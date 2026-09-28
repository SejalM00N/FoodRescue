**# FoodRescue**



**### Smart Surplus Food Redistribution Platform**



**FoodRescue is a full-stack web application that connects food donors, NGOs, and volunteers to reduce food waste and help redistribute surplus food to people in need.**



**The platform manages the complete journey of surplus food — from donation and NGO request to volunteer pickup, live delivery tracking, and final OTP verification.**



**## Live Demo**



**https://food-rescue-zeta.vercel.app**



**## GitHub Repository**



**https://github.com/SejalM00N/FoodRescue**



**## How FoodRescue Works**



**Donor posts surplus food**  

**↓**  

**NGO discovers and requests the food**  

**↓**  

**Donor accepts the request**  

**↓**  

**Volunteer accepts the pickup**  

**↓**  

**Volunteer location is tracked in real time**  

**↓**  

**Volunteer picks up and delivers the food**  

**↓**  

**NGO verifies the delivery using OTP**  

**↓**  

**Donation is completed**



**## Key Features**



**### Donor**



**• Create surplus food donations**  

**• Upload food images**  

**• Add quantity, pickup location, expiry time, and food details**  

**• View donation requests**  

**• Accept or reject NGO requests**  

**• Track donation status**



**### NGO**



**• Browse available food donations**  

**• Request surplus food**  

**• View request status**  

**• Track active deliveries**  

**• View volunteer location in real time**  

**• Verify completed deliveries using OTP**



**### Volunteer**



**• View available pickup requests**  

**• Accept delivery assignments**  

**• View pickup and delivery locations**  

**• Navigate using maps and routing**  

**• Share live location during delivery**  

**• Mark food as picked up and delivered**  

**• Complete delivery through NGO OTP verification**



**## Real-Time Delivery Tracking**



**FoodRescue uses Socket.IO for real-time communication between volunteers and NGOs.**



**During an active delivery:**



**• Volunteer location is continuously shared**  

**• NGO receives location updates in real time**  

**• Delivery-specific Socket.IO rooms keep tracking isolated**  

**• Authentication is required before joining tracking rooms**



**## Maps and Navigation**



**The application uses:**



**• Leaflet for interactive maps**  

**• OpenStreetMap for map data**  

**• OSRM for route calculation and navigation**



**This allows volunteers and NGOs to visualize pickup locations, delivery locations, and active routes.**



**## Image Uploads**



**Food donation images are uploaded using:**



**• Multer for handling multipart form data**  

**• Cloudinary for cloud-based image storage**



**Uploaded images are associated with the corresponding food donation.**



**## Authentication and Security**



**FoodRescue implements:**



**• JWT-based authentication**  

**• Password hashing using bcryptjs**  

**• Role-based authorization**  

**• Protected API routes**  

**• Ownership validation for sensitive operations**  

**• Input validation for coordinates and user data**  

**• Secure OTP generation**  

**• Production CORS restrictions**  

**• Environment variables for sensitive credentials**



**Supported roles:**



**Donor**  

**NGO**  

**Volunteer**



**## Technology Stack**



**Frontend**



**React.js**  

**JavaScript**  

**Vite**  

**Tailwind CSS**  

**React Router**  

**Axios**  

**Lucide React**



**Backend**



**Node.js**  

**Express.js**  

**MongoDB**  

**Mongoose**  

**JWT**  

**bcryptjs**  

**Socket.IO**



**Services and APIs**



**MongoDB Atlas**  

**Cloudinary**  

**Leaflet**  

**OpenStreetMap**  

**OSRM**  

**Vercel**  

**Render**



**## Project Architecture**



**FoodRescue follows a client-server architecture.**



**Frontend**  

**→ React + Vite application**



**Backend**  

**→ Node.js + Express REST API**



**Database**  

**→ MongoDB Atlas**



**Real-Time Layer**  

**→ Socket.IO**



**Image Storage**  

**→ Cloudinary**



**Maps**  

**→ Leaflet + OpenStreetMap**



**Routing**  

**→ OSRM**



**## Project Structure**



**FoodRescue/**



**├── frontend/**  

**│   ├── src/**  

**│   ├── public/**  

**│   └── package.json**  

**│**

**├── backend/**  

**│   ├── controllers/**  

**│   ├── middleware/**  

**│   ├── models/**  

**│   ├── routes/**  

**│   ├── config/**  

**│   └── server.js**  

**│**

**├── README.md**  

**└── .gitignore**



**## Running Locally**



**Clone the repository:**



**git clone https://github.com/SejalM00N/FoodRescue.git**



**Open the project:**



**cd FoodRescue**



**### Backend**



**cd backend**



**npm install**



**Create a `.env` file containing the required MongoDB, JWT, and Cloudinary configuration.**



**Start the backend:**



**npm start**



**### Frontend**



**Open another terminal:**



**cd frontend**



**npm install**



**npm run dev**



**The frontend will run on the Vite development server.**



**## Deployment**



**Frontend is deployed using Vercel.**



**Backend is deployed using Render.**



**MongoDB database is hosted using MongoDB Atlas.**



**Cloudinary is used for image storage.**



**## Project Highlights**



**• Complete donor → NGO → volunteer workflow**  

**• Role-based dashboards and authorization**  

**• Real-time volunteer location tracking**  

**• Interactive maps and route calculation**  

**• Cloud image uploads**  

**• OTP-based delivery verification**  

**• Responsive design for desktop, tablet, and mobile**  

**• Production deployment with Vercel and Render**  

**• Secure authentication and protected API endpoints**



**## Future Improvements**



**• Push notifications for new donation requests**  

**• Improved volunteer matching based on distance**  

**• Donation analytics and impact reports**  

**• NGO verification system**  

**• Email and SMS notifications**  

**• Advanced food expiry alerts**



**## Author**



**Sejal M**



**B.Tech Computer Science \& Engineering**

