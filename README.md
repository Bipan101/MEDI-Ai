# MEDI-AI🏥🤖

A comprehensive AI-powered medical analysis platform that enables users to scan and interpret medical documents, analyze medicines, and manage healthcare records with advanced AI capabilities.

## 🌟 Features

### For Patients
- **📄 Medical Report Analysis**: Upload and get AI-powered analysis of medical documents (blood tests, X-rays, MRI scans, etc.)
- **💊 Medicine Scanner**: Scan medicine packages to get detailed information, dosage, and safety warnings
- **📱 Custom AI Prompts**: Ask specific questions about your medical reports for personalized analysis
- **📋 Medical History**: Categorized view of past records and hospital uploads
- **🏥 Health Providers**: Find nearby healthcare facilities
- **📅 Appointment Booking**: Schedule consultations with doctors

### For Doctors
- **👨‍⚕️ Doctor Dashboard**: Comprehensive overview of patient requests and appointments
- **📋 Patient Appointment Requests**: Manage incoming patient consultation requests
- **👥 Active Patient List**: Track and manage current patients
- **📅 Appointments & Scheduling**: Organize and schedule patient appointments
- **🔍 Patient Medical Analysis**: Review patient-uploaded medical documents with AI insights

## 🛠️ Technology Stack

### Frontend
- **React 18** with modern hooks and functional components
- **Vite** for fast development and building
- **Tailwind CSS** for responsive and modern styling
- **Lucide React** for beautiful icons
- **React Router** for navigation

### Backend
- **Django 5.2.4** - Robust Python web framework
- **Django REST Framework** - API development
- **SQLite** database for development (PostgreSQL ready for production)
- **Google Gemini 2.0 Flash AI** - Advanced AI analysis
- **Python PIL** for image processing

### AI Integration
- **Google Generative AI (Gemini 2.0 Flash)** for medical document analysis
- **Custom prompt engineering** for medical-specific responses
- **Image analysis capabilities** for medical documents and medicine packages

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Google Gemini API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/Bipan101/MEDI-Ai.git
cd Project-Directory
```

### 2. Backend Setup (Django)
```bash
# Navigate to backend directory
cd medi_ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers python-dotenv google-generativeai pillow

# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

### 3. Frontend Setup (React + Vite)
```bash
# Navigate to frontend directory
cd frontend-medi-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Environment Configuration

Create a `.env` file in the `medi_ai` directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key
SECRET_KEY=your_django_secret_key
DEBUG=True
```

## 📖 API Documentation

### Medical Analysis Endpoints

#### Medicine Analysis
```http
POST /medi-ai/medicine-analyzer/
Content-Type: multipart/form-data

{
  "image": "medicine_image.jpg",
  "prompt": "Analyze this medicine and provide dosage information"
}
```

#### Medical Report Analysis
```http
POST /medi-ai/medical-report-analyzer/
Content-Type: multipart/form-data

{
  "image": "medical_report.pdf",
  "prompt": "Explain the blood test results and highlight any abnormal values"
}
```

### Response Format
```json
{
  "Response": "Detailed AI analysis of the medical document...",
  "status": "success",
  "confidence": 92
}
```

## 🏗️ Project Structure

```
MEDI-AI_Complete/
├── README.md
├── frontend-medi-ai/          # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── user/         # Patient pages
│   │   │   ├── doctor/       # Doctor pages
│   │   │   └── shared/       # Shared pages
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   └── data/             # Mock data
│   ├── package.json
│   └── vite.config.ts
├── medi_ai/                  # Django Backend
│   ├── backend/              # Main Django app
│   │   ├── views.py          # API endpoints
│   │   ├── models.py         # Database models
│   │   ├── serializer.py     # Data serializers
│   │   └── urls.py           # URL routing
│   ├── medi_ai/              # Django project settings
│   │   ├── settings.py       # Configuration
│   │   └── urls.py           # Main URL routing
│   ├── manage.py
│   └── .env                  # Environment variables
└── venv/                     # Python virtual environment
```

## 🔐 Authentication & Authorization

- **Role-based access control** (Patient/Doctor)
- **JWT token authentication** (ready for implementation)
- **Protected routes** for authenticated users
- **Role-specific navigation** and features

## 🎨 UI/UX Features

- **Responsive design** - Works on desktop, tablet, and mobile
- **Modern card-based layout** with Tailwind CSS
- **Interactive modals** for detailed views
- **Progress indicators** for file processing
- **Toast notifications** for user feedback
- **Loading states** for better UX

## 🧪 AI Analysis Capabilities

### Medical Document Analysis
- **Blood test reports** with normal/abnormal value identification
- **X-ray interpretation** with findings and recommendations
- **Prescription analysis** with medication details
- **Lab reports** with comprehensive explanations

### Medicine Analysis
- **Drug identification** from package images
- **Dosage information** and administration guidelines
- **Side effects** and contraindications
- **Expiry date** and storage instructions

## 📊 Key Components

### Frontend Components
- **MedicineScanner** - AI-powered medicine analysis
- **ScanInterpreter** - Medical document analysis
- **DoctorDashboard** - Doctor interface with patient management
- **HistoryPage** - Categorized medical history
- **ProtectedRoute** - Route protection based on user roles

### Backend APIs
- **Medicine_Analyzer** - Processes medicine images with Gemini AI
- **Medical_Report_Analyzer** - Analyzes medical documents
- **CORS configuration** - Frontend-backend communication
- **REST Framework** - Standardized API responses

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Deployment
```bash
# Collect static files
python manage.py collectstatic

# Set environment variables for production
export DEBUG=False
export ALLOWED_HOSTS=your-domain.com

# Use production WSGI server
gunicorn medi_ai.wsgi:application
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Medical Disclaimer

**Important**: This AI-powered analysis is for educational and informational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns and decisions.

## 🔮 Future Enhancements

- [ ] **Real-time chat** with healthcare providers
- [ ] **Appointment reminders** and notifications
- [ ] **Health metrics tracking** and visualization
- [ ] **Integration with wearable devices**
- [ ] **Multi-language support**
- [ ] **Telemedicine video calls**
- [ ] **Advanced AI models** for specialized medical analysis
- [ ] **Mobile app development** (React Native)

## 📞 Support

For support, email [support@medi-ai.com](mailto:support@medi-ai.com) or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced medical analysis capabilities
- **React & Django communities** for excellent documentation and support
- **Tailwind CSS** for beautiful and responsive styling
- **Lucide React** for comprehensive icon library

---

**Built with ❤️ for better healthcare accessibility**
