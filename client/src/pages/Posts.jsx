import React, { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';

const Posts = () => {
  const { posts, categories } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    posts.fetchPosts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="posts-page">
      <div className="page-header">
        <h1>All Posts</h1>
      </div>

      {posts.loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.error ? (
        <div className="error">{posts.error}</div>
      ) : (
        <>
          <div className="posts-list">
            {posts.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {posts.pagination && posts.pagination.pages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="btn-pagination"
              >
                Previous
              </button>
              
              {Array.from({ length: posts.pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`btn-pagination ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                disabled={currentPage === posts.pagination.pages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="btn-pagination"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;