'use strict';

var Reflux = require('reflux');
var Firebase = require('firebase');
var config = require('../../util/config');
var ref = new Firebase(config.db.firebase);
var postsRef = ref.child('posts');
var commentsRef = ref.child('comments');
var actions = require('../actions/actions');

// store listener references
var postListener, commentListener;

var postStore = Reflux.createStore({

    listenables: actions,

    init() {
        this.postData = {
            post: {},
            comments: []
        };
    },

    listenToPost(postId) {
        postListener = postsRef
            .child(postId)
            .on('value', this.updatePost.bind(this));

        commentListener = commentsRef
            .orderByChild('postId')
            .equalTo(postId)
            .on('value', this.updateComments.bind(this));
    },

    updatePost(postData) {
        var post = postData.val();

        if (post) {
            post.id = postData.key();
            this.postData.post = post;
        } else {
            // post doesn't exist or was deleted
            this.postData.post = {
                isDeleted: true
            };
        }

        this.trigger(this.postData);
    },

    updateComments(comments) {
        this.postData.comments = [];

        comments.forEach((commentData) => {
            var comment = commentData.val();
            comment.id = commentData.key();
            this.postData.comments.unshift(comment);
        });

        this.trigger(this.postData);
    },

    stopListeningToPost(postId) {
        if (!this.postData.post.isDeleted) {
            postsRef.child(postId)
                .off('value', postListener);
        }

        commentsRef.off('value', commentListener);
    },

    getDefaultData() {
        return this.postData;
    }

});

module.exports = postStore;
