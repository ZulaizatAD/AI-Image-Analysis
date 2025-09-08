import { 
  UserIcon, 
  ClockIcon,
  ChartBarIcon 
} from "@heroicons/react/24/outline";
// Remove CrownIcon import and use a different approach

const UsageStats = ({ userProfile }) => {
  if (!userProfile) return null;

  return (
    <div className="mt-4 p-4 bg-aliceblue rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {userProfile.is_admin ? (
            // Use a crown emoji or different icon for admin
            <span className="text-yellow-500 text-lg">👑</span>
          ) : (
            <UserIcon className="w-5 h-5 text-cadetblue-500" />
          )}
          <div>
            <p className="text-sm font-medium text-cadetblue-900">
              {userProfile.is_admin ? "Admin Account" : "Daily Usage"}
            </p>
            <p className="text-xs text-cadetblue-600">
              {userProfile.is_admin 
                ? "Unlimited access for testing" 
                : `${userProfile.daily_requests_used}/${userProfile.daily_limit} requests used today`
              }
            </p>
          </div>
        </div>
        {!userProfile.is_admin && (
          <div className="text-right">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userProfile.remaining_requests > 1 
                ? 'bg-green-100 text-green-800' 
                : userProfile.remaining_requests === 1
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              <ClockIcon className="w-3 h-3 mr-1" />
              {userProfile.remaining_requests} left
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageStats;