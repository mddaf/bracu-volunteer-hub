import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore"; // Import the auth store

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/events"
    : "/api/events";

const CLUB_API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/clubs"
    : "/api/clubs";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [clubNames, setClubNames] = useState({});
  const user = useAuthStore((state) => state.user); // Get the current user from the auth store

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        // Fetch all events
        const res = await axios.get(API_URL);
        const eventsData = res.data.events;
        setEvents(eventsData);

        // Extract unique club IDs from events
        const clubIds = [...new Set(eventsData.map((event) => event.createdByClubId))];

        // Fetch club names using the /get-club-names endpoint
        if (clubIds.length > 0) {
          const clubRes = await axios.post(`${CLUB_API_URL}/get-club-names`, { clubIds });
          setClubNames(clubRes.data); // clubRes.data is a map of clubId -> clubName
        }
      } catch (error) {
        console.error("Error fetching events or clubs:", error);
        toast.error("Failed to fetch events or clubs.");
      }
    };

    fetchAllEvents();
  }, []);

  const handleJoin = async (eventId) => {
    if (!user) {
      toast.error("You must be logged in to join an event");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/join/${eventId}`,
        { userId: user._id }, // Pass the user ID to the backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);

      // Update the event list to reflect the joined event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, volunteersJoined: event.volunteersJoined + 1, eventVolunteerList: [...event.eventVolunteerList, { userId: user._id }] }
            : event
        )
      );
    } catch (error) {
      if (error.response?.data?.message === "You have already joined this event") {
        toast.error("You have already joined this event");
      } else if (error.response?.data?.message === "Volunteer limit reached") {
        toast.error("Volunteer limit reached");
      } else {
        toast.error(error.response?.data?.message || "Failed to join event");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full p-6 bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-green-400 dark:text-green-600 border-b border-green-500 pb-2">
          Available Events
        </h1>

        {events.length === 0 && <p className="text-gray-400 dark:text-gray-500">No events available.</p>}

        <div className="max-h-[80vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
          {events.map((event) => {
            const isJoined = event.eventVolunteerList.some(
              (volunteer) => volunteer.userId === user?._id
            );

            return (
              <div
                key={event._id}
                className="bg-gray-800 dark:bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg"
              >
                <h2 className="text-xl font-semibold text-green-300 dark:text-green-600 mb-1">
                  {event.eventName}
                </h2>
                <p className="mb-2 text-gray-300 dark:text-gray-700">{event.details}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Open To: {event.openTo}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Volunteer Limit: {event.volunteerLimit}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Volunteers Joined: {event.volunteersJoined}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Created By:{" "}
                  <span className="font-bold text-green-400 dark:text-green-600">
                    {clubNames[event.createdByClubId] || "Unknown Club"}
                  </span>
                </p>
                {event.picture && (
                  <img
                    src={event.picture}
                    alt={event.eventName}
                    className="my-4 rounded-lg w-full max-h-48 object-cover"
                  />
                )}
               {user?.role !== "admin" && (
  <button
    onClick={() => handleJoin(event._id)}
    className={`mt-4 px-4 py-2 rounded ${
      isJoined
        ? "bg-gray-500 text-white cursor-not-allowed"
        : "bg-green-700 text-white hover:bg-green-600"
    }`}
    disabled={isJoined || (event.volunteerLimit !== "No limit" && event.volunteersJoined >= event.volunteerLimit)}
  >
    {isJoined
      ? "Joined"
      : event.volunteerLimit !== "No limit" &&
        event.volunteersJoined >= event.volunteerLimit
      ? "Full"
      : "Join"}
  </button>
)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HomePage;