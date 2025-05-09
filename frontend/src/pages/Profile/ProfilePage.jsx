import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Overview from "./Overview";
import AccountSettings from "./AccountSettings";
import { useAuthStore } from "../../store/authStore";
import { LogOut, User, Settings, ChevronLeft, ChevronRight } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview user={user} />;
      case "settings":
        return <AccountSettings user={user} logout={logout} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen w-full shadow-lg border border-gray-700 dark:border-gray-200 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? "w-17" : "w-64"
          } bg-gray-800 dark:bg-gray-100 p-4 transition-all duration-300 space-y-6 relative`}
        >
          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-0.5 -right-5 bg-gray-800 dark:bg-gray-100 border border-gray-600 dark:border-gray-300 rounded-full p-1"
          >
            {collapsed ? (
              <ChevronRight className="text-white dark:text-gray-700" />
            ) : (
              <ChevronLeft className="text-white dark:text-gray-700" />
            )}
          </button>

          {!collapsed && (
            <h2 className="text-2xl font-bold text-emerald-400 dark:text-emerald-600 mb-4">
              Profile
            </h2>
          )}

          <nav className="space-y-3">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition ${
                activeTab === "overview"
                  ? "bg-emerald-400 dark:bg-emerald-600 text-white"
                  : "text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-200"
              }`}
            >
              <User size={20} />
              {!collapsed && "Overview"}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition ${
                activeTab === "settings"
                  ? "bg-emerald-400 dark:bg-emerald-600 text-white"
                  : "text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-200"
              }`}
            >
              <Settings size={20} />
              {!collapsed && "Account Settings"}
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-red-400 dark:text-red-600 hover:bg-red-900 dark:hover:bg-red-100 transition"
            >
              <LogOut size={20} />
              {!collapsed && "Logout"}
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 bg-gray-900 dark:bg-white text-white dark:text-gray-800 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-emerald-400 dark:text-emerald-600">
            {activeTab === "overview" ? "Overview" : "Account Settings"}
          </h1>
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
