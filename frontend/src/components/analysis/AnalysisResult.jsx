import {
  ChartBarIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { formatAnalysis } from "../../utils/formatters";

const AnalysisResult = ({ result, onReset }) => {
  const handleCopyAnalysis = () => {
    navigator.clipboard.writeText(result);
    // You could add a toast notification here
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 overflow-hidden">
      <div className="bg-gradient-to-r from-cadetblue-500 to-cadetblue-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2" />
              Nutritional Analysis
            </h2>
            <p className="text-aliceblue mt-1">
              AI-powered food analysis results
            </p>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="text-white hover:text-aliceblue transition-colors"
              title="Analyze another image"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: formatAnalysis(result) }}
        />

        <div className="mt-6 pt-6 border-t border-cadetblue-200 flex items-center justify-between">
          <button
            onClick={handleCopyAnalysis}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-cadetblue-700 bg-aliceblue rounded-lg hover:bg-cadetblue-100 transition-colors"
          >
            <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
            Copy Analysis
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-cadetblue-600 hover:text-cadetblue-800 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Analyze Another
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
