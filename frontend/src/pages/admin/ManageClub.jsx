import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/clubs"
    : "/api/clubs";

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllClubs = async () => {
      try {
        const res = await axios.get(API_URL);
        setClubs(res.data.clubs);
      } catch {
        toast.error("Error fetching clubs");
      }
    };
    fetchAllClubs();
  }, []);

  const handleBanUnban = async (clubId, action) => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/${action}/${clubId}`);
      toast.success(`Club ${action}ed successfully.`);
      setClubs(
        clubs.map((club) =>
          club._id === clubId ? { ...club, banned: action === "ban" } : club
        )
      );
    } catch {
      toast.error("Error banning/unbanning club");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (clubId) => {
    if (!confirm("Delete this club?")) return;
    try {
      await axios.delete(`${API_URL}/delete/${clubId}`);
      toast.success("Club deleted.");
      setClubs(clubs.filter((club) => club._id !== clubId));
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen w-full p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8 text-green-400 border-b border-green-500 pb-2">
        Manage All Clubs
      </h1>

      {clubs.length === 0 && <p className="text-gray-400">No clubs available.</p>}

      <div className="max-h-[80vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
        {clubs.map((club) => (
          <div key={club._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-300 mb-1">{club.clubName}</h2>
            <p className="text-sm text-gray-400">Total Members: {club.totalMembers}</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleBanUnban(club._id, club.banned ? "unban" : "ban")}
                className={`${
                  club.banned ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white py-1 px-4 rounded`}
              >
                {club.banned ? "Unban" : "Ban"}
              </button>
              <button
                onClick={() => handleDelete(club._id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageClubs;
