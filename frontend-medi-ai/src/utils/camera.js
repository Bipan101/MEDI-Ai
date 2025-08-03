export class CameraManager {
  constructor() {
    this.currentStream = null;
    this.videoElement = null;
  }

  async requestCameraPermission() {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      return result.state === 'granted' || result.state === 'prompt';
    } catch (error) {
      console.warn('Permission API not supported, proceeding with camera access');
      return true;
    }
  }

  // Legacy method for backward compatibility
  async startCamera(videoElement) {
    const result = await this.initializeCamera();
    if (result.success) {
      this.attachToVideo(videoElement);
      return result.stream;
    } else {
      throw new Error(result.error);
    }
  }

  async initializeCamera(options = {}) {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          success: false,
          error: 'Camera is not supported in this browser'
        };
      }

      const constraints = {
        video: {
          facingMode: options.facingMode || 'environment',
          width: options.width || 1280,
          height: options.height || 720
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentStream = stream;

      return {
        success: true,
        stream
      };
    } catch (error) {
      let errorMessage = 'Failed to access camera';
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Camera access denied. Please allow camera permission and try again.';
            break;
          case 'NotFoundError':
            errorMessage = 'No camera found on this device.';
            break;
          case 'NotReadableError':
            errorMessage = 'Camera is already in use by another application.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'Camera constraints cannot be satisfied.';
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  attachToVideo(videoElement) {
    if (this.currentStream && videoElement) {
      videoElement.srcObject = this.currentStream;
      this.videoElement = videoElement;
    }
  }

  capturePhoto(shouldFlip = true) {
    if (!this.videoElement || !this.currentStream) {
      return {
        success: false,
        error: 'Camera not initialized'
      };
    }

    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        return {
          success: false,
          error: 'Failed to create canvas context'
        };
      }

      // Set canvas dimensions to match video
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;

      // Conditionally flip the image horizontally
      if (shouldFlip) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(this.videoElement, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();
      } else {
        context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      }

      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);

      return {
        success: true,
        imageDataUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to capture photo'
      };
    }
  }

  stopCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }
  }

  switchCamera() {
    const currentFacingMode = this.getCurrentFacingMode();
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    
    this.stopCamera();
    return this.initializeCamera({ facingMode: newFacingMode });
  }

  getCurrentFacingMode() {
    if (!this.currentStream) return 'environment';
    
    const videoTrack = this.currentStream.getVideoTracks()[0];
    if (!videoTrack) return 'environment';
    
    const settings = videoTrack.getSettings();
    return settings.facingMode || 'environment';
  }

  isActive() {
    return this.currentStream !== null;
  }
}