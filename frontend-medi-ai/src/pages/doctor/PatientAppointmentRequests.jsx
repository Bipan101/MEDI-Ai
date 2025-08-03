import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, X, Search, Filter, AlertCircle, Users } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Modal, Badge } from '../../components/ui';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';

const PatientAppointmentRequests = () => {
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const [appointmentRequests, setAppointmentRequests] = useState([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      age: 32,
      gender: 'Female',
      contactNumber: '+977-9841234567',
      email: 'sarah.johnson@email.com',
      requestedDate: '2025-08-05',
      requestedTime: '10:00 AM',
      alternativeDate: '2025-08-06',
      alternativeTime: '2:00 PM',
      reason: 'Follow-up for Blood Test Results - Cholesterol levels discussion',
      urgency: 'high',
      status: 'pending',
      submittedAt: '2025-08-02T08:30:00',
      medicalHistory: 'Hypertension, Diabetes Type 2',
      currentMedications: 'Metformin 500mg, Lisinopril 10mg',
      symptoms: 'Fatigue, occasional dizziness',
      previousVisits: 3,
      lastVisit: '2025-07-15'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      patientId: 'P002',
      age: 45,
      gender: 'Male',
      contactNumber: '+977-9856789012',
      email: 'michael.chen@email.com',
      requestedDate: '2025-08-04',
      requestedTime: '2:30 PM',
      alternativeDate: '2025-08-07',
      alternativeTime: '11:00 AM',
      reason: 'Routine Health Check-up - Annual physical examination',
      urgency: 'medium',
      status: 'pending',
      submittedAt: '2025-08-01T14:15:00',
      medicalHistory: 'No significant medical history',
      currentMedications: 'Multivitamin',
      symptoms: 'None - preventive check-up',
      previousVisits: 1,
      lastVisit: '2024-07-20'
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      patientId: 'P003',
      age: 28,
      gender: 'Female',
      contactNumber: '+977-9812345678',
      email: 'emily.davis@email.com',
      requestedDate: '2025-08-03',
      requestedTime: '4:00 PM',
      alternativeDate: '2025-08-04',
      alternativeTime: '9:00 AM',
      reason: 'Chest Pain and Breathing Difficulty - Emergency consultation needed',
      urgency: 'urgent',
      status: 'pending',
      submittedAt: '2025-08-02T10:45:00',
      medicalHistory: 'Asthma, Anxiety disorder',
      currentMedications: 'Inhaler (Albuterol), Sertraline 50mg',
      symptoms: 'Chest tightness, shortness of breath, rapid heartbeat',
      previousVisits: 5,
      lastVisit: '2025-06-10'
    },
    {
      id: '4',
      patientName: 'David Wilson',
      patientId: 'P004',
      age: 55,
      gender: 'Male',
      contactNumber: '+977-9823456789',
      email: 'david.wilson@email.com',
      requestedDate: '2025-08-08',
      requestedTime: '11:30 AM',
      alternativeDate: '2025-08-09',
      alternativeTime: '3:00 PM',
      reason: 'Medication Review and Adjustment - Side effects discussion',
      urgency: 'medium',
      status: 'approved',
      submittedAt: '2025-07-30T16:20:00',
      medicalHistory: 'High blood pressure, Arthritis',
      currentMedications: 'Amlodipine 5mg, Ibuprofen 400mg',
      symptoms: 'Joint pain, occasional headaches',
      previousVisits: 7,
      lastVisit: '2025-07-01'
    }
  ]);

  const getPriorityColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const showNotification = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleApproveRequest = (requestId) => {
    setAppointmentRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' }
          : req
      )
    );
    showNotification('Appointment request approved successfully!', 'success');
  };

  const handleRejectRequest = (requestId) => {
    setAppointmentRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' }
          : req
      )
    );
    showNotification('Appointment request rejected.', 'info');
  };

  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const filteredRequests = appointmentRequests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.urgency === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getRequestStats = () => {
    return {
      total: appointmentRequests.length,
      pending: appointmentRequests.filter(r => r.status === 'pending').length,
      approved: appointmentRequests.filter(r => r.status === 'approved').length,
      urgent: appointmentRequests.filter(r => r.urgency === 'urgent').length
    };
  };

  const stats = getRequestStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Patient Appointment Requests
            </h1>
            <p className="text-blue-100">
              Manage and review incoming appointment requests from patients
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calendar className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Cases</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card variant="medical">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by patient name, ID, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card variant="medical">
        <CardHeader title={`Appointment Requests (${filteredRequests.length})`} />
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                        <p className="text-sm text-gray-600">ID: {request.patientId} • {request.age}yr {request.gender}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Requested Date & Time:</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {request.requestedDate} at {request.requestedTime}
                        </p>
                        {request.alternativeDate && (
                          <p className="text-xs text-gray-500">
                            Alternative: {request.alternativeDate} at {request.alternativeTime}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Contact:</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {request.contactNumber}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Reason for Visit:</p>
                      <p className="text-sm text-gray-600">{request.reason}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant={getPriorityColor(request.urgency)} size="sm">
                        {request.urgency.toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusColor(request.status)} size="sm">
                        {request.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewRequestDetails(request)}
                    >
                      View Details
                    </Button>
                    
                    {request.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="error"
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex items-center gap-1"
                        >
                          <X className="h-3 w-3" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No appointment requests found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Appointment Request Details"
        className="max-w-2xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Name:</span> {selectedRequest.patientName}</p>
                  <p><span className="font-medium">Patient ID:</span> {selectedRequest.patientId}</p>
                  <p><span className="font-medium">Age:</span> {selectedRequest.age} years</p>
                  <p><span className="font-medium">Gender:</span> {selectedRequest.gender}</p>
                </div>
                <div>
                  <p><span className="font-medium">Phone:</span> {selectedRequest.contactNumber}</p>
                  <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                  <p><span className="font-medium">Previous Visits:</span> {selectedRequest.previousVisits}</p>
                  <p><span className="font-medium">Last Visit:</span> {selectedRequest.lastVisit}</p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3">Appointment Request</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Preferred Date:</span> {selectedRequest.requestedDate}</p>
                <p><span className="font-medium">Preferred Time:</span> {selectedRequest.requestedTime}</p>
                {selectedRequest.alternativeDate && (
                  <>
                    <p><span className="font-medium">Alternative Date:</span> {selectedRequest.alternativeDate}</p>
                    <p><span className="font-medium">Alternative Time:</span> {selectedRequest.alternativeTime}</p>
                  </>
                )}
                <p><span className="font-medium">Reason:</span> {selectedRequest.reason}</p>
                <p><span className="font-medium">Urgency:</span> 
                  <Badge variant={getPriorityColor(selectedRequest.urgency)} size="sm" className="ml-2">
                    {selectedRequest.urgency.toUpperCase()}
                  </Badge>
                </p>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-3">Medical Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Medical History:</span> {selectedRequest.medicalHistory}</p>
                <p><span className="font-medium">Current Medications:</span> {selectedRequest.currentMedications}</p>
                <p><span className="font-medium">Current Symptoms:</span> {selectedRequest.symptoms}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              {selectedRequest.status === 'pending' && (
                <>
                  <Button
                    variant="success"
                    onClick={() => {
                      handleApproveRequest(selectedRequest.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Request
                  </Button>
                  <Button
                    variant="error"
                    onClick={() => {
                      handleRejectRequest(selectedRequest.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject Request
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          id="appointment-requests-toast"
          title={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default PatientAppointmentRequests;
