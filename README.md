# 🚀 VisionX: MERN Stack Quotation Management SaaS

> The fastest, most professional way to create, manage, and track client quotations. Built with the MERN stack for freelancers, agencies, and construction businesses.

**VisionX** is a modern, full-stack SaaS application. It streamlines the quotation workflow with a beautiful glassmorphism React UI, 6 dynamic design templates, instant PDF exports, and complete client pipeline management powered by a secure Node.js and MongoDB backend.

---

## ✨ Key Features

* **📊 Dashboard Analytics:** Get a bird's-eye view of pending, approved, and declined quotes with total pipeline value.
* **🎨 6 Premium Templates:** Instantly switch between *Classic, Modern, Corporate, Compact, Creative,* and *Grouped (Letterhead)* designs.
* **💾 MERN Stack Power:** Fully persistent data storage using MongoDB and Mongoose, ensuring strict user-data isolation and schema validation.
* **📄 Instant Export & Share:** Generate high-fidelity PDFs (via Puppeteer), send quotes directly via Email, or share via WhatsApp.
* **💳 Interactive Pricing & Trials:** Built-in SaaS billing flows including trial limits and Monthly/Yearly subscription toggles.
* **📲 Mobile-Ready (Capacitor):** Fully responsive UI with a native mobile drawer, ready to be compiled into an Android/iOS app.

---

## 🛠️ Tech Stack (MERN)

**Frontend (Client):**
* **React.js** (UI Framework via Vite)
* **Tailwind CSS** (Utility-first Styling)
* **Lucide React** (Beautiful SVG Icons)
* **Axios** (API Client)

**Backend (Server & Database):**
* **MongoDB & Mongoose** (NoSQL Database & Object Data Modeling)
* **Express.js** (RESTful API Framework)
* **Node.js** (JavaScript Runtime)
* **Puppeteer** (Dynamic Headless PDF Generation)
* **JSON Web Tokens (JWT)** (Secure Authentication)

---

## 📂 Core Project Structure

The project is divided into two main directories: `frontend` and `backend`.

```text
VisionX/
├── backend/
│   ├── config/         # MongoDB connection & env setup
│   ├── controllers/    # API logic (quotationController, exportController)
│   ├── models/         # Mongoose Schemas (Quotation.js, User.js)
│   ├── routes/         # Express API routes
│   └── services/       # Email & PDF generation services
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI & 6 Quotation Templates
    │   ├── pages/      # Dashboard, Preview, Export, Auth screens
    │   └── utils/      # API helpers and local storage logic
    └── capacitor.config.json # Mobile build config
💻 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development.

Prerequisites
Node.js (v16 or higher)

MongoDB (Installed locally, or a MongoDB Atlas URI)

1. Backend Setup
Bash
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install

# Create a .env file and add your environment variables
echo "PORT=5000" > .env
echo "MONGO_URI=mongodb://localhost:27017/visionx" >> .env
echo "JWT_SECRET=your_super_secret_jwt_key" >> .env

# Start the Node.js backend server
npm run dev
2. Frontend Setup
Bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Create a .env file for the API URL
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start the Vite React development server
npm run dev
Navigate to http://localhost:5173 in your browser to view the app.

📱 Compiling for Android (Optional)
To turn this React web app into a native Android application:

Bash
cd frontend

# Run the production build
npm run build

# Sync web assets with Capacitor
npx cap sync

# Open the project in Android Studio
npx cap open android
(Note: Ensure your VITE_API_URL is pointing to your local network IP, e.g., http://192.168.x.x:5000/api, before building for a physical device).

📸 Screenshots
(Add your application screenshots here to make the repository stand out)

Dashboard: ![Dashboard Screenshot](./assets/dashboard.png)

Quotation Preview: ![Preview Screenshot](./assets/preview.png)

Export Menu: ![Export Screenshot](./assets/export.png)

🤝 Contributing
Contributions, issues, and feature requests are welcome!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.
