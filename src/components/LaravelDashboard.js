import React, { useState, useEffect } from 'react';
import laravelApiService from '../services/laravelApi';
import './LaravelDashboard.css';

const LaravelDashboard = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    checkApiStatus();
    loadDashboardData();
  }, []);

  const checkApiStatus = async () => {
    try {
      const status = await laravelApiService.getApiStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('Error checking API status:', error);
      setApiStatus({ available: false, error: error.message });
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load multiple data sources in parallel
      const [postsData, statsData, configData] = await Promise.all([
        laravelApiService.getPosts({ per_page: 5 }),
        laravelApiService.getBlogStats(),
        laravelApiService.getConfig()
      ]);

      setPosts(postsData.data || []);
      setStats(statsData.data || {});
      setConfig(configData || {});
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await laravelApiService.clearCache();
      alert('Cache cleared successfully!');
      // Reload data to see fresh results
      loadDashboardData();
    } catch (error) {
      alert('Failed to clear cache: ' + error.message);
    }
  };

  const handleSyncContent = async () => {
    try {
      await laravelApiService.syncContent();
      alert('Content synchronized successfully!');
      loadDashboardData();
    } catch (error) {
      alert('Failed to sync content: ' + error.message);
    }
  };

  const renderApiStatus = () => (
    <div className="api-status">
      <h3>Laravel Backend Status</h3>
      {apiStatus ? (
        <div className={`status-card ${apiStatus.available ? 'online' : 'offline'}`}>
          <div className="status-indicator">
            <span className={`status-dot ${apiStatus.available ? 'green' : 'red'}`}></span>
            {apiStatus.available ? 'Online' : 'Offline'}
          </div>
          {apiStatus.available && (
            <div className="status-details">
              <p><strong>Response Time:</strong> {apiStatus.responseTime}ms</p>
              <p><strong>Version:</strong> {apiStatus.version}</p>
              <p><strong>Environment:</strong> {apiStatus.environment}</p>
              <p><strong>Last Check:</strong> {new Date(apiStatus.timestamp).toLocaleString()}</p>
            </div>
          )}
          {!apiStatus.available && (
            <div className="error-details">
              <p><strong>Error:</strong> {apiStatus.error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="loading">Checking API status...</div>
      )}
    </div>
  );

  const renderOverview = () => (
    <div className="overview-tab">
      <div className="dashboard-actions">
        <button onClick={handleClearCache} className="action-button">
          🗑️ Clear Cache
        </button>
        <button onClick={handleSyncContent} className="action-button">
          🔄 Sync Content
        </button>
        <button onClick={loadDashboardData} className="action-button">
          ↻ Refresh Data
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Posts</h4>
            <span className="stat-number">{stats.total_posts || 0}</span>
          </div>
          <div className="stat-card">
            <h4>Categories</h4>
            <span className="stat-number">{stats.total_categories || 0}</span>
          </div>
          <div className="stat-card">
            <h4>Tags</h4>
            <span className="stat-number">{stats.total_tags || 0}</span>
          </div>
          <div className="stat-card">
            <h4>Avg Post Length</h4>
            <span className="stat-number">{stats.average_post_length || 0} words</span>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="recent-posts">
          <h3>Recent Posts (via Laravel API)</h3>
          <div className="posts-list">
            {posts.slice(0, 3).map((post) => (
              <div key={post.ID} className="post-item">
                <h4>{post.title?.rendered || post.title}</h4>
                <p className="post-meta">
                  {post.date && new Date(post.date).toLocaleDateString()}
                  {post.author?.display_name && ` • by ${post.author.display_name}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderConfiguration = () => (
    <div className="config-tab">
      <h3>Laravel Backend Configuration</h3>
      {config && (
        <div className="config-details">
          <div className="config-item">
            <strong>WordPress API URL:</strong>
            <span>{config.wordpress_api_url}</span>
          </div>
          <div className="config-item">
            <strong>Site URL:</strong>
            <span>{config.site_url}</span>
          </div>
          <div className="config-item">
            <strong>Cache Enabled:</strong>
            <span className={config.cache_enabled ? 'enabled' : 'disabled'}>
              {config.cache_enabled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="config-item">
            <strong>Sync Enabled:</strong>
            <span className={config.sync_enabled ? 'enabled' : 'disabled'}>
              {config.sync_enabled ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (loading && !apiStatus) {
    return (
      <div className="laravel-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Laravel Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="laravel-dashboard">
      <div className="dashboard-header">
        <h2>Laravel Backend Dashboard</h2>
        <p>Monitor and manage your Laravel WordPress API backend</p>
      </div>

      {renderApiStatus()}

      <div className="dashboard-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            Configuration
          </button>
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="loading">Loading dashboard data...</div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'config' && renderConfiguration()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaravelDashboard;
