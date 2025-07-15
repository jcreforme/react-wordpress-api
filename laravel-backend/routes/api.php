<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\WordPressController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| WordPress API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('wordpress')->group(function () {
    
    // Public routes (no authentication required)
    Route::get('/posts', [WordPressController::class, 'getPosts']);
    Route::get('/posts/{id}', [WordPressController::class, 'getPost']);
    Route::get('/search', [WordPressController::class, 'searchPosts']);
    Route::get('/categories', [WordPressController::class, 'getCategories']);
    Route::get('/tags', [WordPressController::class, 'getTags']);
    Route::get('/stats', [WordPressController::class, 'getStats']);
    
    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/posts', [WordPressController::class, 'createPost']);
        Route::put('/posts/{id}', [WordPressController::class, 'updatePost']);
        Route::delete('/posts/{id}', [WordPressController::class, 'deletePost']);
        Route::post('/sync', [WordPressController::class, 'syncContent']);
        Route::delete('/cache', [WordPressController::class, 'clearCache']);
    });
});

/*
|--------------------------------------------------------------------------
| General API Routes
|--------------------------------------------------------------------------
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'version' => config('app.version', '1.0.0'),
        'environment' => app()->environment()
    ]);
});

Route::get('/config', function () {
    return response()->json([
        'wordpress_api_url' => config('wordpress.api_url'),
        'site_url' => config('wordpress.site_url'),
        'cache_enabled' => config('wordpress.enable_caching'),
        'sync_enabled' => config('wordpress.sync.enabled')
    ]);
});
