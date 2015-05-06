'use strict';

var Reflux = require('reflux');

var postsPerPage = 8;

var postsStore = Reflux.createStore({

    init: function() {
        this.posts = [];
        this.currentPage = 1;
        this.nextPage = true;
        this.sortOptions = {
            currentValue: 'upvotes',
            values: {
                // values mapped to firebase locations
                'upvotes': 'upvotes',
                'newest': 'time',
                'comments': 'commentCount'
            },
        };
    },

    getDefaultData: function() {
        return {
            posts: this.posts,
            currentPage: this.currentPage,
            nextPage: this.nextPage,
            sortOptions: this.sortOptions
        };
    }

});

module.exports = postsStore;
