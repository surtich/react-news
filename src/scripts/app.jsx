/* eslint-disable no-multi-spaces */
window.React      = require('react/addons');
var Reflux        = require('reflux');

var Router        = require('react-router');
var RouteHandler  = Router.RouteHandler;
var Route         = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Link          = Router.Link;

var userStore     = require('./stores/userStore');

var cx            = require('classnames');

var Login         = require('./components/login');
var Register      = require('./components/register');

var Posts         = require('./views/posts');

var actions       = require('./actions/actions');
/* eslint-enable */

var ReactNews = React.createClass({

    mixins: [
        Reflux.listenTo(actions.showOverlay, 'showOverlay')
    ],

	getInitialState: function() {
        return {
            user: userStore.getDefaultData(),
            showPanel: false,
            showOverlay: false,
            overlayType: 'login'
        };
    },

	togglePanel: function() {
        this.setState({
            showPanel: !this.state.showPanel
        });
    },

    submitPost: function(e) {
        e.preventDefault();

        var titleEl = this.refs.title.getDOMNode();
        var linkEl = this.refs.link.getDOMNode();

        var user = this.state.user;

        if (titleEl.value.trim() === '') {
            this.setState({
                'postError': 'title_error'
            });
            return;
        }

        if (linkEl.value.trim() === '') {
            this.setState({
                'postError': 'link_error'
            });
            return;
        }

        var post = {
            title: titleEl.value.trim(),
            url: linkEl.value.trim(),
            creator: user.profile.username,
            creatorUID: user.uid,
            time: Date.now()
        };

        actions.submitPost(post);

        titleEl.value = '';
        linkEl.value = '';

        this.togglePanel();
    },

    showOverlay: function(type) {
        var overlay = this.refs.overlay.getDOMNode();
        overlay.addEventListener('click', this.hideOverlayListener);
        this.setState({
            overlayType: type,
            showOverlay: true
        });
    },

    hideOverlayListener: function(e) {
        if (!this.isChildNodeOf(e.target, ['overlay-content'])) {
            this.hideOverlay();
        }
    },

    isChildNodeOf: function(target, parentIds) {
        // returns boolean whether target is child of a list of ids
        // parentIds can be a string or an array of ids
        if (typeof parentIds === 'string') {
            parentIds = [parentIds];
        }
        // if this node is not the one we want, move up the dom tree
        while (target !== null && parentIds.indexOf(target.id) < 0) {
            target = target.parentNode;
        }
        // at this point we have found our containing div or we are out of parent nodes
        return (target !== null && parentIds.indexOf(target.id) >= 0);
    },

    hideOverlay: function() {
        this.setState({
            showOverlay: false
        });
    },

    render: function() {

        var user = this.state.user;
        var username = user ? user.profile.username : '';
        var md5hash = user ? user.profile.md5hash : '';
        var gravatarURI = 'http://www.gravatar.com/avatar/' + md5hash + '?d=mm';

        var postError = this.state.postError;

        var headerCx = cx({
            'header': true,
            'panel-open': this.state.showPanel
        });

        var titleInputCx = cx({
            'panel-input': true,
            'input-error': postError === 'title_error'
        });

        var linkInputCx = cx({
            'panel-input': true,
            'input-error': postError === 'link_error'
        });

        var overlayCx = cx({
            'md-overlay': true,
            'md-show': this.state.showOverlay
        });

        var overlayContent = <Login />;
        if (this.state.overlayType === 'register') {
            overlayContent = <Register />;
        }

        var userArea;
        if (user.isLoggedIn) {
            // show profile info
            userArea = (
                <span className="user-info">
                    <Link to="profile" params={{ username: username }} className="profile-link">
                        <span className="username">{ username }</span>
                        <img src={ gravatarURI } className="nav-pic" />
                    </Link>
                </span>
            );
        } else {
            // show login/register
            userArea = (
                <span>
                    <a onClick={ actions.showOverlay.bind(this, 'login') } >Sign In</a>
                    <a onClick={ actions.showOverlay.bind(this, 'register') } className="register-link">Register</a>
                </span>
            );
        }

        return (
            <div className="wrapper full-height">
                <header className={ headerCx }>
                    <div className="header-main">
                        <div className="float-left">
                            <Link to="home" className="menu-title">react-news</Link>
                        </div>
                        <div className="float-right">
                            { userArea }
                            <a id="panel-toggle" className="panel-toggle" onClick={ this.togglePanel }>
                                <span className="sr-only">Add Post</span>
                            </a>
                        </div>
                    </div>
                    <div id="header-panel" className="header-panel text-center">
                        <form onSubmit={ this.submitPost } className="panel-form">
                            <input type="text" className={ titleInputCx } placeholder="Title" ref="title" />
                            <input type="url" className={ linkInputCx } placeholder="Link" ref="link" />
                            <button type="submit" className="button panel-button button-outline">Submit</button>
                        </form>
                    </div>
                </header>
                <main id="content" className="full-height inner">
                    <RouteHandler { ...this.props } user={ this.state.user } />
                </main>
                <div className={ overlayCx } ref="overlay">{ overlayContent }</div>
            </div>
        );
    }
});


var routes = (
    <Route handler={ ReactNews }>
        <DefaultRoute name="home" handler={ Posts } />
        <Route name="posts" path="/posts/:pageNum" handler={ Posts } ignoreScrollBehavior />
    </Route>
);


Router.run(routes, function(Handler) {
    React.render(<Handler />, document.getElementById('app'));
});
