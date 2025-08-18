import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 60000,
});

// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.detail || error.response.data?.message || "Server error occurred";
            throw new Error(message);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error("Unable to connect to server. Please check if the backend is running.");
        } else {
            // Something else happened
            throw new Error("An unexpected error occurred");
        }
    }
);

export const analyzeImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/analyze-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
};

// Health check function
export const checkHealth = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        throw new Error("Backend is not accessible");
    }
};