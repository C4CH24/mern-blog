import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';

const Home = () => {
  const { posts, categories } = useBlog();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MERN Blog</h1>
          <p>A full-stack blog application built with MongoDB, Express, React, and Node.js</p>
          <div className="hero-actions">
            <Link to="/posts" className="btn btn-primary">
              Browse Posts
            </Link>
            <Link to="/create-post" className="btn btn-secondary">
              Write a Post
            </Link>
          </div>
        </div>
      </section>

      <section className="recent-posts">
        <h2>Recent Posts</h2>
        {posts.loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.error ? (
          <div className="error">{posts.error}</div>
        ) : (
          <div className="posts-grid">
            {posts.posts.slice(0, 3).map((post) => (
              <div key={post._id} className="post-card">
                <h3>
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </h3>
                <div className="post-meta">
                  <span>{post.category?.name}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {post.excerpt && <p>{post.excerpt}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;