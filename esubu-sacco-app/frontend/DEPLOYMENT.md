# Esubu SACCO Frontend - Render Deployment Guide

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub repository with the Esubu SACCO application
- Render account (free tier available)

### Step 1: Fork/Clone Repository
Make sure your code is pushed to GitHub at:
`https://github.com/subu53/esubu_credit_scoring_v2`

### Step 2: Deploy to Render

1. **Visit Render Dashboard**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub

2. **Create New Static Site**
   - Click "New +" button
   - Select "Static Site"
   - Connect your GitHub repository
   - Select `esubu_credit_scoring_v2` repository

3. **Configure Deployment**
   - **Name**: `esubu-sacco-frontend`
   - **Root Directory**: `esubu-sacco-app/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. **Environment Variables**
   Add these environment variables in Render dashboard:
   ```
   NODE_VERSION=18
   REACT_APP_API_URL=https://esubu-sacco-backend.onrender.com
   GENERATE_SOURCEMAP=false
   CI=false
   ```

5. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy
   - Deployment URL will be: `https://esubu-sacco-frontend.onrender.com`

### Step 3: Backend Deployment (Optional)
If you want to deploy the backend as well:

1. **Create Web Service**
   - New + → Web Service
   - Same repository
   - **Root Directory**: `esubu-sacco-app/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python run_server.py`

2. **Environment Variables for Backend**
   ```
   PYTHON_VERSION=3.9
   DATABASE_URL=sqlite:///./esubu_sacco.db
   SECRET_KEY=your-production-secret-key
   ```

### Step 4: Custom Domain (Optional)
- In Render dashboard → Settings → Custom Domains
- Add your domain: `www.esubusacco.co.ke`
- Update DNS records as instructed

## 🔧 Production Optimizations

### Performance
- ✅ Static site generation
- ✅ Automatic GZIP compression
- ✅ CDN distribution
- ✅ HTTP/2 support

### Security
- ✅ HTTPS by default
- ✅ Security headers
- ✅ Environment variable protection

### Monitoring
- View logs in Render dashboard
- Monitor deployment status
- Automatic health checks

## 🌍 Live URLs

### Frontend
- **Production**: https://esubu-sacco-frontend.onrender.com
- **API Documentation**: https://esubu-sacco-backend.onrender.com/docs

### Demo Credentials
- **Admin**: admin@esubusacco.co.ke / admin123
- **Officer**: officer@esubusacco.co.ke / officer123

## 🔄 Continuous Deployment

Render automatically deploys when you push to the main branch:

1. Make changes to your code
2. Commit and push to GitHub
3. Render automatically rebuilds and deploys
4. New version is live in ~2-3 minutes

## 🐛 Troubleshooting

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Render dashboard

### Runtime Issues
- Check environment variables are set correctly
- Verify API URLs are accessible
- Check browser console for errors

### Performance Issues
- Enable caching headers
- Optimize images and assets
- Use React.memo for expensive components

## 📞 Support

For deployment issues:
- Render Documentation: https://docs.render.com
- GitHub Issues: Create issue in repository
- Email: info@esubusacco.co.ke

---

**🎉 Your Esubu SACCO application is now live and empowering dreams globally!**
