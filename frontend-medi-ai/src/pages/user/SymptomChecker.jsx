import React, { useState } from 'react';
import { AlertCircle, Search, Plus, X, Activity, Heart, Thermometer, Brain, Eye, Ear, User, Calendar, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Badge, Input } from '../../components/ui';
import { Toast } from '../../components/ui/Toast';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const commonSymptoms = [
    { id: 1, name: 'Headache', category: 'neurological', icon: Brain },
    { id: 2, name: 'Fever', category: 'general', icon: Thermometer },
    { id: 3, name: 'Cough', category: 'respiratory', icon: Heart },
    { id: 4, name: 'Sore throat', category: 'respiratory', icon: Heart },
    { id: 5, name: 'Fatigue', category: 'general', icon: Activity },
    { id: 6, name: 'Nausea', category: 'digestive', icon: Activity },
    { id: 7, name: 'Dizziness', category: 'neurological', icon: Brain },
    { id: 8, name: 'Chest pain', category: 'cardiac', icon: Heart },
    { id: 9, name: 'Shortness of breath', category: 'respiratory', icon: Heart },
    { id: 10, name: 'Back pain', category: 'musculoskeletal', icon: Activity },
    { id: 11, name: 'Joint pain', category: 'musculoskeletal', icon: Activity },
    { id: 12, name: 'Stomach pain', category: 'digestive', icon: Activity },
    { id: 13, name: 'Runny nose', category: 'respiratory', icon: Heart },
    { id: 14, name: 'Skin rash', category: 'dermatological', icon: Eye },
    { id: 15, name: 'Ear pain', category: 'ent', icon: Ear },
    { id: 16, name: 'Eye irritation', category: 'ophthalmological', icon: Eye },
    { id: 17, name: 'Muscle cramps', category: 'musculoskeletal', icon: Activity },
    { id: 18, name: 'Insomnia', category: 'neurological', icon: Brain },
    { id: 19, name: 'Anxiety', category: 'mental health', icon: Brain },
    { id: 20, name: 'Loss of appetite', category: 'general', icon: Activity }
  ];

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !symptoms.find(s => s.id === symptom.id)
  );

  const addSymptom = (symptom) => {
    setSymptoms([...symptoms, symptom]);
    setSearchTerm('');
  };

  const removeSymptom = (symptomId) => {
    setSymptoms(symptoms.filter(s => s.id !== symptomId));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'default',
      'neurological': 'info',
      'respiratory': 'warning',
      'cardiac': 'error',
      'digestive': 'success',
      'musculoskeletal': 'secondary',
      'dermatological': 'warning',
      'ent': 'info',
      'ophthalmological': 'success',
      'mental health': 'info'
    };
    return colors[category] || 'default';
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      setShowToast(true);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockAnalysis = {
        possibleConditions: [
          {
            condition: 'Common Cold',
            probability: 75,
            description: 'A viral infection of the upper respiratory tract.',
            symptoms: ['Runny nose', 'Sore throat', 'Cough', 'Fatigue'],
            severity: 'mild',
            recommendations: [
              'Get plenty of rest',
              'Stay hydrated',
              'Use over-the-counter pain relievers if needed',
              'Consider throat lozenges for sore throat'
            ]
          },
          {
            condition: 'Seasonal Allergies',
            probability: 60,
            description: 'Allergic reaction to environmental allergens.',
            symptoms: ['Runny nose', 'Eye irritation', 'Fatigue'],
            severity: 'mild',
            recommendations: [
              'Avoid known allergens',
              'Use antihistamines',
              'Keep windows closed during high pollen days',
              'Consider allergy testing'
            ]
          },
          {
            condition: 'Tension Headache',
            probability: 45,
            description: 'The most common type of headache caused by stress or muscle tension.',
            symptoms: ['Headache', 'Fatigue', 'Muscle tension'],
            severity: 'mild',
            recommendations: [
              'Apply cold or warm compress',
              'Practice relaxation techniques',
              'Get adequate sleep',
              'Stay hydrated'
            ]
          }
        ],
        urgencyLevel: 'low',
        generalRecommendations: [
          'Monitor symptoms for 24-48 hours',
          'Contact healthcare provider if symptoms worsen',
          'Maintain good hygiene practices',
          'Stay hydrated and get adequate rest'
        ],
        warningSigns: [
          'High fever (over 103°F/39.4°C)',
          'Severe difficulty breathing',
          'Chest pain or pressure',
          'Severe or persistent headache',
          'Confusion or altered consciousness'
        ],
        disclaimer: 'This is not a medical diagnosis. Please consult with a healthcare professional for proper medical advice.'
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'success';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Symptom Checker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Describe your symptoms and get AI-powered insights about possible conditions. 
          This tool provides educational information and should not replace professional medical advice.
        </p>
      </div>

      {/* Personal Information */}
      <Card variant="medical">
        <CardHeader title="Personal Information" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Age
              </label>
              <Input
                type="number"
                placeholder="e.g., 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select duration</option>
                <option value="less-than-1-day">Less than 1 day</option>
                <option value="1-3-days">1-3 days</option>
                <option value="4-7-days">4-7 days</option>
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="more-than-2-weeks">More than 2 weeks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="h-4 w-4 inline mr-1" />
                Intensity
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select intensity</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Symptom Selection */}
      <Card variant="medical">
        <CardHeader title="Select Your Symptoms" />
        <CardContent>
          {/* Selected Symptoms */}
          {symptoms.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Symptoms:</h3>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => {
                  const IconComponent = symptom.icon;
                  return (
                    <Badge 
                      key={symptom.id} 
                      variant={getCategoryColor(symptom.category)}
                      className="flex items-center gap-2 px-3 py-2"
                    >
                      <IconComponent className="h-3 w-3" />
                      {symptom.name}
                      <button
                        onClick={() => removeSymptom(symptom.id)}
                        className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Symptoms */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Available Symptoms */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredSymptoms.slice(0, 12).map((symptom) => {
              const IconComponent = symptom.icon;
              return (
                <button
                  key={symptom.id}
                  onClick={() => addSymptom(symptom)}
                  className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <IconComponent className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{symptom.name}</span>
                  <Plus className="h-3 w-3 text-gray-400 ml-auto" />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Analyze Button */}
      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleAnalyze}
          disabled={isAnalyzing || symptoms.length === 0}
          className="px-8"
        >
          {isAnalyzing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Analyze Symptoms
            </>
          )}
        </Button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          <Card variant="medical">
            <CardHeader 
              title="Analysis Results" 
              action={
                <Badge variant={getUrgencyColor(analysis.urgencyLevel)} size="sm">
                  {analysis.urgencyLevel} urgency
                </Badge>
              }
            />
            <CardContent>
              <div className="space-y-6">
                {/* Possible Conditions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Possible Conditions</h3>
                  <div className="space-y-4">
                    {analysis.possibleConditions.map((condition, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{condition.condition}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(condition.severity)} size="sm">
                              {condition.severity}
                            </Badge>
                            <span className="text-sm text-gray-600">{condition.probability}% match</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3">{condition.description}</p>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-800 mb-2">Matching Symptoms:</h5>
                          <div className="flex flex-wrap gap-1">
                            {condition.symptoms.map((symptom, idx) => (
                              <Badge key={idx} variant="outline" size="sm">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-800 mb-2">Recommendations:</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {condition.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">General Recommendations</h3>
                  <ul className="space-y-2">
                    {analysis.generalRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="mr-2 text-blue-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warning Signs */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Seek Immediate Medical Attention If:
                  </h3>
                  <ul className="space-y-2">
                    {analysis.warningSigns.map((sign, index) => (
                      <li key={index} className="flex items-start text-red-700">
                        <span className="mr-2">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 italic">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {analysis.disclaimer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          type="warning"
          message="Please select at least one symptom to analyze."
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default SymptomChecker;
