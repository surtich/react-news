var Reflux = require('reflux');

// actions
var actions = require('../actions/actions');

// stores
var profileStore = require('../stores/profileStore');
var userStore = require('../stores/userStore');

// components
var Spinner = require('../components/spinner');

var Profile = React.createClass({

    mixins: [
        require('react-router').Navigation,
        Reflux.listenTo(profileStore, 'onLoaded')
    ],

    getInitialState: function() {
        return {
        	profileData: profileStore.getDefaultData(),
        	isLoading: true
        };
    },

    statics: {

        willTransitionTo: function(transition, params, query, callback) {
            // set callback to watch current user's posts/comments
            userStore.getUserId(params.username).then(function(userId) {
                actions.listenToProfile(userId);
                return callback();
            });
        },

        willTransitionFrom: function(transition, component) {
            actions.stopListeningToProfile();
            component.setState({
                isLoading: true
            });
        }
        
    },

    onLoaded: function(profileData) {
    	this.setState({
    		profileData: profileData,
    		isLoading: false
    	});
    },

    logout: function(e) {
        e.preventDefault();
        actions.logout();
        this.transitionTo('home');
    },

    render: function() {
        var user = this.props.user;
    	var profileData = this.state.profileData;
    	
        return (
            <div className="content full-width">
                {
                    !user.isLoggedIn || (user.profile && user.profile.username !== this.props.params.username) ? '' : (
                        <div className="user-options text-right">
                            <button onClick={ this.logout } className="button button-primary">Sign Out</button>
                        </div>
                    )
                }
	            <h1>{ this.props.params.username + '\'s' } Profile</h1>
            </div>
        );
    }

});

module.exports = Profile;