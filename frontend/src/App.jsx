import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useAnalysis } from "./hooks/useAnalysis";
import { checkHealth } from "./services/api";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";
import LandingPage from "./components/landing/LandingPage";
import ImageUpload from "./components/upload/ImageUpload";
import AnalysisResult from "./components/analysis/AnalysisResult";
import AnalysisLoading from "./components/analysis/AnalysisLoading";
import AnalysisPlaceholder from "./components/analysis/AnalysisPlaceholder";
import SignInModal from "./components/auth/SignInModal";
import SignUpModal from "./components/auth/SignUpModal";

export default function App() {
  const { isLoaded, userId, user, userProfile, getToken, refreshProfile } =
    useAuth();
  const { result, loading, error, analyzeFood, resetAnalysis } = useAnalysis();

  const [backendStatus, setBackendStatus] = useState("checking");
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await checkHealth();
        setBackendStatus("connected");
      } catch (error) {
        setBackendStatus("disconnected");
      }
    };

    checkBackendHealth();
  }, []);

  const handleAnalyze = async (file) => {
    if (!userId) {
      setShowSignIn(true);
      return;
    }

    if (backendStatus !== "connected") {
      return;
    }

    try {
      const token = await getToken();
      setUserToken(token);
      setOriginalFile(file);

      await analyzeFood(file, token, () => {
        refreshProfile();
      });
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleReset = () => {
    resetAnalysis();
    setOriginalFile(null);
    setUserToken(null);
  };

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-aliceblue via-white to-cadetblue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="w-12 h-12" className="mx-auto mb-4" />
          <p className="text-cadetblue-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign in modal
  if (showSignIn) {
    return <SignInModal onClose={() => setShowSignIn(false)} />;
  }

  // Show sign up modal
  if (showSignUp) {
    return <SignUpModal onClose={() => setShowSignUp(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aliceblue via-white to-cadetblue-50">
      <Header
        backendStatus={backendStatus}
        userProfile={userProfile}
        user={user}
        userId={userId}
        onSignIn={() => setShowSignIn(true)}
        onSignUp={() => setShowSignUp(true)}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!userId ? (
          <LandingPage onSignUp={() => setShowSignUp(true)} />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Upload Section */}
            <div className="xl:col-span-2">
              <ImageUpload
                userProfile={userProfile}
                onAnalyze={handleAnalyze}
                loading={loading}
                analysisError={error}
              />
            </div>

            {/* Results Section */}
            <div className="xl:col-span-3 space-y-6">
              {loading ? (
                <AnalysisLoading />
              ) : result ? (
                <AnalysisResult
                  result={result}
                  onReset={handleReset}
                  originalFile={originalFile}
                  userToken={userToken}
                />
              ) : (
                <AnalysisPlaceholder />
              )}
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
