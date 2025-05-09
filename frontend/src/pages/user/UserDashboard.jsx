import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"; // Import Navbar
import JoinedClubs from "./JoinedClubs"; // Component to display joined clubs
import JoinedEvents from "./JoinedEvents"; // Component to display joined events
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for toggle

const UserDashboard = () => {
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
              User Dashboard
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
                  onClick={() => setActiveComponent("joined-clubs")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "C" : "Joined Clubs"}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveComponent("joined-events")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
                >
                  {isSidebarCollapsed ? "E" : "Joined Events"}
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
                Welcome, User
              </h1>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example Cards */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Total Clubs Joined
                  </h2>
                  <p className="mt-2 text-3xl font-bold text-green-500">5</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Total Events Joined
                  </h2>
                  <p className="mt-2 text-3xl font-bold text-green-500">12</p>
                </div>
              </div>
            </div>
          )}
          {activeComponent === "joined-clubs" && <JoinedClubs />}
          {activeComponent === "joined-events" && <JoinedEvents />}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;