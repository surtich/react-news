/* eslint-disable no-multi-spaces */

var gulp               = require('gulp');
var del                = require('del');
var path               = require('path');
var browserify         = require('browserify');
var babelify           = require('babelify');
var historyApiFallback = require('connect-history-api-fallback');
var watchify           = require('watchify');
var browserSync        = require('browser-sync').create();
var source             = require('vinyl-source-stream');
var buffer             = require('vinyl-buffer');
var $                  = require('gulp-load-plugins')();
var eslint             = require('gulp-eslint');
var runSequence        = require('run-sequence');
var config             = require('./src/util/config');
var extend             = require('lodash/object/extend');

/* eslint-enable */
/*eslint no-console:0 */

var srcDir = './src/';
var buildDir = './build/';
var distDir = './dist/';
var mapsDir = './maps/';

var jsEntry = 'app';
var jsTargetName = 'app.js';
var sassEntry = srcDir + 'scss/*.scss';

var prod = $.util.env.prod;

// gulp-plumber for error handling
function handleError() {
    $.util.beep();
    $.notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, arguments);

    // Keep gulp from hanging on this task
    this.emit('end');
}

function buildScript(file, watch) {
    var props = extend({}, watchify.args, {
        entries: [srcDir + 'js/' + file],
        debug: true,
        extensions: ['.js', '.jsx']
    });

    var bblfy = babelify.configure({
        only: /(src\/js)/,
        optional: ['runtime']
    });

    var brwsfy = browserify(props).transform(bblfy);

    var bundler = watch ? watchify(brwsfy, {
        ignoreWatch: true
    }) : brwsfy;

    function rebundle() {
        return bundler.bundle()
            .on('error', handleError)
            .pipe(source(jsTargetName))
            .pipe(buffer())
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.sourcemaps.write(mapsDir))
            .pipe(gulp.dest(buildDir));
    }

    bundler.on('update', rebundle);
    bundler.on('log', $.util.log);
    bundler.on('error', $.util.log);
    return rebundle();
}

gulp.task('styles', function() {
    gulp.src(sassEntry)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            // compression handled in dist task
            outputStyle: 'expanded',
            errLogToConsole: true
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer('last 2 versions'))
        .pipe($.sourcemaps.write(mapsDir))
        .pipe(gulp.dest(buildDir))
        .pipe(browserSync.stream({ match: '**/*.css' }))
        .pipe($.size());
});

// HTML
gulp.task('html', function() {
    return gulp.src(srcDir + '*.html')
        .pipe(gulp.dest(buildDir))
        .pipe($.size());
});

// Favicon
gulp.task('favicon', function() {
    return gulp.src(srcDir + 'favicon.ico')
        .pipe(gulp.dest(buildDir));

});

// Libs
gulp.task('libs', function() {
    gulp.src('node_modules/jquery/dist/**/*')
    .pipe(gulp.dest(buildDir + 'libs/jquery'));
});

gulp.task('minify', function() {
    var assets = $.useref.assets();

    // move favicon to /dist
    gulp.src(buildDir + 'favicon.ico')
        .pipe(gulp.dest(distDir));

    // move libs to /dist
    gulp.src(buildDir + 'libs/**')
          .pipe(gulp.dest(distDir + 'libs/'));

    // minify css/js and move index.html to /dist
    return gulp.src(buildDir + '*.html')
        .pipe($.plumber())
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(distDir))
        .pipe($.size())
        .pipe($.exit());
});

gulp.task('lint', function () {
    return gulp.src([srcDir + 'scripts/*.jsx', 'gulpfile.js'])
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

gulp.task('clean-build', function(cb) {
    del(buildDir, cb);
});

gulp.task('clean-dist', function(cb) {
    del(distDir, cb);
});

gulp.task('build-watch', ['html', 'styles', 'favicon', 'libs'], function() {
    return buildScript(jsEntry, true);
});

gulp.task('build-no-watch', ['html', 'styles', 'favicon', 'libs'], function() {
    return buildScript(jsEntry, false);
});

gulp.task('build', function(cb) {
    runSequence(
        'clean-build',
        'build-no-watch',
        cb
    );
});

gulp.task('dist', function(cb) {
    runSequence(
        'clean-build',
        'clean-dist',
        'build-no-watch',
        'minify',
        cb
    );
});

gulp.task('watch', ['build-watch'], function() {
    browserSync.init({
        server: {
            baseDir: buildDir,
            middleware: [historyApiFallback()]
        }
    });

    gulp.watch(srcDir + '*.html', ['html']);
    gulp.watch(srcDir + 'js/**/*', ['lint']);
    gulp.watch(srcDir + 'scss/**/*.scss', ['styles']);

    $.watch([
        buildDir + '**/*.js',
        buildDir + '**/*.html'
    ], browserSync.reload);
});

gulp.task('serve', function(cb) {
    runSequence(
        'clean-build',
        'watch',
        cb
    );
});

gulp.task('default', ['serve']);
