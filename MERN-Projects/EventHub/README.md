# 🎟️ EventHub — MERN Event Booking Platform

EventHub is a full-stack event booking platform built using the **MERN stack**. It allows users to discover events, register with email OTP verification, authenticate securely using JWT, request event bookings, and manage their bookings.

Administrators can create and manage events, review booking requests, approve bookings, track revenue, manage payment status, and monitor seat availability.

## 🌐 Live Demo

**Frontend:** https://mern-eventhub.vercel.app

**Backend API:** https://web-development-1-ka3u.onrender.com

---

## ✨ Features

### 👤 User Authentication

* User registration
* Email OTP verification
* Secure password hashing with bcrypt
* JWT-based authentication
* Login and logout
* Protected routes
* Role-based authorization
* User and admin roles

### 🎫 Event Management

* Browse available events
* Search events
* View detailed event information
* Ticket pricing
* Total and available seat tracking
* Event categories
* Event images
* Admin event creation
* Admin event deletion

### 📋 Booking System

* Secure booking workflow
* Booking OTP verification
* Booking request system
* Pending booking status
* Admin booking approval
* Paid / unpaid payment status
* Automatic seat deduction after confirmation
* Booking cancellation
* Automatic seat restoration after cancellation

### 📧 Email Notifications

* Registration OTP emails
* Booking OTP emails
* Booking confirmation emails
* Gmail SMTP integration using Nodemailer

### 🛡️ Admin Dashboard

Administrators can:

* View all events
* Create new events
* Delete events
* View all booking requests
* View registered users associated with bookings
* Approve bookings
* Reject booking requests
* Set payment status
* Monitor pending requests
* Track paid clients
* Calculate total revenue
* Monitor event seat availability

---

## 🧰 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* Vite
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Nodemailer
* CORS
* dotenv

### Database

* MongoDB Atlas

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas
* **Email:** Gmail SMTP

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      User Browser   │
                    │     React + Vite    │
                    └──────────┬──────────┘
                               │
                               │ HTTPS / REST API
                               ▼
                    ┌─────────────────────┐
                    │        Vercel       │
                    │  React Frontend App  │
                    └──────────┬──────────┘
                               │
                               │ API Requests
                               ▼
                    ┌─────────────────────┐
                    │       Render        │
                    │ Node + Express API  │
                    └──────┬────────┬─────┘
                           │        │
                  ┌────────┘        └─────────┐
                  ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │  MongoDB Atlas  │         │   Gmail SMTP    │
        │     Database    │         │   Nodemailer    │
        └─────────────────┘         └─────────────────┘
```

---

## 🔐 Authentication Flow

```text
User Registration
       │
       ▼
Create Account
       │
       ▼
Password Hashing
       │
       ▼
Generate OTP
       │
       ▼
Send OTP via Email
       │
       ▼
User Verifies OTP
       │
       ▼
Account Activated
       │
       ▼
Login
       │
       ▼
JWT Token Generated
       │
       ▼
Authenticated Requests
```

Passwords are hashed using **bcryptjs** and authentication is handled using **JSON Web Tokens (JWT)**.

---

## 🎟️ Booking Flow

```text
User selects event
        │
        ▼
Click "Book/Register"
        │
        ▼
Booking OTP generated
        │
        ▼
OTP sent to user's email
        │
        ▼
User verifies OTP
        │
        ▼
Booking request created
        │
        ▼
Status: Pending
        │
        ▼
Admin reviews request
        │
        ├───────────────┐
        ▼               ▼
    Approve           Reject
        │               │
        ▼               ▼
   Confirmed         Cancelled
        │
        ▼
Seat availability updated
        │
        ▼
Confirmation email sent
```

---

## 👨‍💼 Admin Workflow

Administrators have access to a dedicated dashboard.

The dashboard provides:

* Total revenue
* Paid clients
* Pending booking requests
* Event management
* Booking management
* User information
* Payment status
* Seat availability

Admin approval changes the booking state from:

```text
Pending → Confirmed
```

When a confirmed booking is cancelled:

```text
Confirmed → Cancelled
```

and the available seat count is restored.

---

## 📁 Project Structure

```text
EventHub/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | `/api/auth/register`   | Register a new user     |
| POST   | `/api/auth/login`      | Login user              |
| POST   | `/api/auth/verify-otp` | Verify registration OTP |

### Events

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | `/api/events`     | Get all events  |
| POST   | `/api/events`     | Create an event |
| DELETE | `/api/events/:id` | Delete an event |

### Bookings

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | `/api/bookings/send-otp`    | Send booking OTP        |
| POST   | `/api/bookings`             | Create booking request  |
| GET    | `/api/bookings/my`          | Get user/admin bookings |
| PUT    | `/api/bookings/:id/confirm` | Confirm booking         |
| DELETE | `/api/bookings/:id`         | Cancel booking          |

---

## ⚙️ Environment Variables

### Frontend

Create a `.env` file inside the frontend/client directory:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

For the deployed application, the API points to the Render backend.

### Backend

Create a `.env` file inside the server directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_google_app_password
PORT=5000
```

### ⚠️ Security

Never commit `.env` files or secret credentials to GitHub.

Make sure `.gitignore` contains:

```gitignore
node_modules/
.env
.env.local
dist/
build/
```

---

## 🚀 Local Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd EventHub
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create the required `.env` files using the environment variable examples above.

### 5. Start the backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 6. Start the frontend

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔒 Security Features

EventHub implements several security mechanisms:

* JWT authentication
* Password hashing using bcrypt
* Protected API routes
* Role-based authorization
* Admin-only operations
* Email OTP verification
* Booking OTP verification
* Environment-based secret management
* CORS configuration
* MongoDB database security

---

## 📊 Booking States

Bookings use three primary states:

```text
Pending
   │
   ├── Admin Approves ──► Confirmed
   │
   └── Admin Rejects ──► Cancelled
```

Payment status is separately tracked as:

```text
Paid
Not Paid
```

This allows booking and payment states to be managed independently.

---

## 📸 Screenshots

Screenshots of the application can be added here.

Recommended screenshots:

* Home / Event Listing
* Event Details
* Registration / OTP Verification
* Booking Page
* My Bookings
* Admin Dashboard
* Booking Confirmation Email

Example:

```md
![Event Listing](docs/screenshots/home.png)
```

---

## 🚀 Deployment

### Frontend

The React frontend is deployed using **Vercel**.

### Backend

The Node.js/Express backend is deployed using **Render**.

### Database

MongoDB Atlas is used for cloud database storage.

### Email

Nodemailer with Gmail SMTP is used for OTP and booking confirmation emails.

---

## 🔮 Future Improvements

Potential future improvements include:

* Online payment gateway integration
* QR-code based tickets
* Downloadable event tickets
* Event reminders
* Advanced event filtering
* User profile management
* Event reviews and ratings
* Organizer accounts
* Analytics dashboard
* Docker containerization
* CI/CD pipeline
* Cloud monitoring and logging

---

## 🎯 Learning Outcomes

This project provided hands-on experience with:

* Full-stack MERN development
* REST API development
* MongoDB database design
* Authentication and authorization
* JWT implementation
* OTP-based verification
* Email service integration
* Role-based access control
* Booking state management
* API security
* CORS configuration
* Cloud deployment
* Vercel
* Render
* MongoDB Atlas
* Environment variable management

---

## 👨‍💻 Author

**Cecil Baraik**

Aspiring Full-Stack Developer | Cybersecurity Enthusiast

* GitHub: `https://github.com/cecilbaraik19`
* LinkedIn: `https://linkedin.com/in/cecil-baraik-b8150b339`
* Portfolio: `https://cecilbaraik19-portfolio.vercel.app`

---

## ⭐ Support

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

**Built with the MERN stack and deployed using Vercel, Render, and MongoDB Atlas.**
