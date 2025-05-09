import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"; // Import Navbar
import ManageMembers from "./ManageMembers";
import AddMember from "./AddMember";
import CreateEvent from "./CreateEvent";
import ManageEvent from "./ManageEvent";
import JoinRequest from "./JoinRequest";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for toggle

const ClubAdminDashboard = () => {
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
              Club Admin
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
                  onClick={() => setActiveComponent("add-member")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "A" : "Add Member"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("manage-member")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "M" : "Manage Members"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("create-event")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "C" : "Create Event"}
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
              <li>
                <button
                  onClick={() => setActiveComponent("join-request")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "J" : "Join Request"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("club-profile")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "P" : "Club Profile"}
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
                Welcome, Club Admin
              </h1>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overview Cards */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Total Members
                  </h2>
                  <p className="mt-2 text-3xl font-bold text-green-500">150</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Upcoming Events
                  </h2>
                  <p className="mt-2 text-3xl font-bold text-green-500">5</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Club Revenue
                  </h2>
                  <p className="mt-2 text-3xl font-bold text-green-500">$12,000</p>
                </div>
              </div>
            </div>
          )}
          {activeComponent === "add-member" && <AddMember />}
          {activeComponent === "manage-member" && <ManageMembers />}
          {activeComponent === "create-event" && <CreateEvent />}
          {activeComponent === "manage-event" && <ManageEvent />}
          {activeComponent === "join-request" && <JoinRequest />}
          {activeComponent === "club-profile" && <ClubProfile />}
        </main>
      </div>
    </div>
  );
};

export default ClubAdminDashboard;
