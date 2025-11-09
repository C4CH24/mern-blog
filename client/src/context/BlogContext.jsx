import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { usePosts, useCategories } from '../hooks/useApi';

const BlogContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const BlogProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  const postsApi = usePosts();
  const categoriesApi = useCategories();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      authDispatch({
        type: 'LOGIN_SUCCESS',
        payload: JSON.parse(user),
      });
    }

    // Fetch initial data
    postsApi.fetchPosts();
    categoriesApi.fetchCategories();
  }, []);

  const login = async (email, password) => {
    authDispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        authDispatch({
          type: 'LOGIN_SUCCESS',
          payload: data.user,
        });
      } else {
        authDispatch({
          type: 'LOGIN_FAILURE',
          payload: data.message,
        });
      }
    } catch (error) {
      authDispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Login failed',
      });
    }
  };

  const register = async (name, email, password) => {
    authDispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        authDispatch({
          type: 'LOGIN_SUCCESS',
          payload: data.user,
        });
      } else {
        authDispatch({
          type: 'LOGIN_FAILURE',
          payload: data.message,
        });
      }
    } catch (error) {
      authDispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Registration failed',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authDispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    authDispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <BlogContext.Provider
      value={{
        auth: authState,
        posts: postsApi,
        categories: categoriesApi,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};