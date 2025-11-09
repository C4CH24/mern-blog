import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    request,
    setError,
  };
};

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const { loading, error, request } = useApi();

  const fetchPosts = async (page = 1, limit = 10) => {
    try {
      const data = await request('GET', `/posts?page=${page}&limit=${limit}`);
      setPosts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const createPost = async (postData) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await request('POST', '/posts', postData, config);
  };

  const updatePost = async (id, postData) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await request('PUT', `/posts/${id}`, postData, config);
  };

  const deletePost = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await request('DELETE', `/posts/${id}`, null, config);
  };

  return {
    posts,
    pagination,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const { loading, error, request } = useApi();

  const fetchCategories = async () => {
    try {
      const data = await request('GET', '/categories');
      setCategories(data.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const createCategory = async (categoryData) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await request('POST', '/categories', categoryData, config);
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
  };
};