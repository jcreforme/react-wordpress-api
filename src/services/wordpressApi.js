import axios from 'axios';

// WordPress API base URL - replace with your WordPress site URL
const WP_API_BASE_URL = 'https://your-wordpress-site.com/wp-json/wp/v2';

// Create axios instance with default config
const wpApi = axios.create({
  baseURL: WP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// WordPress API service methods
export const wordpressApi = {
  // Get all posts
  getPosts: async (params = {}) => {
    try {
      const response = await wpApi.get('/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get single post by ID
  getPost: async (id) => {
    try {
      const response = await wpApi.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Get all pages
  getPages: async (params = {}) => {
    try {
      const response = await wpApi.get('/pages', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  },

  // Get single page by ID
  getPage: async (id) => {
    try {
      const response = await wpApi.get(`/pages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await wpApi.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get tags
  getTags: async () => {
    try {
      const response = await wpApi.get('/tags');
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  // Get media/images
  getMedia: async (params = {}) => {
    try {
      const response = await wpApi.get('/media', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },

  // Search posts
  searchPosts: async (searchTerm) => {
    try {
      const response = await wpApi.get('/posts', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
};

export default wordpressApi;
