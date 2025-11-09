import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, auth } = useBlog();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        if (data.success) {
          setPost(data.data);
        } else {
          console.error('Failed to fetch post:', data.message);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await posts.deletePost(id);
        navigate('/posts');
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="post-detail">
      <div className="post-header">
        <h1>{post.title}</h1>
        {auth.isAuthenticated && (auth.user?._id === post.author?._id || auth.user?.role === 'admin') && (
          <div className="post-actions">
            <Link to={`/edit-post/${post._id}`} className="btn btn-edit">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-delete">
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
        <div className="post-excerpt">
          <p>{post.excerpt}</p>
        </div>
      )}

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          <strong>Tags: </strong>
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="post-footer">
        <Link to="/posts" className="btn btn-secondary">
          Back to Posts
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;