export const userNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    path: '/dashboard',
    roles: ['user'],
  },
  {
    id: 'scan-interpreter',
    label: 'Scan Interpreter',
    icon: 'FileText',
    path: '/scan-interpreter',
    roles: ['user'],
  },
  {
    id: 'medicine-scanner',
    label: 'Medicine Scanner',
    icon: 'Pill',
    path: '/medicine-scanner',
    roles: ['user'],
  },
  {
    id: 'history',
    label: 'History',
    icon: 'Clock',
    path: '/history',
    roles: ['user'],
  },
  {
    id: 'health-providers',
    label: 'Health Providers',
    icon: 'MapPin',
    path: '/health-providers',
    roles: ['user'],
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: 'Calendar',
    path: '/appointments',
    roles: ['user'],
  },
];

export const doctorNavigation = [
  {
    id: 'doctor-dashboard',
    label: 'Dashboard',
    icon: 'Home',
    path: '/doctor/dashboard',
    roles: ['doctor'],
  },
  {
    id: 'patient-appointment-requests',
    label: 'Patient Appointment Requests',
    icon: 'UserCheck',
    path: '/doctor/appointment-requests',
    roles: ['doctor'],
  },
  {
    id: 'active-patients',
    label: 'Active Patient List',
    icon: 'Users',
    path: '/doctor/active-patients',
    roles: ['doctor'],
  },
  {
    id: 'appointments-scheduling',
    label: 'Appointments & Scheduling',
    icon: 'Calendar',
    path: '/doctor/appointments',
    roles: ['doctor'],
  },
];

export const sharedNavigation = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'User',
    path: '/profile',
    roles: ['user', 'doctor'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    roles: ['user', 'doctor'],
  },
];

export const getNavigationForRole = (role) => {
  const roleNavigation = role === 'doctor' ? doctorNavigation : userNavigation;
  return [...roleNavigation, ...sharedNavigation];
};
