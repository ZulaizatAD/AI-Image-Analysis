import { useState, useCallback } from "react";
import { validateFile, validateImageDimensions } from "../utils/validators";

export const useImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dimensions, setDimensions] = useState(null);

  const handleFileChange = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    try {
      // Validate file
      const validationErrors = validateFile(selectedFile);
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        return;
      }

      // Validate image dimensions
      const imageDimensions = await validateImageDimensions(selectedFile);
      if (!imageDimensions.isValid) {
        setError("Image must be at least 100x100 pixels");
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setDimensions(imageDimensions);
      setError("");
    } catch (error) {
      setError("Error processing file: " + error.message);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const resetUpload = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError("");
    setDragActive(false);
    setDimensions(null);
    setUploading(false);
  }, [preview]);

  return {
    file,
    preview,
    dragActive,
    error,
    uploading,
    dimensions,
    handleFileChange,
    handleDrag,
    handleDrop,
    resetUpload,
    setError,
  };
};