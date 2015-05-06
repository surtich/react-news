var Reflux = require('reflux');

var actions = require('../actions/actions');

var profileStore = Reflux.createStore({

    listenables: actions,

    init: function() {
        this.userId = '';
        this.posts = [];
        this.comments = [];
    },

    listenToProfile: function(userId) {
        this.userId = userId;
    },

    stopListeningToProfile: function() {
    },

    triggerAll: function () {
        this.trigger({
            userId: this.userId,
            posts: this.posts,
            comments: this.comments
        });
    },

    getDefaultData: function() {
        return {
            userId: this.userId,
            posts: this.posts,
            comments: this.comments
        };
    }
});

module.exports = profileStore;