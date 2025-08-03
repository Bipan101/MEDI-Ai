import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Pill, MapPin, MessageCircle, Calendar, Upload, Activity, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent, Button, Badge, Progress } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';

const UserDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Scan Medical Report',
      description: 'Upload and interpret medical documents',
      icon: FileText,
      path: '/scan-interpreter',
      color: 'bg-blue-500',
    },
    {
      title: 'Medicine Scanner',
      description: 'Scan medicine for information',
      icon: Pill,
      path: '/medicine-scanner',
      color: 'bg-green-500',
    },
    {
      title: 'Book Appointment',
      description: 'Schedule consultation with doctors',
      icon: Calendar,
      path: '/appointments',
      color: 'bg-indigo-500',
    },
    {
      title: 'Health Providers',
      description: 'Find nearby healthcare facilities',
      icon: MapPin,
      path: '/health-providers',
      color: 'bg-orange-500',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'scan',
      title: 'Blood Test Report',
      date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
      status: 'completed',
    },
    {
      id: '2',
      type: 'medicine',
      title: 'Paracetamol 500mg',
      date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
      status: 'completed',
    },
    {
      id: '3',
      type: 'scan',
      title: 'X-Ray Report Analysis',
      date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0],
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-primary-100">
              Your health companion is ready to assist you today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Activity className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card key={action.path} variant="medical" clickable>
              <CardContent className="p-4">
                <Link to={action.path} className="block">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {action.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {action.description}
                  </p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-1">
          <Card variant="medical">
            <CardHeader title="Your Health Stats" />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Scans Completed
                    </span>
                    <span className="text-sm text-gray-500">12/20</span>
                  </div>
                  <Progress value={60} variant="success" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Health Score
                    </span>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                  <Progress value={85} variant="success" />
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      This Month
                    </span>
                    <Badge variant="success" size="sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card variant="medical">
            <CardHeader 
              title="Recent Activity" 
              action={
                <Link to="/history">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              }
            />
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        {activity.type === 'scan' && <FileText className="h-4 w-4 text-primary-600" />}
                        {activity.type === 'medicine' && <Pill className="h-4 w-4 text-primary-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Section */}
      <Card variant="outlined">
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Quick Upload
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your medical documents here or click to browse
            </p>
            <Button variant="primary">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
