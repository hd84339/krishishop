# 🌱 KrishiShop — Agriculture E-Commerce Platform

A production-ready MERN stack e-commerce platform for Indian farmers to buy Khad (fertilizers), Beej (seeds), Kitnashak (pesticides), Farming Tools, and more.

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite, Tailwind CSS, GSAP |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Google OAuth 2.0 |
| Images | Cloudinary |
| State | TanStack Query + Context API |

---

## 📁 Project Structure

```
agri-shop-platform/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── animations/         # GSAP animation utilities
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── ProductCard/
│   │   │   ├── Loader/
│   │   │   ├── Button/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # React Context (Auth)
│   │   ├── pages/              # Page components
│   │   │   ├── Home/
│   │   │   ├── Products/
│   │   │   ├── ProductDetails/
│   │   │   ├── Login/
│   │   │   ├── AdminDashboard/
│   │   │   ├── AddProduct/     # Shared Add/Edit form
│   │   │   └── AuthCallback.jsx
│   │   ├── services/           # Axios API layer
│   │   └── utils/              # Helpers & constants
│   └── package.json
│
└── server/                     # Express Backend
    ├── config/db.js
    ├── controllers/
    │   ├── authController.js
    │   └── productController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── adminMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Product.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── productRoutes.js
    ├── utils/jwt.js
    └── server.js
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Google Cloud Console account (for OAuth)

---

### Step 1: Clone & Install

```bash
# Clone the repo
git clone <your-repo-url>
cd agri-shop-platform

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Step 2: Configure Environment Variables

**Server** — copy `.env.example` to `.env`:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/krishishop

JWT_SECRET=your_32_char_min_secret_key_here
JWT_EXPIRE=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=hd84339@gmail.com
ADMIN_PASSWORD=admin123
```

**Client** — copy `.env.example` to `.env`:

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

### Step 3: Set Up External Services

#### MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Free cluster
2. Create a database user with read/write permissions
3. Add your IP to Network Access (or allow all: `0.0.0.0/0`)
4. Copy connection string → paste into `MONGO_URI`

#### Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com) → Free account
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Paste into `CLOUDINARY_*` variables

#### Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. New Project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Secret → paste into env

---

### Step 4: Run the Application

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

---

## 🔐 Admin Access

The admin user is automatically seeded when the server starts:

| Field | Value |
|-------|-------|
| Email | hd84339@gmail.com |
| Password | admin123 |

Admin can: Add, Edit, Delete products, Upload images, Mark featured products.

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login with email/password
GET    /api/auth/me              Get current user (Protected)
GET    /api/auth/google          Initiate Google OAuth
GET    /api/auth/google/callback Google OAuth callback
```

### Products
```
GET    /api/products             Get all products (supports ?category, ?search, ?page, ?limit, ?featured)
GET    /api/products/:id         Get single product
POST   /api/products             Create product (Admin only, multipart/form-data)
PUT    /api/products/:id         Update product (Admin only, multipart/form-data)
DELETE /api/products/:id         Delete product (Admin only)
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client
npm run build

# Deploy to Vercel
npx vercel --prod
```

Add environment variable in Vercel:
- `VITE_API_URL` = `https://your-backend-url.render.com/api`

### Backend → Render
1. Connect GitHub repo to Render
2. Create new **Web Service**
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add all env variables from `server/.env`

### Update CORS & OAuth URLs
After deploying, update:
- `CLIENT_URL` in server env to your Vercel URL
- `GOOGLE_CALLBACK_URL` to your Render URL + `/api/auth/google/callback`
- Add the new callback URL in Google Cloud Console

---

## ✨ Features

- 🛒 Browse & search products by category
- 🔐 Email/Password + Google OAuth login
- 👨‍💼 Admin dashboard with product CRUD
- 📸 Image upload via Cloudinary
- 🎨 GSAP animations (hero, scroll reveal, stagger)
- 📱 Mobile-first responsive design
- 🌙 Dark theme with organic green palette
- ⚡ Skeleton loading states
- 🔔 Toast notifications
- 🔒 JWT authentication with role-based access

---

## 🎨 Design Philosophy

Inspired by Apple's minimal aesthetic but adapted for agriculture:
- **Dark organic palette**: Deep forest greens + earth tones
- **Typography**: Playfair Display (display) + DM Sans (body)
- **Animations**: GSAP hero entrance, scroll-triggered reveals, stagger effects
- **Cards**: Glassmorphism with subtle borders and hover lifts
- **Spacing**: Generous whitespace with intentional density in data tables

# krishishop
