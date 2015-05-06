// actions
var actions = require('../actions/actions');
// components
var Link = require('react-router').Link;

var Post = React.createClass({

    mixins: [
        require('../mixins/pluralize'),
    	require('../mixins/abbreviateNumber'),
    	require('../mixins/hostnameFromUrl'),
        require('../mixins/timeAgo')
    ],

    render: function() {
        var user = this.props.user;
        var post = this.props.post;
        var commentCount = post.commentCount || 0;
        var deleteOption = '';

        if (post.isDeleted) {
            // post doesn't exist
            return (
                <div className="post cf">
                    <div className="post-link">
                        [deleted]
                    </div>
                </div>
            );
        }

        deleteOption = (
            <span className="delete post-info-item">
                <a onClick={ actions.deletePost.bind(this, post.id) }>delete</a>
            </span>
        );

        return (
            <div className="post">
                <div className="post-link">
                    <a className="post-title" href={ post.url }>{ post.title }</a>
                    <span className="hostname">
                        (<a href={ post.url }>{ this.hostnameFromUrl(post.url) }</a>)
                    </span>
                </div>
                <div className="post-info">
                    <div className="posted-by">
                        <span className="post-info-item">
                            { post.creator }
                        </span>
                        <span className="post-info-item">
                            { this.timeAgo(post.time) }
                        </span>
                        <span className="post-info-item">
                                { this.pluralize(commentCount, 'comment') }
                        </span>
                        { deleteOption }
                    </div>
                </div>
            </div>
        );
    }
    
});

module.exports = Post;