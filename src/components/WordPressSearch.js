import React, { useState } from 'react';
import { wordpressApi } from '../services/wordpressApi';
import './WordPressSearch.css';

const WordPressSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const results = await wordpressApi.searchPosts(searchTerm);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search posts. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="wordpress-search">
      <div className="search-container">
        <h2>Search WordPress Posts</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term..."
              className="search-input"
            />
            <button 
              type="submit" 
              disabled={loading || !searchTerm.trim()}
              className="search-button"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            {hasSearched && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="clear-button"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {hasSearched && !loading && !error && (
          <div className="search-results">
            <h3>
              {searchResults.length > 0 
                ? `Found ${searchResults.length} result(s) for "${searchTerm}"` 
                : `No results found for "${searchTerm}"`
              }
            </h3>
            
            {searchResults.length > 0 && (
              <div className="results-list">
                {searchResults.map((post) => (
                  <article key={post.id} className="search-result-item">
                    <div className="result-content">
                      <h4 
                        className="result-title"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      
                      <div className="result-meta">
                        <span className="result-date">
                          {formatDate(post.date)}
                        </span>
                      </div>
                      
                      <div className="result-excerpt">
                        {post.excerpt.rendered ? (
                          <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                        ) : (
                          <p>{stripHtml(post.content.rendered).substring(0, 200)}...</p>
                        )}
                      </div>
                      
                      <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="result-link"
                      >
                        Read Full Post →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordPressSearch;
