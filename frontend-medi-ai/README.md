# MEDI-AI Frontend

An intelligent healthcare companion application that leverages AI to provide medical assistance, document analysis, and healthcare management tools for both patients and healthcare professionals.

## 🚀 Features

### For Patients
- **Medical Scan Interpreter**: Upload and analyze medical reports with AI-powered insights
- **Medicine Scanner**: Scan medicine packaging for detailed drug information and interactions
- **Symptom Checker**: Interactive AI assistant for symptom analysis and health guidance
- **Health Providers**: Find nearby healthcare facilities and services
- **Health Dashboard**: Track health metrics and view recent activity
- **Medical History**: Comprehensive view of past scans, consultations, and reports

### For Healthcare Professionals
- **Doctor Dashboard**: Comprehensive overview of patient requests and performance metrics
- **Patient Request Management**: Handle consultation requests, prescription refills, and report reviews
- **Medical Analysis Tools**: Access to advanced AI-powered diagnostic assistance
- **Performance Analytics**: Track patient satisfaction, response times, and case resolution rates

### Core Features
- **Role-based Authentication**: Separate interfaces for patients and healthcare professionals
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live notifications and status updates
- **Secure Document Handling**: Safe upload and processing of medical documents
- **Multi-language Support**: Internationalization ready

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 5.4.19
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.7.1
- **Form Handling**: React Hook Form 7.61.1
- **Icons**: Lucide React 0.525.0
- **State Management**: React Context API
- **Code Quality**: ESLint + TypeScript ESLint

## 📁 Project Structure

```
src/
├── auth/                 # Authentication context and logic
├── components/
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   └── ui/              # Reusable UI components
├── data/                # Mock data and constants
├── hooks/               # Custom React hooks
├── pages/
│   ├── auth/           # Authentication pages
│   ├── doctor/         # Doctor-specific pages
│   ├── shared/         # Shared pages (Profile, Settings)
│   └── user/           # Patient-specific pages
├── routes/             # Routing configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and helpers
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-medi-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Build and Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, ready for deployment to any static hosting service.

### Preview Production Build
```bash
npm run preview
```

## 🎨 UI Components

The application uses a custom component library built with Tailwind CSS:

- **Card**: Versatile container component with medical theme variants
- **Button**: Multiple variants (primary, outline, ghost) with different sizes
- **Input**: Form input components with validation styling
- **Modal**: Overlay components for dialogs and confirmations
- **Progress**: Progress bars and loading indicators
- **Badge**: Status and category indicators
- **Toast**: Notification system for user feedback

## 🔐 Authentication & Authorization

The app implements role-based access control:

- **Patient Role**: Access to personal health tools and dashboards
- **Doctor Role**: Access to patient management and advanced analytics
- **Protected Routes**: Automatic redirection based on authentication status
- **Context-based State**: Centralized authentication state management

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Adaptive layouts** for different screen sizes
- **Touch-friendly interfaces** for mobile devices
- **Optimized performance** for various device types

## 🧪 Key Features Deep Dive

### Medical Scan Interpreter
- Upload various medical document types
- AI-powered analysis and interpretation
- Detailed explanations in plain language
- Historical tracking of analyzed documents

### Medicine Scanner
- Camera integration for medicine packaging
- Comprehensive drug database lookup
- Drug interaction warnings
- Dosage and administration information

### Symptom Checker
- Interactive chat-based interface
- AI-driven symptom analysis
- Preliminary health assessments
- Recommendations for further action

## 📈 Performance & Optimization

- **Code splitting** with React lazy loading
- **Optimized bundle size** with Vite's tree-shaking
- **Efficient re-renders** with React hooks optimization
- **Image optimization** for medical documents and scans

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@medi-ai.com or join our Slack channel.

## 🔄 Version History

- **v0.0.0** - Initial development version with core features
  - Patient and Doctor dashboards
  - Medical scan interpretation
  - Medicine scanner functionality
  - Symptom checker AI assistant
  - Authentication and role management
