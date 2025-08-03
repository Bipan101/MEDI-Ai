import React, { useState } from 'react';
import { User, Search, Filter, Calendar, Phone, FileText, Eye, MessageCircle, Activity } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Modal, Badge } from '../../components/ui';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';

const ActivePatientList = () => {
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const [activePatients, setActivePatients] = useState([
    {
      id: 'P001',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      contactNumber: '+977-9841234567',
      email: 'sarah.johnson@email.com',
      address: 'Kathmandu, Nepal',
      bloodGroup: 'O+',
      emergencyContact: '+977-9812345678',
      lastVisit: '2025-07-15',
      nextAppointment: '2025-08-05',
      appointmentTime: '10:00 AM',
      status: 'active',
      condition: 'Diabetes',
      severity: 'moderate',
      primaryDiagnosis: 'Type 2 Diabetes Mellitus',
      currentMedications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
      ],
      vitalSigns: {
        bloodPressure: '140/85 mmHg',
        heartRate: '78 bpm',
        temperature: '98.6°F',
        weight: '165 lbs',
        height: '5\'6"'
      },
      recentTests: [
        { test: 'HbA1c', result: '7.2%', date: '2025-07-15', status: 'High' },
        { test: 'Cholesterol', result: '220 mg/dL', date: '2025-07-15', status: 'Elevated' }
      ],
      notes: 'Patient showing good compliance with medication. Needs dietary counseling.',
      totalVisits: 8,
      riskLevel: 'medium'
    },
    {
      id: 'P002',
      name: 'Michael Chen',
      age: 45,
      gender: 'Male',
      contactNumber: '+977-9856789012',
      email: 'michael.chen@email.com',
      address: 'Pokhara, Nepal',
      bloodGroup: 'A+',
      emergencyContact: '+977-9823456789',
      lastVisit: '2025-07-20',
      nextAppointment: '2025-08-04',
      appointmentTime: '2:30 PM',
      status: 'active',
      condition: 'Hypertension',
      severity: 'mild',
      primaryDiagnosis: 'Essential Hypertension',
      currentMedications: [
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' }
      ],
      vitalSigns: {
        bloodPressure: '130/80 mmHg',
        heartRate: '72 bpm',
        temperature: '98.4°F',
        weight: '180 lbs',
        height: '5\'10"'
      },
      recentTests: [
        { test: 'Blood Pressure', result: '130/80', date: '2025-07-20', status: 'Normal' },
        { test: 'Lipid Panel', result: 'Normal', date: '2025-07-20', status: 'Normal' }
      ],
      notes: 'Blood pressure well controlled. Continue current regimen.',
      totalVisits: 5,
      riskLevel: 'low'
    },
    {
      id: 'P003',
      name: 'Emily Davis',
      age: 28,
      gender: 'Female',
      contactNumber: '+977-9812345678',
      email: 'emily.davis@email.com',
      address: 'Lalitpur, Nepal',
      bloodGroup: 'B+',
      emergencyContact: '+977-9834567890',
      lastVisit: '2025-06-10',
      nextAppointment: '2025-08-03',
      appointmentTime: '4:00 PM',
      status: 'critical',
      condition: 'Asthma',
      severity: 'severe',
      primaryDiagnosis: 'Severe Persistent Asthma',
      currentMedications: [
        { name: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed' },
        { name: 'Fluticasone', dosage: '250mcg', frequency: 'Twice daily' },
        { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily' }
      ],
      vitalSigns: {
        bloodPressure: '110/70 mmHg',
        heartRate: '88 bpm',
        temperature: '98.8°F',
        weight: '125 lbs',
        height: '5\'4"'
      },
      recentTests: [
        { test: 'Peak Flow', result: '250 L/min', date: '2025-06-10', status: 'Low' },
        { test: 'Chest X-ray', result: 'Hyperinflation', date: '2025-06-10', status: 'Abnormal' }
      ],
      notes: 'Recent exacerbation. Requires close monitoring and possible medication adjustment.',
      totalVisits: 12,
      riskLevel: 'high'
    },
    {
      id: 'P004',
      name: 'David Wilson',
      age: 55,
      gender: 'Male',
      contactNumber: '+977-9823456789',
      email: 'david.wilson@email.com',
      address: 'Chitwan, Nepal',
      bloodGroup: 'AB+',
      emergencyContact: '+977-9845678901',
      lastVisit: '2025-07-01',
      nextAppointment: '2025-08-08',
      appointmentTime: '11:30 AM',
      status: 'stable',
      condition: 'Arthritis',
      severity: 'moderate',
      primaryDiagnosis: 'Osteoarthritis',
      currentMedications: [
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'Three times daily' },
        { name: 'Glucosamine', dosage: '1500mg', frequency: 'Once daily' }
      ],
      vitalSigns: {
        bloodPressure: '120/75 mmHg',
        heartRate: '68 bpm',
        temperature: '98.2°F',
        weight: '175 lbs',
        height: '5\'8"'
      },
      recentTests: [
        { test: 'X-ray Knee', result: 'Mild joint space narrowing', date: '2025-07-01', status: 'Mild' },
        { test: 'ESR', result: '15 mm/hr', date: '2025-07-01', status: 'Normal' }
      ],
      notes: 'Joint pain manageable with current treatment. Physical therapy recommended.',
      totalVisits: 6,
      riskLevel: 'low'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'error';
      case 'active': return 'warning';
      case 'stable': return 'success';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe': return 'error';
      case 'moderate': return 'warning';
      case 'mild': return 'info';
      default: return 'default';
    }
  };

  const showNotification = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const filteredPatients = activePatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    const matchesCondition = filterCondition === 'all' || patient.condition.toLowerCase().includes(filterCondition.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCondition;
  });

  const getPatientStats = () => {
    return {
      total: activePatients.length,
      active: activePatients.filter(p => p.status === 'active').length,
      critical: activePatients.filter(p => p.status === 'critical').length,
      stable: activePatients.filter(p => p.status === 'stable').length,
      highRisk: activePatients.filter(p => p.riskLevel === 'high').length
    };
  };

  const stats = getPatientStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Active Patient List
            </h1>
            <p className="text-green-100">
              Monitor and manage your active patients and their treatment progress
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Activity className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-orange-600">{stats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stable</p>
                <p className="text-2xl font-bold text-green-600">{stats.stable}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
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
                  placeholder="Search by name, ID, or condition..."
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
                <option value="active">Active</option>
                <option value="critical">Critical</option>
                <option value="stable">Stable</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Conditions</option>
                <option value="diabetes">Diabetes</option>
                <option value="hypertension">Hypertension</option>
                <option value="asthma">Asthma</option>
                <option value="arthritis">Arthritis</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card variant="medical">
        <CardHeader title={`Active Patients (${filteredPatients.length})`} />
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-600">ID: {patient.id} • {patient.age}yr {patient.gender}</p>
                        <p className="text-xs text-gray-500">{patient.address}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Primary Condition:</p>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant={getSeverityColor(patient.severity)} size="sm">
                            {patient.severity}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recent Visit:</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {patient.lastVisit}
                        </p>
                        <p className="text-xs text-gray-500">Next: {patient.nextAppointment}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Contact:</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {patient.contactNumber}
                        </p>
                        <p className="text-xs text-gray-500">Blood Group: {patient.bloodGroup}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant={getStatusColor(patient.status)} size="sm">
                        {patient.status.toUpperCase()}
                      </Badge>
                      <Badge variant={getRiskColor(patient.riskLevel)} size="sm">
                        {patient.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Total Visits: {patient.totalVisits}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => viewPatientDetails(patient)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View Details
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Message
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      Records
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No patients found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Modal */}
      <Modal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title="Patient Details"
        className="max-w-4xl"
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient Overview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Patient Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Name:</span> {selectedPatient.name}</p>
                  <p><span className="font-medium">Patient ID:</span> {selectedPatient.id}</p>
                  <p><span className="font-medium">Age:</span> {selectedPatient.age} years</p>
                  <p><span className="font-medium">Gender:</span> {selectedPatient.gender}</p>
                  <p><span className="font-medium">Blood Group:</span> {selectedPatient.bloodGroup}</p>
                </div>
                <div>
                  <p><span className="font-medium">Phone:</span> {selectedPatient.contactNumber}</p>
                  <p><span className="font-medium">Email:</span> {selectedPatient.email}</p>
                  <p><span className="font-medium">Address:</span> {selectedPatient.address}</p>
                  <p><span className="font-medium">Emergency Contact:</span> {selectedPatient.emergencyContact}</p>
                  <p><span className="font-medium">Total Visits:</span> {selectedPatient.totalVisits}</p>
                </div>
              </div>
            </div>

            {/* Medical Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-3">Medical Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Primary Diagnosis:</span> {selectedPatient.primaryDiagnosis}</p>
                  <p><span className="font-medium">Condition Severity:</span> 
                    <Badge variant={getSeverityColor(selectedPatient.severity)} size="sm" className="ml-2">
                      {selectedPatient.severity.toUpperCase()}
                    </Badge>
                  </p>
                  <p><span className="font-medium">Patient Status:</span> 
                    <Badge variant={getStatusColor(selectedPatient.status)} size="sm" className="ml-2">
                      {selectedPatient.status.toUpperCase()}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p><span className="font-medium">Risk Level:</span> 
                    <Badge variant={getRiskColor(selectedPatient.riskLevel)} size="sm" className="ml-2">
                      {selectedPatient.riskLevel.toUpperCase()}
                    </Badge>
                  </p>
                  <p><span className="font-medium">Last Visit:</span> {selectedPatient.lastVisit}</p>
                  <p><span className="font-medium">Next Appointment:</span> {selectedPatient.nextAppointment} at {selectedPatient.appointmentTime}</p>
                </div>
              </div>
            </div>

            {/* Current Medications */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3">Current Medications</h3>
              <div className="space-y-2">
                {selectedPatient.currentMedications.map((med, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{med.name}</span>
                      <span className="text-sm text-gray-600">{med.dosage}</span>
                    </div>
                    <p className="text-sm text-gray-600">{med.frequency}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vital Signs */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3">Latest Vital Signs</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Blood Pressure:</span> {selectedPatient.vitalSigns.bloodPressure}</p>
                  <p><span className="font-medium">Heart Rate:</span> {selectedPatient.vitalSigns.heartRate}</p>
                </div>
                <div>
                  <p><span className="font-medium">Temperature:</span> {selectedPatient.vitalSigns.temperature}</p>
                  <p><span className="font-medium">Weight:</span> {selectedPatient.vitalSigns.weight}</p>
                </div>
                <div>
                  <p><span className="font-medium">Height:</span> {selectedPatient.vitalSigns.height}</p>
                </div>
              </div>
            </div>

            {/* Recent Test Results */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-3">Recent Test Results</h3>
              <div className="space-y-2">
                {selectedPatient.recentTests.map((test, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{test.test}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm">{test.result}</span>
                        <Badge variant={test.status === 'Normal' ? 'success' : 'warning'} size="sm">
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Date: {test.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Clinical Notes</h3>
              <p className="text-sm text-gray-700">{selectedPatient.notes}</p>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPatientModal(false)}>
                Close
              </Button>
              <Button variant="primary">
                Update Records
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          id="active-patients-toast"
          title={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ActivePatientList;
