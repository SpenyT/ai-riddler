import { useState } from "react";
import { useUsersApi } from "@/api/useUsersApi";
import type { User } from "@/types/userTypes";

export default function UserTestForm() {
  const [formData, setFormData] = useState({
    clerk_id: "user_test_123",
    email: "test@example.com",
    first_name: "John",
    last_name: "Doe",
  });

  const [result, setResult] = useState<User | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const usersApi = useUsersApi()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setResult(null);

    try {
      const user = await usersApi.createUser();
      setResult(user);
      setStatus("success");
      setMessage("User created/synced successfully!");
    } catch (err) {
      setStatus("error");
      setMessage("Failed to create user. Check console.");
    }
  };

  const handleFetch = async () => {
    if (!formData.clerk_id) return;
    setStatus("loading");
    try {
      const user = await usersApi.getUser();
      setResult(user);
      setStatus("success");
      setMessage("User fetched from DB!");
    } catch (err) {
      setStatus("error");
      setMessage("User not found.");
      setResult(null);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md w-full">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Test User Backend</h2>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase">Clerk ID (Simulated)</label>
          <input
            name="clerk_id"
            value={formData.clerk_id}
            onChange={handleChange}
            className="w-full p-2 border rounded font-mono text-sm bg-gray-50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">First Name</label>
                <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Last Name</label>
                <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                />
            </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm"
            required
          />
        </div>

        <div className="flex gap-2 pt-2">
            <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                disabled={status === 'loading'}
            >
                Create / Sync
            </button>
            <button
                type="button"
                onClick={handleFetch}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                disabled={status === 'loading'}
            >
                Fetch by ID
            </button>
        </div>
      </form>

      {/* Response Display */}
      {message && (
        <div className={`mt-4 p-3 rounded text-sm text-center ${status === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-gray-900 text-green-400 rounded text-xs font-mono overflow-auto">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}