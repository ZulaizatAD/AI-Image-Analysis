import HeroSection from "./HeroSection";
import FeatureCard from "./FeatureCard";
import { FEATURES } from "../../utils/constants";

const LandingPage = ({ onSignUp }) => {
  return (
    <div className="text-center py-16">
      {/* Updated max-width for wider layout */}
      <div className="max-w-5xl mx-auto">
        <HeroSection onSignUp={onSignUp} />
        
        {/* Updated grid for better spacing on wide screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {FEATURES.slice(0, 3).map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onSignUp}
            className="bg-gradient-to-r from-cadetblue-500 to-cadetblue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cadetblue-600 hover:to-cadetblue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Get Started Free
          </button>
          <p className="text-sm text-cadetblue-500">
            3 free analyses per day • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;