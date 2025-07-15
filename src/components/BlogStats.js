import React, { useState, useEffect } from 'react';
import { wordpressApi } from '../services/wordpressApi';
import './BlogStats.css';

const BlogStats = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalCategories: 0,
    lastPostDate: null,
    authorCount: 0,
    averagePostLength: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogStats();
  }, []);

  const fetchBlogStats = async () => {
    try {
      setLoading(true);
      
      // Fetch posts, categories in parallel
      const [posts, categories] = await Promise.all([
        wordpressApi.getPosts({ per_page: 100, _embed: true }),
        wordpressApi.getCategories()
      ]);

      // Calculate statistics
      const totalPosts = posts.length;
      const totalCategories = categories.filter(cat => cat.count > 0).length;
      
      // Get last post date
      const lastPost = posts.length > 0 ? posts[0] : null;
      const lastPostDate = lastPost ? new Date(lastPost.date) : null;
      
      // Get unique authors
      const authors = new Set();
      posts.forEach(post => {
        if (post._embedded && post._embedded.author) {
          authors.add(post._embedded.author[0].id);
        }
      });
      
      // Calculate average post length
      const totalWords = posts.reduce((total, post) => {
        const content = post.content.rendered.replace(/<[^>]*>/g, '');
        const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
        return total + wordCount;
      }, 0);
      
      const averagePostLength = totalPosts > 0 ? Math.round(totalWords / totalPosts) : 0;

      setStats({
        totalPosts,
        totalCategories,
        lastPostDate,
        authorCount: authors.size,
        averagePostLength
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch blog statistics.');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const getTimeSinceLastPost = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="blog-stats loading">
        <div className="stats-header">
          <h3>📊 Blog Statistics</h3>
        </div>
        <div className="loading-stats">
          <div className="loading-spinner-small"></div>
          <span>Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-stats error">
        <div className="stats-header">
          <h3>📊 Blog Statistics</h3>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchBlogStats} className="retry-button-small">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-stats">
      <div className="stats-header">
        <h3>📊 Blog Statistics</h3>
        <span className="stats-subtitle">jcreforme.home.blog insights</span>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalPosts}</div>
            <div className="stat-label">Total Posts</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalCategories}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.authorCount}</div>
            <div className="stat-label">Author{stats.authorCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.averagePostLength}</div>
            <div className="stat-label">Avg Words/Post</div>
          </div>
        </div>
      </div>
      
      <div className="last-activity">
        <div className="activity-item">
          <span className="activity-label">📅 Last Post:</span>
          <span className="activity-value">
            {formatDate(stats.lastPostDate)}
          </span>
        </div>
        <div className="activity-item">
          <span className="activity-label">⏱️ Activity:</span>
          <span className="activity-value">
            {getTimeSinceLastPost(stats.lastPostDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogStats;
