var Reflux = require('reflux');

var defaultUser = {
    uid: '',
    profile: {
        username: '',
        upvoted: {}
    },
    isLoggedIn: false
};

var userStore = Reflux.createStore({

    init: function() {
        this.user = defaultUser;
    },

    getDefaultData: function() {
        return this.user;
    }
});

module.exports = userStore;















