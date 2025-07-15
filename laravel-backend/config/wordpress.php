<?php

return [
    /*
    |--------------------------------------------------------------------------
    | WordPress API Configuration
    |--------------------------------------------------------------------------
    |
    | Configure WordPress integration settings including API endpoints,
    | authentication, and caching parameters.
    |
    */

    'api_url' => env('WORDPRESS_API_URL', 'https://public-api.wordpress.com/rest/v1.1/sites/jcreforme.home.blog'),
    
    'site_url' => env('WORDPRESS_SITE_URL', 'https://jcreforme.home.blog'),
    
    'jwt_token' => env('WORDPRESS_JWT_TOKEN'),
    
    'jwt_secret' => env('WORDPRESS_JWT_SECRET', 'your-secret-key'),
    
    'cache_ttl' => env('WORDPRESS_CACHE_TTL', 300), // 5 minutes
    
    'api_timeout' => env('WORDPRESS_API_TIMEOUT', 30), // 30 seconds
    
    'max_posts_per_request' => env('WORDPRESS_MAX_POSTS', 100),
    
    'enable_caching' => env('WORDPRESS_ENABLE_CACHE', true),
    
    /*
    |--------------------------------------------------------------------------
    | Database Integration (if using direct DB access)
    |--------------------------------------------------------------------------
    */
    
    'database' => [
        'connection' => env('WP_DB_CONNECTION', 'wordpress'),
        'host' => env('WP_DB_HOST', '127.0.0.1'),
        'port' => env('WP_DB_PORT', '3306'),
        'database' => env('WP_DB_DATABASE', 'wordpress'),
        'username' => env('WP_DB_USERNAME', 'root'),
        'password' => env('WP_DB_PASSWORD', ''),
        'prefix' => env('WP_DB_PREFIX', 'wp_'),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Content Synchronization Settings
    |--------------------------------------------------------------------------
    */
    
    'sync' => [
        'enabled' => env('WORDPRESS_SYNC_ENABLED', true),
        'interval' => env('WORDPRESS_SYNC_INTERVAL', 300), // 5 minutes
        'batch_size' => env('WORDPRESS_SYNC_BATCH_SIZE', 50),
        'auto_sync_on_webhook' => env('WORDPRESS_AUTO_SYNC', true),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Security Settings
    |--------------------------------------------------------------------------
    */
    
    'security' => [
        'verify_ssl' => env('WORDPRESS_VERIFY_SSL', true),
        'rate_limit_per_minute' => env('WORDPRESS_RATE_LIMIT', 60),
        'allowed_origins' => explode(',', env('WORDPRESS_ALLOWED_ORIGINS', 'http://localhost:3000')),
        'webhook_secret' => env('WORDPRESS_WEBHOOK_SECRET'),
    ],
];
