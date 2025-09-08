import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ErrorMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;