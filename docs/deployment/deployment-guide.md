# Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the NextJS starter template with Better Auth v1.4+ and Drizzle ORM v0.45+ to various hosting platforms, including production, staging, and development environments.

## Deployment Architecture

### Environments

```
┌─────────────────────────────────────────────────────────────┐
│                    Deployment Environments                 │
├─────────────────────────────────────────────────────────────┤
│ Development                                                │
│ ├── Local development                                      │
│ ├── Feature branches                                       │
│ └── Pull request previews                                 │
├─────────────────────────────────────────────────────────────┤
│ Staging                                                    │
│ ├── Integration testing                                    │
│ ├── UAT (User Acceptance Testing)                         │
│ └── Performance testing                                   │
├─────────────────────────────────────────────────────────────┤
│ Production                                                 │
│ ├── Live application                                       │
│ ├── High availability                                      │
│ └── Scalable infrastructure                                │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Platforms

- **Recommended**: Vercel (native Next.js support)
- **Alternative**: Netlify, AWS, DigitalOcean, Railway
- **Self-hosted**: Docker containers on cloud providers

## Environment Configuration

### Production Environment Variables

#### Required Production Variables

```bash
# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret-key"

# Database (Use managed database service)
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
DB_SSL=true
DB_HOST="your-db-host.rds.amazonaws.com"
DB_PORT=5432
DB_NAME="production_db"
DB_USER="db_user"
DB_PASSWORD="secure_password"

# Authentication
BETTER_AUTH_SECRET="your-production-better-auth-secret"
BETTER_AUTH_URL="https://yourdomain.com"

# External Services
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
RESEND_API_KEY="your-production-resend-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

#### Staging Environment Variables

```bash
# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://staging.yourdomain.com"
NEXTAUTH_URL="https://staging.yourdomain.com"

# Database (Staging database)
DATABASE_URL="postgresql://user:pass@staging-db-host:5432/staging_db"

# Authentication (Staging secrets)
BETTER_AUTH_SECRET="staging-secret-key"
NEXTAUTH_SECRET="staging-nextauth-secret"

# Email (Staging email service)
RESEND_API_KEY="staging-resend-key"
RESEND_FROM_EMAIL="staging@yourdomain.com"
```

## Vercel Deployment (Recommended)

### 1. Project Setup

#### Install Vercel CLI

```bash
npm i -g vercel
```

#### Initialize Vercel Project

```bash
# Link project to Vercel
vercel link

# Deploy for first time
vercel --prod
```

#### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 2. Environment Variables Setup

#### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required variables

#### Via Vercel CLI

```bash
# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add BETTER_AUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add RESEND_API_KEY

# Choose environment scope (production, preview, development)
```

### 3. Database Setup for Vercel

#### Vercel Postgres (Recommended)

```bash
# Install Vercel Postgres CLI
npm i @vercel/postgres

# Create database
vercel postgres create

# Link to project
vercel postgres link

# Run migrations
vercel env pull .env.local
npm run db:migrate
```

#### External PostgreSQL Setup

```bash
# Set up connection pooling
# Example with Supabase or PlanetScale
DATABASE_URL="postgresql://user:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres"
```

### 4. Custom Domain Setup

#### Via Vercel Dashboard

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate issuance

#### Automatic DNS Configuration

```bash
# Vercel automatically handles DNS and SSL
# Just add your domain and update nameservers:
# ns1.vercel-dns.com
# ns2.vercel-dns-d1.com
```

### 5. Deployment Process

#### Automatic Deployment

```bash
# Connect GitHub repository
# Vercel will automatically deploy on push to main branch

# Enable preview deployments for pull requests
# Settings → Git → Preview Deployments
```

#### Manual Deployment

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Deploy specific commit
vercel --prod --sha <commit-hash>
```

## Docker Deployment

### 1. Dockerfile Configuration

#### Multi-stage Dockerfile

```dockerfile
# Base image
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose Configuration

#### Development Docker Compose

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/nextjs_starter
      - NEXTAUTH_SECRET=your-secret
      - BETTER_AUTH_SECRET=your-better-auth-secret
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=nextjs_starter
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Production Docker Compose

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - RESEND_API_KEY=${RESEND_API_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Nginx Configuration

#### `nginx.conf`

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
        ssl_certificate_key /etc/ssl/certs/yourdomain.com.key;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }
    }
}
```

## Cloud Platform Deployment

### AWS Deployment

#### 1. AWS ECS (Elastic Container Service)

```yaml
# task-definition.json
{
  "family": "nextjs-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions":
    [
      {
        "name": "nextjs-app",
        "image": "your-account.dkr.ecr.region.amazonaws.com/nextjs-app:latest",
        "portMappings": [{ "containerPort": 3000, "protocol": "tcp" }],
        "environment": [{ "name": "NODE_ENV", "value": "production" }],
        "secrets":
          [{ "name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:region:account:secret:database-url" }],
        "logConfiguration":
          {
            "logDriver": "awslogs",
            "options":
              { "awslogs-group": "/ecs/nextjs-app", "awslogs-region": "us-east-1", "awslogs-stream-prefix": "ecs" },
          },
      },
    ],
}
```

#### 2. AWS RDS for Database

```bash
# Create RDS instance via AWS CLI
aws rds create-db-instance \
  --db-instance-identifier nextjs-starter-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your-secure-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --storage-encrypted
```

### DigitalOcean App Platform

#### `app.yaml`

```yaml
name: nextjs-starter
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/nextjs-starter-better-drizzle
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
      - key: NEXTAUTH_SECRET
        value: ${NEXTAUTH_SECRET}
      - key: BETTER_AUTH_SECRET
        value: ${BETTER_AUTH_SECRET}

databases:
  - name: db
    engine: PG
    version: "15"
```

### Railway Deployment

#### Railway Configuration

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add database
railway add postgresql

# Set environment variables
railway variables set NODE_ENV=production
railway variables set NEXTAUTH_SECRET=your-secret

# Deploy
railway up
```

## CI/CD Pipeline

### GitHub Actions Workflow

#### `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          NEXTAUTH_SECRET: test-secret
          BETTER_AUTH_SECRET: test-better-auth-secret

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: https://yourdomain.com
          NEXTAUTH_URL: https://yourdomain.com

      - name: Build Docker image
        run: docker build -t nextjs-starter .

      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: |
          # Deploy to your platform of choice
          # Example: Vercel, AWS, DigitalOcean
          echo "Deploying to production..."
```

### Vercel CI/CD

#### Automatic Deployments

```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "dev": false
    }
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://yourdomain.com"
    }
  }
}
```

## Monitoring and Logging

### Application Monitoring

#### Vercel Analytics

```typescript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

#### Custom Error Tracking

```typescript
// src/lib/error-tracking.ts
export function trackError(error: Error, context?: Record<string, any>) {
  // Send to error tracking service
  console.error("Application Error:", error, context);

  // Send to external service (Sentry, LogRocket, etc.)
  if (typeof window !== "undefined") {
    // Client-side error tracking
  }
}
```

### Health Checks

#### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    // Check database connection
    await db.select().from("users").limit(1);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
```

### Logging Configuration

#### Production Logging

```typescript
// src/lib/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
```

## Performance Optimization

### Build Optimization

#### Next.js Configuration for Production

```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: ["yourdomain.com"],
    formats: ["image/webp", "image/avif"],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
```

### Database Optimization

#### Connection Pooling

```typescript
// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: process.env.DB_SSL === "true" ? "require" : false,
});

export const db = drizzle(client);
```

## Security Considerations

### Production Security Checklist

#### Environment Security

- [ ] Use strong, unique secrets
- [ ] Enable SSL/TLS for all connections
- [ ] Use managed database services
- [ ] Regularly rotate secrets
- [ ] Enable audit logging

#### Application Security

- [ ] Content Security Policy (CSP)
- [ ] XSS protection headers
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input validation

#### Infrastructure Security

- [ ] Firewall configuration
- [ ] VPN access for admin
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Disaster recovery plan

### Backup Strategy

#### Database Backups

```bash
# Automated daily backups
0 2 * * * pg_dump -h localhost -U postgres -d nextjs_starter | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Weekly backup verification
0 3 * * 0 /scripts/verify-backups.sh
```

#### File Backups

```bash
# Backup user uploads
rsync -av /app/uploads/ /backups/uploads/$(date +\%Y\%m\%d)/
```

## Troubleshooting

### Common Production Issues

#### 1. Database Connection Errors

```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool status
SELECT * FROM pg_stat_activity WHERE datname = 'your_db_name';
```

#### 2. Memory Issues

```bash
# Monitor memory usage
docker stats

# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

#### 3. Build Failures

```bash
# Clear build cache
rm -rf .next
npm run build

# Check disk space
df -h
```

#### 4. SSL Certificate Issues

```bash
# Check SSL certificate
openssl s_client -connect yourdomain.com:443

# Renew SSL certificate (if using certbot)
certbot renew
```

### Performance Monitoring

#### Application Metrics

```typescript
// Middleware for performance monitoring
export function middleware(request: NextRequest) {
  const start = Date.now();

  const response = NextResponse.next();

  const duration = Date.now() - start;
  console.log(`${request.method} ${request.url} - ${duration}ms`);

  return response;
}
```

#### Database Performance

```sql
-- Slow query logging
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

**Document Version**: 1.1
**Last Updated**: December 8, 2024
**Next Review**: January 31, 2025
