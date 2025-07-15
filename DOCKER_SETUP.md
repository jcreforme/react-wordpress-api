# Docker Setup Guide

This guide explains how to run the React WordPress API application using Docker.

## 📦 Docker Files Overview

- `Dockerfile` - Production build with Nginx
- `Dockerfile.dev` - Development build with hot reload
- `docker-compose.yml` - Production environment with optional WordPress
- `docker-compose.dev.yml` - Development environment
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Files to exclude from Docker context

## 🚀 Quick Start

### Option 1: Development Environment (Recommended for development)

```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Or run in background
docker-compose -f docker-compose.dev.yml up -d --build
```

**Services Available:**
- React App: http://localhost:3000 (with hot reload)
- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081

### Option 2: Production Environment

```bash
# Start production environment
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

**Services Available:**
- React App: http://localhost:3000 (production build)
- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081

### Option 3: React App Only

If you already have a WordPress site running elsewhere:

```bash
# Build the React app image
docker build -t react-wordpress-api .

# Run the container
docker run -p 3000:80 react-wordpress-api
```

## 🛠️ Development Workflow

### Start Development Environment
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Start only React development server
docker-compose -f docker-compose.dev.yml up react-dev

# Start with rebuild
docker-compose -f docker-compose.dev.yml up --build
```

### View Logs
```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs

# View specific service logs
docker-compose -f docker-compose.dev.yml logs react-dev
docker-compose -f docker-compose.dev.yml logs wordpress-dev
```

### Stop Services
```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (WARNING: This will delete your WordPress data)
docker-compose -f docker-compose.dev.yml down -v
```

## 🔧 Configuration

### WordPress Configuration

1. **Initial WordPress Setup:**
   - Visit http://localhost:8080
   - Complete the WordPress installation
   - Create sample posts for testing

2. **Connect React App to WordPress:**
   - Update `src/services/wordpressApi.js`
   - Change the API URL to: `http://localhost:8080/wp-json/wp/v2`

3. **Enable CORS in WordPress:**
   - Install a CORS plugin or add headers to functions.php
   - See WORDPRESS_SETUP.md for detailed instructions

### Environment Variables

Create a `.env` file in the project root to customize settings:

```env
# React App
REACT_APP_WP_API_URL=http://localhost:8080/wp-json/wp/v2

# WordPress Database
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress_password
WORDPRESS_DB_NAME=wordpress

# MySQL
MYSQL_ROOT_PASSWORD=root_password
```

### Custom Ports

To use different ports, modify the docker-compose files:

```yaml
services:
  react-dev:
    ports:
      - "3001:3000"  # Change external port to 3001
  
  wordpress-dev:
    ports:
      - "8081:80"    # Change external port to 8081
```

## 📊 Service Details

### React Development Service (react-dev)
- **Image:** Node.js 18 Alpine
- **Port:** 3000
- **Features:** Hot reload, volume mounting
- **Command:** `npm start`

### React Production Service (react-wordpress)
- **Image:** Nginx Alpine
- **Port:** 80 (mapped to 3000)
- **Features:** Optimized build, gzip compression
- **Build:** Multi-stage Docker build

### WordPress Service
- **Image:** Official WordPress
- **Port:** 80 (mapped to 8080)
- **Database:** MySQL 8.0
- **Volumes:** Persistent WordPress files

### MySQL Service
- **Image:** MySQL 8.0
- **Port:** 3306
- **Volumes:** Persistent database data
- **Environment:** Pre-configured WordPress database

### phpMyAdmin Service
- **Image:** Official phpMyAdmin
- **Port:** 80 (mapped to 8081)
- **Purpose:** Database management interface

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Permission Issues (Linux/Mac)**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Container Won't Start**
   ```bash
   # Check container logs
   docker-compose logs [service-name]
   
   # Rebuild containers
   docker-compose build --no-cache
   ```

4. **WordPress Database Connection Error**
   ```bash
   # Wait for MySQL to be ready (it takes ~30 seconds on first run)
   # Check MySQL logs
   docker-compose logs mysql-dev
   ```

5. **React App Can't Connect to WordPress**
   - Ensure WordPress is running on http://localhost:8080
   - Check CORS configuration in WordPress
   - Verify API URL in React app configuration

### Docker Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything (containers, networks, images)
docker system prune -a

# View logs for specific container
docker logs [container-name]

# Execute commands in running container
docker exec -it [container-name] /bin/sh
```

## 🚀 Production Deployment

### Build Production Image
```bash
# Build optimized production image
docker build -t react-wordpress-api:latest .

# Tag for registry
docker tag react-wordpress-api:latest your-registry/react-wordpress-api:latest

# Push to registry
docker push your-registry/react-wordpress-api:latest
```

### Environment-Specific Configurations

Create different docker-compose files for different environments:

- `docker-compose.prod.yml` - Production
- `docker-compose.staging.yml` - Staging
- `docker-compose.dev.yml` - Development

### Docker Swarm / Kubernetes

The application is ready for orchestration platforms:
- Docker Swarm
- Kubernetes
- AWS ECS
- Google Cloud Run

## 📝 Best Practices

1. **Use .dockerignore** to exclude unnecessary files
2. **Multi-stage builds** for smaller production images
3. **Health checks** for service monitoring
4. **Environment variables** for configuration
5. **Persistent volumes** for data storage
6. **Resource limits** for production deployments

## 🔐 Security Considerations

- Change default passwords in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Regularly update base images
- Scan images for vulnerabilities

## 📈 Monitoring

Add monitoring services to your docker-compose:

```yaml
# Example monitoring service
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  
grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
```

## Need Help?

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [WordPress Docker Image](https://hub.docker.com/_/wordpress)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
