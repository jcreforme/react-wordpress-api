# Laravel Backend Setup Guide

This guide will help you set up and configure the Laravel backend for your React-WordPress application.

## 📋 Prerequisites

Before setting up the Laravel backend, ensure you have the following installed:

### Required Software
- **PHP 8.1 or higher**
- **Composer** (PHP dependency manager)
- **MySQL 8.0 or higher** (or MariaDB 10.3+)
- **Redis** (optional, for caching)
- **Node.js 16+** (for the React frontend)

### Installation Links
- [PHP](https://www.php.net/downloads.php)
- [Composer](https://getcomposer.org/download/)
- [MySQL](https://dev.mysql.com/downloads/)
- [Redis](https://redis.io/download)

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Navigate to Laravel backend directory
cd laravel-backend

# Install PHP dependencies
composer install

# Return to root directory
cd ..
```

### 2. Environment Configuration

```bash
# Copy environment file
cd laravel-backend
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Setup

Edit the `.env` file in the `laravel-backend` directory:

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_wordpress
DB_USERNAME=your_username
DB_PASSWORD=your_password

# WordPress API Configuration
WORDPRESS_API_URL=https://public-api.wordpress.com/rest/v1.1/sites/jcreforme.home.blog
WORDPRESS_SITE_URL=https://jcreforme.home.blog

# Cache Configuration (Redis recommended)
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# CORS Configuration for React
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Database Migration

```bash
# Create database (MySQL command line)
mysql -u root -p -e "CREATE DATABASE laravel_wordpress;"

# Run migrations
php artisan migrate
```

### 5. Start the Server

```bash
# Start Laravel development server
php artisan serve --port=8000
```

The Laravel API will be available at: `http://localhost:8000`

## 🐳 Docker Setup (Recommended)

For a complete containerized setup:

```bash
# Start all services (React + Laravel + WordPress + MySQL + Redis)
npm run docker:prod

# Or run in background
npm run docker:prod:bg
```

This will start:
- React frontend: `http://localhost:3000`
- Laravel API: `http://localhost:8001`
- WordPress: `http://localhost:8080`
- phpMyAdmin: `http://localhost:8081`

## 🔧 Configuration Options

### WordPress Integration

The Laravel backend can be configured to work with different WordPress sources:

#### Option 1: WordPress.com Public API (Default)
```env
WORDPRESS_API_URL=https://public-api.wordpress.com/rest/v1.1/sites/jcreforme.home.blog
WORDPRESS_SITE_URL=https://jcreforme.home.blog
```

#### Option 2: Self-hosted WordPress
```env
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://your-wordpress-site.com
WORDPRESS_JWT_TOKEN=your-jwt-token-here
```

#### Option 3: Local WordPress (with Docker)
```env
WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2
WORDPRESS_SITE_URL=http://localhost:8080
```

### Caching Configuration

#### Redis (Recommended)
```env
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
WORDPRESS_CACHE_TTL=300
```

#### File-based Caching
```env
CACHE_DRIVER=file
WORDPRESS_CACHE_TTL=300
```

### Security Configuration

```env
# Rate limiting (requests per minute)
WORDPRESS_RATE_LIMIT=60

# CORS origins (comma-separated)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com

# API security
WORDPRESS_JWT_SECRET=your-secure-secret-key
```

## 🛠️ Available NPM Scripts

The main `package.json` includes helpful scripts for Laravel management:

```bash
# Laravel-specific commands
npm run laravel:install      # Install PHP dependencies
npm run laravel:setup        # Setup environment and generate key
npm run laravel:migrate      # Run database migrations
npm run laravel:serve        # Start Laravel server
npm run laravel:cache        # Cache configuration and routes
npm run laravel:test         # Run Laravel tests

# Full-stack development
npm run dev:full             # Start both React and Laravel servers
npm run setup:all            # Setup both Node.js and PHP dependencies
```

## 📚 API Endpoints

Once the Laravel backend is running, you can access these endpoints:

### Public Endpoints (No Authentication Required)

```
GET  /api/health                    # API health check
GET  /api/config                    # API configuration
GET  /api/wordpress/posts           # Get WordPress posts
GET  /api/wordpress/posts/{id}      # Get specific post
GET  /api/wordpress/search?q={term} # Search posts
GET  /api/wordpress/categories      # Get categories
GET  /api/wordpress/tags            # Get tags
GET  /api/wordpress/stats           # Get blog statistics
```

### Protected Endpoints (Authentication Required)

```
POST   /api/wordpress/posts         # Create new post
PUT    /api/wordpress/posts/{id}    # Update post
DELETE /api/wordpress/posts/{id}    # Delete post
POST   /api/wordpress/sync          # Sync content
DELETE /api/wordpress/cache         # Clear cache
```

## 🧪 Testing the Setup

### 1. Health Check
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-07-15T12:00:00.000000Z",
  "version": "1.0.0",
  "environment": "local"
}
```

### 2. WordPress Posts
```bash
curl http://localhost:8000/api/wordpress/posts?per_page=5
```

### 3. Blog Statistics
```bash
curl http://localhost:8000/api/wordpress/stats
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Composer Not Found
**Error**: `composer: command not found`

**Solution**: Install Composer globally
```bash
# Download and install Composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```

#### 2. Database Connection Error
**Error**: `SQLSTATE[HY000] [2002] Connection refused`

**Solutions**:
1. Ensure MySQL is running
2. Check database credentials in `.env`
3. Create the database if it doesn't exist
4. Verify MySQL port (default: 3306)

#### 3. Redis Connection Error
**Error**: `Connection refused [tcp://127.0.0.1:6379]`

**Solutions**:
1. Install and start Redis:
   ```bash
   # Ubuntu/Debian
   sudo apt install redis-server
   sudo systemctl start redis
   
   # macOS (with Homebrew)
   brew install redis
   brew services start redis
   
   # Windows (with Docker)
   docker run -d -p 6379:6379 redis:alpine
   ```
2. Or use file-based caching:
   ```env
   CACHE_DRIVER=file
   ```

#### 4. CORS Errors in React
**Error**: `Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: Update CORS settings in Laravel `.env`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### 5. WordPress API Not Responding
**Error**: Laravel returns 500 error when fetching WordPress data

**Solutions**:
1. Check WordPress API URL is correct
2. Verify network connectivity
3. Check Laravel logs: `laravel-backend/storage/logs/laravel.log`
4. Test WordPress API directly in browser

#### 6. Permission Errors
**Error**: `The stream or file could not be opened in append mode`

**Solution**: Set proper file permissions
```bash
cd laravel-backend
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Debug Mode

Enable debug mode for detailed error information:

```env
APP_DEBUG=true
LOG_LEVEL=debug
```

**⚠️ Important**: Disable debug mode in production!

## 🚀 Production Deployment

### Environment Configuration

For production, update these settings in `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Use strong, unique keys
APP_KEY=base64:your-generated-key

# Production database
DB_HOST=your-production-db-host
DB_DATABASE=your-production-db
DB_USERNAME=your-production-user
DB_PASSWORD=your-secure-password

# Production cache
CACHE_DRIVER=redis
REDIS_HOST=your-redis-host

# Production CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Optimization Commands

```bash
# Cache configuration and routes
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize Composer autoloader
composer install --no-dev --optimize-autoloader
```

### Web Server Configuration

For production, use a proper web server like Nginx:

```nginx
server {
    listen 80;
    server_name your-api-domain.com;
    root /var/www/laravel-backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 📈 Performance Optimization

### 1. Enable OPcache

Add to your PHP configuration:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
```

### 2. Configure Redis

Optimize Redis configuration:
```
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
```

### 3. Database Optimization

Add indexes for better performance:
```sql
-- Add to your migration
Schema::table('posts', function (Blueprint $table) {
    $table->index(['post_status', 'post_type']);
    $table->index('post_date');
});
```

## 🔐 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique passwords and keys
- Regularly rotate API keys and secrets

### 2. Rate Limiting
- Configure appropriate rate limits for your use case
- Monitor API usage and adjust limits as needed

### 3. Input Validation
- All input is validated using Laravel's validation rules
- HTML content is sanitized to prevent XSS attacks

### 4. HTTPS
- Always use HTTPS in production
- Configure SSL certificates properly
- Update CORS settings for HTTPS origins

## 📞 Support and Resources

### Documentation
- [Laravel Documentation](https://laravel.com/docs)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Redis Documentation](https://redis.io/documentation)

### Logs
- Laravel logs: `laravel-backend/storage/logs/laravel.log`
- Nginx logs: `/var/log/nginx/error.log`
- PHP logs: `/var/log/php/error.log`

### Community
- [Laravel Community](https://laracasts.com/)
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/laravel)

---

This setup guide should get your Laravel backend up and running successfully. If you encounter any issues not covered here, check the logs and refer to the official documentation for the specific components involved.
