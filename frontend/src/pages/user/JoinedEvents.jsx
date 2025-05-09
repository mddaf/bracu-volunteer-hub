import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore"; // Import the auth store

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/events"
    : "/api/events";

const CLUB_API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/clubs"
    : "/api/clubs";

const JoinedEvents = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [clubNames, setClubNames] = useState({});
  const user = useAuthStore((state) => state.user); // Get the current user from the auth store

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${API_URL}/joined-events`,
          { userId: user._id }, // Pass the user ID to the backend
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const events = res.data.events;

        // Extract unique club IDs from events
        const clubIds = [...new Set(events.map((event) => event.createdByClubId))];

        // Fetch club names using the /get-club-names endpoint
        if (clubIds.length > 0) {
          const clubRes = await axios.post(`${CLUB_API_URL}/get-club-names`, { clubIds });
          setClubNames(clubRes.data); // clubRes.data is a map of clubId -> clubName
        }

        setJoinedEvents(events);
      } catch (error) {
        toast.error("Error fetching joined events");
      }
    };
    fetchJoinedEvents();
  }, [user]);

  const handleLeave = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/leave/${eventId}`,
        { userId: user._id }, // Pass the user ID to the backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);

      // Remove the left event from the list
      setJoinedEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave event");
    }
  };

  return (
    <>
      <div className="min-h-screen w-full p-6 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8 text-green-400 border-b border-green-500 pb-2">
          Joined Events
        </h1>

        {joinedEvents.length === 0 && (
          <p className="text-gray-400">You have not joined any events.</p>
        )}

        <div className="max-h-[80vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
          {joinedEvents.map((event) => {
            // Find the current user's volunteer entry
            const volunteer = event.eventVolunteerList.find(
              (v) => v.userId === user._id
            );

            return (
              <div key={event._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-300 mb-1">{event.eventName}</h2>
                <p className="mb-2">{event.details}</p>
                <p className="text-sm text-gray-400">Open To: {event.openTo}</p>
                <p className="text-sm text-gray-400">Volunteer Limit: {event.volunteerLimit}</p>
                <p className="text-sm text-gray-400">Volunteers Joined: {event.volunteersJoined}</p>
                <p className="text-sm text-gray-400">
                  Created By:{" "}
                  <span className="font-bold text-green-500">
                    {clubNames[event.createdByClubId] || "Unknown Club"}
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  Your Status:{" "}
                  <span
                    className={`font-bold ${
                      volunteer?.banned ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {volunteer?.banned ? "Banned" : "Active"}
                  </span>
                </p>
                {event.picture && (
                  <img
                    src={event.picture}
                    alt={event.eventName}
                    className="my-4 rounded-lg w-full max-h-48 object-cover"
                  />
                )}
                <button
                  onClick={() => handleLeave(event._id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Leave
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default JoinedEvents;