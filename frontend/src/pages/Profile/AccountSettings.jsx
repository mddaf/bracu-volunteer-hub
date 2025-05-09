import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

const AccountSettings = ({ user, logout }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    }
  };

  return (
    <>
      <div className="mt-10 p-6 rounded-xl bg-gray-800 dark:bg-gray-50 border border-gray-700 dark:border-gray-200">
        <h3 className="text-xl font-semibold text-emerald-400 dark:text-emerald-600 mb-6">
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-6">
          {[
            {
              label: "Old Password",
              value: oldPassword,
              setter: setOldPassword,
              visible: showOldPassword,
              toggle: setShowOldPassword,
            },
            {
              label: "New Password",
              value: newPassword,
              setter: setNewPassword,
              visible: showNewPassword,
              toggle: setShowNewPassword,
            },
            {
              label: "Confirm Password",
              value: confirmPassword,
              setter: setConfirmPassword,
              visible: showConfirmPassword,
              toggle: setShowConfirmPassword,
            },
          ].map(({ label, value, setter, visible, toggle }, idx) => (
            <div className="relative" key={idx}>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 dark:text-emerald-600" />
              <input
                type={visible ? "text" : "password"}
                placeholder={label}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-600 dark:border-gray-300 bg-gray-900 dark:bg-white text-white dark:text-gray-800 focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => toggle(!visible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-700"
              >
                {visible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          ))}

          <PasswordStrengthMeter password={newPassword} />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Change Password
          </motion.button>
        </form>
      </div>
    </>
  );
};

export default AccountSettings;
