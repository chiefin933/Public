# BookItNow Backend Deployment Guide

## Environment Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- AWS CLI (for production deployments)
- GitHub account with repository access

### Environment Variables
Required environment variables for different environments:

```env
# Development (.env)
DATABASE_URL=postgresql://bookit:bookitpass@localhost:5432/bookitnow_dev
JWT_SECRET=your-secret-here
PORT=4000

# Production (.env.production)
DATABASE_URL=postgresql://user:pass@your-production-db/bookitnow
JWT_SECRET=your-production-secret
PORT=4000
```

## Local Development

1. Start the development environment:
```bash
# Start with Docker (recommended)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Or run locally
npm install
npm run dev
```

2. Run tests:
```bash
npm test
npm run test:coverage
```

## Deployment

### Staging Environment

1. Push to develop branch:
```bash
git checkout develop
git push origin develop
```

The staging workflow will:
- Build and test the application
- Deploy to staging ECS cluster
- Run migrations automatically
- Available at: https://api-staging.bookitnow.com

### Production Environment

1. Create a release:
```bash
git checkout main
git merge develop
git push origin main
```

The production workflow will:
- Build and test the application
- Deploy to production ECS cluster
- Run migrations with safety checks
- Available at: https://api.bookitnow.com

### Manual Deployment

If needed, you can deploy manually:

```bash
# Build production image
docker build -f Dockerfile.prod -t bookitnow-backend:prod .

# Run production stack
docker compose -f docker-compose.prod.yml up -d
```

### Infrastructure Setup

#### AWS ECS (Production)

1. Create ECS cluster:
```bash
aws ecs create-cluster --cluster-name bookitnow-prod
```

2. Set up load balancer and target groups
3. Create ECS service using task definition

#### Database (Production)

1. Create RDS instance:
```bash
aws rds create-db-instance \
  --db-instance-identifier bookitnow-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password>
```

2. Set up backup and maintenance windows

### Monitoring

- Health check endpoint: `/api/health`
- Metrics available in CloudWatch
- Logs forwarded to CloudWatch Logs

### Rollback Procedure

To rollback a deployment:

1. Find the previous stable version:
```bash
aws ecs describe-services --cluster bookitnow-prod --services bookitnow-backend-prod
```

2. Update the service to use the previous task definition:
```bash
aws ecs update-service --cluster bookitnow-prod --service bookitnow-backend-prod --task-definition <previous-task-def>
```

### Database Migrations

Production migrations are handled automatically but can be run manually:

```bash
# Generate new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Security Notes

- Never commit .env files
- Use AWS Secrets Manager for production secrets
- Enable AWS WAF for API endpoints
- Use encrypted connection strings
- Rotate JWT secrets regularly

## Troubleshooting

Common issues and solutions:

1. Migration failures:
```bash
# Check migration status
npx prisma migrate status

# Reset migrations (dev only)
npx prisma migrate reset
```

2. Container health issues:
```bash
# Check container logs
docker compose logs -f backend

# Check ECS service events
aws ecs describe-services --cluster bookitnow-prod --services bookitnow-backend-prod
```

3. Database connection issues:
```bash
# Test database connection
npx prisma db pull
```