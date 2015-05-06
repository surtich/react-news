window.React = require('react/addons');

/* eslint-disable no-multi-spaces */
var Router        = require('react-router');
var RouteHandler  = Router.RouteHandler;
var Route         = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Link          = Router.Link;

var userStore     = require('./stores/userStore');

var cx            = require('classnames');

var Login         = require('./components/login');

var Posts         = require('./views/posts');
/* eslint-enable */

var ReactNews = React.createClass({

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
                    <a>Sign In</a>
                    <a className="register-link">Register</a>
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
                        <form className="panel-form">
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
