import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, AlertCircle, CheckCircle, Clock, TrendingUp, Stethoscope, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Badge, Progress } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';

const DoctorDashboard = () => {
  const { user } = useAuth();

  const patientAppointments = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      type: 'consultation',
      priority: 'high',
      reason: 'Follow-up for Blood Test Results',
      status: 'confirmed',
      duration: '30 min',
      contactNumber: '+977-9841234567'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      patientId: 'P002',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '2:30 PM',
      type: 'check-up',
      priority: 'medium',
      reason: 'Routine Health Check-up',
      status: 'pending',
      duration: '45 min',
      contactNumber: '+977-9856789012'
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      patientId: 'P003',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '4:00 PM',
      type: 'urgent',
      priority: 'high',
      reason: 'Chest Pain - Emergency Consultation',
      status: 'confirmed',
      duration: '60 min',
      contactNumber: '+977-9812345678'
    },
    {
      id: '4',
      patientName: 'David Wilson',
      patientId: 'P004',
      appointmentDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
      appointmentTime: '11:30 AM',
      type: 'consultation',
      priority: 'medium',
      reason: 'Medication Review and Adjustment',
      status: 'confirmed',
      duration: '30 min',
      contactNumber: '+977-9823456789'
    }
  ];

  const todayStats = {
    totalPatients: 24,
    pendingAppointments: patientAppointments.filter(apt => apt.status === 'pending').length,
    confirmedAppointments: patientAppointments.filter(apt => apt.status === 'confirmed').length,
    urgentCases: patientAppointments.filter(apt => apt.priority === 'high' || apt.type === 'urgent').length,
    todayAppointments: patientAppointments.filter(apt => apt.appointmentDate === new Date().toISOString().split('T')[0]).length
  };

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome, Dr. {user?.name}
            </h1>
            <p className="text-blue-100">
              You have {todayStats.todayAppointments} appointments today and {todayStats.pendingAppointments} pending requests.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.todayAppointments}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-orange-600">{todayStats.pendingAppointments}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed Today</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.confirmedAppointments}</p>
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
                <p className="text-2xl font-bold text-red-600">{todayStats.urgentCases}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Patient Appointments */}
      <Card variant="medical">
        <CardHeader 
          title="Quick Patient Appointments" 
          action={
            <Link to="/doctor/appointments">
              <Button variant="outline" size="sm">
                View All Appointments
              </Button>
            </Link>
          }
        />
        <CardContent>
          <div className="space-y-3">
            {patientAppointments.slice(0, 4).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {appointment.type === 'consultation' && <Users className="h-6 w-6 text-blue-600" />}
                    {appointment.type === 'check-up' && <CheckCircle className="h-6 w-6 text-green-600" />}
                    {appointment.type === 'urgent' && <AlertCircle className="h-6 w-6 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                      <span className="text-xs text-gray-500">({appointment.patientId})</span>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {appointment.appointmentDate}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.appointmentTime} ({appointment.duration})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={getPriorityColor(appointment.priority)} size="sm">
                    {appointment.priority}
                  </Badge>
                  <Badge variant={getStatusColor(appointment.status)} size="sm">
                    {appointment.status}
                  </Badge>
                  {appointment.status === 'pending' && (
                    <div className="flex gap-1 mt-2">
                      <Button size="xs" variant="success">
                        Accept
                      </Button>
                      <Button size="xs" variant="outline">
                        Reschedule
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {patientAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No appointments scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="medical">
          <CardHeader title="This Month's Performance" />
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Patient Satisfaction
                  </span>
                  <span className="text-sm text-gray-500">96%</span>
                </div>
                <Progress value={96} variant="success" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Response Time
                  </span>
                  <span className="text-sm text-gray-500">92%</span>
                </div>
                <Progress value={92} variant="success" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Cases Resolved
                  </span>
                  <span className="text-sm text-gray-500">87%</span>
                </div>
                <Progress value={87} variant="warning" />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Rating
                  </span>
                  <Badge variant="success" size="sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Excellent
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="medical">
          <CardHeader title="Quick Actions" />
          <CardContent>
            <div className="space-y-3">
              <Link to="/doctor/appointment-requests">
                <Button variant="primary" fullWidth className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Patient Appointment Requests
                </Button>
              </Link>
              
              <Link to="/doctor/active-patients">
                <Button variant="outline" fullWidth className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Active Patient List
                </Button>
              </Link>
              
              <Link to="/doctor/appointments">
                <Button variant="outline" fullWidth className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointments & Scheduling
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button variant="outline" fullWidth className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
