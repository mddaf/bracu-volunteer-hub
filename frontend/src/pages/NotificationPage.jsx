import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const NotificationPage = () => {
    const notifications = []; // Replace with actual notifications data if available

    return (
        <div>
            <Navbar />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full mx-auto mt-10 p-8 
                bg-gray-900 dark:bg-gray-100 bg-opacity-80 dark:bg-opacity-100 
                backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl 
                border border-gray-800 dark:border-gray-300'
            >
                <h2 className='text-3xl font-bold mb-6 text-center 
                bg-gradient-to-r from-green-400 to-emerald-600 
                text-transparent bg-clip-text dark:from-green-500 dark:to-emerald-700'>
                    Notifications
                </h2>

                <div className='space-y-6'>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <motion.div
                                key={index}
                                className='p-4 bg-gray-800 dark:bg-gray-200 bg-opacity-50 
                                dark:bg-opacity-100 rounded-lg border border-gray-700 
                                dark:border-gray-300'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * index }}
                            >
                                <h3 className='text-lg font-semibold text-green-400 dark:text-green-600 mb-2'>
                                    {notification.title}
                                </h3>
                                <p className='text-gray-300 dark:text-gray-700'>{notification.message}</p>
                                <p className='text-sm text-gray-500 dark:text-gray-600 mt-2'>
                                    {new Date(notification.date).toLocaleString()}
                                </p>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className='p-4 bg-gray-800 dark:bg-gray-200 bg-opacity-50 
                            dark:bg-opacity-100 rounded-lg border border-gray-700 
                            dark:border-gray-300'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className='text-gray-300 dark:text-gray-700 text-center'>
                                You have no new notifications.
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default NotificationPage;