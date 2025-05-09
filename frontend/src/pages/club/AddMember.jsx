import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import SelectClub from "./SelectClub"; // Import the updated SelectClub component

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/clubs"
    : "/api/clubs";

const AddMember = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState(""); // State for selected club ID

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!selectedClubId) {
      toast.error("Please select a club.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please provide a valid email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/add-member`, {
        email,
        clubId: selectedClubId,
        clubRole: role,
      });

      toast.success(res.data.message || "Member added successfully!");
      setEmail("");
      setRole("member");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 dark:bg-white px-4">
      <div className="w-full max-w-md bg-gray-900 dark:bg-gray-100 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-400 dark:text-green-600 mb-6">
          Add Member to Club
        </h1>
        <form onSubmit={handleAddMember} className="space-y-5">
          {/* Pass selectedClubId and onClubSelect to SelectClub */}
          <SelectClub
            onClubSelect={setSelectedClubId}
            selectedClubId={selectedClubId} // Bind the selected club ID
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-800 mb-1">
              User Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-100 dark:text-gray-800 rounded-xl border border-gray-600 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-800 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-100 dark:text-gray-800 rounded-xl border border-gray-600 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="member">Member</option>
              <option value="clubadmin">Club Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-xl shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMember;