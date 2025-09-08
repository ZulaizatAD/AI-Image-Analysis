import { 
  TrashIcon,
  DocumentIcon,
  PhotoIcon 
} from "@heroicons/react/24/outline";
import { formatFileSize } from "../../utils/formatters";

const FilePreview = ({ file, preview, onRemove, className = "" }) => {
  if (!file) return null;

  return (
    <div className={`bg-white border border-cadetblue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* File Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <img
              src={preview}
              alt="File preview"
              className="w-16 h-16 object-cover rounded-lg border border-cadetblue-200"
            />
          ) : (
            <div className="w-16 h-16 bg-cadetblue-50 rounded-lg flex items-center justify-center">
              {file.type.startsWith('image/') ? (
                <PhotoIcon className="w-8 h-8 text-cadetblue-400" />
              ) : (
                <DocumentIcon className="w-8 h-8 text-cadetblue-400" />
              )}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-cadetblue-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-cadetblue-500">
            {formatFileSize(file.size)} • {file.type}
          </p>
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-cadetblue-100 rounded-full h-1.5">
                <div className="bg-cadetblue-500 h-1.5 rounded-full w-full"></div>
              </div>
              <span className="text-xs text-cadetblue-600">Ready</span>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="flex-shrink-0 p-1 text-cadetblue-400 hover:text-red-500 transition-colors"
            title="Remove file"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilePreview;