import { useState, useEffect } from "react";
import { analyzeImage, checkHealth } from "./api";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [dragActive, setDragActive] = useState(false);

  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await checkHealth();
        setBackendStatus("connected");
      } catch (error) {
        setBackendStatus("disconnected");
        setError(
          "Backend server is not running. Please start the backend server."
        );
      }
    };

    checkBackendHealth();
  }, []);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
      setResult("");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image first!");
      return;
    }

    if (backendStatus !== "connected") {
      setError("Backend server is not available. Please check the connection.");
      return;
    }

    try {
      setLoading(true);
      setResult("");
      setError("");
      const res = await analyzeImage(file);
      setResult(res.analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError(error.message || "Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    setError("");
  };

  const getStatusIndicator = () => {
    switch (backendStatus) {
      case "connected":
        return (
          <div className="flex items-center space-x-2 text-cadetblue-600">
            <div className="w-2 h-2 bg-cadetblue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Backend Connected</span>
          </div>
        );
      case "disconnected":
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Backend Disconnected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-cadetblue-400">
            <div className="w-2 h-2 bg-cadetblue-400 rounded-full animate-bounce"></div>
            <span className="text-sm font-medium">Checking Backend...</span>
          </div>
        );
    }
  };

  const formatAnalysis = (text) => {
    // Simple formatting to make the analysis more readable
    return text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-cadetblue-900">$1</strong>'
      )
      .replace(/\*(.*?)\*/g, '<em class="italic text-cadetblue-700">$1</em>')
      .split("\n")
      .map((line, index) => {
        if (line.trim().startsWith("##")) {
          return `<h3 key=${index} class="text-lg font-bold text-cadetblue-900 mt-4 mb-2">${line
            .replace("##", "")
            .trim()}</h3>`;
        } else if (line.trim().startsWith("#")) {
          return `<h2 key=${index} class="text-xl font-bold text-cadetblue-900 mt-6 mb-3">${line
            .replace("#", "")
            .trim()}</h2>`;
        } else if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
          return `<li key=${index} class="ml-4 text-cadetblue-700">${line.replace(
            /^[-•]\s*/,
            ""
          )}</li>`;
        } else if (line.trim()) {
          return `<p key=${index} class="text-cadetblue-700 mb-2">${line}</p>`;
        }
        return `<br key=${index} />`;
      })
      .join("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aliceblue via-white to-cadetblue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-cadetblue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cadetblue-400 to-cadetblue-600 p-2 rounded-lg">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cadetblue-900">
                  Nutrition Analyzer
                </h1>
                <p className="text-sm text-cadetblue-600">
                  AI-powered food analysis
                </p>
              </div>
            </div>
            {getStatusIndicator()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-cadetblue-900 mb-4">
                  Upload Food Image
                </h2>

                {/* Drag and Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive
                      ? "border-cadetblue-400 bg-aliceblue"
                      : "border-cadetblue-300 hover:border-cadetblue-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <div className="space-y-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-aliceblue rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-cadetblue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-cadetblue-900">
                          Drop your food image here
                        </p>
                        <p className="text-sm text-cadetblue-500">
                          or click to browse
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-cadetblue-500 text-center">
                  Supported formats: JPEG, PNG • Maximum size: 10MB
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-red-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || !file || backendStatus !== "connected"}
                  className="w-full mt-6 bg-gradient-to-r from-cadetblue-500 to-cadetblue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-cadetblue-600 hover:to-cadetblue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing Nutrition...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Analyze Nutrition
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 p-6">
              <h3 className="text-lg font-semibold text-cadetblue-900 mb-4">
                What You'll Get
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: "🔍",
                    title: "Food Identification",
                    desc: "AI identifies all visible ingredients",
                  },
                  {
                    icon: "📊",
                    title: "Nutritional Breakdown",
                    desc: "Calories, macros, vitamins & minerals",
                  },
                  {
                    icon: "💡",
                    title: "Health Insights",
                    desc: "Personalized recommendations",
                  },
                  {
                    icon: "⚡",
                    title: "Instant Analysis",
                    desc: "Results in seconds",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className="font-medium text-cadetblue-900">
                        {feature.title}
                      </p>
                      <p className="text-sm text-cadetblue-600">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 overflow-hidden">
                <div className="bg-gradient-to-r from-cadetblue-500 to-cadetblue-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Nutritional Analysis
                  </h2>
                  <p className="text-aliceblue mt-1">
                    AI-powered food analysis results
                  </p>
                </div>

                <div className="p-6">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatAnalysis(result) }}
                  />

                  <div className="mt-6 pt-6 border-t border-cadetblue-200">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result);
                        // You could add a toast notification here
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-cadetblue-700 bg-aliceblue rounded-lg hover:bg-cadetblue-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy Analysis
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 p-8">
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 bg-aliceblue rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-cadetblue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-cadetblue-900 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-cadetblue-600 mb-6">
                    Upload a food image to get detailed nutritional insights
                    powered by AI
                  </p>

                  {/* Sample Images */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { emoji: "🥗", label: "Salads" },
                      { emoji: "🍕", label: "Pizza" },
                      { emoji: "🍎", label: "Fruits" },
                      { emoji: "🥘", label: "Meals" },
                      { emoji: "🍰", label: "Desserts" },
                      { emoji: "🥪", label: "Sandwiches" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="text-center p-3 bg-aliceblue rounded-lg"
                      >
                        <div className="text-2xl mb-1">{item.emoji}</div>
                        <div className="text-xs text-cadetblue-600">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cadetblue-400 to-cadetblue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <svg
                      className="w-8 h-8 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-cadetblue-900 mb-2">
                    Analyzing Your Food
                  </h3>
                  <p className="text-cadetblue-600">
                    Our AI is examining the nutritional content...
                  </p>

                  {/* Progress Steps */}
                  <div className="mt-6 space-y-2">
                    {[
                      "Identifying ingredients...",
                      "Calculating nutrition facts...",
                      "Generating health insights...",
                      "Preparing recommendations...",
                    ].map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center text-sm text-cadetblue-500"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-3 ${
                            index === 0
                              ? "bg-cadetblue-500 animate-pulse"
                              : "bg-cadetblue-300"
                          }`}
                        ></div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 p-6">
            <div className="flex items-center justify-center space-x-6 text-sm text-cadetblue-600">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-cadetblue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-cadetblue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-cadetblue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Accurate Results</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-cadetblue-500">
              Powered by Google Gemini AI • For educational purposes only
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}