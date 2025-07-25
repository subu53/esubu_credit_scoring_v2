# Esubu SACCO Web Application

A comprehensive web application for Esubu SACCO - a deposit-taking SACCO licensed by SASRA in Kenya.

## 🏦 About Esubu SACCO

**Tagline:** "Empowering Dreams. One Loan at a Time."

Esubu SACCO was founded in 2015 by three childhood friends from Bungoma County. With humble beginnings as a community table-banking group in a small rural market, the founders saw firsthand how limited access to credit was holding back farmers, boda boda riders, mama mbogas, and teachers.

Since then, Esubu SACCO has grown into a fully licensed deposit-taking SACCO under SASRA, now serving over 8,000 members across Kenya.

## 🌟 Features

### 🔷 Frontend Website (Public)
- **Home Page**: Compelling story, mission & vision
- **Services**: Loans, deposits, member benefits
- **Responsive Design**: Mobile-first approach
- **SACCO Colors**: Green and Deep Red theme
- **SASRA Licensed Badge**: Visible trust indicator
- **Contact Section**: Email, phone, map integration

### 🔷 Backend System (Secure)
- **Loan Officer Dashboard**: View applications, add remarks
- **Admin Dashboard**: Full system management
- **Credit Scoring Integration**: AI-powered loan decisions
- **Role-based Access Control**: Admin, Officer, Public access

## 🚀 Technology Stack

- **Frontend**: React.js with modern UI components
- **Backend**: FastAPI with secure authentication
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT-based secure login
- **Deployment**: Docker-ready with Render support

## 📁 Project Structure

```
esubu-sacco-v3/
├── frontend/           # React.js public website
├── backend/           # FastAPI application
├── shared/           # Shared utilities and models
├── database/         # Database schemas and migrations
└── docs/            # Documentation
```

## 🔧 Development Setup

### Quick Start (Windows)
```powershell
# Run the automated setup script
.\setup.ps1
```

### Manual Setup

1. **Setup Backend Connection**
   - Backend API: `https://esubu-credit-scoring-v2-1-edit-12.onrender.com`
   - Environment variables configured in `.env`
   - API service ready for loan applications, authentication, and data storage

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Test Backend Integration**
   ```javascript
   // Open browser console and run:
   import { runBackendTests } from './src/utils/backendTest.js';
   runBackendTests();
   ```

## 🌐 Live Application

- **Frontend**: http://localhost:3000 (Development) 
- **Backend API**: https://esubu-credit-scoring-v2-1-edit-12.onrender.com
- **Credit Scoring**: AI-powered loan decisions integrated
- **Data Storage**: Applications stored in backend database

## 🔗 API Integration

### Available Endpoints
- `POST /api/loan-application` - Submit new loan applications
- `GET /api/loan-applications` - Retrieve all applications (officers)
- `POST /api/login` - Member/Officer authentication
- `POST /api/contact` - Contact form submissions
- `POST /api/loan-calculator` - Loan calculation API

### Authentication
- JWT-based authentication system
- Role-based access (Member, Officer, Admin)
- Automatic token management in frontend

## 📊 System Features

### Public Features
- ✅ Landing page with SACCO story
- ✅ Loan application form
- ✅ Member registration
- ✅ Contact information
- ✅ Services overview

### Officer Features
- ✅ View loan applications
- ✅ Add internal remarks
- ✅ Submit applications for walk-ins
- ✅ Dashboard statistics

### Admin Features
- ✅ Manage loan officers
- ✅ Override application decisions
- ✅ Generate reports (CSV/PDF)
- ✅ System activity logs
- ✅ User impersonation for support

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing
- Rate limiting for login attempts
- HTTPS enforcement

---

**© 2025 Esubu SACCO | Licensed by SASRA | All rights reserved**
