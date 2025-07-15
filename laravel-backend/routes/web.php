<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel WordPress API Backend',
        'version' => config('app.version', '1.0.0'),
        'endpoints' => [
            'api' => url('/api'),
            'health' => url('/api/health'),
            'wordpress' => url('/api/wordpress'),
            'docs' => url('/api/docs')
        ]
    ]);
});

Route::get('/docs', function () {
    return view('api-docs');
});
