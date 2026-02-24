# 🍽️ SwadMitra – Food Delivery Application (Zomato Clone)

A full-stack food delivery web application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.

SwadMitra allows users to browse restaurants, explore menus, add items to cart, and place orders securely.  
Includes user authentication, admin panel, and real-time backend integration.

🌐 **Live Demo:**  
👉 https://food-del-pro-frontend.onrender.com/

---

## 🚀 Features

### 👤 User Features
- ✅ User Registration & Login (JWT Authentication)
- ✅ Browse Restaurants & Menus
- ✅ Add to Cart Functionality
- ✅ Place Orders
- ✅ Responsive UI (Mobile Friendly)

### 🛠️ Admin Features
- ✅ Add / Update / Delete Food Items
- ✅ Manage Orders
- ✅ Upload Food Images
- ✅ Restaurant & Menu Management

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React.js (Vite)
- HTML5
- CSS3
- JavaScript
- Axios

### 🔹 Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (File Uploads)
- RESTful APIs

### 🔹 Database
- MongoDB (Mongoose)

### 🔹 Deployment
- Render (Frontend + Backend)

---

## 📂 Project Structure

```
SwadMitra/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── admin/
    ├── public/
    ├── src/
    └── package.json
```

---

## ⚙️ Installation & Setup (Run Locally)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/san7499/food-del-pro.git
cd food-del-pro
```

---

## 🔹 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

## 🔹 Frontend Setup

Open new terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🔹 Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

---

## 🔐 Authentication Flow

1. User registers or logs in.
2. JWT token is generated.
3. Token is stored securely.
4. Protected routes verify authentication.
5. Only authorized users can access order features.

---

## 📦 API Overview

### User Routes
- POST `/api/user/register`
- POST `/api/user/login`

### Food Routes
- GET `/api/food/list`
- POST `/api/food/add`

### Order Routes
- POST `/api/order/place`
- GET `/api/order/userorders`

---

## 🌟 Key Learning Outcomes

- Built scalable RESTful APIs
- Implemented JWT-based authentication
- Managed MongoDB database relationships
- Structured full-stack project architecture
- Implemented file uploads using Multer
- Deployed production-ready MERN application

---

## 📸 Screenshots (Optional)

_Add screenshots of homepage, cart, login, admin dashboard._

---

## 👨‍💻 Author

**Sanket Khapake**  
Full Stack Developer (MERN) | Data Science & Machine Learning | Building Scalable & Data-Driven Applications  

🔗 LinkedIn: https://www.linkedin.com/in/sanket-khapake  
🐙 GitHub: https://github.com/san7499  
