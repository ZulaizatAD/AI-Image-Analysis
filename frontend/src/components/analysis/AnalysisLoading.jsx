import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { LOADING_STEPS } from "../../utils/constants";

const AnalysisLoading = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 p-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cadetblue-400 to-cadetblue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <ArrowPathIcon className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-lg font-medium text-cadetblue-900 mb-2">
          Analyzing Your Food
        </h3>
        <p className="text-cadetblue-600">
          Our AI is examining the nutritional content...
        </p>

        {/* Progress Steps */}
        <div className="mt-6 space-y-2">
          {LOADING_STEPS.map((step, index) => (
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
  );
};

export default AnalysisLoading;