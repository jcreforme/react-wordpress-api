<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\WordPressService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register WordPress Service as singleton
        $this->app->singleton(WordPressService::class, function ($app) {
            return new WordPressService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
