# Smart Hospital - Docker Deployment Guide

## Overview

This guide provides instructions for deploying the Smart Hospital application using Docker and Docker Compose. The setup includes a complete stack with MySQL database and Node.js application server.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 1.29 or higher)
- Git
- At least 2GB of available disk space

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart_hospital
```

### 2. Configure Environment Variables

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file and update the following critical values:

```env
# Database
DB_ROOT_PASSWORD=your_secure_root_password
DB_PASSWORD=your_secure_db_password

# JWT
JWT_SECRET=your_secure_jwt_secret

# OAuth (if using Manus OAuth)
VITE_APP_ID=your_app_id
OWNER_OPEN_ID=your_owner_id
```

### 3. Build and Start the Application

```bash
# Build Docker images
docker-compose build

# Start all services
docker-compose up -d
```

### 4. Initialize the Database

The database migrations will run automatically on first startup. To verify:

```bash
# Check database logs
docker-compose logs mysql

# Check application logs
docker-compose logs app
```

### 5. Access the Application

Once all services are running, access the application at:

```
http://localhost:3000
```

## Service Details

### MySQL Database

- **Container Name**: `smart_hospital_db`
- **Port**: 3306 (default)
- **Volume**: `mysql_data` (persistent storage)
- **Health Check**: Enabled

### Application Server

- **Container Name**: `smart_hospital_app`
- **Port**: 3000 (default)
- **Environment**: Production
- **Health Check**: Enabled

## Common Commands

### View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f mysql
```

### Stop Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop app
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Remove Containers and Volumes

```bash
# Remove containers (keeps volumes)
docker-compose down

# Remove containers and volumes (WARNING: deletes database)
docker-compose down -v
```

### Database Access

Connect to MySQL directly:

```bash
docker-compose exec mysql mysql -u hospital_user -p smart_hospital
```

When prompted, enter the password from your `.env` file.

## Troubleshooting

### Application Won't Start

1. Check logs: `docker-compose logs app`
2. Verify database is running: `docker-compose logs mysql`
3. Ensure ports are not in use: `lsof -i :3000` and `lsof -i :3306`

### Database Connection Error

1. Verify MySQL is healthy: `docker-compose ps`
2. Check database credentials in `.env`
3. Wait for MySQL to fully initialize (can take 30 seconds)

### Port Already in Use

Change the port in `.env`:

```env
APP_PORT=3001
DB_PORT=3307
```

Then restart: `docker-compose restart`

## Production Deployment

For production deployment:

1. **Security**:
   - Use strong, randomly generated passwords
   - Enable SSL/TLS for database connections
   - Use environment-specific secrets management

2. **Scaling**:
   - Use Docker Swarm or Kubernetes for orchestration
   - Set up load balancing
   - Configure auto-scaling policies

3. **Monitoring**:
   - Set up container monitoring (Prometheus, Grafana)
   - Configure log aggregation (ELK Stack, Splunk)
   - Set up alerting for critical metrics

4. **Backup**:
   - Implement automated MySQL backups
   - Store backups in secure, off-site location
   - Test backup restoration regularly

## Performance Optimization

### Database Optimization

```bash
# Create indexes for frequently queried fields
docker-compose exec mysql mysql -u hospital_user -p smart_hospital

CREATE INDEX idx_patient_id ON analysisResults(patientId);
CREATE INDEX idx_doctor_id ON analysisResults(doctorId);
CREATE INDEX idx_analysis_type ON analysisResults(analysisType);
```

### Resource Limits

Edit `docker-compose.yml` to add resource limits:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Backup and Recovery

### Backup Database

```bash
# Create backup
docker-compose exec mysql mysqldump -u hospital_user -p smart_hospital > backup.sql
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T mysql mysql -u hospital_user -p smart_hospital < backup.sql
```

## Support and Documentation

For more information:

- Docker Documentation: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- MySQL Documentation: https://dev.mysql.com/doc/

## License

This project is licensed under the MIT License.

