var Reflux = require('reflux');

var Firebase = require('firebase');
var config = require('../../util/config');
var ref = new Firebase(config.db.firebase);
var usersRef = ref.child('users');

var actions = require('../actions/actions');

var $ = require('jquery');

var defaultUser = {
    uid: '',
    profile: {
        username: '',
        upvoted: {}
    },
    isLoggedIn: false
};

var userStore = Reflux.createStore({

    listenables: actions,

    init: function() {
        this.user = defaultUser;
    },

    getDefaultData: function() {
        return this.user;
    },

    onUpdateProfile: function(userId, profile) {
        this.user = {
            uid: userId,
            profile: profile,
            isLoggedIn: true
        };
        this.trigger(this.user);
    },

    getUserId: function(username) {
        // returns userId given username
        var defer = $.Deferred(); // eslint-disable-line new-cap
        usersRef.orderByChild('username').equalTo(username).once('value', function(user) {
            var userId = Object.keys(user.val())[0];
            defer.resolve(userId);
        });
        return defer.promise();
    },

    onLogoutCompleted: function() {
        this.user = defaultUser;
        this.trigger(this.user);
    }
});

module.exports = userStore;
