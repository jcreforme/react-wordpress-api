# React WordPress API

This project is a React application that integrates with the WordPress REST API to display posts, search functionality, and more.

## Features

- 📝 Display WordPress posts with pagination
- 🔍 Search WordPress posts
- 🖼️ Featured image support
- 👤 Author and date information
- 📱 Responsive design
- ⚡ Fast loading with modern React

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure WordPress URL
Update your WordPress site URL in `src/services/wordpressApi.js`:
```javascript
const WP_API_BASE_URL = 'https://your-wordpress-site.com/wp-json/wp/v2';
```

### 3. Start Development Server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## WordPress Setup

For detailed WordPress configuration instructions, see [WORDPRESS_SETUP.md](./WORDPRESS_SETUP.md).

### Quick WordPress API Test
Verify your WordPress REST API is working by visiting:
```
https://your-wordpress-site.com/wp-json/wp/v2/posts
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

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
