import { ChartBarIcon } from "@heroicons/react/24/outline";
import { SAMPLE_FOODS } from "../../utils/constants";

const AnalysisPlaceholder = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 p-8">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-aliceblue rounded-full flex items-center justify-center mb-4">
          <ChartBarIcon className="w-12 h-12 text-cadetblue-400" />
        </div>
        <h3 className="text-lg font-medium text-cadetblue-900 mb-2">
          Ready to Analyze
        </h3>
        <p className="text-cadetblue-600 mb-6">
          Upload a food image to get detailed nutritional insights powered by AI
        </p>

        {/* Sample Images */}
        <div className="grid grid-cols-3 gap-4">
          {SAMPLE_FOODS.map((item, index) => (
            <div
              key={index}
              className="text-center p-3 bg-aliceblue rounded-lg"
            >
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-xs text-cadetblue-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPlaceholder;