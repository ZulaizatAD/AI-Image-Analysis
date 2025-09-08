import { 
  ArrowPathIcon,
  ChartBarIcon 
} from "@heroicons/react/24/outline";
import { useImageUpload } from "../../hooks/useImageUpload";
import DragDropZone from "./DragDropZone";
import ErrorMessage from "../common/ErrorMessage";
import UsageStats from "../user/UsageStats";
import FeaturesList from "./FeaturesList";

const ImageUpload = ({ userProfile, onAnalyze, loading, analysisError }) => {
  const {
    file,
    preview,
    dragActive,
    error,
    handleFileChange,
    handleDrag,
    handleDrop,
    resetUpload,
    setError,
  } = useImageUpload();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image first!");
      return;
    }
    onAnalyze(file);
  };

  const canAnalyze = file && 
    (userProfile?.is_admin || (!userProfile?.is_admin && userProfile?.remaining_requests > 0));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-cadetblue-900 mb-4">
            Upload Food Image
          </h2>

          <DragDropZone
            preview={preview}
            dragActive={dragActive}
            onFileChange={handleFileChange}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onReset={resetUpload}
          />

          <div className="mt-4 text-xs text-cadetblue-500 text-center">
            Supported formats: JPEG, PNG • Maximum size: 10MB
          </div>

          <ErrorMessage message={error || analysisError} />

          {userProfile && <UsageStats userProfile={userProfile} />}

          <AnalyzeButton
            onSubmit={handleSubmit}
            loading={loading}
            canAnalyze={canAnalyze}
            userProfile={userProfile}
          />
        </div>
      </div>

      <FeaturesList />
    </div>
  );
};

const AnalyzeButton = ({ onSubmit, loading, canAnalyze, userProfile }) => {
  const isDisabled = loading || !canAnalyze;
  
  return (
    <button
      onClick={onSubmit}
      disabled={isDisabled}
      className="w-full mt-6 bg-gradient-to-r from-cadetblue-500 to-cadetblue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-cadetblue-600 hover:to-cadetblue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
          Analyzing Nutrition...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ChartBarIcon className="w-5 h-5 mr-2" />
          {(!userProfile?.is_admin && userProfile?.remaining_requests === 0) 
            ? "Daily Limit Reached" 
            : "Analyze Nutrition"
          }
        </div>
      )}
    </button>
  );
};

export default ImageUpload;