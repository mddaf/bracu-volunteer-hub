import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/clubs" : "/api/clubs";

axios.defaults.withCredentials = true;

const CreateClub = () => {
    const [clubName, setClubName] = useState("");
    const [username, setUsername] = useState(""); // New field for username
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [clubRole] = useState("clubadmin"); // Fixed role for new user
    const [isLoading, setIsLoading] = useState(false);
    const [userExists, setUserExists] = useState(false); // Track if the user exists

    const checkUserExists = async () => {
        try {
            const response = await axios.get(`${API_URL}/check-user`, { params: { email } });
            setUserExists(response.data.exists);
            if (response.data.exists) {
                toast.success("User exists. You can add them to the club.");
            } else {
                toast.info("User does not exist. Please provide a password.");
            }
        } catch (error) {
            toast.error("User does not exist. Please provide a password.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!userExists && password !== confirmPassword) {
            toast.error("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/create-club`, {
                clubName,
                username, // Include username
                email,
                password: userExists ? undefined : password, // Only send password if creating a new user
                confirmPassword: userExists ? undefined : confirmPassword,
                clubRole,
            });

            toast.success(response.data.message || "Club created successfully!");
            setClubName("");
            setUsername(""); // Reset username
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setUserExists(false); // Reset user existence state
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create club.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center text-green-500 dark:text-green-600 mb-6">
                Create Club
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 dark:text-gray-700 mb-2">Club Name</label>
                    <input
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter a unique club name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 dark:text-gray-700 mb-2">User Name</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter user name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 dark:text-gray-700 mb-2">User Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={checkUserExists} // Check if the user exists when the email field loses focus
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter user email"
                        required
                    />
                </div>

                {!userExists && (
                    <>
                        <div>
                            <label className="block text-gray-300 dark:text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 dark:text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Confirm password"
                                required
                            />
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-gray-300 dark:text-gray-700 mb-2">Club Role</label>
                    <p className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300">
                        Club Admin
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {isLoading ? "Creating..." : "Create Club"}
                </button>
            </form>
        </div>
    );
};

export default CreateClub;