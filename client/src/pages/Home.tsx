import FileUploader from "@/components/FileUploader";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">Home</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your ai slop quiz. Upload your PDFs, Images, and Text files here.
        </p>
      </div>

      <div className="flex justify-center">
        <FileUploader />
      </div>
    </div>
  );
}