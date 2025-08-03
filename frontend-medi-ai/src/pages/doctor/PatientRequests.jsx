import React, { useState } from 'react';
import { Search, Filter, Users, FileText, AlertCircle, Clock, CheckCircle, Eye, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Badge, Input } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';

const PatientRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const patientRequests = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientAge: 34,
      type: 'consultation',
      priority: 'high',
      subject: 'Blood Test Results Review',
      description: 'Patient requesting review of recent blood work showing elevated white cell count. Concerned about potential infections or other underlying conditions.',
      submittedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
      status: 'pending',
      symptoms: ['Fatigue', 'Fever', 'Night sweats'],
      medicalHistory: ['Diabetes Type 2', 'Hypertension'],
      attachments: ['blood_test_results.pdf', 'medical_history.pdf']
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      patientAge: 28,
      type: 'prescription',
      priority: 'medium',
      subject: 'Medication Refill Request',
      description: 'Patient requesting refill for anxiety medication. Current prescription expires in 3 days.',
      submittedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
      status: 'pending',
      symptoms: ['Anxiety', 'Sleep issues'],
      medicalHistory: ['Generalized Anxiety Disorder'],
      attachments: ['current_prescription.pdf']
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      patientAge: 45,
      type: 'report_review',
      priority: 'low',
      subject: 'X-Ray Report Analysis',
      description: 'Follow-up X-ray after minor fall. Patient wants confirmation that healing is progressing normally.',
      submittedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
      status: 'completed',
      symptoms: ['Mild pain', 'Stiffness'],
      medicalHistory: ['Previous fracture (2022)'],
      attachments: ['xray_report.pdf', 'previous_xray.pdf']
    },
    {
      id: '4',
      patientName: 'Robert Wilson',
      patientAge: 52,
      type: 'consultation',
      priority: 'high',
      subject: 'Chest Pain Consultation',
      description: 'Patient experiencing intermittent chest pain for the past week. No previous cardiac history but family history of heart disease.',
      submittedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
      status: 'pending',
      symptoms: ['Chest pain', 'Shortness of breath', 'Dizziness'],
      medicalHistory: ['High cholesterol'],
      attachments: ['ecg_results.pdf']
    },
    {
      id: '5',
      patientName: 'Lisa Thompson',
      patientAge: 38,
      type: 'prescription',
      priority: 'medium',
      subject: 'Allergy Medication Adjustment',
      description: 'Current allergy medication not providing adequate relief. Patient requesting alternative options.',
      submittedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
      status: 'in_progress',
      symptoms: ['Persistent sneezing', 'Watery eyes', 'Congestion'],
      medicalHistory: ['Seasonal allergies', 'Asthma'],
      attachments: ['allergy_test_results.pdf']
    },
    {
      id: '6',
      patientName: 'David Brown',
      patientAge: 61,
      type: 'report_review',
      priority: 'high',
      subject: 'MRI Scan Results',
      description: 'MRI scan of lower back showing potential disc issues. Patient experiencing severe pain and mobility issues.',
      submittedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
      status: 'pending',
      symptoms: ['Severe back pain', 'Leg numbness', 'Limited mobility'],
      medicalHistory: ['Previous back surgery (2020)', 'Arthritis'],
      attachments: ['mri_results.pdf', 'pain_assessment.pdf']
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation': return Users;
      case 'prescription': return FileText;
      case 'report_review': return AlertCircle;
      default: return FileText;
    }
  };

  const filteredRequests = patientRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleRequestAction = (requestId, action) => {
    console.log(`${action} request ${requestId}`);
    // Handle request actions (approve, reject, etc.)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Requests</h1>
          <p className="text-gray-600">Manage and respond to patient requests</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="warning" size="sm">
            {patientRequests.filter(r => r.status === 'pending').length} Pending
          </Badge>
          <Badge variant="info" size="sm">
            {patientRequests.filter(r => r.status === 'in_progress').length} In Progress
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card variant="medical">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients or subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const TypeIcon = getTypeIcon(request.type);
          
          return (
            <Card key={request.id} variant="medical">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                        <span className="text-sm text-gray-500">Age {request.patientAge}</span>
                        <Badge variant={getPriorityColor(request.priority)} size="sm">
                          {request.priority}
                        </Badge>
                        <Badge variant={getStatusColor(request.status)} size="sm">
                          {request.status}
                        </Badge>
                      </div>
                      
                      <h4 className="font-medium text-gray-800 mb-2">{request.subject}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{request.description}</p>
                      
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {request.submittedAt}
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {request.attachments.length} attachments
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleRequestAction(request.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestAction(request.id, 'respond')}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <Card variant="medical">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">No patient requests match your current filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Request Details - ${selectedRequest.patientName}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={getPriorityColor(selectedRequest.priority)} size="sm">
                  {selectedRequest.priority} priority
                </Badge>
                <Badge variant={getStatusColor(selectedRequest.status)} size="sm">
                  {selectedRequest.status}
                </Badge>
              </div>
              <span className="text-sm text-gray-500">{selectedRequest.submittedAt}</span>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{selectedRequest.subject}</h4>
              <p className="text-gray-700">{selectedRequest.description}</p>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Symptoms</h5>
              <div className="flex flex-wrap gap-2">
                {selectedRequest.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Medical History</h5>
              <div className="flex flex-wrap gap-2">
                {selectedRequest.medicalHistory.map((condition, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Attachments</h5>
              <div className="space-y-2">
                {selectedRequest.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{file}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
              {selectedRequest.status === 'pending' && (
                <>
                  <Button variant="success" onClick={() => handleRequestAction(selectedRequest.id, 'approve')}>
                    Accept Request
                  </Button>
                  <Button variant="primary" onClick={() => handleRequestAction(selectedRequest.id, 'respond')}>
                    Send Response
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PatientRequests;
