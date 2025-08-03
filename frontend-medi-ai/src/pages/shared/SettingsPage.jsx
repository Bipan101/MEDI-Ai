import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Input, Badge } from '../../components/ui';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Healthcare Settings
    measurementUnit: 'metric', // metric or imperial
    bloodSugarUnit: 'mg/dl', // mg/dl or mmol/l
    temperatureUnit: 'celsius', // celsius or fahrenheit
    medicalDisclaimer: true,
    shareHealthData: false,
    
    // Notification Settings
    appointmentReminders: true,
    medicationReminders: true,
    healthTips: true,
    emergencyAlerts: true,
    
    // Privacy Settings
    dataSharing: false,
    analyticsTracking: false,
    locationServices: true,
    
    // Accessibility Settings
    fontSize: 'medium', // small, medium, large
    highContrast: false,
    screenReader: false,
    
    // Language Settings
    language: 'english',
    
    // App Settings
    offlineMode: false,
    autoSync: true,
    cacheSize: '100MB'
  });

  const [activeTab, setActiveTab] = useState('healthcare');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderSwitch = (key, label, description) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <div className="ml-4">
        <button
          onClick={() => handleSettingChange(key, !settings[key])}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
            settings[key] ? 'bg-teal-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings[key] ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderSelect = (key, label, options, description) => (
    <div className="py-3 border-b border-gray-200 last:border-b-0">
      <label className="block">
        <div className="flex-1 mb-2">
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <select
          value={settings[key]}
          onChange={(e) => handleSettingChange(key, e.target.value)}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  const tabs = [
    { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'language', label: 'Language', icon: '🌐' },
    { id: 'app', label: 'App Settings', icon: '⚙️' }
  ];

  const measurementOptions = [
    { value: 'metric', label: 'Metric (kg, cm)' },
    { value: 'imperial', label: 'Imperial (lbs, ft)' }
  ];

  const bloodSugarOptions = [
    { value: 'mg/dl', label: 'mg/dL (US Standard)' },
    { value: 'mmol/l', label: 'mmol/L (International)' }
  ];

  const temperatureOptions = [
    { value: 'celsius', label: 'Celsius (°C)' },
    { value: 'fahrenheit', label: 'Fahrenheit (°F)' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'nepali', label: 'नेपाली (Nepali)' },
    { value: 'maithili', label: 'मैथिली (Maithili)' },
    { value: 'bhojpuri', label: 'भोजपुरी (Bhojpuri)' },
    { value: 'tamang', label: 'तामाङ (Tamang)' }
  ];

  const cacheSizeOptions = [
    { value: '50MB', label: '50 MB' },
    { value: '100MB', label: '100 MB' },
    { value: '200MB', label: '200 MB' },
    { value: '500MB', label: '500 MB' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'healthcare':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm font-medium">
                    ℹ️
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Medical Disclaimer</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    These settings help personalize your healthcare experience. Always consult with healthcare professionals for medical advice.
                  </p>
                </div>
              </div>
            </div>

            {renderSelect('measurementUnit', 'Measurement Units', measurementOptions, 'Choose your preferred unit system for weight and height')}
            {renderSelect('bloodSugarUnit', 'Blood Sugar Units', bloodSugarOptions, 'Select blood glucose measurement units')}
            {renderSelect('temperatureUnit', 'Temperature Units', temperatureOptions, 'Choose temperature measurement scale')}
            {renderSwitch('medicalDisclaimer', 'Show Medical Disclaimers', 'Display medical disclaimers for AI-generated content')}
            {renderSwitch('shareHealthData', 'Share Anonymized Health Data', 'Help improve healthcare AI by sharing anonymized data')}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            {renderSwitch('appointmentReminders', 'Appointment Reminders', 'Get notified about upcoming medical appointments')}
            {renderSwitch('medicationReminders', 'Medication Reminders', 'Receive alerts for medication schedules')}
            {renderSwitch('healthTips', 'Health Tips', 'Get daily health tips and wellness advice')}
            {renderSwitch('emergencyAlerts', 'Emergency Alerts', 'Receive critical health-related notifications')}
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-amber-600 rounded-full text-white text-sm font-medium">
                    🔒
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Privacy Protection</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    We prioritize your privacy. Your health data is encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>

            {renderSwitch('dataSharing', 'Data Sharing with Partners', 'Allow sharing data with trusted healthcare partners')}
            {renderSwitch('analyticsTracking', 'Analytics Tracking', 'Help us improve the app by tracking usage analytics')}
            {renderSwitch('locationServices', 'Location Services', 'Enable location for nearby healthcare facilities')}
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-4">
            {renderSelect('fontSize', 'Font Size', fontSizeOptions, 'Adjust text size for better readability')}
            {renderSwitch('highContrast', 'High Contrast Mode', 'Increase contrast for better visibility')}
            {renderSwitch('screenReader', 'Screen Reader Support', 'Optimize app for screen reader compatibility')}
          </div>
        );

      case 'language':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full text-white text-sm font-medium">
                    🌐
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Multi-Language Support</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Choose your preferred language for the best experience.
                  </p>
                </div>
              </div>
            </div>

            {renderSelect('language', 'Interface Language', languageOptions, 'Select your preferred language for the app interface')}
          </div>
        );

      case 'app':
        return (
          <div className="space-y-4">
            {renderSwitch('offlineMode', 'Offline Mode', 'Enable offline functionality for core features')}
            {renderSwitch('autoSync', 'Auto Sync', 'Automatically sync data when connected to internet')}
            {renderSelect('cacheSize', 'Cache Storage Limit', cacheSizeOptions, 'Set maximum storage for offline data')}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/localStorage
    console.log('Saving settings:', settings);
    
    // Show success message (you could integrate with toast system)
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        measurementUnit: 'metric',
        bloodSugarUnit: 'mg/dl',
        temperatureUnit: 'celsius',
        medicalDisclaimer: true,
        shareHealthData: false,
        appointmentReminders: true,
        medicationReminders: true,
        healthTips: true,
        emergencyAlerts: true,
        dataSharing: false,
        analyticsTracking: false,
        locationServices: true,
        fontSize: 'medium',
        highContrast: false,
        screenReader: false,
        language: 'english',
        offlineMode: false,
        autoSync: true,
        cacheSize: '100MB'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Settings</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            className="w-full sm:w-auto"
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSaveSettings}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700"
          >
            Save Settings
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <Card variant="medical">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-teal-100 text-teal-700 border border-teal-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <Card variant="medical">
            <CardHeader title={tabs.find(tab => tab.id === activeTab)?.label || 'Settings'} />
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Summary */}
      <Card variant="medical">
        <CardHeader title="Settings Summary" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Language</span>
              <Badge variant="outline">
                {languageOptions.find(lang => lang.value === settings.language)?.label || 'English'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Units</span>
              <Badge variant="outline">
                {settings.measurementUnit === 'metric' ? 'Metric' : 'Imperial'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Offline Mode</span>
              <Badge variant={settings.offlineMode ? 'success' : 'outline'}>
                {settings.offlineMode ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;