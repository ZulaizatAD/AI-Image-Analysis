import { SparklesIcon } from "@heroicons/react/24/solid";

const HeroSection = ({ onSignUp }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center mb-6">
        <SparklesIcon className="w-8 h-8 text-cadetblue-500 mr-2" />
        <h2 className="text-4xl font-bold text-cadetblue-900">
          Analyze Your Food with AI
        </h2>
      </div>
      <p className="text-xl text-cadetblue-600 mb-8">
        Get detailed nutritional insights, calorie counts, and health recommendations 
        for any food image using advanced AI technology.
      </p>
    </div>
  );
};

export default HeroSection;