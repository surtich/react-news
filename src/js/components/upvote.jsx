var actions = require('../actions/actions');
var throttle = require('lodash/function/throttle');

var cx = require('classnames');

var Upvote = React.createClass({

    propTypes: {
        user: React.PropTypes.object,
        itemId: React.PropTypes.string,
        upvotes: React.PropTypes.number,
        upvoteActions: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            upvoted: false
        };
    },

    componentDidMount: function() {
        var upvoted = this.props.user.profile.upvoted;
        this.setState({ upvoted: upvoted ? upvoted[this.props.itemId] : false }); // eslint-disable-line react/no-did-mount-set-state
    },

    componentWillReceiveProps: function(nextProps) {
        var upvoted = nextProps.user.profile.upvoted;
        this.setState({
            upvoted: upvoted ? upvoted[this.props.itemId] : false
        });
    },

    upvote: throttle(function(userId, itemId) {
        if (!this.props.user.isLoggedIn) {
            actions.showOverlay('login');
            return;
        }

        var upvoted = this.state.upvoted;
        var upvoteActions = this.props.upvoteActions;

        if (upvoted === true) {
            upvoteActions.downvote(userId, itemId);
        } else {
            upvoteActions.upvote(userId, itemId);
        }

        this.setState({
            upvoted: !upvoted
        });
    }, 300, { trailing: false }),

    render: function() {
        var userId = this.props.user.uid;
        var itemId = this.props.itemId;
        var upvotes = this.props.upvotes;

        var upvoted = this.state.upvoted;
        var upvoteCx = cx({
            'upvote': true,
            'upvoted': upvoted
        });

        return (
            <a className={ upvoteCx } onClick={ this.upvote.bind(this, userId, itemId) }>
                { upvotes } <i className="fa fa-arrow-up"></i>
            </a>
        );
    }

});

module.exports = Upvote;
