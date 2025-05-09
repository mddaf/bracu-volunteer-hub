import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/clubs"
    : "/api/clubs";

const SelectClub = ({ onClubSelect, selectedClubId }) => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get(`${API_URL}/user-clubs`, {
          withCredentials: true, // Ensure cookies are sent for authentication
        });
        setClubs(response.data.clubs);

        // If no club is selected, default to the first club
        if (!selectedClubId && response.data.clubs.length > 0) {
          onClubSelect(response.data.clubs[0].clubId);
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
        toast.error("Failed to fetch clubs.");
      }
    };

    fetchClubs();
  }, [onClubSelect, selectedClubId]);

  const handleClubChange = (e) => {
    const clubId = e.target.value;
    onClubSelect(clubId); // Pass the selected club ID to the parent component
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Club
      </label>
      <select
        value={selectedClubId || ""}
        onChange={handleClubChange}
        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {clubs.map((club) => (
          <option key={club.clubId} value={club.clubId}>
            {club.clubName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectClub;