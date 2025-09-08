import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for debugging and auth
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        
        // Add timestamp to prevent caching
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now()
            };
        }
        
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`Response from ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data = error.response.data;
            
            let message = "An error occurred";
            
            if (data?.detail) {
                message = data.detail;
            } else if (data?.message) {
                message = data.message;
            } else {
                switch (status) {
                    case 400:
                        message = "Bad request. Please check your input.";
                        break;
                    case 401:
                        message = "Authentication required. Please sign in.";
                        break;
                    case 403:
                        message = "Access denied. Insufficient permissions.";
                        break;
                    case 404:
                        message = "Resource not found.";
                        break;
                    case 429:
                        message = "Too many requests. Please try again later.";
                        break;
                    case 500:
                        message = "Server error. Please try again later.";
                        break;
                    default:
                        message = `Server error (${status}). Please try again.`;
                }
            }
            
            throw new Error(message);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error("Unable to connect to server. Please check if the backend is running.");
        } else {
            // Something else happened
            throw new Error("An unexpected error occurred: " + error.message);
        }
    }
);

// API Functions
export const analyzeImage = async (file, token) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(API_ENDPOINTS.analyze, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
};

export const getUserProfile = async (token) => {
    try {
        const response = await api.get(API_ENDPOINTS.profile, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const getUserHistory = async (token) => {
    try {
        const response = await api.get(API_ENDPOINTS.history, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user history:", error);
        throw error;
    }
};

export const getAdminStats = async (token) => {
    try {
        const response = await api.get(API_ENDPOINTS.adminStats, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        throw error;
    }
};

export const checkHealth = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.health);
        return response.data;
    } catch (error) {
        console.error("Health check failed:", error);
        throw new Error("Backend is not accessible");
    }
};

// Utility function to check if backend is available
export const pingBackend = async () => {
    try {
        const response = await api.get("/", { timeout: 5000 });
        return { status: "connected", data: response.data };
    } catch (error) {
        return { status: "disconnected", error: error.message };
    }
};

export default api;