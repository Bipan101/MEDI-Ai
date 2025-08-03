import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star, Search, Filter, Map, Navigation, Heart, Shield, Users, TrendingUp, User, Building, Award, MessageCircle, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Modal, Badge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';

const HealthProviders = () => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showMap, setShowMap] = useState(false);
  
  // Doctor-specific states
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  
  // Patient resources
  const [resources, setResources] = useState([]);

  useEffect(() => {
    if (isDoctor) {
      // Doctor data: Specialist Network
      setSpecialists([
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
          email: 'rajesh.sharma@tuth.edu.np',
          consultationFee: 1500,
          availability: 'Mon, Wed, Fri - 2:00 PM to 6:00 PM',
          languages: ['Nepali', 'English'],
          expertise: ['Heart Surgery', 'Angioplasty', 'Cardiac Catheterization'],
          education: 'MBBS - KU, MD Internal Medicine - BPKIHS, DM Cardiology - AIIMS Delhi',
          referrals: 28,
          collaborations: 15,
          image: '/api/placeholder/100/100',
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
          email: 'sunita.thapa@birhospital.gov.np',
          consultationFee: 1200,
          availability: 'Tue, Thu, Sat - 10:00 AM to 2:00 PM',
          languages: ['Nepali', 'English', 'Hindi'],
          expertise: ['Stroke Treatment', 'Epilepsy', 'Migraine Management'],
          education: 'MBBS - IoM, MD Neurology - PGIMER Chandigarh',
          referrals: 35,
          collaborations: 22,
          image: '/api/placeholder/100/100',
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
          email: 'amit.bista@patnhospital.org.np',
          consultationFee: 1000,
          availability: 'Mon to Fri - 9:00 AM to 1:00 PM',
          languages: ['Nepali', 'English'],
          expertise: ['Joint Replacement', 'Sports Injuries', 'Fracture Management'],
          education: 'MBBS - KIST Medical College, MS Orthopedics - NAMS',
          referrals: 19,
          collaborations: 8,
          image: '/api/placeholder/100/100',
          status: 'available'
        }
      ]);
    } else {
      // Patient data: Local Healthcare Resources
      setResources([
        {
          id: '1',
          name: 'Tribhuvan University Teaching Hospital',
          type: 'hospital',
          category: 'Government Hospital',
          rating: 4.2,
          distance: '2.5 km',
          address: 'Maharajgunj, Kathmandu',
          phone: '+977-1-4412404',
          services: ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Neurology'],
          openHours: '24 Hours',
          website: 'www.tuth.edu.np',
          emergency: true,
          insurance: ['All Insurance Plans'],
          image: '/api/placeholder/150/100'
        },
        {
          id: '2', 
          name: 'Norvic International Hospital',
          type: 'hospital',
          category: 'Private Hospital',
          rating: 4.6,
          distance: '3.2 km',
          address: 'Thapathali, Kathmandu',
          phone: '+977-1-4258554',
          services: ['Emergency', 'ICU', 'Surgery', 'Maternity', 'Diagnostics'],
          openHours: '24 Hours',
          website: 'www.norvichospital.com',
          emergency: true,
          insurance: ['Prime', 'NIC Asia', 'Shikhar', 'IME General'],
          image: '/api/placeholder/150/100'
        },
        {
          id: '3',
          name: 'Medicare National Hospital',
          type: 'hospital', 
          category: 'Private Hospital',
          rating: 4.4,
          distance: '1.8 km',
          address: 'Chabahil, Kathmandu',
          phone: '+977-1-4466108',
          services: ['Emergency', 'Surgery', 'Pediatrics', 'Gynecology'],
          openHours: '24 Hours',
          website: 'www.medicare.com.np',
          emergency: true,
          insurance: ['Most Insurance Plans'],
          image: '/api/placeholder/150/100'
        },
        {
          id: '4',
          name: 'City Care Pharmacy',
          type: 'pharmacy',
          category: 'Pharmacy',
          rating: 4.3,
          distance: '0.8 km',
          address: 'New Road, Kathmandu',
          phone: '+977-1-4241122',
          services: ['Prescription Medicines', 'OTC Drugs', 'Medical Supplies'],
          openHours: '6:00 AM - 10:00 PM',
          website: 'www.citycarepharmacy.com',
          emergency: false,
          insurance: ['Medicine Insurance'],
          image: '/api/placeholder/150/100'
        },
        {
          id: '5',
          name: 'LifeCare Diagnostic Center',
          type: 'diagnostic',
          category: 'Diagnostic Center',
          rating: 4.5,
          distance: '1.2 km',
          address: 'Dillibazar, Kathmandu',
          phone: '+977-1-4411122',
          services: ['X-Ray', 'CT Scan', 'MRI', 'Blood Tests', 'ECG'],
          openHours: '7:00 AM - 7:00 PM',
          website: 'www.lifecarediagnostic.com',
          emergency: false,
          insurance: ['Health Insurance Plans'],
          image: '/api/placeholder/150/100'
        },
        {
          id: '6',
          name: 'Family Clinic',
          type: 'clinic',
          category: 'General Clinic',
          rating: 4.1,
          distance: '0.5 km',
          address: 'Putalisadak, Kathmandu',
          phone: '+977-1-4433221',
          services: ['General Consultation', 'Minor Surgery', 'Vaccinations'],
          openHours: '9:00 AM - 6:00 PM',
          website: 'www.familyclinic.com.np',
          emergency: false,
          insurance: ['Basic Insurance'],
          image: '/api/placeholder/150/100'
        }
      ]);
    }
  }, [isDoctor]);

  const categories = isDoctor ? 
    ['all', 'cardiology', 'neurology', 'orthopedics', 'pediatrics', 'gynecology'] :
    ['all', 'hospital', 'pharmacy', 'clinic', 'diagnostic', 'emergency'];

  const filteredData = (isDoctor ? specialists : resources).filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isDoctor ? 
        item.specialty.toLowerCase().includes(searchTerm.toLowerCase()) :
        item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      (isDoctor ? 
        item.specialty.toLowerCase() === selectedCategory :
        item.type === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isDoctor ? 'Specialist Network' : 'Healthcare Providers'}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>
      </div>

      {isDoctor && (
        // Doctor Statistics
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Network Specialists</p>
                  <p className="text-2xl font-bold text-blue-600">{specialists.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Referrals</p>
                  <p className="text-2xl font-bold text-green-600">
                    {specialists.reduce((total, s) => total + s.referrals, 0)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Collaborations</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {specialists.reduce((total, s) => total + s.collaborations, 0)}
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(specialists.reduce((total, s) => total + s.rating, 0) / specialists.length).toFixed(1)}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isDoctor ? "Search specialists by name or specialty..." : "Search providers by name or category..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {isDoctor ? (
                // Doctor View: Specialist Cards
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <Badge variant={getStatusBadge(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-blue-600 font-medium">{item.specialty}</p>
                      <p className="text-sm text-gray-600">{item.qualification}</p>
                      <p className="text-sm text-gray-600">{item.hospital}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className={`w-4 h-4 ${getRatingColor(item.rating)} fill-current`} />
                        <span className={`text-sm font-medium ${getRatingColor(item.rating)}`}>
                          {item.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{item.experience}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{item.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{item.availability}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Fee:</span>
                      <span className="text-green-600 font-semibold ml-1">NPR {item.consultationFee}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.expertise.slice(0, 3).map((exp, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                    {item.expertise.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedSpecialist(item)}
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </Button>
                  </div>
                </div>
              ) : (
                // Patient View: Healthcare Provider Cards
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-blue-600 font-medium">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className={`w-4 h-4 ${getRatingColor(item.rating)} fill-current`} />
                        <span className={`text-sm font-medium ${getRatingColor(item.rating)}`}>
                          {item.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{item.distance}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{item.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{item.openHours}</span>
                      {item.emergency && (
                        <Badge variant="error" className="ml-2">24/7 Emergency</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.services.slice(0, 4).map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {item.services.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.services.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedResource(item)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      Directions
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-4">
              {isDoctor ? <Users className="w-12 h-12 mx-auto" /> : <MapPin className="w-12 h-12 mx-auto" />}
            </div>
            <p className="text-gray-500">
              {isDoctor ? 'No specialists found matching your criteria' : 'No healthcare providers found matching your criteria'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Specialist Detail Modal for Doctors */}
      {selectedSpecialist && (
        <Modal
          isOpen={!!selectedSpecialist}
          onClose={() => setSelectedSpecialist(null)}
          title={`${selectedSpecialist.name} - ${selectedSpecialist.specialty}`}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{selectedSpecialist.name}</h3>
                <p className="text-blue-600 font-medium">{selectedSpecialist.specialty}</p>
                <p className="text-sm text-gray-600">{selectedSpecialist.qualification}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className={`w-4 h-4 ${getRatingColor(selectedSpecialist.rating)} fill-current`} />
                  <span className={`text-sm font-medium ${getRatingColor(selectedSpecialist.rating)}`}>
                    {selectedSpecialist.rating} Rating
                  </span>
                  <Badge variant={getStatusBadge(selectedSpecialist.status)}>
                    {selectedSpecialist.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{selectedSpecialist.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{selectedSpecialist.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedSpecialist.phone}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Professional Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Experience:</span> {selectedSpecialist.experience}
                  </div>
                  <div>
                    <span className="font-medium">Consultation Fee:</span> NPR {selectedSpecialist.consultationFee}
                  </div>
                  <div>
                    <span className="font-medium">Languages:</span> {selectedSpecialist.languages.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Availability</h4>
              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                {selectedSpecialist.availability}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Areas of Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSpecialist.expertise.map((exp, idx) => (
                  <Badge key={idx} variant="secondary">
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Education</h4>
              <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                {selectedSpecialist.education}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{selectedSpecialist.referrals}</p>
                <p className="text-sm text-gray-600">Active Referrals</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{selectedSpecialist.collaborations}</p>
                <p className="text-sm text-gray-600">Collaborations</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Consultation
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Resource Detail Modal for Patients */}
      {selectedResource && (
        <Modal
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          title={selectedResource.name}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedResource.name}</h3>
                <p className="text-blue-600 font-medium">{selectedResource.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className={`w-4 h-4 ${getRatingColor(selectedResource.rating)} fill-current`} />
                  <span className={`text-sm font-medium ${getRatingColor(selectedResource.rating)}`}>
                    {selectedResource.rating}
                  </span>
                  <span className="text-sm text-gray-500">• {selectedResource.distance}</span>
                </div>
              </div>
              {selectedResource.emergency && (
                <Badge variant="error">24/7 Emergency</Badge>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Contact & Location</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedResource.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{selectedResource.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{selectedResource.openHours}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Services</h4>
              <div className="flex flex-wrap gap-2">
                {selectedResource.services.map((service, idx) => (
                  <Badge key={idx} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Insurance Accepted</h4>
              <div className="flex flex-wrap gap-2">
                {selectedResource.insurance.map((ins, idx) => (
                  <Badge key={idx} variant="outline">
                    <Shield className="w-3 h-3 mr-1" />
                    {ins}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Get Directions
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HealthProviders;
