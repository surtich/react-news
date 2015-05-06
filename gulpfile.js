/* eslint-disable no-multi-spaces */

var gulp        = require('gulp');
var del         = require('del');
var path        = require('path');
var browserify  = require('browserify');
var reactify    = require('reactify');
var watchify    = require('watchify');
var source      = require('vinyl-source-stream');
var $           = require('gulp-load-plugins')();
var eslint      = require('gulp-eslint');
var runSequence = require('run-sequence');
var config      = require('./src/util/config');

/* eslint-enable */

var prod = $.util.env.prod;

 // gulp-plumber for error handling
 function onError() {
     var args = Array.prototype.slice.call(arguments);
    $.util.beep();
    $.notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}


// Styles
gulp.task('styles', function() {
    return $.rubySass('src/styles', {
            style: 'compressed',
            precision: 10
        })
        .on('error', onError)
        .pipe($.autoprefixer('last 3 versions'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});


// Scripts
gulp.task('scripts', function() {
    var bundler;
    bundler = browserify({
        basedir: __dirname,
        noparse: ['react/addons', 'reflux', 'fastclick', 'react-router'],
        entries: ['./src/scripts/app.jsx'],
        transform: [reactify],
        extensions: ['.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });


    function rebundle() {
        console.log('Bundling Scripts...'); //eslint-disable-line no-console
        var start = Date.now();
        return bundler.bundle()
            .on('error', onError)
            .pipe(source('app.js'))
            .pipe(prod ? $.streamify($.uglify()) : $.util.noop())
            .pipe(gulp.dest('dist/scripts'))
            .pipe($.notify(function() {
                console.log('Bundling Complete - ' + (Date.now() - start) + 'ms'); //eslint-disable-line no-console
            }));
    }

    if (this.seq.indexOf('dist') === -1) {
        bundler = watchify(bundler);
        bundler.on('update', rebundle);
    }

    return rebundle();
});

// HTML
gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());

});

// Favicon
gulp.task('favicon', function() {
    return gulp.src('src/favicon.ico')
        .pipe(gulp.dest('dist'));

});


// Libs
gulp.task('libs', function() {
    gulp.src('node_modules/jquery/dist/**/*')
    .pipe(gulp.dest('dist/libs/jquery'));
});

// Webserver
gulp.task('serve', function() {
    gulp.src('dist')
        .pipe($.webserver({
            livereload: true,
            port: config.server.port,
            fallback: 'index.html'
        }));
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

// Lint
gulp.task('lint', function () {
    return gulp.src(['src/scripts/*.jsx', 'gulpfile.js'])
      // eslint() attaches the lint output to the eslint property
      // of the file object so it can be used by other modules.
      .pipe(eslint({
        globals: {
          'require': true,
          'document': true,
          '__dirname': true,
          'module': true,
          'console': true,
          'window': true,
          'React': true
        },
        rules: {
          'quotes': [2, 'single', 'avoid-escape'],
          'strict': 0,
          'no-unused-vars': 0
        }
    }))
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format());
});

gulp.task('watch', function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/styles/**/*.scss', ['styles']);
});

// Default task
gulp.task('dist', function(callback) {
    runSequence(
        'clean',
        ['libs', 'html', 'favicon', 'styles', 'lint', 'scripts'],
        callback
    );
});

// Watch
gulp.task('default', function(callback) {
    runSequence(
        ['libs', 'html', 'favicon', 'styles', 'lint', 'scripts'],
        'watch',
        'serve',
        callback
    );
});
