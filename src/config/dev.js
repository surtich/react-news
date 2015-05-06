module.exports = {
    server: {
        port: process.env.PORT || 8080
    },
    db: {
    	firebase: process.env.FIREBASE || 'https://sweltering-heat-2457.firebaseio.com'
    },
    app: {
    	posts: {
    		postsPerPage: 3
    	}
    }
};