import { 
  CloudArrowUpIcon,
  TrashIcon 
} from "@heroicons/react/24/outline";

const DragDropZone = ({ 
  preview, 
  dragActive, 
  onFileChange, 
  onDrag, 
  onDrop, 
  onReset 
}) => {
  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        dragActive
          ? "border-cadetblue-400 bg-aliceblue"
          : "border-cadetblue-300 hover:border-cadetblue-400"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      {preview ? (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-aliceblue rounded-full flex items-center justify-center">
            <CloudArrowUpIcon className="w-8 h-8 text-cadetblue-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-cadetblue-900">
              Drop your food image here
            </p>
            <p className="text-sm text-cadetblue-500">
              or click to browse
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default DragDropZone;