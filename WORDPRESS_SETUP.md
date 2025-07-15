# WordPress API Setup Instructions

## Getting Started

This React app is configured to work with the WordPress REST API. Follow these steps to connect it to your WordPress site.

## WordPress.com vs Self-Hosted WordPress

### WordPress.com Sites (Like yours: jcreforme.home.blog)
WordPress.com sites use a different API endpoint structure:
- **API URL:** `https://public-api.wordpress.com/wp/v2/sites/YOUR-SITE.com`
- **Example:** `https://public-api.wordpress.com/wp/v2/sites/jcreforme.home.blog/posts`
- **CORS:** No CORS issues (WordPress.com handles this)
- **Authentication:** Public posts are accessible without authentication

### Self-Hosted WordPress Sites
Self-hosted WordPress sites use the standard REST API:
- **API URL:** `https://your-wordpress-site.com/wp-json/wp/v2`
- **CORS:** May require configuration
- **Authentication:** May require API keys for private content

## 1. WordPress REST API Setup

### Enable WordPress REST API
The WordPress REST API is enabled by default in WordPress 4.7+. No additional setup is required for basic functionality.

### Verify API Access

#### For WordPress.com Sites (like jcreforme.home.blog):
```
https://public-api.wordpress.com/wp/v2/sites/jcreforme.home.blog/posts
```

#### For Self-Hosted WordPress Sites:
```
https://your-wordpress-site.com/wp-json/wp/v2/posts
```

## 2. Configure Your WordPress URL

### For WordPress.com Sites (Current Configuration)
Your site `jcreforme.home.blog` is already configured in `src/services/wordpressApi.js`:
```javascript
const WORDPRESS_COM_SITE = 'jcreforme.home.blog';
const WP_COM_API_BASE_URL = `https://public-api.wordpress.com/wp/v2/sites/${WORDPRESS_COM_SITE}`;
```

To change to a different WordPress.com site:
1. Open `src/services/wordpressApi.js`
2. Update the `WORDPRESS_COM_SITE` variable with your site domain
3. Example: `const WORDPRESS_COM_SITE = 'myblog.wordpress.com';`

### For Self-Hosted WordPress Sites
If you want to connect to a self-hosted WordPress site instead:
1. Open `src/services/wordpressApi.js`
2. Replace the WordPress.com configuration with:
```javascript
const WP_API_BASE_URL = 'https://your-wordpress-site.com/wp-json/wp/v2';

const wpApi = axios.create({
  baseURL: WP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Alternative Configuration Method
You can also update the configuration in `src/config/wordpress.js`:
```javascript
export const WORDPRESS_CONFIG = {
  // For WordPress.com sites
  API_BASE_URL: 'https://public-api.wordpress.com/wp/v2/sites/your-site.com',
  
  // Or for self-hosted sites
  // API_BASE_URL: 'https://your-wordpress-site.com/wp-json/wp/v2',
};
```

## 3. CORS (Cross-Origin Resource Sharing)

### WordPress.com Sites
✅ **No CORS configuration needed!** WordPress.com automatically handles CORS headers for public API access.

### Self-Hosted WordPress Sites
If you encounter CORS errors with self-hosted WordPress sites, you may need to configure your WordPress site to allow cross-origin requests.

### Option 1: WordPress Plugin
Install a CORS plugin like "CORS" by WP CORS

### Option 2: Add to wp-config.php
```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
```

### Option 3: .htaccess (Apache servers)
Add to your WordPress .htaccess file:
```apache
Header add Access-Control-Allow-Origin "*"
Header add Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header add Access-Control-Allow-Headers "Content-Type, Authorization"
```

## 4. Available Features

### Current Features
- ✅ Display WordPress posts with pagination
- ✅ Search posts functionality
- ✅ Responsive design
- ✅ Featured image support
- ✅ Author and date information
- ✅ Excerpt display

### API Methods Available
- `getPosts()` - Fetch all posts
- `getPost(id)` - Fetch single post
- `getPages()` - Fetch pages
- `getCategories()` - Fetch categories
- `getTags()` - Fetch tags
- `getMedia()` - Fetch media files
- `searchPosts(term)` - Search posts

## 5. Customization

### Styling
- Main app styles: `src/App.css`
- Posts component: `src/components/WordPressPosts.css`
- Search component: `src/components/WordPressSearch.css`

### Configuration
- WordPress settings: `src/config/wordpress.js`
- API service: `src/services/wordpressApi.js`

## 6. Development

### Local Development
```bash
npm start
```

### Docker Development (Recommended)
```bash
# Start complete development environment
npm run docker:dev

# Access services:
# - React App: http://localhost:3000
# - WordPress: http://localhost:8080  
# - phpMyAdmin: http://localhost:8081
```

### Build for Production
```bash
npm run build
```

### Docker Production
```bash
# Build and run production containers
npm run docker:prod
```

For detailed Docker instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

## 7. Troubleshooting

### Common Issues

1. **CORS Error**
   - Configure CORS on your WordPress server
   - Use a CORS plugin

2. **404 Not Found**
   - Verify your WordPress URL is correct
   - Ensure REST API is enabled

3. **SSL Certificate Issues**
   - Use HTTPS URLs for production
   - Configure SSL properly on WordPress

4. **Empty Results**
   - Check if your WordPress site has published posts
   - Verify API endpoint accessibility

### Testing API Connection
You can test your API connection by visiting these URLs in your browser:
- Posts: `https://your-site.com/wp-json/wp/v2/posts`
- Pages: `https://your-site.com/wp-json/wp/v2/pages`
- Categories: `https://your-site.com/wp-json/wp/v2/categories`

## 8. Security Considerations

- Never expose sensitive WordPress credentials in frontend code
- Use HTTPS in production
- Consider rate limiting for public APIs
- Validate and sanitize all user inputs

## 9. Performance Tips

- Implement caching for API responses
- Use pagination for large datasets
- Optimize images served from WordPress
- Consider using a CDN for media files

## Need Help?

- WordPress REST API Documentation: https://developer.wordpress.org/rest-api/
- React Documentation: https://reactjs.org/docs/
- Axios Documentation: https://axios-http.com/docs/intro
