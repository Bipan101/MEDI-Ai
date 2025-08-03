import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Save, User, Mail, Phone, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Card, CardHeader, CardContent, Badge, Toast, ToastContainer } from '../../components/ui';
import { validateEmail, validatePhone } from '../../utils/helpers';
import { languages } from '../../utils/languages';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      language: user?.language || 'en',
    },
  });

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.',
      });
      
      setIsEditing(false);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="primary">
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card variant="medical">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={user.avatar || `https://placehold.co/100x100/4ecdc4/ffffff?text=${user.name?.charAt(0) || 'U'}`}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {user.name}
              </h3>
              
              <Badge variant={user.role === 'doctor' ? 'info' : 'default'} className="mb-4">
                {user.role === 'doctor' ? 'Healthcare Provider' : 'Patient'}
              </Badge>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>{languages.find(lang => lang.code === user.language)?.name}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card variant="medical">
            <CardHeader title="Personal Information" />
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    leftIcon={<User className="h-4 w-4" />}
                    disabled={!isEditing}
                    error={errors.name?.message}
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    leftIcon={<Mail className="h-4 w-4" />}
                    disabled={!isEditing}
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Email is required',
                      validate: (value) => validateEmail(value) || 'Please enter a valid email',
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    leftIcon={<Phone className="h-4 w-4" />}
                    disabled={!isEditing}
                    error={errors.phone?.message}
                    {...register('phone', {
                      validate: (value) => !value || validatePhone(value) || 'Please enter a valid phone number',
                    })}
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      {...register('language')}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-4 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      leftIcon={<Save className="h-4 w-4" />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Statistics */}
      <Card variant="medical">
        <CardHeader title="Account Statistics" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">24</div>
              <div className="text-sm text-gray-600">Total Scans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600 mb-1">8</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Medicines Scanned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default ProfilePage;
