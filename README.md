# React + WordPress API + Docker
<img width="958" height="974" alt="image" src="https://github.com/user-attachments/assets/af241390-bf1a-49a5-acf5-27024f8ff323" />

This project is a React application that integrates with the WordPress REST API to display posts, search functionality, and more.

The Laravel as Backend
<img width="1689" height="852" alt="image" src="https://github.com/user-attachments/assets/b02049c3-ff52-45c6-ae6b-71eed10e62bc" />

## Features

- 📝 Display WordPress posts with pagination
- 🔍 Search WordPress posts
- 🖼️ Featured image support
- 👤 Author and date information
- 📱 Responsive design
- ⚡ Fast loading with modern React

## Quick Start

### Option 1: Local Development

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

### Option 2: Docker Development (Recommended)

#### 1. Start with Docker Compose
```bash
# Start development environment (React + WordPress + MySQL)
npm run docker:dev

# Or run in background
npm run docker:dev:bg
```

#### 2. Access Services
- React App: http://localhost:3000 (with hot reload)
- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081

#### 3. Configure WordPress
1. Visit http://localhost:8080 to set up WordPress
2. Update React app to use: `http://localhost:8080/wp-json/wp/v2`

For detailed Docker instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

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

## Project Structure

```
src/
├── components/
│   ├── WordPressPosts.js      # Main posts display component
│   ├── WordPressPosts.css     # Posts styling
│   ├── WordPressSearch.js     # Search functionality
│   └── WordPressSearch.css    # Search styling
├── services/
│   └── wordpressApi.js        # WordPress API service
├── config/
│   └── wordpress.js           # WordPress configuration
├── App.js                     # Main App component
└── App.css                    # Main App styling
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
