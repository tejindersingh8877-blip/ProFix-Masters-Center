# ProFix Masters Center

A modern service marketplace website for AC repair, AC cleaning, house cleaning, and home maintenance services.

## Project Structure

```
ProFix-Masters-Center/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & error handling
│   │   ├── utils/         # Helper functions
│   │   └── config/        # Database config
│   └── .env.example       # Environment variables template
│
└── frontend/         # Next.js React application
    ├── app/              # Next.js app router pages
    ├── components/       # Reusable UI components
    ├── contexts/         # React contexts (Auth)
    ├── lib/              # API client
    └── types/            # TypeScript types

```

## Features

### Customer Features
- ✅ User registration and login
- ✅ Browse services by categories
- ✅ View service provider profiles with ratings
- ✅ Book services with date/time selection
- ✅ Multiple payment options (card, wallet, COD)
- ✅ Track booking status
- ✅ Rate and review providers
- ✅ View booking history

### Service Provider Features
- ✅ Provider registration with verification
- ✅ Profile management (experience, skills, service areas)
- ✅ Upload certificates and ID
- ✅ Create, edit, and delete services
- ✅ Set pricing per service
- ✅ Accept/reject booking requests
- ✅ View booking history
- ✅ Earnings dashboard
- ✅ Wallet and payout system
- ✅ View ratings and reviews

### Admin Panel
- ✅ Dashboard with analytics
- ✅ Manage users (customers & providers)
- ✅ Verify/approve service providers
- ✅ Manage services and categories
- ✅ Commission management (10-15%)
- ✅ View all bookings
- ✅ Payment reports
- ✅ Payout management

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcrypt
- **Email:** Nodemailer
- **OTP Verification:** Custom implementation

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Icons:** Heroicons, React Icons

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
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

5. Start development server:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Update environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Provider only)
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/provider/:providerId` - Get provider reviews

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/payout` - Request payout (Provider)
- `GET /api/users/payouts` - Get payout history

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/providers/:id/status` - Update provider status
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/payouts` - Get all payouts
- `PUT /api/admin/payouts/:id` - Update payout status

## Payment & Commission Logic

1. Customer pays the full service amount
2. Platform automatically deducts commission (default 10-15%)
3. Remaining amount is credited to provider's wallet
4. Providers can request payouts from their wallet
5. Admin approves/processes payout requests

## Database Schema

### User Model
- Supports three roles: customer, provider, admin
- Provider-specific fields: status, experience, skills, wallet, rating
- Authentication: email, phone, password (hashed)

### Service Model
- Linked to provider
- Category-based (AC repair, cleaning, etc.)
- Pricing and duration
- Custom commission rates

### Booking Model
- Links customer, provider, and service
- Payment details and status tracking
- Commission calculation
- Address and scheduling info

### Review Model
- One review per completed booking
- 1-5 star rating
- Updates provider's overall rating

### Payout Model
- Payout requests from providers
- Bank details
- Status tracking (pending, processing, completed, rejected)

## Development Workflow

### Building Backend
```bash
cd backend
npm run build
npm start
```

### Building Frontend
```bash
cd frontend
npm run build
npm start
```

## Deployment

### Backend Deployment (AWS/Google Cloud)
1. Set up MongoDB Atlas or cloud MongoDB
2. Configure environment variables on hosting platform
3. Deploy using PM2, Docker, or serverless

### Frontend Deployment (Vercel recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

## Future Enhancements

- Mobile apps (React Native / Flutter)
- Real-time notifications (Socket.io)
- Advanced search and filters
- Payment gateway integration (Stripe/PayPal)
- SMS OTP integration
- Google Maps integration
- Multi-language support
- Advanced analytics dashboard

## License

This project is proprietary and confidential.

## Support

For support, email support@profixmasters.com or create an issue in the repository.
