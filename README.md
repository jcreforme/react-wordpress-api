# React + WordPress + Laravel Full-Stack Application

<img width="958" height="974" alt="React WordPress Application" src="https://github.com/user-attachments/assets/af241390-bf1a-49a5-acf5-27024f8ff323" />

This project is a comprehensive full-stack application combining React frontend, WordPress content management, and Laravel backend API for enhanced functionality and performance.


**Laravel as Backend**
<img width="1689" height="852" alt="Laravel Backend Architecture" src="https://github.com/user-attachments/assets/b02049c3-ff52-45c6-ae6b-71eed10e62bc" />

## 🏗️ Architecture

### System Components

- **Frontend**: React.js with modern UI components
- **Content Management**: WordPress integration via REST API
- **Backend API**: Laravel for advanced features and caching
- **Database**: MySQL for data persistence
- **Caching**: Redis for improved performance
- **Containerization**: Docker for easy deployment

## ✨ Features

### React Frontend
- 📝 Display WordPress posts with pagination
- 🔍 Advanced search functionality
- 🏷️ Category and tag filtering
- 📊 Blog statistics dashboard
- 📱 Responsive design
- ⚡ Fast loading with modern React

### Laravel Backend
- 🚀 High-performance API layer
- 💾 Redis-based caching
- 🔐 Authentication with Laravel Sanctum
- 🛡️ Rate limiting and security
- 📈 Enhanced analytics and metrics
- 🔄 Real-time content synchronization

### WordPress Integration
- 📰 Content management via WordPress.com API
- 🖼️ Featured image support
- 👤 Author and metadata handling
- 🎨 Rich content rendering

## 🚀 Quick Start

### Option 1: Full-Stack Development (React + Laravel + WordPress)

#### 1. Install All Dependencies
```bash
# Install Node.js dependencies for React
npm install

# Install PHP dependencies for Laravel
cd laravel-backend
composer install
cd ..
```

#### 2. Setup Laravel Backend
```bash
# Setup Laravel environment
npm run laravel:setup

# Run database migrations
npm run laravel:migrate
```

#### 3. Start Development Servers
```bash
# Start both React and Laravel servers concurrently
npm run dev:full

# Or start individually:
# React frontend (port 3000)
npm start

# Laravel backend (port 8000)
npm run laravel:serve
```

#### 4. Access Services
- React Frontend: http://localhost:3000
- Laravel API: http://localhost:8000/api
- API Health Check: http://localhost:8000/api/health

### Option 2: Docker Development (Recommended)

#### 1. Start Full Stack with Docker
```bash
# Start all services (React + Laravel + WordPress + MySQL + Redis)
npm run docker:prod

# Or run in background
npm run docker:prod:bg
```

#### 2. Access Services
- React App: http://localhost:3000
- Laravel API: http://localhost:8001
- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081
- Redis: localhost:6379

### Option 3: Frontend Only (React + WordPress.com API)

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Configure WordPress URL
Update your WordPress site URL in `src/services/wordpressApi.js`:
```javascript
const WP_API_BASE_URL = 'https://your-wordpress-site.com/wp-json/wp/v2';
```

#### 3. Start Development Server
```bash
npm start
```

## WordPress Setup

For detailed WordPress configuration instructions, see [WORDPRESS_SETUP.md](./WORDPRESS_SETUP.md).

### Quick WordPress API Test
Verify your WordPress REST API is working by visiting:
```
https://your-wordpress-site.com/wp-json/wp/v2/posts
```

## Available Scripts

### Development Scripts

#### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm test`
Launches the test runner in the interactive watch mode.

#### `npm run build`
Builds the app for production to the `build` folder.

### Docker Scripts

#### `npm run docker:dev`
Start development environment with Docker (React + WordPress + MySQL)

#### `npm run docker:dev:bg`
Start development environment in background

#### `npm run docker:prod`
Start production environment with Docker

#### `npm run docker:stop`
Stop all Docker services

#### `npm run docker:build`
Build production Docker image

For detailed Docker instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

## 📁 Project Structure

```
react-wordpress/
├── src/                          # React frontend source
│   ├── components/              # React components
│   │   ├── BlogStats.js        # WordPress statistics
│   │   ├── WordPressPosts.js    # Posts display
│   │   ├── WordPressSearch.js   # Search functionality
│   │   └── LaravelDashboard.js  # Laravel backend dashboard
│   ├── services/               # API services
│   │   ├── wordpressApi.js     # WordPress API integration
│   │   └── laravelApi.js       # Laravel API integration
│   └── App.js                  # Main React application
├── laravel-backend/            # Laravel API backend
│   ├── app/                    # Laravel application
│   │   ├── Http/Controllers/   # API controllers
│   │   ├── Services/          # Business logic services
│   │   └── Models/            # Eloquent models
│   ├── config/                # Configuration files
│   ├── routes/               # API routes
│   └── database/             # Migrations and seeders
├── public/                   # React build output
├── docker-compose.yml        # Docker production setup
├── docker-compose.dev.yml    # Docker development setup
├── README.md                # This file
├── LARAVEL_SETUP.md         # Laravel setup guide
├── LARAVEL_WORDPRESS.md     # Technical integration guide
└── package.json             # Node.js dependencies and scripts
```

## 🔧 Development Scripts

### Full-Stack Development
```bash
# Setup everything at once
npm run setup:all

# Start both React and Laravel servers
npm run dev:full

# Start all services with Docker
npm run docker:dev
```

### Frontend Only
```bash
npm start                    # Start React development server
npm run build               # Build for production
npm test                    # Run tests
```

### Laravel Backend
```bash
npm run laravel:install     # Install PHP dependencies
npm run laravel:setup       # Setup Laravel environment
npm run laravel:serve       # Start Laravel server
npm run laravel:migrate     # Run database migrations
npm run laravel:test        # Run Laravel tests
```

### Docker Commands
```bash
npm run docker:prod         # Production Docker setup
npm run docker:dev          # Development Docker setup
npm run docker:stop         # Stop all containers
```

## Customization

### Styling
- Modify CSS files in `src/components/` for component-specific styles
- Update `src/App.css` for global application styles
- All styles are responsive and mobile-friendly

### API Configuration
- Update `src/config/wordpress.js` for WordPress settings
- Modify `src/services/wordpressApi.js` to add new API methods

## Troubleshooting

### CORS Issues
If you encounter CORS errors, you may need to configure your WordPress server to allow cross-origin requests. See [WORDPRESS_SETUP.md](./WORDPRESS_SETUP.md) for solutions.

### API Connection
Test your WordPress REST API directly:
```
https://your-wordpress-site.com/wp-json/wp/v2/posts
```

##📁 Complete Laravel Backend Structure
- laravel-backend directory with full Laravel application
- RESTful API endpoints for WordPress integration
-Advanced caching with Redis support
-Rate limiting and security middleware
-CORS configuration for React frontend

##🚀 Laravel Features
-WordPressService: Advanced API integration with caching
-WordPressController: RESTful endpoints for all WordPress operations
-Middleware: CORS, rate limiting, and authentication
-Configuration: Environment-based WordPress and cache settings
-Docker Support: Full containerization with Nginx

##⚛️ React Integration
-LaravelApiService: Complete API client for Laravel backend
-LaravelDashboard: Beautiful dashboard component for monitoring
-Tabbed Interface: Switch between WordPress content and Laravel backend
-Real-time Status: API health monitoring and performance metrics

##🐳 Docker Enhancement
-Updated docker-compose.yml with Laravel, Redis, and Nginx
-Production-ready containerization
-Multi-service orchestration

##📚 Comprehensive Documentation
-LARAVEL_SETUP.md: Complete setup guide
-Updated README.md: Full-stack documentation
-LARAVEL_WORDPRESS.md: Technical integration guide

##🌟 Key Features:
-High Performance: Redis caching for WordPress API responses
-Security: Rate limiting, CORS protection, input validation
-Monitoring: Real-time API status and performance metrics
-Scalability: Microservices architecture ready
-Developer Experience: Rich tooling and automated workflows

##🚀 Quick Start Commands:

##🌍 Access Points:
-React Frontend: http://localhost:3000
-Laravel API: http://localhost:8000 (local) or http://localhost:8001 (Docker)
-WordPress: http://localhost:8080 (Docker)
-API Health: http://localhost:8000/api/health

##📊 Available API Endpoints:
-GET /api/wordpress/posts - Enhanced WordPress posts
-GET /api/wordpress/search - Advanced search with caching
-GET /api/wordpress/stats - Blog statistics
-GET /api/health - API health check
-DELETE /api/wordpress/cache - Cache management

##Your project now has a powerful three-tier architecture:
-React Frontend - Modern UI with tabbed interface
-Laravel Backend - High-performance API layer with caching
-WordPress Content - Content management via REST API
-The Laravel backend adds significant value with caching, rate limiting, enhanced error handling, and provides a foundation for advanced features like authentication, analytics, and real-time synchronization.


## Technologies Used

- React 19.1.0
- Axios for HTTP requests
- WordPress REST API
- Modern CSS with Flexbox/Grid
- Responsive design principles

## Learn More

- [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
