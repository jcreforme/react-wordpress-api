<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class WordPressService
{
    protected Client $client;
    protected string $baseUrl;
    protected int $cacheTtl;

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 30,
            'verify' => false, // For development only
        ]);
        $this->baseUrl = config('wordpress.api_url');
        $this->cacheTtl = config('wordpress.cache_ttl', 300); // 5 minutes default
    }

    /**
     * Fetch WordPress posts with caching
     */
    public function fetchPosts(array $params = []): array
    {
        $cacheKey = 'wp_posts_' . md5(serialize($params));
        
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($params) {
            try {
                $response = $this->client->get($this->baseUrl . '/posts', [
                    'query' => array_merge([
                        'number' => 10,
                        'fields' => 'ID,title,content,excerpt,date,URL,author,categories,tags,featured_image'
                    ], $params)
                ]);

                $data = json_decode($response->getBody(), true);
                return $data['posts'] ?? [];

            } catch (RequestException $e) {
                Log::error('WordPress API Error: ' . $e->getMessage());
                throw new \Exception('Failed to fetch posts from WordPress API');
            }
        });
    }

    /**
     * Fetch a specific WordPress post
     */
    public function fetchPost(int $id): ?array
    {
        $cacheKey = "wp_post_{$id}";
        
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($id) {
            try {
                $response = $this->client->get($this->baseUrl . "/posts/{$id}", [
                    'query' => [
                        'fields' => 'ID,title,content,excerpt,date,URL,author,categories,tags,featured_image,metadata'
                    ]
                ]);

                return json_decode($response->getBody(), true);

            } catch (RequestException $e) {
                if ($e->getResponse() && $e->getResponse()->getStatusCode() === 404) {
                    return null;
                }
                Log::error('WordPress API Error: ' . $e->getMessage());
                throw new \Exception('Failed to fetch post from WordPress API');
            }
        });
    }

    /**
     * Search WordPress posts
     */
    public function searchPosts(string $query): array
    {
        $cacheKey = 'wp_search_' . md5($query);
        
        return Cache::remember($cacheKey, 300, function () use ($query) { // 5 minutes for search
            try {
                $response = $this->client->get($this->baseUrl . '/posts', [
                    'query' => [
                        'search' => $query,
                        'number' => 20,
                        'fields' => 'ID,title,content,excerpt,date,URL,author'
                    ]
                ]);

                $data = json_decode($response->getBody(), true);
                return $data['posts'] ?? [];

            } catch (RequestException $e) {
                Log::error('WordPress Search API Error: ' . $e->getMessage());
                throw new \Exception('Failed to search posts');
            }
        });
    }

    /**
     * Fetch WordPress categories
     */
    public function fetchCategories(): array
    {
        return Cache::remember('wp_categories', 3600, function () { // 1 hour cache
            try {
                $response = $this->client->get($this->baseUrl . '/categories', [
                    'query' => [
                        'number' => 100
                    ]
                ]);

                $data = json_decode($response->getBody(), true);
                return $data['categories'] ?? [];

            } catch (RequestException $e) {
                Log::error('WordPress Categories API Error: ' . $e->getMessage());
                throw new \Exception('Failed to fetch categories');
            }
        });
    }

    /**
     * Fetch WordPress tags
     */
    public function fetchTags(): array
    {
        return Cache::remember('wp_tags', 3600, function () { // 1 hour cache
            try {
                $response = $this->client->get($this->baseUrl . '/tags', [
                    'query' => [
                        'number' => 100
                    ]
                ]);

                $data = json_decode($response->getBody(), true);
                return $data['tags'] ?? [];

            } catch (RequestException $e) {
                Log::error('WordPress Tags API Error: ' . $e->getMessage());
                throw new \Exception('Failed to fetch tags');
            }
        });
    }

    /**
     * Get blog statistics
     */
    public function getBlogStats(): array
    {
        return Cache::remember('wp_stats', 1800, function () { // 30 minutes cache
            try {
                // Get site info
                $siteResponse = $this->client->get($this->baseUrl . '');
                $siteData = json_decode($siteResponse->getBody(), true);

                // Get recent posts to calculate averages
                $postsResponse = $this->client->get($this->baseUrl . '/posts', [
                    'query' => [
                        'number' => 100,
                        'fields' => 'ID,title,content,date'
                    ]
                ]);
                $postsData = json_decode($postsResponse->getBody(), true);
                $posts = $postsData['posts'] ?? [];

                // Calculate statistics
                $totalPosts = $siteData['posts_total'] ?? count($posts);
                $avgPostLength = 0;
                $lastPostDate = null;

                if (!empty($posts)) {
                    $totalLength = array_sum(array_map(function($post) {
                        return str_word_count(strip_tags($post['content'] ?? ''));
                    }, $posts));
                    
                    $avgPostLength = round($totalLength / count($posts));
                    $lastPostDate = $posts[0]['date'] ?? null;
                }

                return [
                    'total_posts' => $totalPosts,
                    'total_categories' => count($this->fetchCategories()),
                    'total_tags' => count($this->fetchTags()),
                    'average_post_length' => $avgPostLength,
                    'last_post_date' => $lastPostDate,
                    'site_name' => $siteData['name'] ?? 'WordPress Site',
                    'site_description' => $siteData['description'] ?? '',
                    'site_url' => $siteData['URL'] ?? config('wordpress.site_url')
                ];

            } catch (RequestException $e) {
                Log::error('WordPress Stats API Error: ' . $e->getMessage());
                throw new \Exception('Failed to fetch blog statistics');
            }
        });
    }

    /**
     * Clear WordPress cache
     */
    public function clearCache(): bool
    {
        try {
            Cache::tags(['wordpress'])->flush();
            return true;
        } catch (\Exception $e) {
            Log::error('Cache clear error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Create a new WordPress post (if authenticated)
     */
    public function createPost(array $data): array
    {
        try {
            $response = $this->client->post($this->baseUrl . '/posts/new', [
                'json' => $data,
                'headers' => [
                    'Authorization' => 'Bearer ' . config('wordpress.jwt_token')
                ]
            ]);

            $post = json_decode($response->getBody(), true);
            
            // Clear relevant cache
            $this->clearCache();
            
            return $post;

        } catch (RequestException $e) {
            Log::error('WordPress Create Post Error: ' . $e->getMessage());
            throw new \Exception('Failed to create post');
        }
    }
}
