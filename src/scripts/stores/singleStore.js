var Reflux = require('reflux');
var Firebase = require('firebase');
var config = require('../../util/config');
var postsRef = new Firebase(config.db.firebase + '/posts');
var actions = require('../actions/actions');

// store listener references
var postListener;

var postStore = Reflux.createStore({

    listenables: actions,

    init: function() {
        this.postData = {
            post: {},
            comments: []
        };
    },

    listenToPost: function(postId) {
        postListener = postsRef.child(postId).on('value', this.updatePost.bind(this));
    },

    updatePost: function(postData) {
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

    stopListeningToPost: function(postId) {
        if (!this.postData.post.isDeleted) {
            postsRef.child(postId).off('value', postListener);
        }
    },

    getDefaultData: function() {
        return this.postData;
    }

});

module.exports = postStore;















