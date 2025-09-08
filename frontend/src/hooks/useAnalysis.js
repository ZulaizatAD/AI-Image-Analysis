import { useState, useCallback } from "react";
import { analyzeImage } from "../services/api";

export const useAnalysis = () => {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [analysisId, setAnalysisId] = useState(null);
    const [timestamp, setTimestamp] = useState(null);

    const analyzeFood = useCallback(async (file, token, onSuccess) => {
        if (!file) {
            setError("Please select an image first!");
            return;
        }

        try {
            setLoading(true);
            setResult("");
            setError("");
            setAnalysisId(null);

            const response = await analyzeImage(file, token);

            setResult(response.analysis);
            setAnalysisId(response.analysis_id);
            setTimestamp(response.timestamp);

            if (onSuccess) {
                onSuccess(response);
            }

            return response;
        } catch (error) {
            console.error("Error analyzing image:", error);

            let errorMessage = "Error analyzing image. Please try again.";

            if (error.message.includes("Daily limit")) {
                errorMessage = "You've reached your daily limit of 3 analyses. Please try again tomorrow!";
            } else if (error.message.includes("Invalid file")) {
                errorMessage = "Invalid file format. Please upload a JPEG or PNG image.";
            } else if (error.message.includes("File size")) {
                errorMessage = "File size too large. Please upload an image smaller than 10MB.";
            } else if (error.message.includes("Invalid token")) {
                errorMessage = "Authentication expired. Please sign in again.";
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetAnalysis = useCallback(() => {
        setResult("");
        setError("");
        setAnalysisId(null);
        setTimestamp(null);
    }, []);

    const clearError = useCallback(() => {
        setError("");
    }, []);

    return {
        result,
        loading,
        error,
        analysisId,
        timestamp,
        analyzeFood,
        resetAnalysis,
        clearError,
        setError,
    };
};        