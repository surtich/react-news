window.React = require('react/addons');

/* eslint-disable no-multi-spaces */
var Router        = require('react-router');
var RouteHandler  = Router.RouteHandler;
var Route         = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Link          = Router.Link;
/* eslint-enable */

var ReactNews = React.createClass({

    render: function() {
        return (
            <div className="wrapper full-height">
                Hello World!
            </div>
        );
    }
});


var routes = (
    <Route handler={ ReactNews }>
    </Route>
);


Router.run(routes, function(Handler) {
    React.render(<Handler />, document.getElementById('app'));
});
