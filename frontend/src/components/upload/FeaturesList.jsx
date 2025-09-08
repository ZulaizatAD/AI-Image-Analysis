import { FEATURES } from "../../utils/constants";

const FeaturesList = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 p-6">
      <h3 className="text-lg font-semibold text-cadetblue-900 mb-4">
        What You'll Get
      </h3>
      <div className="space-y-3">
        {FEATURES.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {feature.iconComponent ? (
                <feature.iconComponent className="w-6 h-6 text-cadetblue-500 mt-0.5" />
              ) : (
                <span className="text-2xl">{feature.icon}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-cadetblue-900">{feature.title}</p>
              <p className="text-sm text-cadetblue-600">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesList;