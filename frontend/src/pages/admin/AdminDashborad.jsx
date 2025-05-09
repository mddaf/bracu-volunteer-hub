import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"; // Import Navbar
import CreateRoles from "./CreateRoles";
import CreateEvent from "./CreateEvent";
import CreateClub from "./CreateClub"; // Import CreateClub component
import ManageRoles from "./ManageRoles";
import ManageEvent from "./ManageEvent";
import ManageClubs from "./ManageClub";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for toggle

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("overview"); // State to track active component
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State to track sidebar collapse
  const [isMobile, setIsMobile] = useState(false); // State to track if the device is mobile

  // Detect screen size and auto-collapse sidebar on medium and small devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Collapse sidebar for screens <= 768px
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true); // Auto-collapse sidebar on mobile
    }
  }, [isMobile]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-16" : "w-64"
          } bg-gray-800 dark:bg-gray-700 text-gray-200 transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between p-4">
            <div
              className={`text-center text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text ${
                isSidebarCollapsed ? "hidden" : "block"
              }`}
            >
              Admin
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-gray-400 hover:text-gray-200 focus:outline-none"
            >
              {isSidebarCollapsed ? (
                <ChevronRight size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </button>
          </div>
          <nav className="mt-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveComponent("overview")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "O" : "Overview"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("create-club")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "C" : "Create Club"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("manage-club")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "M" : "Manage Club"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("create-roles")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "R" : "Create Roles"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("manage-roles")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "M" : "Manage Roles"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("create-event")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "E" : "Create Event"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("manage-event")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "M" : "Manage Event"}
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeComponent === "overview" && (
            <div className="p-6">
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
            </div>
          )}
          {activeComponent === "create-club" && <CreateClub />}
          {activeComponent === "manage-club" && <ManageClubs />}
          {activeComponent === "create-roles" && <CreateRoles />}
          {activeComponent === "manage-roles" && <ManageRoles />}
          {activeComponent === "create-event" && <CreateEvent />}
          {activeComponent === "manage-event" && <ManageEvent />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;