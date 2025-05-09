import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore"; // Import the auth store

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/clubs"
    : "/api/clubs";

const JoinedClubs = () => {
  const [joinedClubs, setJoinedClubs] = useState([]);
  const user = useAuthStore((state) => state.user); // Get the current user from the auth store

  useEffect(() => {
    const fetchJoinedClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/user-clubs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJoinedClubs(response.data.clubs);
      } catch (error) {
        console.error("Error fetching joined clubs:", error);
        toast.error("Failed to fetch joined clubs.");
      }
    };

    fetchJoinedClubs();
  }, []);

  const handleLeaveClub = async (clubId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/leave-club`,
        { clubId, userId: user._id }, // Pass the user ID to the backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);

      // Remove the club from the list of joined clubs
      setJoinedClubs((prevClubs) =>
        prevClubs.filter((club) => club.clubId !== clubId)
      );
    } catch (error) {
      console.error("Error leaving club:", error);
      toast.error(error.response?.data?.message || "Failed to leave club.");
    }
  };

  return (
    <div className="min-h-screen w-full p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8 text-green-400 border-b border-green-500 pb-2">
        Joined Clubs
      </h1>

      {joinedClubs.length === 0 && (
        <p className="text-gray-400">You have not joined any clubs.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {joinedClubs.map((club) => (
          <div
            key={club.clubId}
            className="bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-green-300 mb-1">
              {club.clubName}
            </h2>
            <p className="text-sm text-gray-400">{club.description}</p>
            {club.logo && (
              <img
                src={club.logo}
                alt={club.clubName}
                className="my-4 rounded-lg w-full max-h-48 object-cover"
              />
            )}
            <button
              onClick={() => handleLeaveClub(club.clubId)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Leave Club
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinedClubs;