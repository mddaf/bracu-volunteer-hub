import { motion } from "framer-motion";

const Overview = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {/* Profile Info */}
      <div className="p-6 rounded-xl bg-gray-800 dark:bg-gray-50 border border-gray-700 dark:border-gray-200">
        <h3 className="text-xl font-semibold text-emerald-400 dark:text-emerald-600 mb-4">Profile Information</h3>
        <ul className="space-y-2 text-gray-300 dark:text-gray-700">
          <li><strong>Name:</strong> {user.name}</li>
          <li><strong>Email:</strong> {user.email}</li>
          <li><strong>Role:</strong> {user.role}</li>
        </ul>
      </div>

      {/* Activity Info */}
      <div className="p-6 rounded-xl bg-gray-800 dark:bg-gray-50 border border-gray-700 dark:border-gray-200">
        <h3 className="text-xl font-semibold text-emerald-400 dark:text-emerald-600 mb-4">Account Activity</h3>
        <ul className="space-y-2 text-gray-300 dark:text-gray-700">
          <li>
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </li>
          <li><strong>Last Login:</strong> {user.lastLogin}</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Overview;
