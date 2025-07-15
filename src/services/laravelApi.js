// Laravel Backend API Service
import axios from 'axios';

class LaravelApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_LARAVEL_API_URL || 'http://localhost:8000/api';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Laravel API health check failed:', error);
      throw error;
    }
  }

  // WordPress Posts
  async getPosts(params = {}) {
    try {
      const response = await this.api.get('/wordpress/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts from Laravel API:', error);
      throw error;
    }
  }

  async getPost(id) {
    try {
      const response = await this.api.get(`/wordpress/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post from Laravel API:', error);
      throw error;
    }
  }

  async searchPosts(query) {
    try {
      const response = await this.api.get('/wordpress/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching posts via Laravel API:', error);
      throw error;
    }
  }

  // Categories and Tags
  async getCategories() {
    try {
      const response = await this.api.get('/wordpress/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories from Laravel API:', error);
      throw error;
    }
  }

  async getTags() {
    try {
      const response = await this.api.get('/wordpress/tags');
      return response.data;
    } catch (error) {
      console.error('Error fetching tags from Laravel API:', error);
      throw error;
    }
  }

  // Blog Statistics
  async getBlogStats() {
    try {
      const response = await this.api.get('/wordpress/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog stats from Laravel API:', error);
      throw error;
    }
  }

  // Configuration
  async getConfig() {
    try {
      const response = await this.api.get('/config');
      return response.data;
    } catch (error) {
      console.error('Error fetching config from Laravel API:', error);
      throw error;
    }
  }

  // Cache Management
  async clearCache() {
    try {
      const response = await this.api.delete('/wordpress/cache');
      return response.data;
    } catch (error) {
      console.error('Error clearing cache via Laravel API:', error);
      throw error;
    }
  }

  // Content Management (requires authentication)
  async createPost(postData) {
    try {
      const response = await this.api.post('/wordpress/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post via Laravel API:', error);
      throw error;
    }
  }

  async updatePost(id, postData) {
    try {
      const response = await this.api.put(`/wordpress/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post via Laravel API:', error);
      throw error;
    }
  }

  async deletePost(id) {
    try {
      const response = await this.api.delete(`/wordpress/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post via Laravel API:', error);
      throw error;
    }
  }

  // Content Synchronization
  async syncContent() {
    try {
      const response = await this.api.post('/wordpress/sync');
      return response.data;
    } catch (error) {
      console.error('Error syncing content via Laravel API:', error);
      throw error;
    }
  }

  // Check if Laravel backend is available
  async isAvailable() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get API status and performance metrics
  async getApiStatus() {
    try {
      const startTime = Date.now();
      const health = await this.healthCheck();
      const responseTime = Date.now() - startTime;
      
      return {
        available: true,
        responseTime,
        status: health.status,
        timestamp: health.timestamp,
        version: health.version,
        environment: health.environment
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
        responseTime: null
      };
    }
  }
}

// Create and export singleton instance
const laravelApiService = new LaravelApiService();

export default laravelApiService;
