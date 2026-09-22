**# FoodRescue**



**FoodRescue is a full-stack web platform designed to reduce food waste by connecting food donors with NGOs and volunteers for efficient food redistribution.**



**## Problem Statement**



**Large quantities of surplus food from restaurants, events, hotels, and other sources may go to waste even when nearby communities and organizations need food.**



**FoodRescue provides a digital platform where surplus food can be listed, requested, picked up, delivered, and verified through a structured workflow.**



**## Key Features**



**- User registration and JWT-based authentication**

**- Role-based access for Donors, NGOs, and Volunteers**

**- Surplus food donation management**

**- Food image upload using Cloudinary**

**- Donation location and coordinates**

**- NGO browsing of available food**

**- Donation request workflow**

**- Volunteer pickup and delivery workflow**

**- NGO delivery verification**

**- Role switching through account settings**

**- Responsive dashboards for different user roles**

**- MongoDB-based persistent data storage**



**## User Roles**



**### Donor**



**Donors can:**



**- Create food donations**

**- Add food details and quantities**

**- Upload food images**

**- Set preparation time and pickup deadline**

**- Provide pickup location**

**- Track their donations**

**- Manage their account role**



**### NGO**



**NGOs can:**



**- Browse available food donations**

**- Request suitable donations**

**- Manage donation requests**

**- Verify completed deliveries**



**### Volunteer**



**Volunteers can:**



**- View available pickup tasks**

**- Accept food pickups**

**- Track deliveries**

**- Complete delivery workflows**

**- Help connect donors with NGOs**



**## Technology Stack**



**### Frontend**



**- React.js**

**- JavaScript**

**- Tailwind CSS**

**- React Router**

**- Axios**

**- Lucide React**

**- Leaflet**

**- OpenStreetMap**



**### Backend**



**- Node.js**

**- Express.js**

**- MongoDB**

**- Mongoose**

**- JWT**

**- bcryptjs**

**- Multer**

**- Cloudinary**



**### Development \& Deployment**



**- Git**

**- GitHub**

**- Vercel**

**- Render**



**## Project Structure**



**```text**

**FoodRescue/**

**│**

**├── backend/**

**│   ├── config/**

**│   ├── controllers/**

**│   ├── middleware/**

**│   ├── models/**

**│   ├── routes/**

**│   ├── .env.example**

**│   ├── package.json**

**│   └── server.js**

**│**

**├── frontend/**

**│   ├── public/**

**│   ├── src/**

**│   │   ├── context/**

**│   │   ├── pages/**

**│   │   ├── services/**

**│   │   └── assets/**

**│   ├── package.json**

**│   └── vite.config.js**

**│**

**├── .gitignore**

**└── README.md**

