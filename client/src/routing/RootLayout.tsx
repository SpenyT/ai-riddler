import { Outlet, Link } from "react-router";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Change with Navbar component */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Nav Links */}
            <div className="hidden sm:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}