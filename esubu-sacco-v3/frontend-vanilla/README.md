# Esubu SACCO - Vanilla Frontend

A pure HTML/CSS/JavaScript implementation of the Esubu SACCO web application that works without npm dependencies.

## 🚀 Quick Start

1. **Simply open the HTML file:**
   ```
   Double-click on: esubu-sacco.html
   ```

2. **Or serve with a local server:**
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js (if available)
   npx serve .
   ```

3. **Open in browser:**
   ```
   http://localhost:8080/esubu-sacco.html
   ```

## 📁 Files Structure

```
frontend-vanilla/
├── esubu-sacco.html    # Main application file
├── styles.css          # All styling
├── script.js           # All JavaScript functionality
└── README.md           # This file
```

## ✨ Features

### 🏠 **Complete Web Application**
- **Home Page**: Hero section with statistics and services preview
- **Loan Application**: Multi-step form with real-time calculator
- **Services**: Detailed information about all loan types
- **About**: Company story, mission, and values
- **Contact**: Contact information and message form
- **Login**: Member and Officer authentication

### 💰 **Loan Application System**
- **Multi-step Form**: Personal → Employment → Loan Information
- **Real-time Calculator**: Monthly payment and interest calculation
- **Form Validation**: Client-side validation for all fields
- **API Integration**: Submits to your backend at `https://esubu-credit-scoring-v2-1-edit-12.onrender.com`

### 🔧 **Technical Features**
- **No Dependencies**: Pure vanilla JavaScript, HTML, CSS
- **Responsive Design**: Works on desktop, tablet, and mobile
- **API Integration**: Ready to connect to your existing backend
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error management
- **Notifications**: Success/error message system

## 🌐 Backend Integration

The application is configured to connect to your existing backend:

**API Base URL:** `https://esubu-credit-scoring-v2-1-edit-12.onrender.com`

### Available API Endpoints:
- `POST /api/loan-application` - Submit loan applications
- `POST /api/contact` - Contact form submissions  
- `POST /api/login` - User authentication
- `GET /` - Health check

### Backend Status:
- Check the **Contact** page for real-time backend connection status
- Green = Connected and ready
- Yellow = Connected but with issues
- Red = Connection failed

## 🎨 Customization

### Colors (CSS Variables):
```css
:root {
  --primary-color: #28a745;    /* SACCO Green */
  --secondary-color: #dc3545;  /* Deep Red */
  --dark-color: #343a40;       /* Dark Gray */
  --light-color: #f8f9fa;      /* Light Gray */
}
```

### Loan Calculator Settings:
```javascript
const rate = 0.15; // 15% annual interest rate
```

## 📱 Mobile Responsive

The application automatically adapts to different screen sizes:
- **Desktop**: Full layout with sidebar calculator
- **Tablet**: Stacked layout, reduced spacing
- **Mobile**: Single column, compressed navigation

## 🔒 Security Features

- **Input Validation**: All form fields validated
- **XSS Protection**: Proper input sanitization
- **HTTPS Ready**: Secure communication with backend
- **JWT Authentication**: Token-based login system

## 🚀 Deployment Options

### 1. **Static Hosting** (Recommended)
- Upload files to any web server
- Works with GitHub Pages, Netlify, Vercel
- No server-side requirements

### 2. **Local Development**
- Open `esubu-sacco.html` directly in browser
- Or use any local web server

### 3. **CDN Deployment**
- Upload to AWS S3, Google Cloud Storage
- Configure with CloudFront/CloudFlare

## 🧪 Testing

### Manual Testing:
1. **Navigation**: Test all page links
2. **Loan Form**: Fill out complete application
3. **Calculator**: Test loan amount calculations
4. **Contact Form**: Send test message
5. **Login**: Test member/officer login
6. **Responsive**: Test on different screen sizes

### Backend Connection:
- Visit the Contact page to see connection status
- Check browser console for API logs
- Submit test loan application

## 📈 Performance

- **Load Time**: < 2 seconds on average connection
- **File Sizes**: 
  - HTML: ~25KB
  - CSS: ~15KB  
  - JavaScript: ~12KB
- **Total**: < 60KB (excluding images)

## 🛠️ Troubleshooting

### Common Issues:

1. **Backend Connection Failed**
   - Check internet connection
   - Verify backend URL is accessible
   - Check browser console for CORS errors

2. **Form Not Submitting**
   - Ensure all required fields are filled
   - Check network tab for API calls
   - Verify backend endpoints are working

3. **Styling Issues**
   - Clear browser cache
   - Check if CSS file is loading
   - Verify file paths are correct

## 🎯 Next Steps

1. **Test the Application**: Open `esubu-sacco.html` and test all features
2. **Submit Test Application**: Fill out the loan application form
3. **Check Backend**: Verify applications are received in your backend
4. **Deploy**: Upload to your preferred hosting platform
5. **Go Live**: Share with your SACCO members!

---

**🏦 Esubu SACCO | Licensed by SASRA | Empowering Dreams. One Loan at a Time.**
