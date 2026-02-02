export default function Home() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">Home</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your ai slop quiz. Upload your PDFs, Images, and Text files here.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">File Upload Component will go here</p>
      </div>
    </div>
  );
}