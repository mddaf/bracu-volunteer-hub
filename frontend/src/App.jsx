import { Navigate, Route, Routes } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NotificationPage from "./pages/NotificationPage";


import AdminDashboard from "./pages/admin/AdminDashborad"; // Import AdminDashboard
import ClubDashboard from "./pages/club/ClubAdminDashboard"; // Import ClubDashboard



import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
// import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated} = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};


const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuthStore();

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to='/' replace />;
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    return (
        <div
            className='min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden'
        >
            <Routes>
                {/* Existing Routes */}
                <Route
                    path='/'
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/signup'
                    element={
                        <RedirectAuthenticatedUser>
                            <div className='flex items-center justify-center h-screen'>
                                <SignUpPage />
                            </div>
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path='/login'
                    element={
                        <RedirectAuthenticatedUser>
                            <div className='flex items-center justify-center h-screen'>
                                <LoginPage />
                            </div>
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path='/profile'
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/notifications'
                    element={
                        <ProtectedRoute>
                            <NotificationPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Dashboard Route */}
                <Route
                    path='/admin/dashboard'
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                {/* Club Dashboard Route */}
                <Route
                    path='/club/dashboard'
                    element={
                        <ProtectedRoute>
                            <RoleBasedRoute allowedRoles={["clubadmin"]}>
                                <ClubDashboard />
                            </RoleBasedRoute>
                        </ProtectedRoute>
                    }
                />

                {/* Catch All Routes */}
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;