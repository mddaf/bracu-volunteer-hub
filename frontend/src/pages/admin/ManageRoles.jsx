import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/user-manage" : "/api/user-manage";

const ManageRoles = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClubModalOpen, setIsClubModalOpen] = useState(false);
    const [selectedClubs, setSelectedClubs] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/list`);
            setUsers(res.data);
        } catch {
            toast.error("Failed to fetch users");
        }
    };

    const handleAction = async (action, userId) => {
        try {
            if (action === "ban") {
                await axios.patch(`${API_URL}/ban/${userId}`);
                toast.success("User banned");
            } else if (action === "unban") {
                await axios.patch(`${API_URL}/unban/${userId}`);
                toast.success("User unbanned");
            } else if (action === "delete") {
                await axios.delete(`${API_URL}/delete/${userId}`);
                toast.success("User deleted");
            }
            fetchUsers();
        } catch {
            toast.error(`Failed to ${action} user`);
        }
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const openClubModal = (user) => {
        setSelectedClubs(user.clubs);
        setIsClubModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const closeClubModal = () => {
        setSelectedClubs([]);
        setIsClubModalOpen(false);
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Manage Roles</h1>
            <div className="overflow-x-auto max-h-[80vh] overflow-y-auto custom-scrollbar">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Name</th>
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Role</th>
                            <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t border-gray-200 dark:border-gray-700">
                                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{user.name}</td>
                                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{user.role}</td>
                                <td className="px-4 py-2">
                                    <button onClick={() => openModal(user)} className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">View More</button>
                                    <button onClick={() => openClubModal(user)} className="mr-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">View Clubs</button>
                                    <button onClick={() => handleAction(user.bannedAccount ? "unban" : "ban", user._id)} className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">
                                        {user.bannedAccount ? "Unban" : "Ban"}
                                    </button>
                                    <button onClick={() => handleAction("delete", user._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Details Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">User Details</h2>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {selectedUser.name}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {selectedUser.email}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Role:</strong> {selectedUser.role}</p>
                        <p className="text-gray-700 dark:text-gray-300"><strong>Event Banned Count:</strong> {selectedUser.eventBannedCount}</p>
                        <button onClick={closeModal} className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded">Close</button>
                    </div>
                </div>
            )}

            {/* User Clubs Modal */}
            {isClubModalOpen && selectedClubs && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Joined Clubs</h2>
                        {selectedClubs.length > 0 ? (
                            <ul>
                                {selectedClubs.map((club, index) => (
                                    <li key={index} className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <p className="text-gray-700 dark:text-gray-300"><strong>Club Name:</strong> {club.clubId?.clubName}</p>
                                        <p className="text-gray-700 dark:text-gray-300"><strong>Role:</strong> {club.clubRole}</p>
                                        <p className="text-gray-700 dark:text-gray-300"><strong>Status:</strong> {club.banned ? "Banned" : "Active"}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300">No clubs associated with this user.</p>
                        )}
                        <button onClick={closeClubModal} className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRoles;
