import { XMarkIcon } from "@heroicons/react/24/outline";

const AuthModal = ({ children, title, subtitle, onClose }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aliceblue via-white to-cadetblue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cadetblue-400 hover:text-cadetblue-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cadetblue-900 mb-2">{title}</h2>
          <p className="text-cadetblue-600">{subtitle}</p>
        </div>
        
        {children}
        
        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="text-cadetblue-600 hover:text-cadetblue-800 text-sm flex items-center justify-center mx-auto"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;