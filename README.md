# 💼 Job Portal MERN Stack App

A full-stack Job Portal web application that connects **job seekers** with **employers**. Built using the **MERN stack (MongoDB, Express.js, React, Node.js)** with **JWT authentication**, **role-based access**, **Zustand**, and modern UI dashboards.

---

## ✨ Features

### 🧑‍💼 Employer:
- Post new job listings
- View all applications for their jobs
- Accept/Reject applications
- Dashboard with job stats and analytics
- Edit/Delete their own job posts

### 🙋‍♂️ Job Seeker:
- Browse all job listings
- Apply to jobs with cover letter and resume
- View application history and status
- Dashboard with application activity over time

### 🌐 General:
- JWT-based secure login/signup
- Role-based access control (Employer vs Job Seeker)
- Fully responsive UI (React + Tailwind CSS)
- Dark mode support
- Charts (Bar, Pie, Line) using Recharts

---

## 📁 Project Structure

intern-stack/
├── project/# React + Zustand + Tailwind CSS + React Router
│
│── server/ # Node.js + Express + MongoDB + Mongoose


---

## ⚙️ Tech Stack

| Frontend     | Backend         | Database | Other Tools     |
|--------------|-----------------|----------|-----------------|
| React        | Node.js         | MongoDB  | Zustand         |
| Tailwind CSS | Express.js      | Mongoose | Recharts        |
| React Router | JWT Auth        |          | React Hook Form |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone (https://github.com/anandhakrishnan13/jobportal)
cd job-portal/
2. Install dependencies
🔧 Backend
cd backend
npm install
🎨 Frontend
cd ../frontend
npm install
3. Environment Variables
🔐 Backend .env
Create a .env file in backend/:
PORT=5000
MONGO_URI=mongodb+srv://database:password@cluster.h9rx086.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager
JWT_SECRET=yourSuperSecureSecret
4. Run the App
⬅️ Backend (port 5000)
cd Server
npm run dev
➡️ Frontend (port 3000)
cd project
npm run dev
🌍 Deployment
Frontend:Vercel
https://jobportal-pi-hazel.vercel.app/
Backend: Render
https://jobportal-480g.onrender.com/

