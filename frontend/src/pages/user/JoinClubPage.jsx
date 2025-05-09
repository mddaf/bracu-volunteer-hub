import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { toast } from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/join-club"
    : "/api/join-club";

const JoinClubPage = () => {
  const [clubs, setClubs] = useState([]); // State to store all clubs
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedClub, setSelectedClub] = useState(null); // Selected club for join request
  const [message, setMessage] = useState(""); // Optional message for the join request
  const [submitting, setSubmitting] = useState(false); // Submitting state

  // Fetch all clubs from the API
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const res = await axios.get(`${API_URL}/clubs`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });
        setClubs(res.data.clubs); // Assuming the API returns { clubs: [...] }
      } catch (error) {
        toast.error("Failed to fetch clubs");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Handle join request submission
  const handleJoinRequest = async (e) => {
    e.preventDefault();
    if (!selectedClub) {
      toast.error("Please select a club to join");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const res = await axios.post(
        `${API_URL}/${selectedClub}/join`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        }
      );

      toast.success(res.data.message || "Join request sent successfully!");
      setMessage(""); // Clear the message field
      setSelectedClub(null); // Reset selected club
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send join request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-white dark:text-gray-900">
        Loading clubs...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full p-6  text-white dark:bg-gray-100 dark:text-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Join a Club</h2>
        </div>
        {clubs.length === 0 ? (
          <p>No clubs available to join.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club._id}
                className={`p-4 border rounded-lg shadow cursor-pointer ${
                  selectedClub === club._id
                    ? "bg-blue-600 text-white border-blue-700 dark:bg-blue-500 dark:border-blue-600"
                    : "bg-gray-800 text-gray-400 border-gray-300 hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-700 dark:border-gray-300 dark:hover:bg-gray-300"
                }`}
                onClick={() => setSelectedClub(club._id)}
              >
                <h3 className="text-lg font-semibold">{club.clubName}</h3>
                <p className="text-sm">
                  {club.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {selectedClub && (
          <form onSubmit={handleJoinRequest} className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Send Join Request</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
              rows="4"
              placeholder="Why do you want to join this club? (optional)"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Send Request"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedClub(null)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default JoinClubPage;
