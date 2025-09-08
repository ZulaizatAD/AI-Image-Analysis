import { ArrowPathIcon } from "@heroicons/react/24/outline";

const LoadingSpinner = ({ size = "w-8 h-8", className = "" }) => {
  return (
    <ArrowPathIcon 
      className={`${size} animate-spin text-cadetblue-500 ${className}`} 
    />
  );
};

export default LoadingSpinner;