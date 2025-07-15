import React, { useState, useEffect } from 'react';
import { wordpressApi } from '../services/wordpressApi';
import './WordPressCategories.css';

const WordPressCategories = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await wordpressApi.getCategories();
      // Filter out categories with 0 posts
      const categoriesWithPosts = fetchedCategories.filter(cat => cat.count > 0);
      setCategories(categoriesWithPosts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(selectedCategory === category.id ? null : category.id);
    }
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner-small"></div>
        <span>Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-error">
        <p>{error}</p>
        <button onClick={fetchCategories} className="retry-button-small">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="wordpress-categories">
      <h3>Filter by Category</h3>
      <div className="categories-list">
        <button
          className={`category-button ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => handleCategoryClick(null)}
        >
          All Posts
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
            <span className="post-count">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WordPressCategories;
