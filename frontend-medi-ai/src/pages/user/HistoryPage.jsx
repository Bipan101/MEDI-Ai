import React, { useState } from 'react';
import { FileText, Calendar, Eye, Download, Filter, Search, Clock, Building2, User } from 'lucide-react';
import { Card, CardContent, Button, Badge, Input, Modal, Progress } from '../../components/ui';
import { mockMedicalScans } from '../../data/mockData.js';
import { formatDate, formatTimeAgo } from '../../utils/helpers';

const HistoryPage = () => {
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'hospital', 'user'

  const filteredScans = mockMedicalScans.filter(scan => {
    const matchesSearch = scan.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scan.interpretation?.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || scan.type === filterType;
    const matchesTab = activeTab === 'all' || scan.source === activeTab;
    return matchesSearch && matchesFilter && matchesTab;
  });

  // Categorize scans by source
  const hospitalScans = mockMedicalScans.filter(scan => scan.source === 'hospital');
  const userScans = mockMedicalScans.filter(scan => scan.source === 'user');

  const handleViewDetails = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'lab_report':
        return 'Lab Report';
      case 'x_ray':
        return 'X-Ray';
      case 'prescription':
        return 'Prescription';
      case 'medicine':
        return 'Medicine';
      default:
        return 'Document';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'lab_report':
        return 'bg-blue-100 text-blue-800';
      case 'x_ray':
        return 'bg-green-100 text-green-800';
      case 'prescription':
        return 'bg-yellow-100 text-yellow-800';
      case 'medicine':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'success';
    if (confidence >= 70) return 'warning';
    return 'error';
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
          <p className="text-gray-600 mt-1">
            View and manage your medical scans and reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="info" className="text-sm">
            {filteredScans.length} {filteredScans.length === 1 ? 'record' : 'records'}
          </Badge>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Records ({mockMedicalScans.length})
          </button>
          <button
            onClick={() => setActiveTab('hospital')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'hospital'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Hospital Uploads ({hospitalScans.length})
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'user'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="h-4 w-4" />
            My Uploads ({userScans.length})
          </button>
        </nav>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search scans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="lab_report">Lab Reports</option>
                <option value="x_ray">X-Rays</option>
                <option value="prescription">Prescriptions</option>
                <option value="medicine">Medicines</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScans.map((scan) => (
          <Card key={scan.id} variant="medical" className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {/* Thumbnail */}
              <div className="relative mb-4">
                <img
                  src={scan.thumbnail}
                  alt={scan.fileName}
                  className="w-full h-32 object-cover rounded-lg bg-gray-100"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getTypeColor(scan.type)} size="sm">
                    {getTypeLabel(scan.type)}
                  </Badge>
                  {scan.source === 'hospital' && (
                    <Badge variant="success" size="sm">
                      <Building2 className="h-3 w-3 mr-1" />
                      Hospital
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate" title={scan.fileName}>
                    {scan.fileName}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(scan.uploadDate)}
                  </div>
                  {scan.source === 'hospital' && scan.hospitalName && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Building2 className="h-3 w-3 mr-1" />
                      {scan.hospitalName}
                    </div>
                  )}
                </div>

                {/* Confidence Score */}
                {scan.confidence && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Confidence</span>
                      <span className="font-medium">{scan.confidence}%</span>
                    </div>
                    <Progress 
                      value={scan.confidence} 
                      variant={getConfidenceColor(scan.confidence)}
                      size="sm"
                    />
                  </div>
                )}

                {/* Risk Level */}
                {scan.interpretation?.riskLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <Badge variant={getRiskLevelColor(scan.interpretation.riskLevel)} size="sm">
                      {scan.interpretation.riskLevel.charAt(0).toUpperCase() + scan.interpretation.riskLevel.slice(1)}
                    </Badge>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(scan)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(scan.fileUrl, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredScans.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scans found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'No scans match your search criteria. Try adjusting your filters.'
                : 'You haven\'t uploaded any medical scans yet. Start by uploading your first scan.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedScan?.fileName || 'Scan Details'}
      >
        {selectedScan && (
          <div className="space-y-6">
            {/* Scan Image */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={selectedScan.fileUrl}
                alt={selectedScan.fileName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">File Name</h4>
                <p className="text-sm text-gray-600">{selectedScan.fileName}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Upload Date</h4>
                <p className="text-sm text-gray-600">{formatDate(selectedScan.uploadDate)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Type</h4>
                <Badge className={getTypeColor(selectedScan.type)} size="sm">
                  {getTypeLabel(selectedScan.type)}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Source</h4>
                <div className="flex items-center gap-2">
                  {selectedScan.source === 'hospital' ? (
                    <Badge variant="success" size="sm">
                      <Building2 className="h-3 w-3 mr-1" />
                      Hospital Upload
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">
                      <User className="h-3 w-3 mr-1" />
                      Personal Upload
                    </Badge>
                  )}
                </div>
              </div>
              {selectedScan.source === 'hospital' && selectedScan.hospitalName && (
                <div className="col-span-2">
                  <h4 className="font-medium text-gray-900 mb-1">Hospital</h4>
                  <p className="text-sm text-gray-600">{selectedScan.hospitalName}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Confidence</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant={getConfidenceColor(selectedScan.confidence)} size="sm">
                    {selectedScan.confidence}%
                  </Badge>
                  <Progress 
                    value={selectedScan.confidence} 
                    variant={getConfidenceColor(selectedScan.confidence)}
                    size="sm"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Interpretation */}
            {selectedScan.interpretation && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">AI Interpretation</h4>
                
                {/* Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                  <p className="text-sm text-gray-700">{selectedScan.interpretation.summary}</p>
                </div>

                {/* Findings */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Key Findings</h5>
                  <ul className="space-y-1">
                    {selectedScan.interpretation.findings.map((finding, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                  <ul className="space-y-1">
                    {selectedScan.interpretation.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Level */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Risk Level</span>
                  <Badge variant={getRiskLevelColor(selectedScan.interpretation.riskLevel)}>
                    {selectedScan.interpretation.riskLevel.charAt(0).toUpperCase() + selectedScan.interpretation.riskLevel.slice(1)}
                  </Badge>
                </div>

                {/* Disclaimer */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Disclaimer:</strong> {selectedScan.interpretation.disclaimer}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => window.open(selectedScan.fileUrl, '_blank')}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Original
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;