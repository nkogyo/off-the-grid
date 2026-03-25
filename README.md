# 👟 OFF THE GRID — Sneaker Showcase Platform

Off The Grid is a modern sneaker product showcase web application built with React and Firebase. It provides a clean, editorial-style interface for browsing products while allowing administrators to manage content dynamically in real-time.

---

## 🚀 FEATURES

### 🧢 Public User Side

* Dynamic product catalog
* Product details with:

  * Main image (1)
  * Sub images (up to 3)
* Size selection (auto-filled in inquiry form)
* Featured sneaker (admin-controlled)
* New arrivals section (admin-controlled)
* Latest updates page
* Brand filtering via clickable featured brands
* Inquiry system (Check Availability)

---

### 🛠️ Admin Dashboard (Protected)

* Secure admin login (Firebase Authentication)
* Add / Edit / Delete products
* Upload:

  * 1 Main Image
  * Up to 3 Sub Images
* Manage:

  * Store information (syncs to About & Contact)
  * About page content
  * Updates (news/events)
  * New arrivals
  * Featured sneaker
  * Featured brands (text-based)

---

### 📩 Inquiry System

* Users can send inquiries directly from the product page
* Selected size is automatically included
* All inquiries are stored in Firebase Firestore
* Admin can view inquiries inside the dashboard

---

## 🧩 TECH STACK

* Frontend: React (Vite)
* Backend / Database: Firebase Firestore
* Authentication: Firebase Auth
* Hosting: Firebase Hosting
* Styling: Custom CSS (Editorial / Streetwear UI)

---

## 📁 PROJECT STRUCTURE

src/
│
├── pages/
│   ├── Home.jsx
│   ├── Catalog.jsx
│   ├── ProductDetails.jsx
│   ├── Updates.jsx
│   ├── Contact.jsx
│   ├── About.jsx
│   ├── AdminDashboard.jsx
│   └── AdminLogin.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── ...
│
├── firebase/
│   └── config.js

---

## ⚙️ SETUP INSTRUCTIONS

1. Clone the repository
   git clone https://github.com/your-username/off-the-grid.git
   cd off-the-grid

2. Install dependencies
   npm install

3. Run locally
   npm run dev

---

## 🔥 FIREBASE SETUP

1. Create a Firebase project
2. Enable:

   * Firestore Database
   * Authentication (Email/Password)
   * Hosting
3. Add your Firebase config in:
   src/firebase/config.js

---

## 🌐 DEPLOYMENT

Build the project:
npm run build

Deploy using Firebase:
firebase deploy

---

## 📱 MOBILE RESPONSIVENESS

* Fully responsive layout
* Optimized for mobile browsing
* Clean UI scaling for smaller screens

---

## 🎨 UI DESIGN

* Editorial streetwear aesthetic
* Grid-based layout
* Neon accents + graffiti-inspired elements
* Hover animations and interactive components

---

## 🔐 ADMIN ACCESS

Admin dashboard is protected using Firebase Authentication.

Route:
/admin/login

Only authorized users can:

* Access dashboard
* Modify content
* View inquiries

---

## 📌 NOTES

* All content updates are real-time via Firebase
* No redeploy needed when admin updates data
* Designed for scalability and content flexibility

---

## 👨‍💻 DEVELOPER

Developed by: DE JESUS, James Andrei; Jacinto, Euliemae; Marmol, Precious Gem; Ramos, Jocel Myca
Project: Off The Grid Sneaker Platform

---

## 📄 LICENSE

This project is for academic and educational purposes.
