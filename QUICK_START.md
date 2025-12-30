# Quick Start Guide - ProFix Masters Center

Get the ProFix Masters Center up and running in minutes!

## 🚀 Option 1: Quick Start with Docker (Recommended)

The fastest way to run the entire application with one command.

### Prerequisites
- Docker and Docker Compose installed on your system
- Git (to clone the repository)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tejindersingh8877-blip/ProFix-Masters-Center.git
   cd ProFix-Masters-Center
   ```

2. **Create environment file (optional for Docker):**
   
   Create a `.env` file in the root directory with the following (optional - Docker will work without this):
   ```env
   JWT_SECRET=my-super-secret-jwt-key-for-production
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

   This single command will:
   - Start MongoDB database
   - Build and start the backend API
   - Build and start the frontend application

4. **Access the application:**
   - **Frontend:** Open http://localhost:3000 in your browser
   - **Backend API:** http://localhost:5000
   - **MongoDB:** localhost:27017

5. **View logs (optional):**
   ```bash
   # View all logs
   docker-compose logs -f
   
   # View backend logs only
   docker-compose logs -f backend
   
   # View frontend logs only
   docker-compose logs -f frontend
   ```

6. **Stop the application:**
   ```bash
   docker-compose down
   ```

7. **Stop and remove all data:**
   ```bash
   docker-compose down -v
   ```

---

## 💻 Option 2: Manual Setup (Development)

Run backend and frontend separately for development.

### Prerequisites
- Node.js v18 or higher
- MongoDB installed and running locally (or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/profix-masters
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   DEFAULT_COMMISSION_RATE=0.15
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start backend development server:**
   ```bash
   npm run dev
   ```

   The API will be available at http://localhost:5000

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Edit `.env.local` file:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start frontend development server:**
   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:3000

---

## 🗄️ MongoDB Setup Options

### Option A: Local MongoDB (Docker - Easiest)

If you don't have MongoDB installed, use Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Option B: Local MongoDB Installation

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Download and install from https://www.mongodb.com/try/download/community

### Option C: MongoDB Atlas (Cloud)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/profix-masters
   ```

---

## ✅ Verify Installation

### Check Backend

Visit http://localhost:5000 in your browser. You should see:
```json
{
  "message": "Welcome to ProFix Masters Center API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "services": "/api/services",
    "bookings": "/api/bookings",
    "reviews": "/api/reviews",
    "admin": "/api/admin"
  }
}
```

### Check Frontend

Visit http://localhost:3000 in your browser. You should see the ProFix Masters homepage.

---

## 🎯 First Steps After Installation

### 1. Create an Admin Account

Use an API client (Postman, curl, or Thunder Client) to create an admin user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@profixmasters.com",
    "phone": "+1234567890",
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

### 2. Create a Customer Account

Register through the UI:
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form and select "Customer"
4. Submit

### 3. Create a Service Provider Account

Register through the UI:
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form and select "Service Provider"
4. Submit
5. Wait for admin approval (you can approve yourself via admin panel)

---

## 🔧 Troubleshooting

### Port Already in Use

**Error:** `Port 3000/5000 is already in use`

**Solution:**
```bash
# Find process using the port
lsof -i :3000  # or :5000

# Kill the process
kill -9 <PID>
```

Or change the port in your `.env` files.

### Cannot Connect to MongoDB

**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
1. Make sure MongoDB is running
2. Check your `MONGODB_URI` in `.env`
3. For local MongoDB, use: `mongodb://localhost:27017/profix-masters`
4. For Docker MongoDB, make sure the container is running: `docker ps`

### Frontend Cannot Connect to Backend

**Error:** Network errors or CORS issues

**Solutions:**
1. Make sure backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
3. Verify backend URL: `http://localhost:5000/api`

### Docker Issues

**Error:** Docker build failures

**Solutions:**
1. Make sure Docker is running: `docker info`
2. Rebuild containers: `docker-compose build --no-cache`
3. Remove old containers: `docker-compose down -v`
4. Start fresh: `docker-compose up -d --build`

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Backend server port |
| NODE_ENV | No | development | Environment (development/production) |
| MONGODB_URI | Yes | - | MongoDB connection string |
| JWT_SECRET | Yes | - | Secret key for JWT tokens |
| JWT_EXPIRE | No | 7d | JWT token expiration |
| EMAIL_HOST | No | - | SMTP server host |
| EMAIL_PORT | No | 587 | SMTP server port |
| EMAIL_USER | No | - | Email username |
| EMAIL_PASSWORD | No | - | Email password |
| DEFAULT_COMMISSION_RATE | No | 0.15 | Default commission rate (15%) |
| FRONTEND_URL | No | http://localhost:3000 | Frontend URL for CORS |

### Frontend (.env.local)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | Yes | - | Backend API URL |

---

## 🎓 Next Steps

1. **Explore the API:** Check out [API.md](./API.md) for complete API documentation
2. **Deploy:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides
3. **Contribute:** Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
4. **Learn More:** Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for project overview

---

## 💡 Tips

- Use Docker for the quickest setup
- Use manual setup for development and debugging
- Keep your `.env` files secure and never commit them
- For email functionality, use Gmail with an [App Password](https://support.google.com/accounts/answer/185833)
- The platform comes with sample data - start by creating an admin user

---

## 🆘 Need Help?

- **Documentation:** Check the `/docs` folder
- **Issues:** Create an issue on GitHub
- **Email:** support@profixmasters.com

---

## 📊 System Requirements

**Minimum:**
- 2GB RAM
- 2 CPU cores
- 5GB disk space

**Recommended:**
- 4GB RAM
- 4 CPU cores
- 10GB disk space

---

Happy coding! 🚀
