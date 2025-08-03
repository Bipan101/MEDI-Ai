# MEDI-AI Medicine Scanner Integration Guide

## 🚀 Quick Start

### Backend Setup (Django + Gemini AI)

1. **Navigate to backend directory:**
   ```bash
   cd e:\MEDI-AI_Complete\medi_ai
   ```

2. **Install dependencies (if not already done):**
   ```bash
   pip install django djangorestframework django-cors-headers pillow google-generativeai python-dotenv cloudinary
   ```

3. **Set up environment variables:**
   Create `.env` file in `medi_ai` directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start Django server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React + Vite)

1. **Navigate to frontend directory:**
   ```bash
   cd e:\MEDI-AI_Complete\frontend-medi-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🧪 Testing the Medicine Scanner

### Method 1: Using the Web Interface

1. Open the frontend at `http://localhost:5173`
2. Navigate to "Medicine Scanner" page
3. Upload an image or take a photo of a medicine
4. Click "Scan Medicine"
5. Wait for AI analysis (15-30 seconds)
6. Review the detailed medicine information

### Method 2: API Testing (Developer)

1. Open browser console on the frontend
2. Run the test suite:
   ```javascript
   // Load the test file first (add to index.html or import in component)
   import './src/utils/apiTests.js';
   
   // Then run tests
   mediAiTests.runFullTest();
   ```

### Method 3: Direct API Testing

Test the medicine scanner endpoint directly:

```bash
curl -X POST http://localhost:8000/backend/medicine-scanner/ \
  -F "image=@path/to/your/medicine/image.jpg" \
  -H "Accept: application/json"
```

## 📋 What's Implemented

### ✅ Backend Features
- **MedicineScannerAPI**: Dedicated endpoint for medicine analysis
- **Gemini AI Integration**: Advanced AI vision for medicine recognition
- **CORS Configuration**: Allows frontend-backend communication
- **Error Handling**: Comprehensive error responses
- **File Validation**: Image type and size validation

### ✅ Frontend Features
- **File Upload**: Support for JPEG/PNG images up to 10MB
- **Camera Integration**: Take photos directly from device camera
- **Real-time Processing**: Live AI analysis with progress indicators
- **Detailed Results**: Comprehensive medicine information display
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on mobile and desktop

### ✅ AI Analysis Provides
- Medicine name and generic name
- Dosage and manufacturer information
- Medical uses and indications
- Side effects and precautions
- Drug interactions
- Price estimates (NPR)
- Prescription requirements
- Availability status

## 🛠️ API Endpoints

### Medicine Scanner
- **URL**: `POST /backend/medicine-scanner/`
- **Body**: `FormData` with `image` file
- **Response**: 
  ```json
  {
    "success": true,
    "medicine": {
      "name": "Medicine name",
      "genericName": "Active ingredient", 
      "dosage": "Strength",
      "manufacturer": "Company name",
      "category": "Medicine type",
      "description": "Brief description",
      "confidence": 85-99,
      "uses": ["indication1", "indication2"],
      "sideEffects": ["effect1", "effect2"],
      "precautions": ["warning1", "warning2"],
      "interactions": ["drug1", "drug2"],
      "price": {"min": 25, "max": 75, "currency": "NPR"},
      "availability": "available|limited|unavailable",
      "prescriptionRequired": true|false
    }
  }
  ```

## 🔧 Troubleshooting

### Backend Issues
- **Django server won't start**: Check if port 8000 is available
- **Gemini API errors**: Verify `GEMINI_API_KEY` in `.env` file
- **CORS errors**: Ensure `corsheaders` is installed and configured

### Frontend Issues
- **API connection failed**: Verify backend is running on port 8000
- **Camera not working**: Check browser permissions and HTTPS
- **File upload errors**: Ensure image is under 10MB and valid format

### Common Solutions
1. **Clear browser cache** and restart both servers
2. **Check console logs** for detailed error messages
3. **Verify environment variables** are properly set
4. **Test API directly** using curl or Postman

## 📱 Supported Features

### Image Sources
- File upload (JPEG, PNG)
- Camera capture (front/back camera)
- Drag & drop upload

### Medicine Information
- Prescription and OTC medicines
- Tablets, capsules, syrups
- Local and international brands
- Generic and branded medicines

### Browsers Supported
- Chrome (recommended)
- Firefox
- Safari
- Edge

## ⚠️ Important Notes

1. **Medical Disclaimer**: This tool is for educational purposes only. Always consult healthcare professionals.
2. **API Key Security**: Never expose Gemini API keys in frontend code.
3. **Image Quality**: Better quality images provide more accurate results.
4. **Internet Required**: AI analysis requires active internet connection.

## 🎯 Next Steps

Once you confirm the basic functionality works:

1. **Production Deployment**: Configure for production environment
2. **Database Integration**: Store scan results and user history  
3. **User Authentication**: Add login/registration system
4. **Advanced Features**: Add medicine interaction checker
5. **Mobile App**: Consider React Native implementation

---

**Ready to test? Start both servers and try scanning a medicine!** 🚀
