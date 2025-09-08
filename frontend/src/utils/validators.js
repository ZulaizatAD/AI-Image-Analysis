import { APP_CONFIG } from "./constants";

export const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push("Please select a file");
    return errors;
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    errors.push("Please select a valid image file");
  }

  // Check specific allowed types
  if (!APP_CONFIG.allowedFileTypes.includes(file.type)) {
    errors.push("Only JPEG and PNG files are allowed");
  }

  // Check file size
  if (file.size > APP_CONFIG.maxFileSize) {
    errors.push(`File size must be less than ${formatFileSize(APP_CONFIG.maxFileSize)}`);
  }

  // Check minimum file size (prevent empty files)
  if (file.size < 1024) { // 1KB minimum
    errors.push("File appears to be empty or corrupted");
  }

  return errors;
};

export const validateImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      const dimensions = {
        width: img.width,
        height: img.height,
        isValid: img.width >= 100 && img.height >= 100,
        aspectRatio: img.width / img.height
      };
      
      // Clean up
      URL.revokeObjectURL(img.src);
      resolve(dimensions);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return errors;
};

export const validateImageQuality = async (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Get image data to analyze quality
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple blur detection (variance of Laplacian)
      let sum = 0;
      let sumSquared = 0;
      let count = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        sum += gray;
        sumSquared += gray * gray;
        count++;
      }
      
      const mean = sum / count;
      const variance = (sumSquared / count) - (mean * mean);
      
      const quality = {
        isBlurry: variance < 100, // Threshold for blur detection
        variance: variance,
        dimensions: { width: img.width, height: img.height },
        fileSize: file.size
      };
      
      URL.revokeObjectURL(img.src);
      resolve(quality);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve({ isBlurry: false, error: "Could not analyze image quality" });
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageContent = async (file) => {
  // This is a basic content validation
  // In a real app, you might use AI services for content moderation
  
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ];
  
  if (!allowedMimeTypes.includes(file.type)) {
    return { isValid: false, reason: "Unsupported image format" };
  }
  
  // Check for minimum dimensions
  try {
    const dimensions = await validateImageDimensions(file);
    if (!dimensions.isValid) {
      return { isValid: false, reason: "Image too small (minimum 100x100 pixels)" };
    }
    
    // Check aspect ratio (prevent extremely wide or tall images)
    if (dimensions.aspectRatio > 10 || dimensions.aspectRatio < 0.1) {
      return { isValid: false, reason: "Image aspect ratio too extreme" };
    }
    
    return { isValid: true, dimensions };
  } catch (error) {
    return { isValid: false, reason: "Could not validate image: " + error.message };
  }
};

export const sanitizeFileName = (fileName) => {
  // Remove or replace unsafe characters
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
};

export const validateAnalysisInput = (file, userProfile) => {
  const errors = [];
  
  // File validation
  const fileErrors = validateFile(file);
  errors.push(...fileErrors);
  
  // User validation
  if (!userProfile) {
    errors.push("User profile not loaded");
    return errors;
  }
  
  // Rate limit validation
  if (!userProfile.is_admin && userProfile.remaining_requests <= 0) {
    errors.push("Daily analysis limit reached");
  }
  
  return errors;
};

// Helper function for file size formatting
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};