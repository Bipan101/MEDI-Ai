// API configuration and service functions
const API_BASE_URL = 'http://localhost:8000'; // Django backend URL

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to create FormData for file uploads
  createFormData(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return formData;
  }

  // Helper method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Accept': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    };

    // Don't set Content-Type for FormData - let browser set it
    if (!(options.body instanceof FormData)) {
      defaultOptions.headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      // Add timeout support
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // More specific error messages
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please check if the backend server is running.');
        } else if (response.status === 500) {
          throw new Error(errorData.error || 'Internal server error. Please try again later.');
        } else if (response.status === 400) {
          throw new Error(errorData.error || 'Invalid request. Please check your input.');
        }
        
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      } else if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running and try again.');
      }
      
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Check if backend is accessible
  async checkBackendHealth() {
    try {
      const response = await fetch(`${this.baseURL}/medi-ai/user/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        timeout: 5000
      });
      return { accessible: true, status: response.status };
    } catch (error) {
      return { accessible: false, error: error.message };
    }
  }

  // Medicine Scanner API
  async scanMedicine(imageFile) {
    // Validate image file
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error('Please provide a valid image file');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Please upload a JPEG or PNG image file');
    }

    if (imageFile.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Image file is too large. Please use an image smaller than 10MB');
    }

    const formData = this.createFormData({
      image: imageFile
    });

    return await this.makeRequest('/medi-ai/medicine-scanner/', {
      method: 'POST',
      body: formData,
    });
  }

  // Label Explainer API (existing)
  async explainLabel(imageFile, prompt, sessionKey) {
    const formData = this.createFormData({
      image: imageFile,
      prompt: prompt
    });

    return await this.makeRequest('/medi-ai/label-explaner/', {
      method: 'POST',
      body: formData,
      headers: {
        'Session-Key': sessionKey
      }
    });
  }

  // Continue conversation with existing image context
  async continueConversation(prompt, sessionKey) {
    return await this.makeRequest('/medi-ai/label-explaner/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Session-Key': sessionKey
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });
  }

  // User registration API
  async registerUser(userData) {
    return await this.makeRequest('/medi-ai/user/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Get users API
  async getUsers() {
    return await this.makeRequest('/medi-ai/user/', {
      method: 'GET',
    });
  }

  // Medical Report Analyzer API
  async analyzeMedicalReport(imageFile, prompt = '') {
    // Validate image file
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error('Please provide a valid medical report image file');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Please upload a JPEG or PNG image file');
    }

    if (imageFile.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Image file is too large. Please use an image smaller than 10MB');
    }

    const formData = this.createFormData({
      image: imageFile,
      prompt: prompt
    });

    return await this.makeRequest('/medi-ai/medical-report-analyzer/', {
      method: 'POST',
      body: formData,
    });
  }

  // Medical Report API
  async uploadMedicalReport(reportData) {
    const formData = this.createFormData(reportData);

    return await this.makeRequest('/medi-ai/medical-report/', {
      method: 'POST',
      body: formData,
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  scanMedicine,
  explainLabel,
  continueConversation,
  registerUser,
  getUsers,
  analyzeMedicalReport,
  uploadMedicalReport
} = apiService;
