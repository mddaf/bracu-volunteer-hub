import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import SelectClub from "./SelectClub";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/join-club"
    : "/api/join-club";

const JoinRequest = () => {
  const [selectedClubId, setSelectedClubId] = useState(null); // Selected club ID
  const [requests, setRequests] = useState([]); // State to store join requests
  const [loading, setLoading] = useState(false); // Loading state
  const [processing, setProcessing] = useState(false); // Processing state for actions

  // Fetch join requests for the selected club
  useEffect(() => {
    if (!selectedClubId) return;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const res = await axios.get(`${API_URL}/${selectedClubId}/requests`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });
        setRequests(res.data.joinRequests); // Assuming the API returns { joinRequests: [...] }
      } catch (error) {
        toast.error("Failed to fetch join requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [selectedClubId]);

  // Handle accept or deny actions
  const handleAction = async (requestId, action) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const res = await axios.post(
        `${API_URL}/requests/${requestId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        }
      );

      toast.success(res.data.message || `Request ${action}ed successfully!`);
      // Remove the processed request from the list
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${action} request`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Join Requests</h2>

      {/* Club Selection */}
      <SelectClub
        onClubSelect={setSelectedClubId}
        selectedClubId={selectedClubId}
      />

      {/* Loading State */}
      {loading ? (
        <div className="text-center mt-10 text-gray-900 dark:text-white">
          Loading join requests...
        </div>
      ) : requests.length === 0 ? (
        <p className="mt-6">No pending join requests for this club.</p>
      ) : (
        <div className="space-y-4 mt-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="p-4 border rounded-lg shadow bg-gray-200 dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold">
                {request.userId.name} ({request.userId.email})
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {request.message || "No message provided."}
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleAction(request._id, "accept")}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  disabled={processing}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAction(request._id, "deny")}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  disabled={processing}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinRequest;