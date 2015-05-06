
var Register = React.createClass({

    getInitialState: function() {
        return {
            error: '',
            submitted: false
        };
    },

    render: function() {
        var error = this.state.error ? <div className="error login-error">{ this.state.error }</div> : '';

        return (
            <div className="login md-modal text-center" id="overlay-content">
                <form className="login-form text-left">
                    <h1>Register</h1>
                    <label htmlFor="username">Username</label><br />
                    <input type="text" placeholder="Username" id="username" ref="username" /><br />
                    <label htmlFor="email">Email</label><br />
                    <input type="email" placeholder="Email" id="email" ref="email" /><br />
                    <label htmlFor="password">Password</label><br />
                    <input type="password" placeholder="Password" id="password" ref="password" /><br />
                    <button type="submit" className="button button-primary" ref="submit">
                        { this.state.submitted ? <Spinner /> : 'Register' }
                    </button>
                </form>
                { error }
            </div>
        );
    }

});

module.exports = Register;