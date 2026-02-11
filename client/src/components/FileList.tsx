import { useEffect, useState } from "react";
// Import the types and functions we defined
import type { FileMetadata } from "@/types/fileTypes";
import { useFilesApi } from "@/api/useFilesApi";
import { formatBytes, formatDate } from "@/utils/format";

export default function FileList() {
  // Use the FileMetadata type for state
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filesApi = useFilesApi()

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await filesApi.getAllFiles();
      setFiles(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) return <div className="text-center p-6 text-gray-500">Loading files...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-8 w-full max-w-4xl">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Uploaded Files</h2>
        <button onClick={fetchFiles} className="text-sm text-blue-600 hover:text-blue-800">
            Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Filename</th>
              <th className="px-6 py-3">Class</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3">Uploaded</th>
              <th className="px-6 py-3 text-right">Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{file.filename}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {file.class_in_question}
                  </span>
                </td>
                <td className="px-6 py-4">{formatBytes(file.size)}</td>
                <td className="px-6 py-4">{formatDate(file.relevant_date)}</td>
                <td className="px-6 py-4 text-right">
                  {/* Use the helper function here */}
                  <a
                    href={filesApi.getFileDownloadUrl(file._id)}
                    className="text-blue-600 hover:underline font-medium"
                    download // Hint to browser to download instead of open
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-6">No files found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}