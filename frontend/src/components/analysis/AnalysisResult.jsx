import { useState } from "react";
import {
  ChartBarIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { formatAnalysis } from "../../utils/formatters";

const AnalysisResult = ({ result, onReset, originalFile, userToken }) => {
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const handleCopyAnalysis = () => {
    navigator.clipboard.writeText(result);
  };

  const handleDownloadPDF = async () => {
    if (!originalFile) {
      alert(
        "Cannot generate PDF - no image file available. Please analyze an image first."
      );
      return;
    }

    if (!userToken) {
      alert(
        "Cannot generate PDF - authentication required. Please sign in again."
      );
      return;
    }

    try {
      setDownloadingPDF(true);

      const formData = new FormData();
      formData.append("file", originalFile);
      formData.append("analysis_text", result);

      console.log("Sending PDF request...");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/generate-pdf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("PDF generation failed:", errorText);
        throw new Error(`Failed to generate PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nutrition_analysis_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("PDF download error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setDownloadingPDF(false);
    }
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

        <div className="mt-6 pt-6 border-t border-cadetblue-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAnalysis}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-cadetblue-700 bg-aliceblue rounded-lg hover:bg-cadetblue-100 transition-colors"
            >
              <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
              Copy Text
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF || !originalFile || !userToken}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                downloadingPDF || !originalFile || !userToken
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "text-white bg-cadetblue-500 hover:bg-cadetblue-600"
              }`}
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              {downloadingPDF ? "Generating..." : "Download PDF"}
            </button>
          </div>

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