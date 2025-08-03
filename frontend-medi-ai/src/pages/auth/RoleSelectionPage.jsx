import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowRight } from 'lucide-react';
import { Card, CardContent, Button } from '../../components/ui';
import { APP_NAME } from '../../utils/constants';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate('/login', { state: { selectedRole: role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {APP_NAME}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started with AI-powered healthcare assistance
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Patient Card */}
          <Card 
            variant="medical" 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => handleRoleSelect('user')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                I'm a Patient
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get AI-powered health insights, scan medical reports, check symptoms, 
                and find local healthcare resources.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                  Scan and interpret medical reports
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                  Medicine information scanner
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                  AI-powered symptom checker
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                  Find local healthcare facilities
                </div>
              </div>
              
              <Button 
                variant="primary" 
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => handleRoleSelect('user')}
              >
                Continue as Patient
              </Button>
            </CardContent>
          </Card>

          {/* Doctor Card */}
          <Card 
            variant="medical" 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => handleRoleSelect('doctor')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-200 transition-colors">
                <Stethoscope className="h-10 w-10 text-secondary-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                I'm a Doctor
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access advanced diagnostic tools, manage patient requests, and provide 
                professional medical insights with AI assistance.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3" />
                  Manage patient consultation requests
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3" />
                  Advanced diagnostic tools
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3" />
                  AI-assisted medical analysis
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3" />
                  Professional dashboard
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => handleRoleSelect('doctor')}
              >
                Continue as Doctor
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            This platform is designed for educational purposes and should not replace professional medical advice. 
            Always consult with qualified healthcare professionals for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
