<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class WordPressApiRateLimit
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = 'wordpress-api:' . $request->ip();
        $maxAttempts = config('wordpress.security.rate_limit_per_minute', 60);

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $retryAfter = RateLimiter::availableIn($key);
            
            return response()->json([
                'error' => 'Too many requests',
                'message' => 'Rate limit exceeded. Try again in ' . $retryAfter . ' seconds.',
                'retry_after' => $retryAfter
            ], 429);
        }

        RateLimiter::hit($key, 60); // 1 minute window

        $response = $next($request);

        // Add rate limit headers
        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => $maxAttempts - RateLimiter::attempts($key),
            'X-RateLimit-Reset' => now()->addMinute()->timestamp,
        ]);

        return $response;
    }
}
