#!/bin/bash

# Laravel Backend Startup Script

echo "🚀 Starting Laravel Backend Setup..."

# Check if .env exists
if [ ! -f "/var/www/laravel/.env" ]; then
    echo "📝 Creating .env file..."
    cp /var/www/laravel/.env.example /var/www/laravel/.env
fi

# Generate application key if not exists
if ! grep -q "APP_KEY=base64:" /var/www/laravel/.env; then
    echo "🔑 Generating application key..."
    php artisan key:generate --no-interaction
fi

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until php artisan migrate:status > /dev/null 2>&1; do
    echo "Database not ready, waiting..."
    sleep 5
done

# Run migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force --no-interaction

# Clear and cache config
echo "🧹 Clearing and caching configuration..."
php artisan config:clear
php artisan config:cache
php artisan route:cache

# Clear cache
echo "🗑️ Clearing application cache..."
php artisan cache:clear

# Set proper permissions
echo "🔐 Setting file permissions..."
chown -R www-data:www-data /var/www/laravel/storage
chown -R www-data:www-data /var/www/laravel/bootstrap/cache
chmod -R 775 /var/www/laravel/storage
chmod -R 775 /var/www/laravel/bootstrap/cache

echo "✅ Laravel Backend setup complete!"

# Start PHP-FPM
exec php-fpm
