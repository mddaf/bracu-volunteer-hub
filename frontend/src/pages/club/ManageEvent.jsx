import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import SelectClub from "./SelectClub"; // Import the SelectClub component

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/events"
    : "/api/events";

const CLUB_API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/clubs"
    : "/api/clubs";

const ManageAllEvents = () => {
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));
  const [events, setEvents] = useState([]);
  const [clubNames, setClubNames] = useState({}); // Store club names by ID
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchEventsAndClubs = async () => {
        try {
          // Fetch events
          const res = await axios.get(`${API_URL}/my-events`, {
            params: { createdBy: user._id },
          });
          setEvents(res.data.events);

          // Extract unique club IDs
          const clubIds = res.data.events
            .map((event) => event.createdByClubId)
            .filter((id) => id); // Filter out null or undefined IDs

          if (clubIds.length > 0) {
            // Fetch club names
            const clubRes = await axios.post(`${CLUB_API_URL}/get-club-names`, {
              clubIds,
            });
            setClubNames(clubRes.data); // Store club names by ID
          }
        } catch (err) {
          toast.error("Error fetching events or clubs");
        }
      };
      fetchEventsAndClubs();
    }
  }, [isAuthenticated, user]);

  const handleEditToggle = (event) => {
    setEditingId(event._id);
    setEditData({
      eventId: event.eventId,
      eventName: event.eventName,
      picture: event.picture,
      details: event.details,
      openTo: event.openTo,
      volunteerLimit: typeof event.volunteerLimit === "number" ? event.volunteerLimit : event.volunteerLimit || "No limit",
      createdByClubId: event.createdByClubId || "", // Include createdByClubId
    });
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/delete/${eventId}`);
      toast.success("Event deleted.");
      setEvents(events.filter((e) => e._id !== eventId));
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleClubSelect = (clubId) => {
    setEditData((prev) => ({
      ...prev,
      createdByClubId: clubId, // Update createdByClubId when a club is selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(editData).forEach(([key, val]) => {
        if (key === "volunteerLimit") {
          formData.append(key, isNaN(val) ? val : Number(val));
        } else {
          formData.append(key, val);
        }
      });

      await axios.put(`${API_URL}/update/${editingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event updated successfully");
      setEditingId(null);

      const res = await axios.get(`${API_URL}/my-events`, {
        params: { createdBy: user._id },
      });
      setEvents(res.data.events);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-green-500 dark:text-green-400 border-b border-green-500 pb-2">
        Manage All Events
      </h1>

      {events.length === 0 && <p className="text-gray-500 dark:text-gray-400">No events available.</p>}

      <div className="max-h-[80vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
        {events.map((event) => (
          <div key={event._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {editingId === event._id ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="eventId"
                  value={editData.eventId}
                  onChange={handleInputChange}
                  placeholder="Event ID"
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="text"
                  name="eventName"
                  value={editData.eventName}
                  onChange={handleInputChange}
                  placeholder="Event Name"
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <textarea
                  name="details"
                  value={editData.details}
                  onChange={handleInputChange}
                  placeholder="Event Details"
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                />
                <select
                  name="openTo"
                  value={editData.openTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Open to All</option>
                  <option value="clubMembersOnly">Club Members Only</option>
                </select>
                <input
                  type="text"
                  name="volunteerLimit"
                  value={editData.volunteerLimit}
                  onChange={handleInputChange}
                  placeholder="Volunteer Limit (e.g., 10 or 'No limit')"
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="file"
                  name="picture"
                  onChange={handleInputChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                />
                {editData.picture && (
                  <img
                    src={
                      typeof editData.picture === "string"
                        ? editData.picture
                        : URL.createObjectURL(editData.picture)
                    }
                    alt="Preview"
                    className="rounded-lg w-full max-h-48 object-cover my-2"
                  />
                )}
               <div>
  <SelectClub
    onClubSelect={handleClubSelect} // Pass the selected club ID to handleClubSelect
    selectedClubId={editData.createdByClubId} // Bind the current selected club ID
  />
</div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-green-500 dark:text-green-400 mb-1">{event.eventName}</h2>
                <p className="mb-2 text-gray-700 dark:text-gray-300">{event.details}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Open To: {event.openTo}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Volunteer Limit: {event.volunteerLimit}</p>
                {event.createdByClubId && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Club: {clubNames[event.createdByClubId] || "Loading..."}
                  </p>
                )}
                {event.picture && (
                  <img
                    src={event.picture}
                    alt={event.eventName}
                    className="my-4 rounded-lg w-full max-h-48 object-cover"
                  />
                )}
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleEditToggle(event)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAllEvents;