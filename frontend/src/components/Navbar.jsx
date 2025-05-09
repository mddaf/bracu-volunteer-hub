import { Link, useLocation } from "react-router-dom";
import { Search, User, Bell, LogOut, LayoutDashboard, Plus, Shield, Users, Menu } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import ThemeController from "./ThemeController";
import { useState } from "react";

const Navbar = () => {
    const { logout, user } = useAuthStore(); // Access user information
    const location = useLocation(); // Get the current route
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

    // Determine visibility of elements based on the current route
    const isHomePage = location.pathname === "/";
    const isProfilePage = location.pathname === "/profile";
    const isNotificationPage = location.pathname === "/notifications";
    const isAdminDashboardPage = location.pathname === "/admin/dashboard";
    const isClubDashboardPage = location.pathname === "/club/dashboard";
    const isUserDashboardPage = location.pathname === "/user/dashboard";

    // Check if the user has access to any dashboard based on role
    const hasDashboardAccess =
        user?.role === "admin" ||
        user?.role === "user" ||
        user?.clubs.some((club) => ["clubadmin", "moderator"].includes(club.clubRole));

    return (
        <nav className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 shadow-md flex items-center justify-between">
            {/* Logo */}
            <Link
                to="/"
                className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text dark:from-green-500 dark:to-emerald-700"
            >
                BRACU Volunteer Hub
            </Link>

            {/* Search Bar (only visible on HomePage) */}
            {isHomePage && (
                <div className="flex items-center bg-gray-800 dark:bg-gray-200 rounded-lg px-3 py-2 w-[30%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <Search className="text-gray-400 dark:text-gray-600 mr-2" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none text-sm text-gray-300 dark:text-gray-700 placeholder-gray-500 dark:placeholder-gray-600 w-full"
                    />
                </div>
            )}

            {/* Icons for large screens */}
            <div className="hidden md:flex items-center space-x-4">
                {/* Dashboard Link (based on user role and club roles) */}
                {hasDashboardAccess && !isAdminDashboardPage && !isClubDashboardPage && !isUserDashboardPage && (
                    <>
                        {user?.role === "admin" && (
                            <Link to="/admin/dashboard" className="relative group">
                                <Shield className="hover:text-green-400 dark:hover:text-green-600 transition-transform transform group-hover:scale-110" size={24} />
                                <span className="absolute left-1/2 transform -translate-x-[20%] bottom-[-2.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                                    Admin Dashboard
                                </span>
                            </Link>
                        )}
                        {user?.clubs.some((club) => ["clubadmin", "moderator"].includes(club.clubRole)) && (
                            <Link to="/club/dashboard" className="relative group">
                                <Users className="hover:text-green-400 dark:hover:text-green-600 transition-transform transform group-hover:scale-110" size={24} />
                                <span className="absolute left-1/2 transform -translate-x-[20%] bottom-[-2.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                                    Club Dashboard
                                </span>
                            </Link>
                        )}
                        {user?.role === "user" && (
                            <Link to="/user/dashboard" className="relative group">
                                <LayoutDashboard className="hover:text-green-400 dark:hover:text-green-600 transition-transform transform group-hover:scale-110" size={24} />
                                <span className="absolute left-1/2 transform -translate-x-[20%] bottom-[-2.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                                    User Dashboard
                                </span>
                            </Link>
                        )}
                    </>
                )}

                {/* Plus Icon for Joining Club (only for user role) */}
                {user?.role === "user" && (
                    <Link to="/join-club" className="relative group">
                        <Plus className="hover:text-green-400 dark:hover:text-green-600 transition-transform transform group-hover:scale-110" size={24} />
                        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-2.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                            Join Club
                        </span>
                    </Link>
                )}

                {/* Profile Icon */}
                {!isProfilePage && (
                    <Link to="/profile" className="relative group">
                        <User className="hover:text-green-400 dark:hover:text-green-600 transition-transform transform group-hover:scale-110" size={24} />
                        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-1.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                            Profile
                        </span>
                    </Link>
                )}

                {/* Notification Icon */}
                {!isNotificationPage && (
                    <Link to="/notifications" className="relative group">
                        <Bell className="hover:text-green-400 dark:hover:text-green-600 transition-transform transform group-hover:scale-110" size={24} />
                        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-1.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                            Notifications
                        </span>
                    </Link>
                )}

                {/* Theme Toggle Button */}
                <div className="relative group">
                    <ThemeController />
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-1.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                        Theme
                    </span>
                </div>

                {/* Logout Icon */}
                <button onClick={logout} className="relative group focus:outline-none">
                    <LogOut className="hover:text-red-400 dark:hover:text-red-600 transition-transform transform group-hover:scale-110" size={24} />
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-1.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                        Logout
                    </span>
                </button>
            </div>



            {/* Theme Toggle Button (always visible) */}
            <div className="md:hidden relative">
                <ThemeController />
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-1.5rem] text-white dark:text-gray-900 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                    Theme
                </span>
            </div>

            {/* Hamburger Menu for small screens */}
            <div className="md:hidden relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="focus:outline-none"
                >
                    <Menu className="text-white dark:text-gray-900" size={24} />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 top-12 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-lg shadow-lg p-4 space-y-2 w-48 z-50">
                        {hasDashboardAccess && (
                            <>
                                {user?.role === "admin" && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="block px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                {user?.clubs.some((club) => ["clubadmin", "moderator"].includes(club.clubRole)) && (
                                    <Link
                                        to="/club/dashboard"
                                        className="block px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition"
                                    >
                                        Club Dashboard
                                    </Link>
                                )}
                                {user?.role === "user" && (
                                    <Link
                                        to="/user/dashboard"
                                        className="block px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition"
                                    >
                                        User Dashboard
                                    </Link>
                                )}
                            </>
                        )}
                        {user?.role === "user" && (
                            <Link
                                to="/join-club"
                                className="block px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition"
                            >
                                Join Club
                            </Link>
                        )}
                        {!isProfilePage && (
                            <Link
                                to="/profile"
                                className="block px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition"
                            >
                                Profile
                            </Link>
                        )}
                        {!isNotificationPage && (
                            <Link
                                to="/notifications"
                                className="block px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition"
                            >
                                Notifications
                            </Link>
                        )}
                        <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 rounded-md hover:bg-red-500 dark:hover:bg-red-400 hover:text-white dark:hover:text-gray-900 transition"
                        >
                        <LogOut className="hover:text-red-400 dark:hover:text-red-600 transition-transform transform group-hover:scale-110" size={24} />

                        </button>
                    </div>
                )}
            </div>

            
        </nav>
    );
};

export default Navbar;