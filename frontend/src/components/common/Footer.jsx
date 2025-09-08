import {
  CheckCircleIcon,
  LockClosedIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const Footer = () => {
  return (
    <footer className="mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 p-6">
          <div className="flex items-center justify-center space-x-6 text-sm text-cadetblue-600">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-4 h-4 text-cadetblue-500" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <LockClosedIcon className="w-4 h-4 text-cadetblue-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <StarIcon className="w-4 h-4 text-cadetblue-500" />
              <span>Accurate Results</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-cadetblue-500 text-center">
            Powered by Google Gemini AI • Secured by Clerk Authentication
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
