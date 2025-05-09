import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/roles" : "/api/roles";

const CreateRoles = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user"); // Default role is "user"
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
    
        setIsLoading(true);
    
        try {
            const response = await axios.post(`${API_URL}/check-email`, { name, email, password, role });
            if (response.data.exists) {
                toast.error(response.data.message);
            } else {
                toast.success(response.data.message);
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setRole("user");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create role");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 dark:bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center text-green-500 dark:text-green-600 mb-6">
                Create Role
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Name"
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Dummy Password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-gray-400 dark:text-gray-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Confirm Dummy Password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-gray-400 dark:text-gray-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-lg border border-gray-700 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {isLoading ? "Creating..." : "Create Role"}
                </button>
            </form>
        </div>
    );
};

export default CreateRoles;