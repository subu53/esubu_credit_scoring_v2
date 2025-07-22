# Esubu SACCO Management System

**Empowering Dreams. One Loan at a Time.**

A comprehensive web application for Esubu SACCO - a deposit-taking SACCO licensed by SASRA in Kenya. This system provides both a public-facing website and a secure backend management system for loan officers and administrators.

## 🚀 Features

### 🔷 Frontend Website (Public User View)
- **Responsive Landing Page**: Modern, mobile-first design with SACCO trust colors
- **About Us Section**: Compelling story of Esubu SACCO's journey from 2015
- **Services Overview**: Loans, Deposits, and Member Benefits
- **Contact Information**: Email, phone, and location details
- **Public Loan Application**: Online application form for prospective members
- **Licensed by SASRA Badge**: Prominently displayed for trust and credibility

### 🔷 Backend System (Secure Login Required)

#### 👨‍💼 Loan Officer Dashboard
- **Application Management**: View and manage loan applications
- **Search & Filter**: Find applications by name, ID, or application number
- **Status Tracking**: Update application status (pending, under review, approved, rejected)
- **Internal Remarks**: Add comments and notes to applications
- **Dashboard Statistics**: Overview of pending, approved, and rejected applications
- **Walk-in Support**: Submit applications on behalf of walk-in clients

#### 🛠️ Admin Dashboard
- **Complete System Oversight**: Full visibility over all operations
- **User Management**: Create, edit, and deactivate loan officers
- **Decision Override**: Override system decisions with reasons
- **Advanced Reporting**: Export data to CSV for analysis
- **System Statistics**: Comprehensive metrics and performance data
- **Role-Based Access Control**: Secure separation of admin and officer functions

## 🏗️ Technical Architecture

### Backend (FastAPI)
- **FastAPI Framework**: Modern, fast Python web framework
- **SQLAlchemy ORM**: Database management with SQLite
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and Officer roles
- **Automatic API Documentation**: Generated with OpenAPI/Swagger
- **Credit Scoring Algorithm**: Built-in loan evaluation system

### Frontend (React TypeScript)
- **React 18**: Modern React with TypeScript
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Context API**: Global state management
- **CSS Grid/Flexbox**: Responsive layout system
- **Custom Design System**: SACCO brand colors and components

### Key Technologies
- **Python 3.8+**: Backend development
- **Node.js 16+**: Frontend build tools
- **SQLite**: Database (easily upgradeable to PostgreSQL)
- **TypeScript**: Type-safe frontend development
- **JWT**: Secure authentication
- **RESTful API**: Clean API design

## 📖 Esubu SACCO Story

Esubu SACCO was founded in 2015 by three childhood friends from Bungoma County. With humble beginnings as a community table-banking group in a small rural market, the founders saw firsthand how limited access to credit was holding back farmers, boda boda riders, mama mbogas, and teachers.

Their mission was simple: create a safe, transparent, and member-owned SACCO that empowers low- and medium-income earners to save consistently and access loans fairly.

Since then, Esubu SACCO has grown into a fully licensed deposit-taking SACCO under SASRA, now serving over 8,000 members across Kenya, both online and in-person. We still honor our roots — we know our members by name, and we design systems that serve real Kenyan lives.

## 🚦 Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database**
   ```bash
   python init_db.py
   ```

5. **Start the backend server**
   ```bash
   python -m app.main
   # or
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🔐 Default Login Credentials

### Admin User
- **Email**: admin@esubusacco.co.ke
- **Password**: admin123

### Loan Officer
- **Email**: officer@esubusacco.co.ke
- **Password**: officer123

**⚠️ Important**: Change these credentials in production!

## 📊 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

## 🏢 System Features

### Loan Application Processing
1. **Public Application**: Anyone can apply through the website
2. **Automatic Credit Scoring**: Built-in algorithm evaluates applications
3. **Officer Review**: Loan officers can review and add remarks
4. **Status Management**: Track applications through the approval process
5. **Admin Oversight**: Administrators can override system decisions

### User Management
- **Role-Based Access**: Officers and Admins have different permissions
- **Secure Authentication**: JWT tokens with automatic expiration
- **User Creation**: Admins can create new officer accounts
- **Activity Tracking**: Monitor user actions and login history

### Reporting & Analytics
- **CSV Export**: Download application data for analysis
- **Dashboard Statistics**: Real-time metrics and KPIs
- **Search & Filter**: Advanced application search capabilities
- **Audit Trail**: Track all system activities

## 🎨 Design System

### Brand Colors
- **Primary Green**: #2d8f47 (SACCO trust and growth)
- **Primary Red**: #8B0000 (Licensed by SASRA badge)
- **Light Green**: #4CAF50 (Success states)
- **Gray Palette**: #f8f9fa to #343a40 (UI elements)

### Typography
- **Primary Font**: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Headings**: Weighted hierarchy with green accent
- **Body Text**: Optimized for readability

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layouts
- **Mobile**: Touch-friendly interface

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access Control**: Granular permissions
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: SQLAlchemy ORM prevents injection attacks

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Update all credentials and secrets
2. **Database**: Consider upgrading to PostgreSQL for production
3. **HTTPS**: Enable SSL/TLS for secure communication
4. **File Storage**: Implement proper file upload handling
5. **Monitoring**: Add logging and monitoring solutions
6. **Backup**: Implement database backup strategies

### Docker Deployment (Coming Soon)
Docker configurations will be added for easy deployment.

## 🧪 Testing

The codebase is designed to be easily testable:
- **Backend**: Unit tests with pytest
- **Frontend**: Component tests with Jest and React Testing Library
- **API Tests**: Automated API testing with FastAPI TestClient

## 📈 Future Enhancements

- **Mobile App**: React Native mobile application
- **SMS Integration**: SMS notifications for application updates
- **Document Upload**: Support for uploading identification documents
- **Payment Integration**: M-Pesa and bank integration
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Swahili and other local languages

## 👥 Contributing

This project is designed for extensibility and maintenance:

1. **Code Structure**: Well-organized, modular architecture
2. **Documentation**: Comprehensive inline documentation
3. **Type Safety**: TypeScript for frontend reliability
4. **API Standards**: RESTful API design principles
5. **Error Handling**: Comprehensive error management

## 📞 Support

For technical support or questions about Esubu SACCO:

- **Email**: info@esubusacco.co.ke
- **Phone**: +254-700-123-456
- **Location**: Bungoma County, Kenya

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏛️ Regulatory Compliance

Esubu SACCO is licensed by SASRA (Sacco Societies Regulatory Authority) and complies with all relevant Kenyan financial regulations.

---

**Built with ❤️ for the Kenyan financial inclusion community**

*Esubu SACCO - Empowering Dreams. One Loan at a Time.*
