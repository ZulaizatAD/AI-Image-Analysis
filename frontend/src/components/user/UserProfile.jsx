import { 
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CogIcon 
} from "@heroicons/react/24/outline";
// Remove CrownIcon import

const UserProfile = ({ userProfile, onClose }) => {
  if (!userProfile) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cadetblue-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cadetblue-500 to-cadetblue-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {userProfile.is_admin ? (
              <span className="text-3xl">👑</span>
            ) : (
              <UserIcon className="w-8 h-8 text-white" />
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {userProfile.is_admin ? 'Admin Profile' : 'User Profile'}
              </h2>
              <p className="text-aliceblue text-sm">{userProfile.email}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-aliceblue"
            >
              <CogIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Daily Usage */}
          <div className="bg-aliceblue rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="w-5 h-5 text-cadetblue-500" />
              <span className="text-sm font-medium text-cadetblue-900">
                Today's Usage
              </span>
            </div>
            <p className="text-2xl font-bold text-cadetblue-900">
              {userProfile.is_admin ? '∞' : userProfile.daily_requests_used}
            </p>
            <p className="text-xs text-cadetblue-600">
              {userProfile.is_admin 
                ? 'Unlimited access' 
                : `of ${userProfile.daily_limit} requests`
              }
            </p>
          </div>

          {/* Remaining */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ChartBarIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-900">
                Remaining
              </span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {userProfile.is_admin ? '∞' : userProfile.remaining_requests}
            </p>
            <p className="text-xs text-green-600">
              requests left today
            </p>
          </div>

          {/* Total Analyses */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ChartBarIcon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-900">
                Total Analyses
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {userProfile.total_requests}
            </p>
            <p className="text-xs text-blue-600">
              all time
            </p>
          </div>

          {/* Member Since */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-900">
                Member Since
              </span>
            </div>
            <p className="text-sm font-bold text-purple-900">
              {formatDate(userProfile.member_since)}
            </p>
            <p className="text-xs text-purple-600">
              joined date
            </p>
          </div>
        </div>

        {/* Progress Bar for Non-Admin */}
        {!userProfile.is_admin && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-cadetblue-900">
                Daily Progress
              </span>
              <span className="text-sm text-cadetblue-600">
                {userProfile.daily_requests_used}/{userProfile.daily_limit}
              </span>
            </div>
            <div className="w-full bg-cadetblue-100 rounded-full h-2">
              <div 
                className="bg-cadetblue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(userProfile.daily_requests_used / userProfile.daily_limit) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Account Type Badge */}
        <div className="text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            userProfile.is_admin 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-cadetblue-100 text-cadetblue-800'
          }`}>
            {userProfile.is_admin ? (
              <>
                <span className="mr-1">👑</span>
                Administrator Account
              </>
            ) : (
              <>
                <UserIcon className="w-4 h-4 mr-1" />
                Standard Account
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;