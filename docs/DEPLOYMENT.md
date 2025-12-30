# ProFix Masters Center Deployment Guide

## Deployment Options

### Option 1: Docker Compose (Recommended for Development/Testing)

1. **Prerequisites:**
   - Docker and Docker Compose installed
   - Create a `.env` file in the root directory

2. **Environment Variables:**
   Create a `.env` file:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

3. **Build and Run:**
   ```bash
   docker-compose up -d
   ```

4. **Access:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

5. **Stop:**
   ```bash
   docker-compose down
   ```

---

### Option 2: Vercel (Frontend) + Heroku (Backend)

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

4. **Environment Variables:**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com/api
   ```

#### Backend Deployment (Heroku)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Add MongoDB:**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set Environment Variables:**
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set NODE_ENV=production
   heroku config:set EMAIL_HOST=smtp.gmail.com
   heroku config:set EMAIL_PORT=587
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-password
   heroku config:set DEFAULT_COMMISSION_RATE=0.15
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

---

### Option 3: AWS Deployment

#### Backend (AWS Elastic Beanstalk)

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize:**
   ```bash
   cd backend
   eb init
   ```

3. **Create Environment:**
   ```bash
   eb create profix-backend-env
   ```

4. **Set Environment Variables:**
   ```bash
   eb setenv JWT_SECRET=your-secret MONGODB_URI=your-mongodb-uri ...
   ```

5. **Deploy:**
   ```bash
   eb deploy
   ```

#### Frontend (AWS Amplify)

1. **Connect Repository:**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Select the `frontend` directory as root

2. **Build Settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables:**
   Add in Amplify console:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

---

### Option 4: Google Cloud Platform

#### Backend (Cloud Run)

1. **Build Container:**
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/PROJECT_ID/profix-backend
   ```

2. **Deploy:**
   ```bash
   gcloud run deploy profix-backend \
     --image gcr.io/PROJECT_ID/profix-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Set Environment Variables:**
   ```bash
   gcloud run services update profix-backend \
     --set-env-vars JWT_SECRET=your-secret,MONGODB_URI=your-uri
   ```

#### Frontend (Firebase Hosting)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Initialize:**
   ```bash
   cd frontend
   firebase init hosting
   ```

4. **Build:**
   ```bash
   npm run build
   ```

5. **Deploy:**
   ```bash
   firebase deploy
   ```

---

### Option 5: DigitalOcean

#### Using App Platform

1. **Create New App:**
   - Go to DigitalOcean App Platform
   - Connect GitHub repository

2. **Configure Services:**
   
   **Backend:**
   - Source: `backend` directory
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Port: 5000

   **Frontend:**
   - Source: `frontend` directory
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Port: 3000

3. **Add Database:**
   - Create MongoDB cluster
   - Add connection string to backend environment variables

4. **Set Environment Variables:**
   - Configure in App Platform dashboard

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster

2. **Configure Network Access:**
   - Add IP address: `0.0.0.0/0` (for testing)
   - Or add specific IPs for production

3. **Create Database User:**
   - Username: `profixadmin`
   - Password: (generate strong password)

4. **Get Connection String:**
   ```
   mongodb+srv://profixadmin:<password>@cluster0.xxxxx.mongodb.net/profix-masters?retryWrites=true&w=majority
   ```

5. **Update Environment Variables:**
   ```env
   MONGODB_URI=mongodb+srv://profixadmin:<password>@cluster0.xxxxx.mongodb.net/profix-masters
   ```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (for self-hosted)

1. **Install Certbot:**
   ```bash
   sudo apt-get install certbot
   ```

2. **Obtain Certificate:**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Update Nginx Configuration:**
   ```nginx
   server {
       listen 443 ssl;
       server_name yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:3000;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

---

## Monitoring and Logging

### Application Monitoring

**Recommended Tools:**
- **Sentry:** Error tracking and performance monitoring
- **LogRocket:** Session replay and logging
- **Datadog:** Infrastructure monitoring

### Setup Sentry (Example)

1. **Install:**
   ```bash
   npm install @sentry/node @sentry/nextjs
   ```

2. **Backend (server.ts):**
   ```typescript
   import * as Sentry from '@sentry/node';
   
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   ```

3. **Frontend (next.config.js):**
   ```javascript
   const { withSentryConfig } = require('@sentry/nextjs');
   
   module.exports = withSentryConfig(nextConfig, {
     silent: true,
     org: "your-org",
     project: "your-project"
   });
   ```

---

## Backup Strategy

### Database Backups

**Automated Backups:**
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
```

**Cron Job:**
```bash
0 2 * * * /path/to/backup-script.sh
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ELB, DigitalOcean Load Balancer)
- Deploy multiple instances of backend
- Use Redis for session management

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for high read workloads
- Sharding for large datasets

### CDN for Static Assets
- Cloudflare
- AWS CloudFront
- DigitalOcean Spaces

---

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Secure MongoDB with authentication
- [ ] Set strong JWT secret
- [ ] Enable rate limiting
- [ ] Implement CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Implement request validation
- [ ] Add CSRF protection
- [ ] Use helmet.js for Express

---

## Performance Optimization

### Backend
- [ ] Enable compression
- [ ] Implement caching (Redis)
- [ ] Database indexing
- [ ] Query optimization
- [ ] Use connection pooling

### Frontend
- [ ] Image optimization (Next.js Image)
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Service Worker/PWA
- [ ] CDN for static assets

---

## Post-Deployment

1. **Test All Endpoints:**
   - Run integration tests
   - Test payment flows
   - Verify email notifications

2. **Monitor Logs:**
   - Check for errors
   - Monitor response times
   - Track database queries

3. **Setup Alerts:**
   - Server down alerts
   - Error rate alerts
   - Performance degradation alerts

4. **Documentation:**
   - Update API documentation
   - Create user guides
   - Document deployment process

---

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection
- Verify environment variables
- Check port availability

**Frontend can't connect to API:**
- Verify API URL
- Check CORS settings
- Ensure backend is running

**Database connection failed:**
- Check MongoDB URI
- Verify network access
- Confirm credentials

---

## Support

For deployment issues:
- Check logs: `docker logs profix-backend`
- Review error messages
- Contact: support@profixmasters.com
