import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Edit, Trash2, CheckCircle, X, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Modal, Badge } from '../../components/ui';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';

const AppointmentsScheduling = () => {
  const { user } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  // New appointment form data
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientId: '',
    date: '',
    time: '',
    duration: '30',
    type: 'consultation',
    reason: '',
    notes: ''
  });

  const [appointments, setAppointments] = useState([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      date: '2025-08-05',
      time: '10:00',
      endTime: '10:30',
      duration: 30,
      type: 'consultation',
      reason: 'Follow-up for Blood Test Results',
      status: 'confirmed',
      contactNumber: '+977-9841234567',
      notes: 'Patient needs to bring previous test reports',
      priority: 'high'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      patientId: 'P002',
      date: '2025-08-04',
      time: '14:30',
      endTime: '15:15',
      duration: 45,
      type: 'check-up',
      reason: 'Routine Health Check-up',
      status: 'confirmed',
      contactNumber: '+977-9856789012',
      notes: 'Annual physical examination',
      priority: 'medium'
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      patientId: 'P003',
      date: '2025-08-03',
      time: '16:00',
      endTime: '17:00',
      duration: 60,
      type: 'urgent',
      reason: 'Chest Pain - Emergency Consultation',
      status: 'pending',
      contactNumber: '+977-9812345678',
      notes: 'Patient experiencing chest pain and breathing difficulties',
      priority: 'urgent'
    },
    {
      id: '4',
      patientName: 'David Wilson',
      patientId: 'P004',
      date: '2025-08-08',
      time: '11:30',
      endTime: '12:00',
      duration: 30,
      type: 'consultation',
      reason: 'Medication Review',
      status: 'confirmed',
      contactNumber: '+977-9823456789',
      notes: 'Review current medications and adjust dosage',
      priority: 'medium'
    },
    {
      id: '5',
      patientName: 'Lisa Anderson',
      patientId: 'P005',
      date: '2025-08-03',
      time: '09:00',
      endTime: '09:30',
      duration: 30,
      type: 'consultation',
      reason: 'Diabetes Management',
      status: 'confirmed',
      contactNumber: '+977-9834567890',
      notes: 'Review HbA1c results and adjust treatment plan',
      priority: 'medium'
    }
  ]);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const showNotification = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === today);
  };

  const getSelectedDateAppointments = () => {
    return appointments.filter(apt => apt.date === selectedDate);
  };

  const getAppointmentStats = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      today: appointments.filter(a => a.date === today).length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      urgent: appointments.filter(a => a.priority === 'urgent').length
    };
  };

  const handleCreateAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const endTime = new Date(`1970-01-01T${newAppointment.time}:00`);
    endTime.setMinutes(endTime.getMinutes() + parseInt(newAppointment.duration));
    
    const newApt = {
      id: Date.now().toString(),
      ...newAppointment,
      endTime: endTime.toTimeString().substr(0, 5),
      status: 'confirmed',
      priority: 'medium'
    };

    setAppointments(prev => [...prev, newApt]);
    setNewAppointment({
      patientName: '',
      patientId: '',
      date: '',
      time: '',
      duration: '30',
      type: 'consultation',
      reason: '',
      notes: ''
    });
    setShowBookingModal(false);
    showNotification('Appointment created successfully!', 'success');
  };

  const handleUpdateAppointment = (appointmentId, updates) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, ...updates }
          : apt
      )
    );
    showNotification('Appointment updated successfully!', 'success');
  };

  const handleDeleteAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    showNotification('Appointment cancelled successfully!', 'info');
  };

  const editAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const isTimeSlotAvailable = (date, time) => {
    return !appointments.some(apt => 
      apt.date === date && 
      apt.time === time && 
      apt.status !== 'cancelled'
    );
  };

  const stats = getAppointmentStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Appointments & Scheduling
            </h1>
            <p className="text-purple-100">
              Manage your appointment schedule and patient bookings
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
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
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
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="medical">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => setShowBookingModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'day' ? 'primary' : 'outline'}
                onClick={() => setViewMode('day')}
                size="sm"
              >
                Day View
              </Button>
              <Button
                variant={viewMode === 'week' ? 'primary' : 'outline'}
                onClick={() => setViewMode('week')}
                size="sm"
              >
                Week View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="medical">
          <CardHeader title="Today's Schedule" />
          <CardContent>
            <div className="space-y-3">
              {getTodaysAppointments().length > 0 ? (
                getTodaysAppointments()
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                          <Badge variant={getPriorityColor(appointment.priority)} size="sm">
                            {appointment.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time} - {appointment.endTime} ({appointment.duration} min)
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="xs" variant="outline" onClick={() => editAppointment(appointment)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="xs" 
                          variant="error" 
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No appointments today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Schedule */}
        <Card variant="medical">
          <CardHeader title={`Schedule for ${selectedDate}`} />
          <CardContent>
            <div className="space-y-3">
              {getSelectedDateAppointments().length > 0 ? (
                getSelectedDateAppointments()
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                          <Badge variant={getStatusColor(appointment.status)} size="sm">
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time} - {appointment.endTime}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="xs" variant="outline" onClick={() => editAppointment(appointment)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="xs" 
                          variant="error" 
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No appointments on this date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Slot Availability */}
      <Card variant="medical">
        <CardHeader title={`Available Time Slots - ${selectedDate}`} />
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
            {timeSlots.map((time) => (
              <div
                key={time}
                className={`p-2 text-center text-sm rounded border ${
                  isTimeSlotAvailable(selectedDate, time)
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {time}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Appointment Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Schedule New Appointment"
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment(prev => ({...prev, patientName: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient ID
              </label>
              <input
                type="text"
                value={newAppointment.patientId}
                onChange={(e) => setNewAppointment(prev => ({...prev, patientId: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient ID"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment(prev => ({...prev, date: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <select
                value={newAppointment.time}
                onChange={(e) => setNewAppointment(prev => ({...prev, time: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (min)
              </label>
              <select
                value={newAppointment.duration}
                onChange={(e) => setNewAppointment(prev => ({...prev, duration: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Type
            </label>
            <select
              value={newAppointment.type}
              onChange={(e) => setNewAppointment(prev => ({...prev, type: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="consultation">Consultation</option>
              <option value="check-up">Check-up</option>
              <option value="follow-up">Follow-up</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit
            </label>
            <input
              type="text"
              value={newAppointment.reason}
              onChange={(e) => setNewAppointment(prev => ({...prev, reason: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the visit purpose"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={newAppointment.notes}
              onChange={(e) => setNewAppointment(prev => ({...prev, notes: e.target.value}))}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes or instructions"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateAppointment}>
              Create Appointment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Appointment"
        className="max-w-lg"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                {selectedAppointment.patientName} ({selectedAppointment.patientId})
              </h3>
              <p className="text-sm text-gray-600">{selectedAppointment.reason}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedAppointment.status}
                onChange={(e) => setSelectedAppointment(prev => ({...prev, status: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  handleUpdateAppointment(selectedAppointment.id, { status: selectedAppointment.status });
                  setShowEditModal(false);
                }}
              >
                Update Appointment
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          id="appointments-toast"
          title={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default AppointmentsScheduling;
