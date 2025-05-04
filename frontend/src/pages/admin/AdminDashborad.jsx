import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar"; // Import Navbar

const AdminDashboard = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 dark:bg-gray-700 text-gray-200">
                    <div className="p-4 text-center text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        Admin Dashboard
                    </div>
                    <nav className="mt-4">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/admin/users"
                                    className="block px-4 py-2 hover:bg-gray-700 rounded-md"
                                >
                                    Manage Users
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/roles"
                                    className="block px-4 py-2 hover:bg-gray-700 rounded-md"
                                >
                                    Manage Roles
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/settings"
                                    className="block px-4 py-2 hover:bg-gray-700 rounded-md"
                                >
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Welcome, Admin
                    </h1>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Example Cards */}
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Total Users
                            </h2>
                            <p className="mt-2 text-3xl font-bold text-green-500">1,234</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Active Sessions
                            </h2>
                            <p className="mt-2 text-3xl font-bold text-green-500">567</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                System Health
                            </h2>
                            <p className="mt-2 text-3xl font-bold text-green-500">Good</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;