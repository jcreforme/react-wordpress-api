import React from 'react';
import './PostDetails.css';

const PostDetails = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getWordCount = (content) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (content) => {
    const wordCount = getWordCount(content);
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const getCategories = () => {
    if (post._embedded && post._embedded['wp:term']) {
      const categories = post._embedded['wp:term'].find(terms => 
        terms.some(term => term.taxonomy === 'category')
      );
      return categories ? categories.filter(term => term.taxonomy === 'category') : [];
    }
    return [];
  };

  const getTags = () => {
    if (post._embedded && post._embedded['wp:term']) {
      const tags = post._embedded['wp:term'].find(terms => 
        terms.some(term => term.taxonomy === 'post_tag')
      );
      return tags ? tags.filter(term => term.taxonomy === 'post_tag') : [];
    }
    return [];
  };

  const getAuthor = () => {
    if (post._embedded && post._embedded.author) {
      return post._embedded.author[0];
    }
    return null;
  };

  const categories = getCategories();
  const tags = getTags();
  const author = getAuthor();
  const readingTime = getReadingTime(post.content.rendered);
  const wordCount = getWordCount(post.content.rendered);

  return (
    <div className="post-details">
      {/* Post Meta Information */}
      <div className="post-meta-detailed">
        <div className="meta-item">
          <span className="meta-label">📅 Published:</span>
          <span className="meta-value">{formatDate(post.date)}</span>
        </div>
        
        {post.modified !== post.date && (
          <div className="meta-item">
            <span className="meta-label">✏️ Updated:</span>
            <span className="meta-value">{formatDate(post.modified)}</span>
          </div>
        )}
        
        <div className="meta-item">
          <span className="meta-label">📖 Reading time:</span>
          <span className="meta-value">{readingTime} min read</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">📝 Word count:</span>
          <span className="meta-value">{wordCount.toLocaleString()} words</span>
        </div>
        
        {author && (
          <div className="meta-item">
            <span className="meta-label">👤 Author:</span>
            <span className="meta-value">{author.name}</span>
          </div>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="post-categories">
          <h4>Categories</h4>
          <div className="categories-tags">
            {categories.map((category) => (
              <span key={category.id} className="category-tag">
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="post-tags">
          <h4>Tags</h4>
          <div className="categories-tags">
            {tags.map((tag) => (
              <span key={tag.id} className="tag-item">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Post Status */}
      <div className="post-status">
        <div className="status-indicators">
          <span className={`status-badge status-${post.status}`}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
          
          {post.sticky && (
            <span className="status-badge status-sticky">
              📌 Pinned
            </span>
          )}
          
          <span className="status-badge status-format">
            Format: {post.format || 'standard'}
          </span>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="social-sharing">
        <h4>Share this post</h4>
        <div className="share-buttons">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(post.link)}&text=${encodeURIComponent(post.title.rendered)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button twitter"
          >
            🐦 Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.link)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button facebook"
          >
            📘 Facebook
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.link)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button linkedin"
          >
            💼 LinkedIn
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(post.link)}
            className="share-button copy"
          >
            📋 Copy Link
          </button>
        </div>
      </div>

      {/* WordPress Jetpack Features */}
      {post.jetpack_shortlink && (
        <div className="jetpack-features">
          <h4>WordPress.com Features</h4>
          <div className="jetpack-info">
            <a
              href={post.jetpack_shortlink}
              target="_blank"
              rel="noopener noreferrer"
              className="jetpack-link"
            >
              📎 Short URL: {post.jetpack_shortlink}
            </a>
            
            {post.jetpack_likes_enabled && (
              <span className="jetpack-feature">❤️ Likes enabled</span>
            )}
            
            {post.jetpack_sharing_enabled && (
              <span className="jetpack-feature">📤 Sharing enabled</span>
            )}
          </div>
        </div>
      )}

      {/* External Link */}
      <div className="external-link">
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="view-original-button"
        >
          🔗 View Original Post on WordPress
        </a>
      </div>
    </div>
  );
};

export default PostDetails;
