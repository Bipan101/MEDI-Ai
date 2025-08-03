import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Star, MapPin, Phone, Search, Filter, CheckCircle, AlertCircle, CalendarDays, Users } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Modal, Badge } from '../../components/ui';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';

const AppointmentPage = () => {
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  
  // Patient's appointments
  const [myAppointments, setMyAppointments] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);

  useEffect(() => {
    // Load available doctors
    setAvailableDoctors([
      {
        id: '1',
        name: 'Dr. Rajesh Sharma',
        specialty: 'Cardiology',
        qualification: 'MD, DM Cardiology',
        hospital: 'Tribhuvan University Teaching Hospital',
        experience: '15 years',
        rating: 4.8,
        location: 'Maharajgunj, Kathmandu',
        phone: '+977-9841234567',
        consultationFee: 1500,
        availability: {
          monday: { 
            slots: [
              { time: '09:00', capacity: 8, booked: 3 },
              { time: '10:00', capacity: 10, booked: 7 },
              { time: '11:00', capacity: 8, booked: 2 },
              { time: '14:00', capacity: 10, booked: 4 },
              { time: '15:00', capacity: 8, booked: 1 }
            ], 
            status: 'available' 
          },
          tuesday: { slots: [], status: 'unavailable' },
          wednesday: { 
            slots: [
              { time: '09:00', capacity: 8, booked: 6 },
              { time: '10:00', capacity: 10, booked: 9 },
              { time: '11:00', capacity: 8, booked: 3 },
              { time: '14:00', capacity: 10, booked: 5 },
              { time: '15:00', capacity: 8, booked: 2 }
            ], 
            status: 'available' 
          },
          thursday: { 
            slots: [
              { time: '14:00', capacity: 6, booked: 4 },
              { time: '15:00', capacity: 6, booked: 3 },
              { time: '16:00', capacity: 6, booked: 1 }
            ], 
            status: 'limited' 
          },
          friday: { 
            slots: [
              { time: '09:00', capacity: 8, booked: 2 },
              { time: '10:00', capacity: 10, booked: 5 },
              { time: '11:00', capacity: 8, booked: 4 },
              { time: '14:00', capacity: 10, booked: 6 },
              { time: '15:00', capacity: 8, booked: 3 }
            ], 
            status: 'available' 
          },
          saturday: { 
            slots: [
              { time: '09:00', capacity: 5, booked: 3 },
              { time: '10:00', capacity: 5, booked: 4 }
            ], 
            status: 'limited' 
          },
          sunday: { slots: [], status: 'unavailable' }
        },
        nextAvailable: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        image: '/api/placeholder/80/80',
        status: 'available'
      },
      {
        id: '2',
        name: 'Dr. Sunita Thapa',
        specialty: 'Neurology',
        qualification: 'MD, DM Neurology',
        hospital: 'Bir Hospital',
        experience: '12 years',
        rating: 4.9,
        location: 'Ratna Park, Kathmandu',
        phone: '+977-9851234567',
        consultationFee: 1200,
        availability: {
          monday: { 
            slots: [
              { time: '10:00', capacity: 6, booked: 2 },
              { time: '11:00', capacity: 6, booked: 4 },
              { time: '15:00', capacity: 8, booked: 1 },
              { time: '16:00', capacity: 8, booked: 3 }
            ], 
            status: 'available' 
          },
          tuesday: { 
            slots: [
              { time: '09:00', capacity: 8, booked: 5 },
              { time: '10:00', capacity: 6, booked: 3 },
              { time: '11:00', capacity: 6, booked: 2 },
              { time: '15:00', capacity: 8, booked: 6 },
              { time: '16:00', capacity: 8, booked: 4 }
            ], 
            status: 'available' 
          },
          wednesday: { 
            slots: [
              { time: '16:00', capacity: 4, booked: 3 }
            ], 
            status: 'limited' 
          },
          thursday: { 
            slots: [
              { time: '09:00', capacity: 8, booked: 3 },
              { time: '10:00', capacity: 6, booked: 4 },
              { time: '11:00', capacity: 6, booked: 1 },
              { time: '15:00', capacity: 8, booked: 7 },
              { time: '16:00', capacity: 8, booked: 2 }
            ], 
            status: 'available' 
          },
          friday: { slots: [], status: 'unavailable' },
          saturday: { 
            slots: [
              { time: '09:00', capacity: 5, booked: 2 },
              { time: '10:00', capacity: 5, booked: 4 },
              { time: '11:00', capacity: 5, booked: 1 }
            ], 
            status: 'available' 
          },
          sunday: { slots: [], status: 'unavailable' }
        },
        nextAvailable: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
        image: '/api/placeholder/80/80',
        status: 'busy'
      },
      {
        id: '3',
        name: 'Dr. Amit Bista',
        specialty: 'Orthopedics',
        qualification: 'MS Orthopedics',
        hospital: 'Patan Hospital',
        experience: '10 years',
        rating: 4.7,
        location: 'Lagankhel, Lalitpur',
        phone: '+977-9861234567',
        consultationFee: 1000,
        availability: {
          monday: { 
            slots: [
              { time: '09:00', capacity: 12, booked: 4 },
              { time: '10:00', capacity: 12, booked: 8 },
              { time: '11:00', capacity: 12, booked: 6 },
              { time: '12:00', capacity: 10, booked: 3 }
            ], 
            status: 'available' 
          },
          tuesday: { 
            slots: [
              { time: '09:00', capacity: 12, booked: 7 },
              { time: '10:00', capacity: 12, booked: 11 },
              { time: '11:00', capacity: 12, booked: 5 },
              { time: '12:00', capacity: 10, booked: 2 }
            ], 
            status: 'available' 
          },
          wednesday: { 
            slots: [
              { time: '09:00', capacity: 12, booked: 9 },
              { time: '10:00', capacity: 12, booked: 12 },
              { time: '11:00', capacity: 12, booked: 8 },
              { time: '12:00', capacity: 10, booked: 4 }
            ], 
            status: 'available' 
          },
          thursday: { 
            slots: [
              { time: '09:00', capacity: 12, booked: 6 },
              { time: '10:00', capacity: 12, booked: 9 },
              { time: '11:00', capacity: 12, booked: 7 },
              { time: '12:00', capacity: 10, booked: 5 }
            ], 
            status: 'available' 
          },
          friday: { 
            slots: [
              { time: '09:00', capacity: 12, booked: 3 },
              { time: '10:00', capacity: 12, booked: 6 },
              { time: '11:00', capacity: 12, booked: 4 },
              { time: '12:00', capacity: 10, booked: 1 }
            ], 
            status: 'available' 
          },
          saturday: { slots: [], status: 'unavailable' },
          sunday: { slots: [], status: 'unavailable' }
        },
        nextAvailable: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        image: '/api/placeholder/80/80',
        status: 'available'
      },
      {
        id: '4',
        name: 'Dr. Priya Maharjan',
        specialty: 'Pediatrics',
        qualification: 'MD Pediatrics',
        hospital: 'Kanti Children Hospital',
        experience: '8 years',
        rating: 4.6,
        location: 'Maharajgunj, Kathmandu',
        phone: '+977-9871234567',
        consultationFee: 800,
        availability: {
          monday: { 
            slots: [
              { time: '14:00', capacity: 15, booked: 8 },
              { time: '15:00', capacity: 15, booked: 12 },
              { time: '16:00', capacity: 15, booked: 6 },
              { time: '17:00', capacity: 12, booked: 4 }
            ], 
            status: 'available' 
          },
          tuesday: { 
            slots: [
              { time: '14:00', capacity: 15, booked: 10 },
              { time: '15:00', capacity: 15, booked: 14 },
              { time: '16:00', capacity: 15, booked: 7 },
              { time: '17:00', capacity: 12, booked: 5 }
            ], 
            status: 'available' 
          },
          wednesday: { 
            slots: [
              { time: '14:00', capacity: 15, booked: 9 },
              { time: '15:00', capacity: 15, booked: 13 },
              { time: '16:00', capacity: 15, booked: 11 },
              { time: '17:00', capacity: 12, booked: 8 }
            ], 
            status: 'available' 
          },
          thursday: { 
            slots: [
              { time: '14:00', capacity: 15, booked: 11 },
              { time: '15:00', capacity: 15, booked: 15 },
              { time: '16:00', capacity: 15, booked: 9 },
              { time: '17:00', capacity: 12, booked: 6 }
            ], 
            status: 'available' 
          },
          friday: { 
            slots: [
              { time: '14:00', capacity: 15, booked: 5 },
              { time: '15:00', capacity: 15, booked: 8 },
              { time: '16:00', capacity: 15, booked: 3 },
              { time: '17:00', capacity: 12, booked: 2 }
            ], 
            status: 'available' 
          },
          saturday: { 
            slots: [
              { time: '09:00', capacity: 10, booked: 6 },
              { time: '10:00', capacity: 10, booked: 8 },
              { time: '11:00', capacity: 10, booked: 4 }
            ], 
            status: 'available' 
          },
          sunday: { slots: [], status: 'unavailable' }
        },
        nextAvailable: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        image: '/api/placeholder/80/80',
        status: 'available'
      }
    ]);

    // Load patient's existing appointments
    setMyAppointments([
      {
        id: '1',
        doctorName: 'Dr. Rajesh Sharma',
        specialty: 'Cardiology',
        date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
        time: '10:00',
        status: 'confirmed',
        reason: 'Regular checkup',
        hospital: 'Tribhuvan University Teaching Hospital'
      },
      {
        id: '2',
        doctorName: 'Dr. Sunita Thapa',
        specialty: 'Neurology',
        date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
        time: '15:00',
        status: 'pending',
        reason: 'Consultation for headaches',
        hospital: 'Bir Hospital'
      }
    ]);
  }, []);

  const specialties = ['all', 'cardiology', 'neurology', 'orthopedics', 'pediatrics', 'gynecology', 'dermatology'];

  const filteredDoctors = availableDoctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
      doctor.specialty.toLowerCase() === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  const showNotification = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'unavailable': return 'error';
      default: return 'default';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getAppointmentStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getDayName = (dateStr) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const getAvailableSlots = (doctor, date) => {
    if (!date || !doctor) return [];
    const dayName = getDayName(date);
    return doctor.availability[dayName]?.slots || [];
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate('');
    setSelectedTime('');
    setAppointmentReason('');
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime || !appointmentReason.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Check if the selected time slot is still available
    const dayName = getDayName(selectedDate);
    const slots = selectedDoctor.availability[dayName]?.slots || [];
    const selectedSlot = slots.find(slot => slot.time === selectedTime);
    
    if (!selectedSlot || selectedSlot.booked >= selectedSlot.capacity) {
      showNotification('Sorry, this time slot is now fully booked. Please select another time.', 'error');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAppointment = {
        id: Date.now().toString(),
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        reason: appointmentReason,
        hospital: selectedDoctor.hospital
      };

      setMyAppointments(prev => [newAppointment, ...prev]);
      
      // Update the doctor's availability to reflect the new booking
      setAvailableDoctors(prev => 
        prev.map(doctor => {
          if (doctor.id === selectedDoctor.id) {
            return {
              ...doctor,
              availability: {
                ...doctor.availability,
                [dayName]: {
                  ...doctor.availability[dayName],
                  slots: doctor.availability[dayName].slots.map(slot => 
                    slot.time === selectedTime 
                      ? { ...slot, booked: slot.booked + 1 }
                      : slot
                  )
                }
              }
            };
          }
          return doctor;
        })
      );
      
      setShowBookingModal(false);
      showNotification('Appointment booked successfully! You will receive a confirmation shortly.', 'success');
    } catch (error) {
      showNotification('Failed to book appointment. Please try again.', 'error');
    }
  };

  const cancelAppointment = (appointmentId) => {
    setMyAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      )
    );
    showNotification('Appointment cancelled successfully', 'info');
  };

  // Generate next 7 days for date selection
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('my-appointments').scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2"
          >
            <CalendarDays className="w-4 h-4" />
            My Appointments
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map(doctor => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                        <Badge variant={getStatusBadge(doctor.status)}>
                          {doctor.status}
                        </Badge>
                      </div>
                      <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                      <p className="text-sm text-gray-600">{doctor.qualification}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className={`w-4 h-4 ${getRatingColor(doctor.rating)} fill-current`} />
                      <span className={`text-sm font-medium ${getRatingColor(doctor.rating)}`}>
                        {doctor.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{doctor.experience}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{doctor.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Consultation Fee:</span>
                    <span className="text-green-600 font-semibold ml-1">NPR {doctor.consultationFee}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Next Available:</span>
                    <span className="text-blue-600 ml-1">{doctor.nextAvailable}</span>
                  </div>
                </div>

                {/* Weekly Availability Summary */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">This Week Availability:</p>
                  <div className="grid grid-cols-7 gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index];
                      const dayAvailability = doctor.availability[dayKey];
                      const totalSlots = dayAvailability.slots.length;
                      const availableSlots = dayAvailability.slots.filter(slot => slot.booked < slot.capacity).length;
                      const statusColor = 
                        dayAvailability.status === 'available' ? 'bg-green-100 text-green-800' :
                        dayAvailability.status === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-500';
                      
                      return (
                        <div key={day} className={`text-xs p-1 rounded text-center ${statusColor}`}>
                          <div className="font-medium">{day}</div>
                          <div>{availableSlots || '-'}/{totalSlots || '-'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={() => handleBookAppointment(doctor)}
                  className="w-full"
                  disabled={doctor.status === 'unavailable'}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No doctors found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* My Appointments Section */}
      <div id="my-appointments">
        <Card>
          <CardHeader title="My Appointments" />
          <CardContent>
            <div className="space-y-4">
              {myAppointments.length > 0 ? (
                myAppointments.map(appointment => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{appointment.doctorName}</h3>
                          <Badge variant={getAppointmentStatusBadge(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div>
                            <span className="font-medium">Specialty:</span> {appointment.specialty}
                          </div>
                          <div>
                            <span className="font-medium">Hospital:</span> {appointment.hospital}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {appointment.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No appointments scheduled yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <Modal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title={`Book Appointment with ${selectedDoctor.name}`}
        >
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-blue-600">{selectedDoctor.specialty}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor.hospital}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date *
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime(''); // Reset time when date changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a date</option>
                  {getNext7Days().map(date => {
                    const dayName = getDayName(date);
                    const availability = selectedDoctor.availability[dayName];
                    const availableSlots = availability.slots.filter(slot => slot.booked < slot.capacity);
                    const isAvailable = availableSlots.length > 0;
                    
                    return (
                      <option key={date} value={date} disabled={!isAvailable}>
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })} {!isAvailable && '(Fully Booked)'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {getAvailableSlots(selectedDoctor, selectedDate).map(slot => {
                      const isFullyBooked = slot.booked >= slot.capacity;
                      const remainingSlots = slot.capacity - slot.booked;
                      
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => !isFullyBooked && setSelectedTime(slot.time)}
                          disabled={isFullyBooked}
                          className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                            selectedTime === slot.time
                              ? 'bg-blue-500 text-white border-blue-500'
                              : isFullyBooked
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="font-medium">{slot.time}</div>
                          <div className={`text-xs mt-1 ${
                            selectedTime === slot.time ? 'text-blue-100' : 
                            isFullyBooked ? 'text-gray-400' : 
                            remainingSlots <= 3 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {isFullyBooked ? 'Fully Booked' : `${remainingSlots} spots left`}
                          </div>
                          <div className={`text-xs ${
                            selectedTime === slot.time ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            Capacity: {slot.capacity}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {getAvailableSlots(selectedDoctor, selectedDate).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No available time slots for this date
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <textarea
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for consultation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Consultation Fee:</span>
                  <span className="text-green-600 font-semibold ml-1">NPR {selectedDoctor.consultationFee}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Payment can be made at the hospital during your visit
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={confirmBooking}
                className="flex-1"
                disabled={!selectedDate || !selectedTime || !appointmentReason.trim()}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Booking
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          id="appointment-toast"
          title={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default AppointmentPage;
