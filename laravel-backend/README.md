# Laravel Backend for React-WordPress Integration

This Laravel backend provides a robust API layer for the React-WordPress application, offering enhanced functionality, caching, and secure data management.

## Features

- **WordPress API Integration**: Seamless connection to WordPress.com REST API
- **Advanced Caching**: Redis-based caching for improved performance
- **Rate Limiting**: API rate limiting for security and stability
- **CORS Support**: Cross-origin resource sharing for React frontend
- **Authentication**: Laravel Sanctum for API authentication
- **Error Handling**: Comprehensive error handling and logging
- **Configuration Management**: Environment-based configuration

## Installation

### Prerequisites

- PHP 8.1 or higher
- Composer
- MySQL/MariaDB
- Redis (optional, for caching)

### Setup Steps

1. **Install Dependencies**
   ```bash
   cd laravel-backend
   composer install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure Database**
   Update `.env` file with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=laravel_wordpress
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. **Configure WordPress API**
   Update WordPress settings in `.env`:
   ```env
   WORDPRESS_API_URL=https://public-api.wordpress.com/rest/v1.1/sites/jcreforme.home.blog
   WORDPRESS_SITE_URL=https://jcreforme.home.blog
   ```

5. **Configure Redis (Optional)**
   ```env
   CACHE_DRIVER=redis
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379
   ```

6. **Run Migrations**
   ```bash
   php artisan migrate
   ```

7. **Start the Server**
   ```bash
   php artisan serve --port=8000
   ```

## API Endpoints

### WordPress Content

- `GET /api/wordpress/posts` - Get WordPress posts
- `GET /api/wordpress/posts/{id}` - Get specific post
- `GET /api/wordpress/search?q={query}` - Search posts
- `GET /api/wordpress/categories` - Get categories
- `GET /api/wordpress/tags` - Get tags
- `GET /api/wordpress/stats` - Get blog statistics

### System

- `GET /api/health` - Health check
- `GET /api/config` - API configuration

### Authentication Required

- `POST /api/wordpress/posts` - Create post
- `PUT /api/wordpress/posts/{id}` - Update post
- `DELETE /api/wordpress/posts/{id}` - Delete post
- `POST /api/wordpress/sync` - Sync content
- `DELETE /api/wordpress/cache` - Clear cache

## Usage Examples

### Fetch Posts
```javascript
fetch('http://localhost:8000/api/wordpress/posts?per_page=10')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Search Posts
```javascript
fetch('http://localhost:8000/api/wordpress/search?q=technology')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Get Blog Statistics
```javascript
fetch('http://localhost:8000/api/wordpress/stats')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Configuration

### WordPress Settings

The `config/wordpress.php` file contains all WordPress-related configuration:

- **API URL**: WordPress.com REST API endpoint
- **Caching**: Cache TTL and settings
- **Security**: Rate limiting and CORS settings
- **Sync**: Content synchronization options

### Environment Variables

Key environment variables:

- `WORDPRESS_API_URL`: WordPress API endpoint
- `WORDPRESS_CACHE_TTL`: Cache time-to-live in seconds
- `WORDPRESS_RATE_LIMIT`: Requests per minute limit
- `WORDPRESS_SYNC_ENABLED`: Enable content synchronization

## Caching

The Laravel backend implements multi-layer caching:

1. **API Response Caching**: WordPress API responses cached for 5 minutes
2. **Search Results Caching**: Search results cached for 5 minutes
3. **Categories/Tags Caching**: Cached for 1 hour
4. **Statistics Caching**: Cached for 30 minutes

### Cache Management

Clear all WordPress cache:
```bash
php artisan cache:clear
```

Or via API:
```bash
curl -X DELETE http://localhost:8000/api/wordpress/cache
```

## Security Features

- **Rate Limiting**: 60 requests per minute per IP
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Request validation for all endpoints
- **Error Handling**: Secure error responses
- **Authentication**: Laravel Sanctum for protected routes

## Development

### Artisan Commands

Custom commands for development:

```bash
# Clear WordPress cache
php artisan wordpress:clear-cache

# Sync WordPress content
php artisan wordpress:sync

# Check WordPress connection
php artisan wordpress:test-connection
```

### Testing

Run tests:
```bash
php artisan test
```

### Logging

Logs are stored in `storage/logs/laravel.log`. WordPress API errors are logged with detailed information.

## Docker Support

The Laravel backend can be run with Docker using the main project's Docker configuration.

## Integration with React Frontend

The Laravel backend is designed to work seamlessly with the React frontend:

1. **CORS Configuration**: Allows requests from React development server
2. **JSON API**: All responses in JSON format
3. **Error Handling**: Consistent error response format
4. **Rate Limiting**: Prevents abuse while allowing normal usage

### Frontend Integration Example

```javascript
// React service for Laravel backend
class LaravelApiService {
  constructor() {
    this.baseUrl = 'http://localhost:8000/api';
  }

  async getPosts(params = {}) {
    const query = new URLSearchParams(params);
    const response = await fetch(`${this.baseUrl}/wordpress/posts?${query}`);
    return response.json();
  }

  async searchPosts(query) {
    const response = await fetch(`${this.baseUrl}/wordpress/search?q=${encodeURIComponent(query)}`);
    return response.json();
  }

  async getStats() {
    const response = await fetch(`${this.baseUrl}/wordpress/stats`);
    return response.json();
  }
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Update `WORDPRESS_ALLOWED_ORIGINS` in `.env`
2. **Rate Limit Exceeded**: Adjust `WORDPRESS_RATE_LIMIT` setting
3. **Cache Issues**: Clear cache with `php artisan cache:clear`
4. **WordPress API Errors**: Check API URL and network connectivity

### Debug Mode

Enable debug mode in `.env`:
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

This will provide detailed error information in logs and responses.

## Production Deployment

For production deployment:

1. Set `APP_ENV=production` and `APP_DEBUG=false`
2. Configure proper database credentials
3. Set up Redis for caching
4. Configure SSL certificates
5. Set appropriate rate limits
6. Enable proper logging and monitoring

## Contributing

When contributing to the Laravel backend:

1. Follow PSR-12 coding standards
2. Add tests for new features
3. Update documentation
4. Ensure proper error handling
5. Add appropriate logging

## License

This Laravel backend is part of the React-WordPress integration project and follows the same licensing terms.
