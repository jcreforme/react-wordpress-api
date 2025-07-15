<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\WordPressService;
use Illuminate\Http\JsonResponse;

class WordPressController extends Controller
{
    protected WordPressService $wordpressService;

    public function __construct(WordPressService $wordpressService)
    {
        $this->wordpressService = $wordpressService;
    }

    /**
     * Get WordPress posts with optional filtering
     */
    public function getPosts(Request $request): JsonResponse
    {
        try {
            $params = $request->validate([
                'per_page' => 'integer|min:1|max:100',
                'page' => 'integer|min:1',
                'categories' => 'string',
                'search' => 'string',
                'author' => 'integer',
                'status' => 'string|in:publish,draft,private'
            ]);

            $posts = $this->wordpressService->fetchPosts($params);

            return response()->json([
                'success' => true,
                'data' => $posts,
                'meta' => [
                    'total' => count($posts),
                    'page' => $params['page'] ?? 1,
                    'per_page' => $params['per_page'] ?? 10
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific WordPress post
     */
    public function getPost(int $id): JsonResponse
    {
        try {
            $post = $this->wordpressService->fetchPost($id);

            if (!$post) {
                return response()->json([
                    'success' => false,
                    'message' => 'Post not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $post
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search WordPress posts
     */
    public function searchPosts(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'q' => 'required|string|min:2'
            ]);

            $results = $this->wordpressService->searchPosts($request->input('q'));

            return response()->json([
                'success' => true,
                'data' => $results,
                'meta' => [
                    'query' => $request->input('q'),
                    'total' => count($results)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get WordPress categories
     */
    public function getCategories(): JsonResponse
    {
        try {
            $categories = $this->wordpressService->fetchCategories();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get WordPress tags
     */
    public function getTags(): JsonResponse
    {
        try {
            $tags = $this->wordpressService->fetchTags();

            return response()->json([
                'success' => true,
                'data' => $tags
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tags',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get blog statistics
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = $this->wordpressService->getBlogStats();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
