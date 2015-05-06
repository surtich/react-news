'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var config = require('../../util/config');
var ref = new Firebase(config.db.firebase);

var commentsRef = ref.child('comments'),
    postsRef = ref.child('posts'),
    usersRef = ref.child('users');

var actions = Reflux.createActions({
    // user actions
    'login': {},
    'logout': { asyncResult: true },
    'register': {},
    'createProfile': {},
    'updateProfile': {},
    // post actions
    'upvotePost': {},
    'downvotePost': {},
    'submitPost': {},
    'deletePost': {},
    'setSortBy': {},
    // comment actions
    'upvoteComment': {},
    'downvoteComment': {},
    'updateCommentCount': {},
    'addComment': {},
    'deleteComment': {},
    // firebase actions
    'listenToProfile': {},
    'listenToPost': {},
    'listenToPosts': {},
    'stopListeningToProfile': {},
    'stopListeningToPosts': {},
    'stopListeningToPost': {},
    // error actions
    'loginError': {},
    'postError': {},
    // ui actions
    'showOverlay': {},
    'goToPost': {}
});


/* User Actions
===============================*/

/* Post Actions
===============================*/

actions.submitPost.preEmit = function(post) {
    var newPostRef = postsRef.push(post, function(error) {
        if (error !== null) {
            actions.postError(error.code);
        } else {
            actions.goToPost(newPostRef.key());
        }
    });
};

actions.deletePost.preEmit = function(postId) {
    postsRef.child(postId).remove();
};

/* Comment Actions
===============================*/


module.exports = actions;