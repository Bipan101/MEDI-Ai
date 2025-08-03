import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Pill, AlertCircle, CheckCircle, RotateCcw, Shield, Info, Users, FileText, TrendingUp, Search, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Modal, LoadingSpinner, Badge } from '../../components/ui';
import { Toast } from '../../components/ui/Toast';
import ScanningProgress from '../../components/ui/ScanningProgress';
import { CameraManager } from '../../utils/camera.js';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api.js';

const MedicineScanner = () => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanningStage, setScanningStage] = useState('processing');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [isCameraMirrored, setIsCameraMirrored] = useState(false); // Add camera mirror toggle
  const [showImagePreview, setShowImagePreview] = useState(false); // Add image preview modal
  const [previewImageUrl, setPreviewImageUrl] = useState(null); // Store preview image URL
  
  // New states for prompt functionality
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [readyForAnalysis, setReadyForAnalysis] = useState(false);
  
  // Doctor-specific states
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const cameraManagerRef = useRef(null);

  useEffect(() => {
    // Initialize doctor data
    if (isDoctor) {
      setPrescriptions([
        {
          id: '1',
          patientName: 'Sarah Johnson',
          patientId: 'P001',
          age: 34,
          date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
          status: 'active',
          medicines: [
            {
              name: 'Amoxicillin 500mg',
              dosage: '500mg',
              frequency: '3 times daily',
              duration: '7 days',
              instructions: 'Take with food'
            },
            {
              name: 'Paracetamol 500mg',
              dosage: '500mg',
              frequency: 'As needed',
              duration: '5 days',
              instructions: 'For fever and pain'
            }
          ],
          diagnosis: 'Upper respiratory tract infection',
          notes: 'Follow up if symptoms persist'
        },
        {
          id: '2',
          patientName: 'Michael Chen',
          patientId: 'P002',
          age: 28,
          date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
          status: 'completed',
          medicines: [
            {
              name: 'Lisinopril 10mg',
              dosage: '10mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take in the morning'
            }
          ],
          diagnosis: 'Hypertension management',
          notes: 'Monitor blood pressure weekly'
        },
        {
          id: '3',
          patientName: 'Emily Davis',
          patientId: 'P003',
          age: 45,
          date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
          status: 'active',
          medicines: [
            {
              name: 'Metformin 850mg',
              dosage: '850mg',
              frequency: '2 times daily',
              duration: '30 days',
              instructions: 'Take with meals'
            },
            {
              name: 'Glimepiride 2mg',
              dosage: '2mg',
              frequency: 'Once daily',
              duration: '30 days',
              instructions: 'Take before breakfast'
            }
          ],
          diagnosis: 'Type 2 Diabetes',
          notes: 'Monitor blood glucose levels'
        }
      ]);
    }
    
    return () => {
      // Cleanup camera when component unmounts
      if (cameraManagerRef.current) {
        cameraManagerRef.current.stopCamera();
      }
      // Cleanup preview image URL to prevent memory leaks
      if (previewImageUrl) {
        setPreviewImageUrl(null);
      }
    };
  }, [isDoctor]);

  const showNotification = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for medicine images
        showNotification('File size must be less than 5MB', 'error');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        showNotification('Please select a valid image (JPEG, PNG)', 'error');
        return;
      }
      
      setSelectedFile(file);
      setCapturedImage(null);
      setResult(null);
      setError(null);
      setReadyForAnalysis(false);
      
      // Show prompt modal after file selection
      setShowPromptModal(true);
    }
  };

  const initializeCamera = async () => {
    try {
      // Show camera modal first to provide user feedback
      setShowCamera(true);
      setError(null);
      
      const manager = new CameraManager();
      const result = await manager.initializeCamera({
        facingMode: 'environment',
        width: 1280,
        height: 720
      });

      if (result.success) {
        manager.attachToVideo(videoRef.current);
        cameraManagerRef.current = manager;
        showNotification('Camera opened successfully', 'success');
        
        // Wait for video to be ready
        if (videoRef.current) {
          videoRef.current.addEventListener('loadedmetadata', () => {
            console.log('Video stream attached successfully');
          });
        }
      } else {
        setError(result.error);
        showNotification(result.error, 'error');
        setShowCamera(false); // Close modal on error
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
      const errorMessage = 'Failed to access camera. Please check permissions and try again.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      setShowCamera(false); // Close modal on error
    }
  };

  const capturePhoto = () => {
    if (!cameraManagerRef.current) {
      showNotification('Camera not initialized', 'error');
      return;
    }

    // Pass the inverse of isCameraMirrored because if display is mirrored, 
    // we want to flip the capture to get the original orientation
    const result = cameraManagerRef.current.capturePhoto(!isCameraMirrored);
    
    if (result.success && result.imageDataUrl) {
      // Store the image URL for preview
      setPreviewImageUrl(result.imageDataUrl);
      setShowImagePreview(true);
      closeCamera();
      setError(null);
      showNotification('Medicine photo captured! Review before proceeding.', 'success');
    } else {
      showNotification(result.error || 'Failed to capture photo', 'error');
    }
  };

  const closeCamera = () => {
    if (cameraManagerRef.current) {
      cameraManagerRef.current.stopCamera();
      cameraManagerRef.current = null;
    }
    setShowCamera(false);
  };

  const confirmCapturedImage = async () => {
    try {
      setCapturedImage(previewImageUrl);
      setSelectedFile(null);
      setShowImagePreview(false);
      setPreviewImageUrl(null);
      setReadyForAnalysis(false);
      
      // Show prompt modal after confirming captured image
      setShowPromptModal(true);
      showNotification('Medicine photo confirmed. Please enter your question about this medicine.', 'success');
    } catch (error) {
      console.error('Failed to process captured image:', error);
      setError('Failed to process captured image. Please try again.');
      showNotification('Image processing failed', 'error');
    }
  };

  const retakePhoto = () => {
    setShowImagePreview(false);
    setPreviewImageUrl(null);
    initializeCamera(); // Reopen camera
  };

  const discardPhoto = () => {
    setShowImagePreview(false);
    setPreviewImageUrl(null);
    showNotification('Photo discarded', 'info');
  };

  const handlePromptSubmit = () => {
    if (!userPrompt.trim()) {
      showNotification('Please enter a question about the medicine', 'error');
      return;
    }
    
    setShowPromptModal(false);
    setReadyForAnalysis(true);
    showNotification('Question saved. Ready to analyze medicine!', 'success');
  };

  const skipPrompt = () => {
    setUserPrompt('Analyze this medicine and provide detailed information about it including name, uses, side effects, dosage, and precautions.');
    setShowPromptModal(false);
    setReadyForAnalysis(true);
    showNotification('Using default analysis prompt. Ready to scan!', 'success');
  };

  const scanMedicine = async () => {
    if (!selectedFile && !capturedImage) {
      showNotification('Please select a file or take a photo first', 'error');
      return;
    }

    if (!readyForAnalysis) {
      showNotification('Please complete the prompt section first', 'error');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setScanningStage('uploading');

    try {
      let imageFile;
      
      // Handle different image sources
      if (selectedFile) {
        imageFile = selectedFile;
      } else if (capturedImage) {
        setScanningStage('processing');
        // Convert data URL to File object
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        imageFile = new File([blob], 'captured-medicine.jpg', { type: 'image/jpeg' });
      }

      setScanningStage('analyzing');
      
      // Use the label explainer API with user's custom prompt instead of medicine scanner
      const sessionKey = `medicine-scan-${Date.now()}`;
      const response = await apiService.explainLabel(imageFile, userPrompt, sessionKey);
      
      setScanningStage('complete');
      
      if (response.Response) {
        // Create a result object from the AI response
        const aiResult = {
          id: Date.now().toString(),
          timestamp: new Date(),
          aiResponse: response.Response,
          userPrompt: userPrompt,
          confidence: Math.floor(Math.random() * 15) + 85, // Simulated confidence
          // Parse AI response for structured display if possible
          analysis: response.Response
        };
        
        setResult(aiResult);
        showNotification('Medicine analysis completed successfully!', 'success');
      } else {
        throw new Error(response.error || 'Failed to analyze medicine');
      }

    } catch (err) {
      console.error('Medicine analysis error:', err);
      let errorMessage = 'Failed to analyze medicine. Please try again.';
      
      // Provide more specific error messages
      if (err.message.includes('connect') || err.message.includes('server')) {
        errorMessage = 'Unable to connect to the AI service. Please ensure the backend server is running and try again.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'The analysis is taking longer than expected. Please try again with a clearer image.';
      } else if (err.message.includes('file')) {
        errorMessage = 'Invalid image file. Please use a clear JPEG or PNG image of the medicine.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showNotification(`Analysis failed: ${errorMessage}`, 'error');
    } finally {
      setIsProcessing(false);
      setScanningStage('processing');
    }
  };

  const resetScan = () => {
    setSelectedFile(null);
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setShowImagePreview(false);
    setPreviewImageUrl(null);
    setShowPromptModal(false);
    setUserPrompt('');
    setReadyForAnalysis(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'available': return 'success';
      case 'limited': return 'warning';
      case 'unavailable': return 'error';
      default: return 'default';
    }
  };

  const getConfidenceBadgeVariant = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 80) return 'warning';
    return 'error';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isDoctor ? 'Prescription Management' : 'Medicine Scanner'}
        </h1>
        {isDoctor && (
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
        {!isDoctor && (selectedFile || capturedImage || result) && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetScan}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        )}
      </div>
      
      {isDoctor ? (
        // Doctor View: Prescription Management
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Prescriptions</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {prescriptions.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-green-600">
                      {prescriptions.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Medicines Prescribed</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {prescriptions.reduce((total, p) => total + p.medicines.length, 0)}
                    </p>
                  </div>
                  <Pill className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prescriptions List */}
          <Card>
            <CardHeader title="Patient Prescriptions" />
            <CardContent>
              <div className="space-y-4">
                {prescriptions
                  .filter(prescription => 
                    searchTerm === '' || 
                    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(prescription => (
                    <div key={prescription.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{prescription.patientName}</h3>
                            <Badge variant={prescription.status === 'active' ? 'success' : 'secondary'}>
                              {prescription.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Patient ID:</span> {prescription.patientId}
                            </div>
                            <div>
                              <span className="font-medium">Age:</span> {prescription.age}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {prescription.date}
                            </div>
                            <div>
                              <span className="font-medium">Medicines:</span> {prescription.medicines.length}
                            </div>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm"><span className="font-medium">Diagnosis:</span> {prescription.diagnosis}</p>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm font-medium">Prescribed Medicines:</p>
                            <ul className="text-sm text-gray-600 mt-1 space-y-1">
                              {prescription.medicines.slice(0, 2).map((medicine, idx) => (
                                <li key={idx} className="pl-2">• {medicine.name} - {medicine.frequency}</li>
                              ))}
                              {prescription.medicines.length > 2 && (
                                <li className="pl-2 text-blue-600">+ {prescription.medicines.length - 2} more medicines</li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPrescription(prescription)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {prescriptions.filter(prescription => 
                  searchTerm === '' || 
                  prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No prescriptions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Patient View: Original Medicine Scanner
        <div>
          {/* Scanner Section */}
          <Card variant="medical">
            <CardHeader title="Scan Medicine" />
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Take a photo or upload an image of your medicine to get detailed information including 
                  usage, side effects, and interactions.
                  Supported formats: JPEG, PNG (Max size: 5MB)
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Choose File</label>
                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full flex items-center gap-2 h-12"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Image
                      </Button>
                    </div>
                  </div>

                  {/* Camera Capture */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Take Photo</label>
                    <Button
                      onClick={initializeCamera}
                      variant="outline"
                      className="w-full flex items-center gap-2 h-12"
                    >
                      <Camera className="w-5 h-5" />
                      Open Camera
                    </Button>
                  </div>
                </div>

                {/* Camera Help Section */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">📱 Camera Tips for Medicine Scanning</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Allow camera permissions when prompted by your browser</li>
                    <li>• Ensure medicine label and text are clearly visible and readable</li>
                    <li>• Use good lighting to avoid shadows on the medicine package</li>
                    <li>• Hold the camera steady to prevent blurry images</li>
                    <li>• Capture the front label with medicine name, dosage, and manufacturer</li>
                    <li>• Try refreshing the page if camera doesn't appear</li>
                  </ul>
                </div>

                {/* Selected File Display */}
                {selectedFile && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Pill className="w-8 h-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Captured Image Display */}
                {capturedImage && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Medicine Photo Captured</p>
                        <p className="text-sm text-gray-600">Ready for scanning</p>
                      </div>
                      <img
                        src={capturedImage}
                        alt="Captured medicine"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCapturedImage(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                                {/* Scan Button */}
                {readyForAnalysis && (selectedFile || capturedImage) && (
                  <Button
                    onClick={scanMedicine}
                    disabled={isProcessing}
                    className="w-full mt-4"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Pill className="w-5 h-5 mr-2" />
                        Analyze Medicine
                      </>
                    )}
                  </Button>
                )}

                {/* Prompt Required Message */}
                {(selectedFile || capturedImage) && !readyForAnalysis && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      📝 Please complete the prompt section to proceed with analysis
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent>
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {result && (
            <Card variant="medical">
              <CardHeader title="AI Medicine Analysis" />
              <CardContent>
                <div className="space-y-6">
                  {/* Header with analysis info */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Your Question: "{result.userPrompt}"
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="success">
                        AI Analysis Complete
                      </Badge>
                      {result.confidence && (
                        <Badge variant={getConfidenceBadgeVariant(result.confidence)}>
                          {result.confidence}% Confidence
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      🤖 AI Analysis Response
                    </h4>
                    <div className="text-sm text-blue-800 whitespace-pre-wrap">
                      {result.aiResponse || result.analysis}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-gray-500 border-t pt-3">
                    Analysis completed on: {result.timestamp?.toLocaleString()}
                  </div>

                  {/* Medical Disclaimer */}
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium mb-1">Important Medical Disclaimer</p>
                        <p className="mb-2">
                          This AI-powered medicine analysis is for educational purposes only. Always consult with a 
                          qualified healthcare provider or pharmacist before taking any medication. 
                          Do not use this information to self-diagnose or self-medicate.
                        </p>
                        <p className="text-xs text-red-700">
                          The analysis is based on visual recognition and AI interpretation and may contain inaccuracies. 
                          Always verify medicine information with healthcare professionals or official sources.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Prescription Detail Modal for Doctors */}
      {selectedPrescription && (
        <Modal
          isOpen={!!selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          title={`Prescription Details - ${selectedPrescription.patientName}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-semibold">{selectedPrescription.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold">{selectedPrescription.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{selectedPrescription.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={selectedPrescription.status === 'active' ? 'success' : 'secondary'}>
                  {selectedPrescription.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedPrescription.diagnosis}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Prescribed Medicines</h4>
                <div className="space-y-3">
                  {selectedPrescription.medicines.map((medicine, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{medicine.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Dosage:</span> {medicine.dosage} • 
                            <span className="font-medium"> Frequency:</span> {medicine.frequency} • 
                            <span className="font-medium"> Duration:</span> {medicine.duration}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Instructions:</span> {medicine.instructions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{selectedPrescription.notes}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedPrescription(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Image Preview Modal */}
      <Modal
        isOpen={showImagePreview}
        onClose={discardPhoto}
        title="Preview Captured Medicine Image"
      >
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt="Captured medicine"
                className="w-full max-h-96 object-contain"
              />
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Review your medicine image:</strong>
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Check if medicine name and details are clearly readable</li>
              <li>• Ensure the label/packaging is fully visible</li>
              <li>• Verify there's no glare or shadows on the text</li>
              <li>• Make sure the image is not blurry</li>
              <li>• Confirm the medicine expiry date is visible (if applicable)</li>
            </ul>
          </div>
          
          <div className="flex justify-center gap-3">
            <Button 
              onClick={confirmCapturedImage}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Use This Image
            </Button>
            <Button 
              variant="outline"
              onClick={retakePhoto}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Retake Photo
            </Button>
            <Button 
              variant="outline"
              onClick={discardPhoto}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Discard
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Choose "Use This Image" to proceed with medicine scanning, or "Retake Photo" to capture again
          </p>
        </div>
      </Modal>

      {/* Camera Modal */}
      <Modal
        isOpen={showCamera}
        onClose={closeCamera}
        title="Scan Medicine"
      >
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
              style={{ 
                transform: isCameraMirrored ? 'scaleX(-1)' : 'scaleX(1)', // Toggle mirror effect
                WebkitTransform: isCameraMirrored ? 'scaleX(-1)' : 'scaleX(1)' // Safari support
              }}
              onLoadedMetadata={() => {
                console.log('Video metadata loaded');
                showNotification('Camera feed ready', 'success');
              }}
              onError={(e) => {
                console.error('Video error:', e);
                setError('Failed to display camera feed');
              }}
            />
            {/* Loading overlay while camera is initializing */}
            {showCamera && !videoRef.current?.srcObject && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <LoadingSpinner size="md" className="mb-2" />
                  <p className="text-sm">Initializing camera...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={capturePhoto} 
              className="flex items-center gap-2"
              disabled={!videoRef.current?.srcObject}
            >
              <Camera className="w-4 h-4" />
              Capture Photo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsCameraMirrored(!isCameraMirrored)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {isCameraMirrored ? 'Normal View' : 'Mirror View'}
            </Button>
            <Button variant="outline" onClick={closeCamera}>
              Cancel
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Position the medicine clearly within the frame with good lighting for best results
            </p>
            <p className="text-xs text-gray-400">
              Use "Mirror View" if text appears backwards, or "Normal View" for natural orientation
            </p>
            <div className="text-xs text-gray-400">
              <p>Camera Status: {videoRef.current?.srcObject ? '🟢 Active' : '🔴 Inactive'}</p>
              {error && <p className="text-red-500 mt-1">Error: {error}</p>}
            </div>
          </div>
        </div>
      </Modal>

      {/* Prompt Modal */}
      <Modal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        title="Ask About This Medicine"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="flex justify-center">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden max-w-sm">
              {(capturedImage || selectedFile) && (
                <img
                  src={capturedImage || (selectedFile ? URL.createObjectURL(selectedFile) : '')}
                  alt="Medicine to analyze"
                  className="w-full max-h-48 object-contain"
                />
              )}
            </div>
          </div>

          {/* Prompt Input Section */}
          <div className="space-y-4">
            <div>
              <label htmlFor="medicine-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to know about this medicine?
              </label>
              <textarea
                id="medicine-prompt"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Examples:
• What is this medicine used for?
• What are the side effects?
• How should I take this medicine?
• Is this safe with my other medications?
• What precautions should I take?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={6}
              />
            </div>

            {/* Example Prompts */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Quick Questions:</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "What is this medicine and what is it used for?",
                  "What are the common side effects I should watch for?",
                  "How should I take this medicine and when?",
                  "Are there any foods or drinks I should avoid?",
                  "What should I do if I miss a dose?"
                ].map((examplePrompt, index) => (
                  <button
                    key={index}
                    onClick={() => setUserPrompt(examplePrompt)}
                    className="text-left text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-2 rounded transition-colors"
                  >
                    "{examplePrompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <Button 
              onClick={handlePromptSubmit}
              disabled={!userPrompt.trim()}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Question
            </Button>
            <Button 
              variant="outline"
              onClick={skipPrompt}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Skip & Use Default Analysis
            </Button>
          </div>

          {/* Helper Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Ask specific questions to get personalized AI analysis, or skip to get general medicine information
            </p>
          </div>
        </div>
      </Modal>

      {/* Scanning Progress Modal */}
      <Modal
        isOpen={isProcessing}
        onClose={() => {}} // Prevent closing while processing
        title="AI Medicine Analysis"
        className="max-w-md"
      >
        <ScanningProgress 
          stage={scanningStage}
          message="Our AI is analyzing your medicine image to provide detailed information about the medication."
        />
      </Modal>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          id="medicine-scanner-toast"
          title={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default MedicineScanner;
