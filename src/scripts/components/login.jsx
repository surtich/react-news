'use strict';

// components
var Spinner = require('../components/spinner');

var Login = React.createClass({

    getInitialState: function() {
        return {
            error: '',
            submitted: false
        };
    },

    render: function() {
        var error = this.state.error ? <div className="error login-error">{ this.state.error }</div> : null;

        return (
            <div className="login text-center md-modal" id="overlay-content">
                <form className="login-form text-left">
                    <h1>Login</h1>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" placeholder="Email" id="email" ref="email" /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" placeholder="Password" id="password" ref="password" /><br />
                    <button type="submit" className="button button-primary" ref="submit">
                        { this.state.submitted ? <Spinner /> : 'Sign In' }
                    </button>
                </form>
                { error }
            </div>
        );
    }
});

module.exports = Login;