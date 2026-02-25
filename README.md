# 🍕 PizzaVerse - Full Stack Pizza Ordering System

A premium, full-stack MERN (MongoDB, Express, React, Node.js) application designed for building custom pizzas, managing inventory, and processing payments seamlessly. 

![PizzaVerse Preview](frontend/public/favicon.ico)

## 🌟 Features

### For Users
- **Secure Authentication**: JWT-based login, registration with email verification logic, and a forgot/reset password flow.
- **3D Flipping Auth Portal**: Modern CSS animations provide a seamless transition between Login and Registration.
- **Interactive Pizza Builder**: A visually rich, step-by-step pizza customization engine.
- **Dynamic 3D Previews**: Live updates the pizza model based on your ingredient selections (Base, Sauce, Cheese, Veggies, Meats).
- **Cart & Checkout**: Secure Razorpay integration (Test Mode) to instantly process orders.
- **Live Order Tracking**: Track the status of your pizza from the oven to your door right from your dashboard.

### For Admins
- **Unified Admin Portal**: Dedicated dashboard for staff to manage operations.
- **Inventory Management**: Create, Read, Update, and Delete available pizza ingredients.
- **Automated Stock Tracking**: Deducts inventory automatically when users place orders.
- **Low Stock Alerts**: Triggers an automated email notification to the admin via Nodemailer if any ingredient falls below the threshold (default: 20 units).
- **Order Management System**: View all user orders and update their delivery statuses in real-time.

## 🚀 Technology Stack
* **Frontend**: React.js (Vite), React Router, Context API, CSS (Vanilla Custom CSS with variables), React Hot Toast for notifications.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose).
* **Payment Gateway**: Razorpay Integration.
* **Email Service**: Nodemailer.

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed locally (or a MongoDB Atlas URI)
- Razorpay Test Account for API Keys
- A Gmail account with an App Password (for Nodemailer)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/pizza-app
   JWT_SECRET=your_super_secret_jwt_key
   EMAIL_USER=your_real_gmail_address@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RAZORPAY_KEY_ID=your_razorpay_test_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_test_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Seed the database with high-quality 3D emoji ingredient icons:
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## 🎓 Reviewer Instructions

To specifically evaluate the core features requested in this internship task, please follow these instructions:

### Testing Payment Integration (Razorpay)
The application includes a seamless fallback mechanism for testing payments.
* **Hassle-Free Demo Mode:** By default, if you run the app without providing Razorpay API keys in the `.env` files, the checkout page will simulate a successful transaction. It will instantly process a dummy payment, verify it, deduct inventory, and place the order without requiring any Razorpay account setup.
* **Testing the Real Flow:** If you wish to test the actual Razorpay User Interface:
  1. Sign up for a free Razorpay account and ensure you are in **Test Mode**.
  2. Generate Test API Keys from the dashboard.
  3. Place your `Key Id` and `Key Secret` in `backend/.env`.
  4. Place your `Key Id` in `frontend/.env`.
  5. Restart both servers. When you click "Pay Securely" on checkout, the official Razorpay test modal will appear.

### Testing Admin Low-Stock Email Alerts (Nodemailer)
The system is wired to automatically send an email to the Admin whenever any ingredient's stock drops below **20 units** after an order is placed.
1. Provide a real Gmail address to `EMAIL_USER` in `backend/.env`.
2. Generate a 16-character **App Password** from your Google Account Security settings (Search "App Passwords" in your Google account).
3. Paste the App Password into `EMAIL_PASS` in `backend/.env` (no spaces).
4. Restart the backend server.
5. Log in as an Admin (`/admin-login`), go to the Inventory manager, and edit an ingredient (e.g., "Thin Crust") so its stock is exactly `20`.
6. Log in as a User (`/login`), build a pizza using that specific ingredient, and place an order.
7. The stock will drop to `19`, and an automated low-stock alert will instantly be dispatched to the provided Gmail inbox!

## 🔐 Default Demo Accounts (If seeded manually)
You can assign roles directly in the MongoDB cluster, or use the dual-sided Auth Portal to sign up as a User or an Admin directly from the UI.

## 📜 License
This project is for educational and portfolio purposes. Feel free to clone and modify it!
