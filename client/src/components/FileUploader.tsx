import { useState } from 'react';
import { useFilesApi } from '@/api/useFilesApi';

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [className, setClassName] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const filesApi = useFilesApi();

  const handleUpload = async () => {
    if (!selectedFile || !className) return;

    setStatus("uploading");
    try {
      // Just pass file and class name now
      const result = await filesApi.uploadFile(selectedFile, className);
      
      setStatus("success");
      setMessage(`Success! Uploaded: ${result.filename}`);
      setSelectedFile(null);
      setClassName("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Upload failed.");
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Class Material</h2>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Class Name</label>
        <input 
          type="text" 
          placeholder="e.g. MATH 101"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Date Input REMOVED */}

      <div className="mb-4">
        <input
          type="file"
          onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!selectedFile || !className || status === 'uploading'}
        className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
      >
        {status === 'uploading' ? 'Uploading...' : 'Upload File'}
      </button>
      
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}