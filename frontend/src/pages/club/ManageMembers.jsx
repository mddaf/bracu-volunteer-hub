import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore"; // Zustand store
import SelectClub from "./SelectClub"; // Import the updated SelectClub component

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/clubs"
    : "/api/clubs";

const ManageMembers = () => {
  const { user } = useAuthStore(); // Get the logged-in user from Zustand
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null); // For "View More" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clubId, setClubId] = useState(""); // Selected club ID

  useEffect(() => {
    if (clubId) {
      fetchMembers();
    }
  }, [clubId]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/${clubId}/members`);
      setMembers(response.data.members); // Set the members in state
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch members");
    }
  };

  const handleAction = async (action, memberId) => {
    if (!clubId) {
      toast.error("Club ID is missing or you are not authorized.");
      return;
    }

    try {
      if (action === "ban") {
        await axios.patch(`${API_URL}/${clubId}/ban-member/${memberId}`);
        toast.success("Member banned successfully");
      } else if (action === "unban") {
        await axios.patch(`${API_URL}/${clubId}/unban-member/${memberId}`);
        toast.success("Member unbanned successfully");
      } else if (action === "delete") {
        await axios.delete(`${API_URL}/${clubId}/delete-member/${memberId}`);
        toast.success("Member deleted successfully");
      }
      fetchMembers(); // Refresh the member list
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error(error.response?.data?.message || "Failed to perform action");
    }
  };

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setIsModalOpen(false);
  };

  // Restrict the page to club admins only
  if (!user || !user.clubs || user.clubs.every((club) => club.clubRole !== "clubadmin")) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        You must be a Club Admin to access this page.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Manage Members</h1>

      {/* Club Selector */}
      <SelectClub onClubSelect={setClubId} selectedClubId={clubId} />

      {clubId && (
        <div className="overflow-x-auto max-h-[80vh] overflow-y-auto custom-scrollbar mt-6">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Role</th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.userId._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{member.userId?.name || "Unknown"}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{member.clubRole}</td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{member.banned ? "Banned" : "Active"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(member)}
                      className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      View More
                    </button>
                    {member.banned ? (
                      <button
                        onClick={() => handleAction("unban", member.userId._id)}
                        className="mr-2 bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded"
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction("ban", member.userId._id)}
                        className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        Ban
                      </button>
                    )}
                    <button
                      onClick={() => handleAction("delete", member.userId._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View More Modal */}
      {isModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Member Details</h2>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Name:</strong> {selectedMember.userId?.name || "Unknown"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {selectedMember.userId?.email || "Unknown"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Role:</strong> {selectedMember.clubRole}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Status:</strong> {selectedMember.banned ? "Banned" : "Active"}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;