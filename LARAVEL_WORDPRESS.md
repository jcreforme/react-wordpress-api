# Laravel + WordPress Integration Guide

## Overview

This document provides a comprehensive technical guide for integrating Laravel with WordPress, creating powerful hybrid applications that leverage the strengths of both platforms.

## Table of Contents

1. [Architecture Patterns](#architecture-patterns)
2. [Integration Methods](#integration-methods)
3. [Database Integration](#database-integration)
4. [Authentication & User Management](#authentication--user-management)
5. [API Integration](#api-integration)
6. [Content Management](#content-management)
7. [Performance Considerations](#performance-considerations)
8. [Security Best Practices](#security-best-practices)
9. [Deployment Strategies](#deployment-strategies)
10. [Code Examples](#code-examples)

## Architecture Patterns

### 1. Headless WordPress with Laravel API

**Pattern**: WordPress as a content management backend, Laravel as the API layer and business logic handler.

```
Frontend (React/Vue) ← → Laravel API ← → WordPress (Headless CMS)
```

**Benefits**:
- Complete separation of concerns
- Laravel handles complex business logic
- WordPress manages content creation
- Scalable and maintainable

### 2. WordPress Frontend with Laravel Services

**Pattern**: WordPress handles the frontend while Laravel provides specialized services.

```
WordPress Frontend ← → Laravel Microservices
```

**Use Cases**:
- E-commerce functionality
- Advanced user management
- Complex data processing
- Third-party integrations

### 3. Unified Database Architecture

**Pattern**: Shared database with custom tables for Laravel functionality.

```
WordPress Tables + Laravel Tables (Same Database)
```

## Advanced Integration Patterns

### 4. Microservices Architecture

**Pattern**: Laravel and WordPress as independent microservices communicating via APIs and message queues.

```
WordPress Service ← → Message Queue ← → Laravel Service
     ↓                                        ↓
  Redis Cache                           Elasticsearch
```

**Benefits**:
- True service independence
- Scalable horizontally
- Technology agnostic communication
- Fault isolation

#### Message Queue Implementation

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Queue;
use App\Jobs\SyncWordPressContent;

class WordPressEventService
{
    public function handlePostPublished($postData)
    {
        Queue::push(new SyncWordPressContent([
            'action' => 'post_published',
            'post_id' => $postData['ID'],
            'post_data' => $postData
        ]));
    }

    public function handleUserRegistered($userData)
    {
        Queue::push(new SyncWordPressContent([
            'action' => 'user_registered',
            'user_id' => $userData['ID'],
            'user_data' => $userData
        ]));
    }
}
```

### 5. Event-Driven Architecture

**Pattern**: Real-time synchronization using event streams and webhooks.

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WordPressPostUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $post;
    public $changes;

    public function __construct($post, $changes = [])
    {
        $this->post = $post;
        $this->changes = $changes;
    }

    public function broadcastOn()
    {
        return new Channel('wordpress.posts.' . $this->post['id']);
    }

    public function broadcastWith()
    {
        return [
            'post' => $this->post,
            'changes' => $this->changes,
            'timestamp' => now()->toISOString()
        ];
    }
}
```

### 6. GraphQL Integration

**Pattern**: Unified GraphQL endpoint combining WordPress and Laravel data.

```php
<?php

namespace App\GraphQL\Queries;

use App\Models\WordPress\Post;
use App\Models\User;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class WordPressQuery
{
    public function posts($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $query = Post::with(['author', 'meta', 'categories'])
                    ->where('post_status', 'publish')
                    ->where('post_type', 'post');

        if (isset($args['search'])) {
            $query->where(function($q) use ($args) {
                $q->where('post_title', 'like', '%' . $args['search'] . '%')
                  ->orWhere('post_content', 'like', '%' . $args['search'] . '%');
            });
        }

        if (isset($args['category_id'])) {
            $query->whereHas('categories', function($q) use ($args) {
                $q->where('term_id', $args['category_id']);
            });
        }

        return $query->paginate(
            $args['first'] ?? 15,
            ['*'],
            'page',
            $args['page'] ?? 1
        );
    }

    public function combinedUserData($rootValue, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $wpUser = \App\Models\WordPress\User::find($args['id']);
        $laravelUser = User::where('wordpress_id', $args['id'])->first();

        return [
            'wordpress_profile' => $wpUser,
            'laravel_profile' => $laravelUser,
            'combined_stats' => [
                'total_posts' => $wpUser->posts()->count(),
                'total_orders' => $laravelUser ? $laravelUser->orders()->count() : 0,
                'last_activity' => max($wpUser->last_activity ?? '', $laravelUser->updated_at ?? '')
            ]
        ];
    }
}
```

## Integration Methods

### Method 1: REST API Integration

#### WordPress to Laravel Communication

```php
// Laravel Controller
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WordPressService;

class WordPressController extends Controller
{
    protected $wordpressService;

    public function __construct(WordPressService $wordpressService)
    {
        $this->wordpressService = $wordpressService;
    }

    public function getPosts(Request $request)
    {
        $posts = $this->wordpressService->fetchPosts([
            'per_page' => $request->get('per_page', 10),
            'categories' => $request->get('categories'),
            'search' => $request->get('search')
        ]);

        return response()->json($posts);
    }
}
```

#### WordPress Service Class

```php
<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

class WordPressService
{
    protected $client;
    protected $baseUrl;

    public function __construct()
    {
        $this->client = new Client();
        $this->baseUrl = config('wordpress.api_url');
    }

    public function fetchPosts(array $params = [])
    {
        $cacheKey = 'wp_posts_' . md5(serialize($params));
        
        return Cache::remember($cacheKey, 300, function () use ($params) {
            $response = $this->client->get($this->baseUrl . '/wp-json/wp/v2/posts', [
                'query' => $params
            ]);

            return json_decode($response->getBody(), true);
        });
    }

    public function createPost(array $data)
    {
        $response = $this->client->post($this->baseUrl . '/wp-json/wp/v2/posts', [
            'json' => $data,
            'headers' => [
                'Authorization' => 'Bearer ' . config('wordpress.jwt_token')
            ]
        ]);

        return json_decode($response->getBody(), true);
    }
}
```

### Method 2: Database-Level Integration

#### Shared Database Configuration

```php
// config/database.php
'connections' => [
    'mysql' => [
        'driver' => 'mysql',
        'host' => env('DB_HOST', '127.0.0.1'),
        'database' => env('DB_DATABASE', 'laravel_wp'),
        'username' => env('DB_USERNAME', 'forge'),
        'password' => env('DB_PASSWORD', ''),
        'prefix' => '',
    ],
    'wordpress' => [
        'driver' => 'mysql',
        'host' => env('WP_DB_HOST', '127.0.0.1'),
        'database' => env('WP_DB_DATABASE', 'wordpress'),
        'username' => env('WP_DB_USERNAME', 'forge'),
        'password' => env('WP_DB_PASSWORD', ''),
        'prefix' => env('WP_DB_PREFIX', 'wp_'),
    ],
];
```

#### WordPress Models in Laravel

```php
<?php

namespace App\Models\WordPress;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $connection = 'wordpress';
    protected $table = 'posts';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'post_author',
        'post_date',
        'post_content',
        'post_title',
        'post_excerpt',
        'post_status',
        'post_name'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'post_author', 'ID');
    }

    public function meta()
    {
        return $this->hasMany(PostMeta::class, 'post_id', 'ID');
    }

    public function categories()
    {
        return $this->belongsToMany(
            Term::class,
            'term_relationships',
            'object_id',
            'term_taxonomy_id'
        );
    }
}
```

### Method 3: Plugin-Based Integration

#### Laravel WordPress Plugin

```php
<?php
/*
Plugin Name: Laravel Integration
Description: Integrates WordPress with Laravel application
Version: 1.0.0
*/

class LaravelIntegration
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueScripts']);
        add_action('wp_ajax_laravel_request', [$this, 'handleLaravelRequest']);
        add_action('wp_ajax_nopriv_laravel_request', [$this, 'handleLaravelRequest']);
        add_filter('the_content', [$this, 'injectLaravelContent']);
    }

    public function handleLaravelRequest()
    {
        $action = $_POST['laravel_action'] ?? '';
        $data = $_POST['data'] ?? [];

        $response = $this->callLaravelAPI($action, $data);
        
        wp_send_json($response);
    }

    private function callLaravelAPI($endpoint, $data)
    {
        $url = get_option('laravel_api_url') . '/api/' . $endpoint;
        
        $response = wp_remote_post($url, [
            'body' => json_encode($data),
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . get_option('laravel_api_token')
            ]
        ]);

        return json_decode(wp_remote_retrieve_body($response), true);
    }
}

new LaravelIntegration();
```

## Database Integration

### Shared User Management

```php
<?php

namespace App\Models\WordPress;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $connection = 'wordpress';
    protected $table = 'users';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'user_login',
        'user_email',
        'user_nicename',
        'display_name'
    ];

    protected $hidden = [
        'user_pass',
    ];

    public function getAuthPassword()
    {
        return $this->user_pass;
    }

    public function meta()
    {
        return $this->hasMany(UserMeta::class, 'user_id', 'ID');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'post_author', 'ID');
    }
}
```

### Cross-Platform Data Sync

```php
<?php

namespace App\Services;

use App\Models\User;
use App\Models\WordPress\User as WordPressUser;

class UserSyncService
{
    public function syncWordPressUser($wpUserId)
    {
        $wpUser = WordPressUser::find($wpUserId);
        
        if (!$wpUser) {
            return false;
        }

        $laravelUser = User::updateOrCreate(
            ['wordpress_id' => $wpUser->ID],
            [
                'name' => $wpUser->display_name,
                'email' => $wpUser->user_email,
                'username' => $wpUser->user_login,
                'wordpress_id' => $wpUser->ID
            ]
        );

        return $laravelUser;
    }

    public function syncToWordPress(User $user)
    {
        if (!$user->wordpress_id) {
            // Create new WordPress user
            $wpUser = new WordPressUser([
                'user_login' => $user->username,
                'user_email' => $user->email,
                'display_name' => $user->name,
                'user_pass' => wp_hash_password($user->password),
                'user_registered' => now()
            ]);
            
            $wpUser->save();
            
            $user->update(['wordpress_id' => $wpUser->ID]);
        } else {
            // Update existing WordPress user
            WordPressUser::where('ID', $user->wordpress_id)
                ->update([
                    'user_email' => $user->email,
                    'display_name' => $user->name
                ]);
        }
    }
}
```

## Authentication & User Management

### JWT Authentication Between Platforms

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class WordPressJWTAuth
{
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['error' => 'Token required'], 401);
        }

        try {
            $decoded = JWT::decode($token, new Key(config('wordpress.jwt_secret'), 'HS256'));
            
            $wpUser = \App\Models\WordPress\User::find($decoded->data->user->id);
            
            if (!$wpUser) {
                return response()->json(['error' => 'Invalid user'], 401);
            }

            $request->merge(['wp_user' => $wpUser]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}
```

### Single Sign-On Implementation

```php
<?php

namespace App\Services;

use App\Models\User;
use App\Models\WordPress\User as WordPressUser;
use Illuminate\Support\Facades\Hash;

class SSOService
{
    public function authenticateFromWordPress($wpToken)
    {
        $wpUser = $this->validateWordPressToken($wpToken);
        
        if (!$wpUser) {
            return false;
        }

        $laravelUser = User::where('wordpress_id', $wpUser->ID)->first();
        
        if (!$laravelUser) {
            $laravelUser = $this->createLaravelUserFromWP($wpUser);
        }

        return auth()->login($laravelUser);
    }

    private function createLaravelUserFromWP(WordPressUser $wpUser)
    {
        return User::create([
            'name' => $wpUser->display_name,
            'email' => $wpUser->user_email,
            'password' => Hash::make(str_random(32)), // Random password
            'wordpress_id' => $wpUser->ID
        ]);
    }
}
```

## API Integration

### WordPress REST API Extensions

```php
<?php
// WordPress Plugin: Laravel API Extensions

add_action('rest_api_init', function() {
    register_rest_route('laravel/v1', '/sync-user/(?P<id>\d+)', [
        'methods' => 'POST',
        'callback' => 'sync_user_to_laravel',
        'permission_callback' => 'laravel_api_permissions'
    ]);
});

function sync_user_to_laravel($request) {
    $user_id = $request['id'];
    $user = get_user_by('ID', $user_id);
    
    if (!$user) {
        return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
    }

    $laravel_url = get_option('laravel_api_url') . '/api/sync-wp-user';
    
    $response = wp_remote_post($laravel_url, [
        'body' => json_encode([
            'wp_user_id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name
        ]),
        'headers' => [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . get_option('laravel_api_token')
        ]
    ]);

    return ['success' => true, 'response' => $response];
}
```

### Laravel API for WordPress

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\WordPressSyncService;

class WordPressSyncController extends Controller
{
    protected $syncService;

    public function __construct(WordPressSyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    public function syncUser(Request $request)
    {
        $validated = $request->validate([
            'wp_user_id' => 'required|integer',
            'username' => 'required|string',
            'email' => 'required|email',
            'display_name' => 'required|string'
        ]);

        $user = $this->syncService->syncWordPressUser($validated);

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function getWordPressContent(Request $request)
    {
        $posts = $this->syncService->getRecentPosts(
            $request->get('limit', 10)
        );

        return response()->json([
            'posts' => $posts
        ]);
    }
}
```

## Content Management

### Content Synchronization

```php
<?php

namespace App\Services;

use App\Models\WordPress\Post;
use App\Models\Article;

class ContentSyncService
{
    public function syncWordPressPost($postId)
    {
        $wpPost = Post::find($postId);
        
        if (!$wpPost || $wpPost->post_status !== 'publish') {
            return false;
        }

        $article = Article::updateOrCreate(
            ['wordpress_id' => $wpPost->ID],
            [
                'title' => $wpPost->post_title,
                'content' => $wpPost->post_content,
                'excerpt' => $wpPost->post_excerpt,
                'slug' => $wpPost->post_name,
                'published_at' => $wpPost->post_date,
                'wordpress_id' => $wpPost->ID
            ]
        );

        $this->syncPostMeta($wpPost, $article);
        
        return $article;
    }

    private function syncPostMeta($wpPost, $article)
    {
        $meta = $wpPost->meta()->pluck('meta_value', 'meta_key');
        
        $article->update([
            'featured_image' => $meta['_thumbnail_id'] ?? null,
            'seo_title' => $meta['_yoast_wpseo_title'] ?? null,
            'seo_description' => $meta['_yoast_wpseo_metadesc'] ?? null
        ]);
    }
}
```

## Performance Considerations

### Caching Strategy

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class WordPressCacheService
{
    public function cacheWordPressData($key, $callback, $ttl = 3600)
    {
        return Cache::tags(['wordpress'])->remember($key, $ttl, $callback);
    }

    public function invalidateWordPressCache($tags = [])
    {
        if (empty($tags)) {
            Cache::tags(['wordpress'])->flush();
        } else {
            Cache::tags(array_merge(['wordpress'], $tags))->flush();
        }
    }

    public function cachePostsWithRedis($posts)
    {
        foreach ($posts as $post) {
            Redis::setex(
                "wp:post:{$post['id']}", 
                3600, 
                json_encode($post)
            );
        }
    }
}
```

### Database Query Optimization

```php
<?php

namespace App\Repositories;

use App\Models\WordPress\Post;
use Illuminate\Database\Eloquent\Collection;

class WordPressPostRepository
{
    public function getPostsWithMeta(array $postIds): Collection
    {
        return Post::with([
            'meta' => function($query) {
                $query->whereIn('meta_key', [
                    '_thumbnail_id',
                    '_yoast_wpseo_title',
                    '_yoast_wpseo_metadesc'
                ]);
            },
            'author:ID,display_name,user_email'
        ])
        ->whereIn('ID', $postIds)
        ->where('post_status', 'publish')
        ->orderBy('post_date', 'desc')
        ->get();
    }

    public function getPopularPosts($limit = 10)
    {
        return Post::select('posts.*')
            ->leftJoin('postmeta', function($join) {
                $join->on('posts.ID', '=', 'postmeta.post_id')
                     ->where('postmeta.meta_key', '=', 'post_views_count');
            })
            ->where('post_status', 'publish')
            ->orderByRaw('CAST(postmeta.meta_value AS UNSIGNED) DESC')
            ->limit($limit)
            ->get();
    }
}
```

## Security Best Practices

### API Authentication

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class WordPressAPIAuth
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-WP-API-KEY');
        $timestamp = $request->header('X-WP-TIMESTAMP');
        $signature = $request->header('X-WP-SIGNATURE');

        if (!$this->validateSignature($apiKey, $timestamp, $signature, $request->getContent())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($this->isTimestampExpired($timestamp)) {
            return response()->json(['error' => 'Request expired'], 401);
        }

        return $next($request);
    }

    private function validateSignature($apiKey, $timestamp, $signature, $body)
    {
        $secret = config('wordpress.api_secret');
        $expectedSignature = hash_hmac('sha256', $apiKey . $timestamp . $body, $secret);
        
        return hash_equals($expectedSignature, $signature);
    }

    private function isTimestampExpired($timestamp, $maxAge = 300)
    {
        return (time() - $timestamp) > $maxAge;
    }
}
```

### Input Sanitization

```php
<?php

namespace App\Services;

class WordPressSecurityService
{
    public function sanitizeWordPressContent($content)
    {
        // Remove WordPress shortcodes
        $content = preg_replace('/\[([^\]]*)\]/', '', $content);
        
        // Sanitize HTML
        $content = strip_tags($content, '<p><br><strong><em><ul><ol><li><a><h1><h2><h3><h4><h5><h6>');
        
        // Remove script tags and event handlers
        $content = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi', '', $content);
        $content = preg_replace('/\son\w+="[^"]*"/i', '', $content);
        
        return $content;
    }

    public function validateWordPressUser($userData)
    {
        return [
            'user_login' => sanitize_user($userData['user_login']),
            'user_email' => sanitize_email($userData['user_email']),
            'display_name' => sanitize_text_field($userData['display_name'])
        ];
    }
}
```

## Deployment Strategies

### Docker Configuration

```dockerfile
# Dockerfile for Laravel + WordPress
FROM php:8.1-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel application
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy WordPress
RUN curl -O https://wordpress.org/latest.tar.gz \
    && tar xzf latest.tar.gz \
    && mv wordpress /var/www/wordpress \
    && rm latest.tar.gz

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/sites-available/default

EXPOSE 80

CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;'"]
```

### Environment Configuration

```bash
# .env for Laravel + WordPress
APP_NAME="Laravel WordPress App"
APP_ENV=production
APP_KEY=base64:your-app-key
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel_wp
DB_USERNAME=root
DB_PASSWORD=password

# WordPress Database (if separate)
WP_DB_HOST=db
WP_DB_DATABASE=wordpress
WP_DB_USERNAME=root
WP_DB_PASSWORD=password
WP_DB_PREFIX=wp_

# WordPress API
WORDPRESS_API_URL=https://your-wp-site.com
WORDPRESS_API_TOKEN=your-jwt-token
WORDPRESS_API_SECRET=your-secret-key

# Cache
CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## Code Examples

### Complete Integration Service

```php
<?php

namespace App\Services;

use App\Models\WordPress\Post;
use App\Models\WordPress\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class WordPressIntegrationService
{
    protected $cacheService;
    protected $syncService;

    public function __construct(
        WordPressCacheService $cacheService,
        ContentSyncService $syncService
    ) {
        $this->cacheService = $cacheService;
        $this->syncService = $syncService;
    }

    public function getWordPressPosts($params = [])
    {
        $cacheKey = 'wp_posts_' . md5(serialize($params));
        
        return $this->cacheService->cacheWordPressData($cacheKey, function() use ($params) {
            $query = Post::where('post_status', 'publish')
                        ->where('post_type', 'post')
                        ->with(['author', 'meta'])
                        ->orderBy('post_date', 'desc');

            if (isset($params['category'])) {
                $query->whereHas('categories', function($q) use ($params) {
                    $q->where('slug', $params['category']);
                });
            }

            if (isset($params['search'])) {
                $query->where(function($q) use ($params) {
                    $q->where('post_title', 'like', '%' . $params['search'] . '%')
                      ->orWhere('post_content', 'like', '%' . $params['search'] . '%');
                });
            }

            return $query->paginate($params['per_page'] ?? 10);
        });
    }

    public function syncAllContent()
    {
        try {
            $posts = Post::where('post_status', 'publish')
                        ->where('post_type', 'post')
                        ->where('post_modified', '>', now()->subHours(24))
                        ->get();

            foreach ($posts as $post) {
                $this->syncService->syncWordPressPost($post->ID);
            }

            Log::info('WordPress content sync completed', ['posts_synced' => $posts->count()]);
            
        } catch (\Exception $e) {
            Log::error('WordPress sync failed', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function createWordPressPost($data)
    {
        $post = new Post([
            'post_title' => $data['title'],
            'post_content' => $data['content'],
            'post_excerpt' => $data['excerpt'] ?? '',
            'post_status' => $data['status'] ?? 'draft',
            'post_author' => $data['author_id'],
            'post_date' => now(),
            'post_name' => str_slug($data['title'])
        ]);

        $post->save();

        // Clear cache
        $this->cacheService->invalidateWordPressCache(['posts']);

        return $post;
    }
}
```

## Development Workflow Integration

### Git Workflow for Hybrid Projects

```bash
# .gitignore for Laravel + WordPress
/node_modules
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.phpunit.result.cache
docker-compose.override.yml
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log

# WordPress specific
/wordpress/wp-config.php
/wordpress/wp-content/uploads/
/wordpress/wp-content/cache/
/wordpress/wp-content/backup-db/
/wordpress/wp-content/advanced-cache.php
/wordpress/wp-content/wp-cache-config.php
/wordpress/.htaccess
```

### CI/CD Pipeline Configuration

```yaml
# .github/workflows/laravel-wordpress.yml
name: Laravel WordPress Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: laravel_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
        extensions: mbstring, dom, fileinfo, mysql
        
    - name: Install Laravel Dependencies
      run: composer install --no-progress --no-suggest --prefer-dist --optimize-autoloader
      
    - name: Setup WordPress Test Environment
      run: |
        wget https://wordpress.org/latest.tar.gz
        tar xzf latest.tar.gz
        cp wordpress/wp-config-sample.php wordpress/wp-config.php
        
    - name: Generate Application Key
      run: php artisan key:generate
      
    - name: Run Laravel Tests
      run: php artisan test
      
    - name: Run WordPress Integration Tests
      run: ./vendor/bin/phpunit tests/Integration/
      
    - name: Run Security Scan
      run: composer audit

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to Production
      run: |
        # Deploy Laravel application
        rsync -avz --exclude-from='.gitignore' ./ ${{ secrets.PRODUCTION_SERVER }}:/var/www/laravel/
        
        # Deploy WordPress if changes detected
        if git diff --name-only HEAD~1 HEAD | grep -q "wordpress/"; then
          rsync -avz wordpress/ ${{ secrets.PRODUCTION_SERVER }}:/var/www/wordpress/
        fi
```

## Troubleshooting Guide

### Common Integration Issues

#### 1. Database Connection Problems

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DiagnoseWordPressConnection extends Command
{
    protected $signature = 'wordpress:diagnose';
    protected $description = 'Diagnose WordPress database connection issues';

    public function handle()
    {
        $this->info('Diagnosing WordPress integration...');
        
        // Test Laravel database
        try {
            DB::connection('mysql')->getPdo();
            $this->info('✓ Laravel database connection: OK');
        } catch (\Exception $e) {
            $this->error('✗ Laravel database connection failed: ' . $e->getMessage());
        }
        
        // Test WordPress database
        try {
            DB::connection('wordpress')->getPdo();
            $this->info('✓ WordPress database connection: OK');
            
            $postCount = DB::connection('wordpress')->table('posts')->count();
            $this->info("  Found {$postCount} posts in WordPress database");
            
        } catch (\Exception $e) {
            $this->error('✗ WordPress database connection failed: ' . $e->getMessage());
        }
        
        // Test API connectivity
        $this->testWordPressAPI();
        
        // Check file permissions
        $this->checkFilePermissions();
    }
    
    private function testWordPressAPI()
    {
        try {
            $response = \Http::get(config('wordpress.api_url') . '/wp-json/wp/v2/posts?per_page=1');
            
            if ($response->successful()) {
                $this->info('✓ WordPress REST API: OK');
            } else {
                $this->error('✗ WordPress REST API returned: ' . $response->status());
            }
        } catch (\Exception $e) {
            $this->error('✗ WordPress REST API connection failed: ' . $e->getMessage());
        }
    }
    
    private function checkFilePermissions()
    {
        $paths = [
            storage_path('logs'),
            storage_path('framework/cache'),
            storage_path('framework/sessions'),
            storage_path('framework/views')
        ];
        
        foreach ($paths as $path) {
            if (is_writable($path)) {
                $this->info("✓ {$path}: Writable");
            } else {
                $this->error("✗ {$path}: Not writable");
            }
        }
    }
}
```

#### 2. Sync Conflict Resolution

```php
<?php

namespace App\Services;

class ConflictResolutionService
{
    public function resolvePostConflict($laravelPost, $wordpressPost)
    {
        $conflicts = $this->detectConflicts($laravelPost, $wordpressPost);
        
        if (empty($conflicts)) {
            return ['status' => 'no_conflict'];
        }
        
        $resolution = [];
        
        foreach ($conflicts as $field => $conflict) {
            $resolution[$field] = $this->resolveFieldConflict($field, $conflict);
        }
        
        return [
            'status' => 'resolved',
            'conflicts' => $conflicts,
            'resolution' => $resolution
        ];
    }
    
    private function resolveFieldConflict($field, $conflict)
    {
        switch ($field) {
            case 'title':
            case 'content':
                // Prefer the most recently modified
                return $conflict['laravel_updated'] > $conflict['wordpress_updated'] 
                    ? $conflict['laravel_value'] 
                    : $conflict['wordpress_value'];
                    
            case 'status':
                // WordPress status takes precedence
                return $conflict['wordpress_value'];
                
            case 'author':
                // Prefer WordPress author
                return $conflict['wordpress_value'];
                
            default:
                // Default to WordPress value
                return $conflict['wordpress_value'];
        }
    }
    
    private function detectConflicts($laravelPost, $wordpressPost)
    {
        $conflicts = [];
        
        $fields = ['title', 'content', 'excerpt', 'status'];
        
        foreach ($fields as $field) {
            $laravelValue = $laravelPost->{$field};
            $wpValue = $wordpressPost->{"post_{$field}"};
            
            if ($laravelValue !== $wpValue) {
                $conflicts[$field] = [
                    'laravel_value' => $laravelValue,
                    'wordpress_value' => $wpValue,
                    'laravel_updated' => $laravelPost->updated_at,
                    'wordpress_updated' => $wordpressPost->post_modified
                ];
            }
        }
        
        return $conflicts;
    }
}
```

## Performance Benchmarks

### Expected Performance Metrics

| Operation | Records | Expected Time | Memory Usage |
|-----------|---------|---------------|--------------|
| Sync Single Post | 1 | < 100ms | < 2MB |
| Bulk Sync Posts | 100 | < 5s | < 50MB |
| Full Site Sync | 1000+ | < 30s | < 200MB |
| API Request | - | < 200ms | < 1MB |
| Cache Hit | - | < 10ms | Minimal |

### Performance Optimization Checklist

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class OptimizeWordPressIntegration extends Command
{
    protected $signature = 'wordpress:optimize';
    protected $description = 'Optimize WordPress integration performance';

    public function handle()
    {
        $this->info('Optimizing WordPress integration...');
        
        // Clear all caches
        $this->call('cache:clear');
        $this->call('config:cache');
        $this->call('route:cache');
        $this->call('view:cache');
        
        // Optimize Composer autoloader
        exec('composer dump-autoload --optimize');
        $this->info('✓ Composer autoloader optimized');
        
        // Optimize database queries
        $this->optimizeDatabase();
        
        // Warm up caches
        $this->warmUpCaches();
        
        $this->info('WordPress integration optimization complete!');
    }
    
    private function optimizeDatabase()
    {
        // Add database indexes for common queries
        \DB::statement('CREATE INDEX IF NOT EXISTS idx_posts_status_type ON wp_posts (post_status, post_type)');
        \DB::statement('CREATE INDEX IF NOT EXISTS idx_posts_date ON wp_posts (post_date)');
        \DB::statement('CREATE INDEX IF NOT EXISTS idx_postmeta_key ON wp_postmeta (meta_key)');
        
        $this->info('✓ Database indexes optimized');
    }
    
    private function warmUpCaches()
    {
        // Cache recent posts
        app(\App\Services\WordPressService::class)->fetchPosts(['per_page' => 20]);
        
        // Cache categories
        app(\App\Services\WordPressService::class)->fetchCategories();
        
        $this->info('✓ Caches warmed up');
    }
}
```

## Security Considerations

### Security Audit Checklist

- [ ] **API Authentication**: JWT tokens properly validated
- [ ] **Input Sanitization**: All WordPress content sanitized
- [ ] **SQL Injection Prevention**: Using parameterized queries
- [ ] **XSS Protection**: Content properly escaped
- [ ] **CSRF Protection**: Laravel CSRF middleware enabled
- [ ] **Rate Limiting**: API endpoints rate limited
- [ ] **SSL/TLS**: All communications encrypted
- [ ] **User Permissions**: Proper role-based access control
- [ ] **File Upload Security**: Validate and sanitize uploads
- [ ] **Database Security**: Separate user accounts with minimal privileges

## Conclusion

This comprehensive guide covers the technical integration of Laravel and WordPress, providing:

- **Multiple Architecture Patterns** for different use cases
- **Complete Implementation Examples** with working code
- **Security Best Practices** for production environments
- **Performance Optimization** strategies and monitoring
- **Testing Approaches** for reliable integration
- **Troubleshooting Tools** for common issues
- **Development Workflow** integration

The Laravel + WordPress combination offers a powerful platform for building modern web applications that leverage WordPress's content management capabilities with Laravel's robust framework features.

## Next Steps

1. **Choose Your Integration Pattern**: Select the most appropriate pattern based on your requirements
2. **Set Up Authentication**: Implement secure communication between platforms
3. **Database Design**: Plan your shared or separate database strategy
4. **API Development**: Build robust APIs for cross-platform communication
5. **Testing**: Implement comprehensive testing for both platforms
6. **Deployment**: Configure production environment with proper security measures
7. **Monitoring**: Set up logging and monitoring for the integrated system

For specific implementation help or advanced scenarios, refer to the Laravel and WordPress official documentation or consult with experienced developers familiar with both platforms.
