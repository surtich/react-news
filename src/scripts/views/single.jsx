var Reflux      = require('reflux');
var singleStore = require('../stores/singleStore');
var actions     = require('../actions/actions');
var Spinner     = require('../components/spinner');
var Post        = require('../components/post');
var Router      = require('react-router');

var SinglePost = React.createClass({

    mixins: [
        require('../mixins/pluralize'),
        Router.Navigation,
        Router.State,
        Reflux.listenTo(singleStore, 'onUpdate')
    ],

    getInitialState: function() {
        return {
            post: false,
            comments: [],
            loading: true
        };
    },

    statics: {

        willTransitionTo: function(transition, params) {
            // watch current post and comments
            actions.listenToPost(params.postId);
        },

        willTransitionFrom: function(transition, component) {
            actions.stopListeningToPost(component.state.post.id);
        }
        
    },

    onUpdate: function(postData) {
        this.setState({
            post: postData.post,
            loading: false
        });
    },

    render: function() {
        var user = this.props.user;
        var comments = this.state.comments;
        var post = this.state.post;
        var postId = this.getParams();
        var content;

        if (this.state.loading) {
            content = <Spinner />;
        // } else if (post.isDeleted) {
        //     this.replaceWith('404');
        } else {
            content = (
                <div>
                    <Post post={ post } user={ user } key={ postId } />
                </div>
            );
        }

        return (
            <div className="content full-width">
                { content }
            </div>
        );
    }

});

module.exports = SinglePost;