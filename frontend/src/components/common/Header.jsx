import { UserButton } from "@clerk/clerk-react";
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon 
} from "@heroicons/react/24/outline";
import { APP_CONFIG } from "../../utils/constants";

const Header = ({ 
  backendStatus, 
  userProfile, 
  user, 
  userId, 
  onSignIn, 
  onSignUp 
}) => {
  const getStatusIndicator = () => {
    switch (backendStatus) {
      case "connected":
        return (
          <div className="flex items-center space-x-2 text-cadetblue-600">
            <WifiIcon className="w-4 h-4 text-cadetblue-500" />
            <span className="text-sm font-medium">Backend Connected</span>
          </div>
        );
      case "disconnected":
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">Backend Disconnected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-cadetblue-400">
            <ArrowPathIcon className="w-4 h-4 text-cadetblue-400 animate-spin" />
            <span className="text-sm font-medium">Checking Backend...</span>
          </div>
        );
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-cadetblue-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cadetblue-400 to-cadetblue-600 p-2 rounded-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-cadetblue-900">
                {APP_CONFIG.name}
              </h1>
              <p className="text-sm text-cadetblue-600">
                {APP_CONFIG.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusIndicator()}
            
            {userId ? (
              <div className="flex items-center space-x-4">
                {userProfile && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-cadetblue-900">
                      {userProfile.is_admin ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          👑 Admin
                        </span>
                      ) : (
                        `${userProfile.remaining_requests} requests left`
                      )}
                    </p>
                    <p className="text-xs text-cadetblue-600">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                )}
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onSignIn}
                  className="px-4 py-2 text-cadetblue-600 hover:text-cadetblue-800 font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignUp}
                  className="px-4 py-2 bg-cadetblue-500 text-white rounded-lg hover:bg-cadetblue-600 font-medium"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;