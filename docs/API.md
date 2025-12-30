# ProFix Masters Center API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
Creates a new user account (customer or provider).

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "role": "customer" // or "provider"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your phone/email with OTP.",
  "userId": "64abc123...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
Authenticates a user and returns a JWT token.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isEmailVerified": false,
    "isPhoneVerified": false
  }
}
```

### Send OTP
Sends an OTP for phone/email verification.

**Endpoint:** `POST /auth/send-otp` (Protected)

**Body:**
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### Verify OTP
Verifies the OTP sent to user's phone/email.

**Endpoint:** `POST /auth/verify-otp` (Protected)

**Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### Get Current User
Returns the authenticated user's information.

**Endpoint:** `GET /auth/me` (Protected)

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    // ... other user fields
  }
}
```

---

## Service Endpoints

### Get All Services
Returns a paginated list of active services with optional filtering.

**Endpoint:** `GET /services`

**Query Parameters:**
- `category` (optional): Filter by service category
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "_id": "64xyz789...",
      "title": "AC Repair Service",
      "description": "Professional AC repair and maintenance",
      "category": "ac_repair",
      "basePrice": 500,
      "duration": 60,
      "images": ["url1", "url2"],
      "isActive": true,
      "providerId": {
        "_id": "64abc123...",
        "name": "Provider Name",
        "rating": 4.5,
        "totalReviews": 10
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Service by ID
Returns detailed information about a specific service.

**Endpoint:** `GET /services/:id`

**Response:**
```json
{
  "success": true,
  "service": {
    "_id": "64xyz789...",
    "title": "AC Repair Service",
    "description": "Professional AC repair and maintenance",
    "category": "ac_repair",
    "basePrice": 500,
    "duration": 60,
    "providerId": {
      "_id": "64abc123...",
      "name": "Provider Name",
      "email": "provider@example.com",
      "phone": "+1234567890",
      "rating": 4.5,
      "totalReviews": 10,
      "experience": 5,
      "skills": ["AC Repair", "Maintenance"]
    }
  }
}
```

### Create Service
Creates a new service (Provider only).

**Endpoint:** `POST /services` (Protected - Provider/Admin only)

**Body:**
```json
{
  "title": "AC Repair Service",
  "description": "Professional AC repair and maintenance",
  "category": "ac_repair",
  "basePrice": 500,
  "duration": 60,
  "images": ["url1", "url2"]
}
```

**Response:**
```json
{
  "success": true,
  "service": {
    "_id": "64xyz789...",
    "title": "AC Repair Service",
    // ... other service fields
  }
}
```

### Update Service
Updates an existing service.

**Endpoint:** `PUT /services/:id` (Protected - Provider/Admin only)

**Body:** Same as create service

**Response:**
```json
{
  "success": true,
  "service": {
    // updated service object
  }
}
```

### Delete Service
Deletes a service.

**Endpoint:** `DELETE /services/:id` (Protected - Provider/Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## Booking Endpoints

### Create Booking
Creates a new service booking.

**Endpoint:** `POST /bookings` (Protected - Customer only)

**Body:**
```json
{
  "serviceId": "64xyz789...",
  "bookingDate": "2025-01-15",
  "bookingTime": "10:00",
  "customerAddress": "123 Main St",
  "customerCity": "New York",
  "customerZipCode": "10001",
  "customerPhone": "+1234567890",
  "paymentMethod": "cod", // or "card", "wallet"
  "notes": "Please call before arrival"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "_id": "64booking123...",
    "customerId": "64abc123...",
    "providerId": "64provider123...",
    "serviceId": "64xyz789...",
    "bookingDate": "2025-01-15T00:00:00.000Z",
    "bookingTime": "10:00",
    "customerAddress": "123 Main St",
    "customerCity": "New York",
    "servicePrice": 500,
    "commissionRate": 0.15,
    "commissionAmount": 75,
    "providerEarning": 425,
    "totalAmount": 500,
    "status": "pending",
    "paymentMethod": "cod",
    "paymentStatus": "pending"
  }
}
```

### Get My Bookings
Returns bookings for the authenticated user.

**Endpoint:** `GET /bookings` (Protected)

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "64booking123...",
      "customerId": { /* customer details */ },
      "providerId": { /* provider details */ },
      "serviceId": { /* service details */ },
      "status": "pending",
      "totalAmount": 500
      // ... other booking fields
    }
  ],
  "pagination": { /* pagination info */ }
}
```

### Get Booking by ID
Returns detailed information about a specific booking.

**Endpoint:** `GET /bookings/:id` (Protected)

**Response:**
```json
{
  "success": true,
  "booking": {
    // detailed booking object with populated references
  }
}
```

### Update Booking Status
Updates the status of a booking (Provider/Admin only).

**Endpoint:** `PUT /bookings/:id/status` (Protected)

**Body:**
```json
{
  "status": "confirmed" // or "in_progress", "completed", "rejected"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    // updated booking object
  }
}
```

### Cancel Booking
Cancels a booking (Customer only).

**Endpoint:** `PUT /bookings/:id/cancel` (Protected)

**Body:**
```json
{
  "cancellationReason": "Need to reschedule"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    // updated booking with status "cancelled"
  }
}
```

---

## Review Endpoints

### Create Review
Creates a review for a completed booking.

**Endpoint:** `POST /reviews` (Protected - Customer only)

**Body:**
```json
{
  "bookingId": "64booking123...",
  "rating": 5,
  "comment": "Excellent service! Very professional."
}
```

**Response:**
```json
{
  "success": true,
  "review": {
    "_id": "64review123...",
    "bookingId": "64booking123...",
    "customerId": "64abc123...",
    "providerId": "64provider123...",
    "serviceId": "64xyz789...",
    "rating": 5,
    "comment": "Excellent service! Very professional."
  }
}
```

### Get Provider Reviews
Returns reviews for a specific provider.

**Endpoint:** `GET /reviews/provider/:providerId`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "64review123...",
      "customerId": {
        "name": "Customer Name",
        "profilePhoto": "url"
      },
      "serviceId": {
        "title": "Service Name",
        "category": "ac_repair"
      },
      "rating": 5,
      "comment": "Great service!",
      "createdAt": "2025-01-10T..."
    }
  ],
  "pagination": { /* pagination info */ }
}
```

---

## User Endpoints

### Get Profile
Returns the current user's profile.

**Endpoint:** `GET /users/profile` (Protected)

**Response:**
```json
{
  "success": true,
  "user": {
    // user object without password
  }
}
```

### Update Profile
Updates the current user's profile.

**Endpoint:** `PUT /users/profile` (Protected)

**Body:**
```json
{
  "name": "Updated Name",
  "address": "New Address",
  "city": "New City",
  "experience": 6,
  "skills": ["Skill 1", "Skill 2"]
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    // updated user object
  }
}
```

### Request Payout
Creates a payout request (Provider only).

**Endpoint:** `POST /users/payout` (Protected - Provider only)

**Body:**
```json
{
  "amount": 1000,
  "bankDetails": {
    "accountNumber": "1234567890",
    "bankName": "Bank Name",
    "ifscCode": "BANK0001234",
    "accountHolderName": "Provider Name"
  }
}
```

**Response:**
```json
{
  "success": true,
  "payout": {
    "_id": "64payout123...",
    "providerId": "64provider123...",
    "amount": 1000,
    "status": "pending",
    "bankDetails": { /* bank details */ }
  }
}
```

---

## Admin Endpoints

### Get Dashboard Stats
Returns platform statistics for admin dashboard.

**Endpoint:** `GET /admin/dashboard` (Protected - Admin only)

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "totalCustomers": 150,
      "totalProviders": 45,
      "pendingProviders": 5
    },
    "bookings": {
      "total": 500,
      "completed": 450,
      "pending": 50
    },
    "services": {
      "total": 120,
      "active": 110
    },
    "revenue": {
      "total": 250000,
      "commission": 37500
    }
  }
}
```

### Get All Users
Returns a list of all users with filtering.

**Endpoint:** `GET /admin/users` (Protected - Admin only)

**Query Parameters:**
- `role` (optional): Filter by user role
- `status` (optional): Filter by provider status
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "users": [
    // array of user objects
  ],
  "pagination": { /* pagination info */ }
}
```

### Update Provider Status
Updates the verification status of a provider.

**Endpoint:** `PUT /admin/providers/:id/status` (Protected - Admin only)

**Body:**
```json
{
  "status": "approved" // or "rejected", "suspended"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Provider status updated to approved",
  "provider": {
    // updated provider object
  }
}
```

### Update Payout Status
Updates the status of a payout request.

**Endpoint:** `PUT /admin/payouts/:id` (Protected - Admin only)

**Body:**
```json
{
  "status": "completed", // or "rejected"
  "notes": "Payment processed"
}
```

**Response:**
```json
{
  "success": true,
  "payout": {
    // updated payout object
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API rate limits:
- **Public endpoints**: 100 requests per 15 minutes
- **Authenticated endpoints**: 500 requests per 15 minutes

---

## Commission Rates

Default commission rate: **15%**

Custom commission rates can be set per service or category by admin.

**Calculation:**
```
Service Price: ₹1000
Commission (15%): ₹150
Provider Earning: ₹850
Total Customer Payment: ₹1000
```

---

## Webhooks (Future Enhancement)

Coming soon: Webhook support for booking updates, payment notifications, etc.
