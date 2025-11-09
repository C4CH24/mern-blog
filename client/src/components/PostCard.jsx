import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const PostCard = ({ post }) => {
  const { auth, posts } = useBlog();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await posts.deletePost(id);
        posts.fetchPosts(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <h3 className="post-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h3>
        {auth.isAuthenticated && (auth.user?._id === post.author?._id || auth.user?.role === 'admin') && (
          <div className="post-actions">
            <Link to={`/edit-post/${post._id}`} className="btn-edit">
              Edit
            </Link>
            <button
              onClick={() => handleDelete(post._id)}
              className="btn-delete"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="post-meta">
        <span className="post-category">{post.category?.name}</span>
        <span className="post-date">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="post-author">By {post.author?.name}</span>
      </div>
      {post.excerpt && (
        <p className="post-excerpt">{post.excerpt}</p>
      )}
      <div className="post-footer">
        <Link to={`/posts/${post._id}`} className="btn-read-more">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;