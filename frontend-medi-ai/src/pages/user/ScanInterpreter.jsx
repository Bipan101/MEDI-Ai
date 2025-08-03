import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, FileImage, AlertCircle, CheckCircle, RotateCcw, Users, ClipboardList, TrendingUp, ArrowRight, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Modal, LoadingSpinner, Badge } from '../../components/ui';
import { Toast } from '../../components/ui/Toast';
import ScanningProgress from '../../components/ui/ScanningProgress';
import { CameraManager } from '../../utils/camera.js';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api.js';

const ScanInterpreter = () => {
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
  const [isCameraMirrored, setIsCameraMirrored] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  
  // New states for prompt functionality
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [readyForAnalysis, setReadyForAnalysis] = useState(false);
  
  // Doctor-specific states
  const [patientReports, setPatientReports] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reviewMode, setReviewMode] = useState('pending');
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const cameraManagerRef = useRef(null);

  useEffect(() => {
    // Initialize doctor data
    if (isDoctor) {
      setPatientReports([
        {
          id: '1',
          patientName: 'Sarah Johnson',
          patientId: 'P001',
          age: 34,
          reportType: 'Blood Test',
          uploadDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
          status: 'pending',
          priority: 'high',
          findings: 'Elevated white blood cell count, possible infection',
          recommendations: 'Prescribe antibiotics, follow-up in 48 hours'
        },
        {
          id: '2',
          patientName: 'Michael Chen',
          patientId: 'P002',
          age: 28,
          reportType: 'X-Ray',
          uploadDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
          status: 'reviewed',
          priority: 'medium',
          findings: 'Mild pneumonia in left lung',
          recommendations: 'Rest, increased fluid intake, monitor symptoms'
        },
        {
          id: '3',
          patientName: 'Emily Davis',
          patientId: 'P003',
          age: 45,
          reportType: 'MRI Scan',
          uploadDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
          status: 'pending',
          priority: 'urgent',
          findings: 'Requires immediate specialist consultation',
          recommendations: 'Refer to neurologist within 24 hours'
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
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showNotification('File size should be less than 10MB', 'error');
        return;
      }
      setSelectedFile(file);
      setCapturedImage(null);
      setError(null);
      setReadyForAnalysis(false);
      
      // Show prompt modal after file selection
      setShowPromptModal(true);
      showNotification('Medical report selected. Please enter your question about this report.', 'success');
    }
  };

  const initializeCamera = async () => {
    try {
      // Show camera modal first to provide user feedback
      setShowCamera(true);
      setError(null);
      
      const manager = new CameraManager();
      const result = await manager.initializeCamera();
      
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

  const capturePhoto = async () => {
    if (cameraManagerRef.current) {
      try {
        // Pass the inverse of isCameraMirrored because if display is mirrored, 
        // we want to flip the capture to get the original orientation
        const result = cameraManagerRef.current.capturePhoto(!isCameraMirrored);
        
        if (result.success) {
          // Store the image URL for preview
          setPreviewImageUrl(result.imageDataUrl);
          setShowImagePreview(true);
          closeCamera();
          setError(null);
          showNotification('Photo captured! Review before proceeding.', 'success');
        } else {
          setError(result.error);
          showNotification(result.error, 'error');
        }
      } catch (error) {
        console.error('Photo capture failed:', error);
        setError('Failed to capture photo. Please try again.');
        showNotification('Photo capture failed', 'error');
      }
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
      // Convert data URL to blob
      const response = await fetch(previewImageUrl);
      const imageBlob = await response.blob();
      
      setCapturedImage(imageBlob);
      setSelectedFile(null);
      setShowImagePreview(false);
      setPreviewImageUrl(null);
      setReadyForAnalysis(false);
      
      // Show prompt modal after confirming captured image
      setShowPromptModal(true);
      showNotification('Medical report photo confirmed. Please enter your question about this report.', 'success');
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
      showNotification('Please enter a question about the medical report', 'error');
      return;
    }
    
    setShowPromptModal(false);
    setReadyForAnalysis(true);
    showNotification('Question saved. Ready to analyze medical report!', 'success');
  };

  const skipPrompt = () => {
    setUserPrompt('Analyze this medical report and provide a comprehensive interpretation including key findings, normal vs abnormal results, and recommendations.');
    setShowPromptModal(false);
    setReadyForAnalysis(true);
    showNotification('Using default analysis prompt. Ready to analyze!', 'success');
  };

  const processImage = async () => {
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
        // Convert blob to file
        imageFile = new File([capturedImage], 'captured-report.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
      }

      setScanningStage('analyzing');
      
      // Call the medical report analyzer API
      const response = await apiService.analyzeMedicalReport(imageFile, userPrompt);
      
      if (response.success) {
        setResult({
          ...response,
          timestamp: new Date()
        });
        showNotification('Medical report analysis completed successfully!', 'success');
      } else {
        throw new Error(response.error || 'Analysis failed');
      }
      
    } catch (error) {
      console.error('Processing failed:', error);
      setError(error.message || 'Failed to process medical report. Please try again.');
      showNotification('Analysis failed: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsProcessing(false);
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 80) return 'warning';
    return 'error';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isDoctor ? 'Patient Report Review' : 'Scan Interpreter'}
        </h1>
        {isDoctor ? (
          <div className="flex gap-2">
            <Button
              variant={reviewMode === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReviewMode('pending')}
            >
              Pending ({patientReports.filter(r => r.status === 'pending').length})
            </Button>
            <Button
              variant={reviewMode === 'reviewed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReviewMode('reviewed')}
            >
              Reviewed ({patientReports.filter(r => r.status === 'reviewed').length})
            </Button>
          </div>
        ) : (
          (selectedFile || capturedImage || result) && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetScan}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          )
        )}
      </div>
      
      {isDoctor ? (
        // Doctor View: Patient Report Review
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-red-600">
                      {patientReports.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-green-600">
                      {patientReports.filter(r => r.status === 'reviewed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Urgent Cases</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {patientReports.filter(r => r.priority === 'urgent').length}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Reports List */}
          <Card>
            <CardHeader title="Patient Reports" />
            <CardContent>
              <div className="space-y-4">
                {patientReports
                  .filter(report => reviewMode === 'all' || report.status === reviewMode)
                  .map(report => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{report.patientName}</h3>
                            <Badge 
                              variant={report.priority === 'urgent' ? 'destructive' : 
                                      report.priority === 'high' ? 'warning' : 'secondary'}
                            >
                              {report.priority}
                            </Badge>
                            <Badge variant={report.status === 'reviewed' ? 'success' : 'warning'}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Patient ID:</span> {report.patientId}
                            </div>
                            <div>
                              <span className="font-medium">Age:</span> {report.age}
                            </div>
                            <div>
                              <span className="font-medium">Report Type:</span> {report.reportType}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {report.uploadDate}
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm"><span className="font-medium">Findings:</span> {report.findings}</p>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm"><span className="font-medium">Recommendations:</span> {report.recommendations}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPatient(report)}
                          >
                            View Details
                          </Button>
                          {report.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                // Mark as reviewed
                                setPatientReports(prev => 
                                  prev.map(r => r.id === report.id ? {...r, status: 'reviewed'} : r)
                                );
                                showNotification('Report marked as reviewed', 'success');
                              }}
                            >
                              Mark Reviewed
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                
                {patientReports.filter(report => reviewMode === 'all' || report.status === reviewMode).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No {reviewMode} reports found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Patient View: Original Scan Interpreter
        <div>
          {/* Upload Section */}
          <Card variant="medical">
            <CardHeader title="Upload Medical Report" />
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Upload your medical reports, lab results, or scan images for AI-powered interpretation.
                  Supported formats: JPEG, PNG, PDF (Max size: 10MB)
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
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full flex items-center gap-2 h-12"
                      >
                        <Upload className="w-5 h-5" />
                        Select File
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
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Camera Troubleshooting</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Allow camera permissions when prompted by your browser</li>
                    <li>• Make sure no other apps are using your camera</li>
                    <li>• Try refreshing the page if camera doesn't appear</li>
                    <li>• Use HTTPS for camera access (HTTP may not work)</li>
                  </ul>
                </div>

                {/* Selected File Display */}
                {selectedFile && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileImage className="w-6 h-6 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">{selectedFile.name}</p>
                        <p className="text-sm text-blue-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                        className="text-blue-600 hover:text-blue-800"
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
                      <Camera className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900">Photo captured</p>
                        <p className="text-sm text-green-600">Ready for analysis</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCapturedImage(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Process Button */}
                {(selectedFile || capturedImage) && !result && (
                  <div className="mt-4 space-y-3">
                    {!readyForAnalysis && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          📝 Please complete the prompt section before analyzing your medical report.
                        </p>
                      </div>
                    )}
                    
                    {readyForAnalysis && (
                      <Button
                        onClick={processImage}
                        disabled={isProcessing}
                        className="w-full flex items-center gap-2 h-12"
                      >
                        {isProcessing ? (
                          <>
                            <LoadingSpinner size="sm" />
                            Analyzing Medical Report...
                          </>
                        ) : (
                          <>
                            <FileImage className="w-5 h-5" />
                            Analyze Medical Report
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card variant="error">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Display */}
          {result && (
            <Card variant="success">
              <CardHeader title="Medical Report Analysis" />
              <CardContent>
                <div className="space-y-4">
                  {/* AI Analysis Response */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      AI Analysis Results
                    </h3>
                    <div className="prose max-w-none">
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {result.aiResponse || result.analysis}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Medical Disclaimer</p>
                        <p>
                          This AI interpretation is for informational purposes only and should not replace 
                          professional medical advice, diagnosis, or treatment. Always consult with a 
                          qualified healthcare provider for medical concerns.
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

      {/* Patient Detail Modal for Doctors */}
      {selectedPatient && (
        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`Patient Details - ${selectedPatient.patientName}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-semibold">{selectedPatient.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-semibold">{selectedPatient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Report Type</p>
                <p className="font-semibold">{selectedPatient.reportType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Upload Date</p>
                <p className="font-semibold">{selectedPatient.uploadDate}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Clinical Findings</h4>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedPatient.findings}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{selectedPatient.recommendations}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex gap-2">
                <Badge 
                  variant={selectedPatient.priority === 'urgent' ? 'destructive' : 
                          selectedPatient.priority === 'high' ? 'warning' : 'secondary'}
                >
                  {selectedPatient.priority} priority
                </Badge>
                <Badge variant={selectedPatient.status === 'reviewed' ? 'success' : 'warning'}>
                  {selectedPatient.status}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPatient(null)}
                >
                  Close
                </Button>
                {selectedPatient.status === 'pending' && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setPatientReports(prev => 
                        prev.map(r => r.id === selectedPatient.id ? {...r, status: 'reviewed'} : r)
                      );
                      setSelectedPatient(null);
                      showNotification('Report marked as reviewed', 'success');
                    }}
                  >
                    Mark as Reviewed
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Camera Modal */}
      <Modal
        isOpen={showCamera}
        onClose={closeCamera}
        title="Take Photo of Medical Report"
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
              Position your medical report clearly within the frame and ensure good lighting
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

      {/* Prompt Input Modal */}
      <Modal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        title="Describe Your Medical Report"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-3">
              Help our AI provide better analysis by describing your medical report or asking specific questions:
            </p>
            <ul className="space-y-1 text-xs">
              <li>• What type of medical report is this? (blood test, X-ray, MRI, etc.)</li>
              <li>• Are there any specific symptoms or concerns?</li>
              <li>• What specific information are you looking for?</li>
              <li>• Any particular values or findings you want explained?</li>
            </ul>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your prompt or question:
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="E.g., 'Please analyze this blood test report and explain any abnormal values. I'm particularly concerned about my cholesterol levels.'"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPromptModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowPromptModal(false);
                setReadyForAnalysis(true);
              }}
              disabled={!userPrompt.trim()}
            >
              Continue with Analysis
            </Button>
          </div>
        </div>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        isOpen={showImagePreview}
        onClose={discardPhoto}
        title="Preview Captured Image"
      >
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {previewImageUrl && (
              <img
                src={previewImageUrl}
                alt="Captured medical report"
                className="w-full max-h-96 object-contain"
              />
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Review your captured image:</strong>
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Check if all text is clearly readable</li>
              <li>• Ensure the document is fully visible</li>
              <li>• Verify there's no glare or shadows</li>
              <li>• Make sure the image is not blurry</li>
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
            Choose "Use This Image" to proceed with analysis, or "Retake Photo" to capture again
          </p>
        </div>
      </Modal>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          id="scan-interpreter-toast"
          title={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ScanInterpreter;
