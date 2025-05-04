import { Link, useLocation } from "react-router-dom";
import { Search, User, Bell, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import ThemeController from "./ThemeController";

const Navbar = () => {
    const { logout, user } = useAuthStore(); // Access user information
    const location = useLocation(); // Get the current route

    // Determine visibility of elements based on the current route
    const isHomePage = location.pathname === "/";
    const isProfilePage = location.pathname === "/profile";
    const isNotificationPage = location.pathname === "/notifications";
    const isAdminDashboardPage = location.pathname === "/admin/dashboard";
    const isClubDashboardPage = location.pathname === "/club/dashboard";

    return (
        <nav className='bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 shadow-md flex items-center justify-between'>
            {/* Logo */}
            <Link to='/' className='text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text dark:from-green-500 dark:to-emerald-700'>
                MyApp
            </Link>

            {/* Search Bar (only visible on HomePage) */}
            {isHomePage && (
                <div className='flex items-center bg-gray-800 dark:bg-gray-200 rounded-lg px-3 py-2'>
                    <Search className='text-gray-400 dark:text-gray-600 mr-2' size={20} />
                    <input
                        type='text'
                        placeholder='Search...'
                        className='bg-transparent outline-none text-sm text-gray-300 dark:text-gray-700 placeholder-gray-500 dark:placeholder-gray-600'
                    />
                </div>
            )}

            {/* Icons */}
            <div className='flex items-center space-x-4'>
                {/* Dashboard Link (based on user role, hidden on respective dashboard page) */}
                {user?.role === "admin" && !isAdminDashboardPage && (
                    <Link to='/admin/dashboard'>
                        <LayoutDashboard className='hover:text-green-400 dark:hover:text-green-600 transition' size={24} />
                    </Link>
                )}
                {user?.role === "clubadmin" && !isClubDashboardPage && (
                    <Link to='/club/dashboard'>
                        <LayoutDashboard className='hover:text-green-400 dark:hover:text-green-600 transition' size={24} />
                    </Link>
                )}

                {/* Profile Icon (hidden on ProfilePage) */}
                {!isProfilePage && (
                    <Link to='/profile'>
                        <User className='hover:text-green-400 dark:hover:text-green-600 transition' size={24} />
                    </Link>
                )}

                {/* Notification Icon (hidden on NotificationPage) */}
                {!isNotificationPage && (
                    <Link to='/notifications'>
                        <Bell className='hover:text-green-400 dark:hover:text-green-600 transition' size={24} />
                    </Link>
                )}

                {/* Theme Toggle Button */}
                <ThemeController />

                {/* Logout Icon */}
                <button onClick={logout} className='focus:outline-none'>
                    <LogOut className='hover:text-red-400 dark:hover:text-red-600 transition' size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;