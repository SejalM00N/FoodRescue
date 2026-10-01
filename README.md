# FoodRescue

### Smart Surplus Food Redistribution Platform

FoodRescue is a full-stack web application that connects food donors, NGOs, and volunteers to coordinate the redistribution of surplus food.

It manages the complete workflow from food donation and NGO requests to volunteer pickup, real-time delivery tracking, and OTP-based delivery verification.

[Live Demo](https://food-rescue-zeta.vercel.app) · [GitHub Repository](https://github.com/SejalM00N/FoodRescue)

## How It Works

Donor creates a food donation  
↓  
NGO discovers and requests the donation  
↓  
Donor accepts the request  
↓  
Volunteer accepts the pickup  
↓  
Volunteer shares live location  
↓  
Food is picked up and delivered  
↓  
NGO verifies delivery using OTP

## Key Features

### Role-Based Workflows

- Donor — create donations, manage NGO requests, and track donation status
- NGO — find available food, request donations, track deliveries, and verify completed deliveries
- Volunteer — accept pickups, navigate to locations, share live location, and complete deliveries

### Real-Time Delivery Tracking

Implemented real-time volunteer location tracking using Socket.IO.

- Volunteer location is shared during an active delivery
- NGO receives location updates in real time
- Delivery-specific Socket.IO rooms isolate tracking sessions
- Socket authentication is required before joining a tracking room

### Maps and Navigation

- Leaflet for interactive maps
- OpenStreetMap for map data
- OSRM for route calculation
- Pickup and delivery locations displayed on the map

### Secure Delivery Verification

- Secure OTP generation on the backend
- Volunteer completes the delivery
- NGO verifies the delivery using OTP
- Delivery status changes after successful verification

### Authentication and Security

- JWT-based authentication
- Password hashing using bcryptjs
- Role-based authorization
- Protected API routes
- Ownership and delivery-state validation
- Input and coordinate validation
- Production CORS restrictions
- Environment variables for sensitive credentials

### Food Image Uploads

Food images are handled using Multer and stored in Cloudinary.

## Technology Stack

| Area           | Technologies                             |
| -------------- | ---------------------------------------- |
| Frontend       | React.js, JavaScript, Vite, Tailwind CSS |
| Routing & HTTP | React Router, Axios                      |
| Backend        | Node.js, Express.js                      |
| Database       | MongoDB Atlas, Mongoose                  |
| Authentication | JWT, bcryptjs                            |
| Real-Time      | Socket.IO                                |
| Image Storage  | Cloudinary, Multer                       |
| Maps           | Leaflet, OpenStreetMap                   |
| Routing        | OSRM                                     |
| Deployment     | Vercel, Render                           |

## Architecture

React + Vite Frontend  
↓  
Express REST API  
↓  
MongoDB Atlas

Supporting services:

- Socket.IO for real-time delivery tracking
- Cloudinary for food image storage
- Leaflet and OpenStreetMap for maps
- OSRM for route calculation

## Project Structure

```text
FoodRescue/
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # Authentication and shared state
│   │   ├── services/       # API/service logic
│   │   ├── assets/         # Images and frontend assets
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/             # External service configuration
│   ├── controllers/        # Application/business logic
│   ├── middleware/         # Authentication, roles, uploads
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # REST API routes
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

## Deployment

- Frontend — Vercel
- Backend — Render
- Database — MongoDB Atlas
- Image Storage — Cloudinary

## Run Locally

Clone the repository:

git clone https://github.com/SejalM00N/FoodRescue.git

cd FoodRescue

Backend:

cd backend

npm install

npm start

Frontend:

cd frontend

npm install

npm run dev

Create the required backend environment variables for MongoDB, JWT, and Cloudinary before starting the server.
