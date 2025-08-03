import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Stethoscope } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Card, CardContent, Toast, ToastContainer } from '../../components/ui';
import { validateEmail } from '../../utils/helpers';
import { APP_NAME } from '../../utils/constants';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addToast = (toast) => {
    const newToast = { ...toast, id: Date.now().toString(), onClose: removeToast };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      await login(data.email, data.password, selectedRole);
      
      addToast({
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back!`,
      });
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || (selectedRole === 'doctor' ? '/doctor/dashboard' : '/dashboard');
      navigate(from, { replace: true });
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: error instanceof Error ? error.message : 'Invalid credentials',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {APP_NAME}
          </h1>
          <p className="text-gray-600">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex space-x-4 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
              selectedRole === 'user'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="font-medium">Patient</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('doctor')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
              selectedRole === 'doctor'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Stethoscope className="h-5 w-5" />
            <span className="font-medium">Doctor</span>
          </button>
        </div>

        {/* Login Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  validate: (value) => validateEmail(value) || 'Please enter a valid email',
                })}
              />

              {/* Password Field */}
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />

              {/* Demo Credentials */}
              {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Patient:</strong> user@example.com / password123</p>
                  <p><strong>Doctor:</strong> doctor@example.com / password123</p>
                </div>
              </div> */}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Medical Disclaimer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            By signing in, you agree to our terms of service and privacy policy.
            This platform is for educational purposes and should not replace professional medical advice.
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default LoginPage;
