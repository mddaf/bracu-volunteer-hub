import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore"; // Import the auth store
import SelectClub from "./SelectClub"; // Import the updated SelectClub component

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/events" : "/api/events";

const CreateEvent = () => {
    const { user, isAuthenticated } = useAuthStore(); // Access user and authentication state
    const [eventId, setEventId] = useState("");
    const [eventName, setEventName] = useState("");
    const [picture, setPicture] = useState(""); // Stores the URL or file path
    const [details, setDetails] = useState("");
    const [openTo, setOpenTo] = useState("all"); // Default is "all"
    const [volunteerLimit, setVolunteerLimit] = useState("No limit"); // Default is "No limit"
    const [createdBy, setCreatedBy] = useState(""); // Stores the creator's ID
    const [createdByType, setCreatedByType] = useState(""); // Dynamically set based on role
    const [createdByClubId, setCreatedByClubId] = useState(""); // Selected club ID
    const [isLoading, setIsLoading] = useState(false);

    // Set createdBy and createdByType dynamically based on the user
    useEffect(() => {
        if (isAuthenticated && user) {
            setCreatedBy(user._id);
            setCreatedByType(user.role === "admin" ? "admin" : "clubadmin");
        }
    }, [isAuthenticated, user]);

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.url; // Assuming the server returns the uploaded file's URL
        } catch (error) {
            toast.error("Failed to upload file");
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate volunteerLimit
        if (
            (typeof volunteerLimit === "string" && volunteerLimit !== "No limit" && isNaN(Number(volunteerLimit))) ||
            (typeof volunteerLimit === "number" && volunteerLimit <= 0) ||
            (typeof volunteerLimit === "string" && !isNaN(Number(volunteerLimit)) && Number(volunteerLimit) <= 0)
        ) {
            toast.error("Volunteer limit must be greater than 0 or 'No limit'");
            setIsLoading(false);
            return;
        }

        let pictureUrl = picture;

        // If a file is selected, upload it
        if (typeof picture !== "string" && picture) {
            pictureUrl = await handleFileUpload(picture);
            if (!pictureUrl) {
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await axios.post(`${API_URL}/create`, {
                eventId,
                eventName,
                picture: pictureUrl,
                details,
                openTo,
                volunteerLimit: isNaN(volunteerLimit) ? volunteerLimit : Number(volunteerLimit),
                createdBy,
                createdByType,
                createdByClubId, // Include the selected club ID
            });

            toast.success("Event created successfully!");
            setEventId("");
            setEventName("");
            setPicture("");
            setDetails("");
            setOpenTo("all");
            setVolunteerLimit("No limit");
            setCreatedByClubId("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create event");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center text-green-500 dark:text-green-600 mb-6">
                Create Event
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Event ID (unique)"
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Event Name"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 dark:text-gray-700 mb-2">Picture (URL or File)</label>
                    <input
                        type="text"
                        value={typeof picture === "string" ? picture : ""}
                        onChange={(e) => setPicture(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Picture URL"
                    />
                    <input
                        type="file"
                        onChange={(e) => setPicture(e.target.files[0])}
                        className="mt-2 w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div>
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Event Details"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div>
                    <select
                        value={openTo}
                        onChange={(e) => setOpenTo(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    >
                        <option value="all">Open to All</option>
                        <option value="clubMembersOnly">Club Members Only</option>
                    </select>
                </div>
                <div>
                    <input
                        type="text"
                        value={volunteerLimit}
                        onChange={(e) => setVolunteerLimit(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Volunteer Limit (e.g., 10 or 'No limit')"
                    />
                </div>
                <div>
                    <SelectClub
                        onClubSelect={setCreatedByClubId} // Pass the selected club ID to setCreatedByClubId
                        selectedClubId={createdByClubId} // Bind the selected club ID
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {isLoading ? "Creating..." : "Create Event"}
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;