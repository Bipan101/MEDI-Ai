import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, Stethoscope } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { Button, Input, Card, CardContent, Toast, ToastContainer } from '../../components/ui';
import { validateEmail, validatePhone } from '../../utils/helpers';
import { APP_NAME } from '../../utils/constants';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

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
      await signup({ ...data, role: selectedRole });
      
      addToast({
        type: 'success',
        title: 'Account Created',
        message: 'Welcome to Medi-AI! Your account has been created successfully.',
      });
      
      // Redirect to dashboard based on role
      const redirectPath = selectedRole === 'doctor' ? '/doctor/dashboard' : '/dashboard';
      navigate(redirectPath, { replace: true });
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Signup Failed',
        message: error instanceof Error ? error.message : 'Failed to create account',
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
            Create your account to get started with AI-powered healthcare.
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

        {/* Signup Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                leftIcon={<User className="h-5 w-5" />}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Name must not exceed 50 characters',
                  },
                })}
              />

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

              {/* Phone Field */}
              <Input
                type="tel"
                label="Phone Number (Optional)"
                placeholder="+977-9801234567"
                leftIcon={<Phone className="h-5 w-5" />}
                error={errors.phone?.message}
                {...register('phone', {
                  validate: (value) => !value || validatePhone(value) || 'Please enter a valid phone number',
                })}
              />

              {/* Password Field */}
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Create a strong password"
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
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                  },
                })}
              />

              {/* Confirm Password Field */}
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />

              {/* Terms and Conditions */}
              <div className="text-sm text-gray-600">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
                .
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Medical Disclaimer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            This platform is for educational purposes and should not replace professional medical advice.
            Always consult with qualified healthcare professionals for medical decisions.
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default SignupPage;
