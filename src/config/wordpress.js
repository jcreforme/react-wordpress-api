// WordPress Configuration
// Update these settings to match your WordPress site

export const WORDPRESS_CONFIG = {
  // Your WordPress site URL (without trailing slash)
  API_BASE_URL: 'https://your-wordpress-site.com/wp-json/wp/v2',
  
  // Alternative for local development
  // API_BASE_URL: 'http://localhost/your-wordpress-site/wp-json/wp/v2',
  
  // API timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default number of posts per page
  POSTS_PER_PAGE: 10,
  
  // Whether to include embedded data (like featured images, author info)
  INCLUDE_EMBEDDED: true,
  
  // Default post fields to include
  DEFAULT_FIELDS: [
    'id',
    'title',
    'content',
    'excerpt',
    'date',
    'link',
    'author',
    'featured_media',
    '_embedded'
  ]
};

// WordPress API endpoints
export const WP_ENDPOINTS = {
  POSTS: '/posts',
  PAGES: '/pages',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  MEDIA: '/media',
  USERS: '/users',
  COMMENTS: '/comments'
};

// Common WordPress API parameters
export const WP_PARAMS = {
  // Include embedded data
  EMBED: { _embed: true },
  
  // Common post parameters
  POSTS: {
    per_page: WORDPRESS_CONFIG.POSTS_PER_PAGE,
    _embed: WORDPRESS_CONFIG.INCLUDE_EMBEDDED
  },
  
  // Common page parameters
  PAGES: {
    per_page: 100,
    _embed: WORDPRESS_CONFIG.INCLUDE_EMBEDDED
  }
};

export default WORDPRESS_CONFIG;
