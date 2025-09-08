import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  LightBulbIcon,
  BoltIcon 
} from "@heroicons/react/24/outline";

const iconMap = {
  "🔍": MagnifyingGlassIcon,
  "📊": ChartBarIcon,
  "💡": LightBulbIcon,
  "⚡": BoltIcon,
};

const FeatureCard = ({ feature }) => {
  const IconComponent = iconMap[feature.icon];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-cadetblue-200 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-center mb-4">
        {IconComponent ? (
          <IconComponent className="w-8 h-8 text-cadetblue-500" />
        ) : (
          <div className="text-4xl">{feature.icon}</div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-cadetblue-900 mb-2">
        {feature.title}
      </h3>
      <p className="text-cadetblue-600">{feature.desc}</p>
    </div>
  );
};

export default FeatureCard;