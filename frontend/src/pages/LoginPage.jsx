import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ThemeController from "../components/ThemeController";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    const { login, isLoading, error } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div
            className='max-w-md w-full bg-gray-900 dark:bg-gray-100 bg-opacity-50 dark:bg-opacity-100 
            backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                {/* Theme Controller */}
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 
                    text-transparent bg-clip-text dark:from-green-500 dark:to-emerald-700'>
                        Welcome Back
                    </h2>
                    <ThemeController />
                </div>

                <form onSubmit={handleLogin}>
                    <fieldset className='fieldset space-y-4'>
                        {/* Email Input */}
                        <div className='relative'>
                            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 dark:text-green-600' />
                            <input
                                className="input w-full pl-10 px-4 py-3 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 
                                placeholder-gray-500 dark:placeholder-gray-600 rounded-lg border border-gray-700 dark:border-gray-300 
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                                focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100"
                                type='email'
                                placeholder='Email Address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className='relative'>
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 dark:text-green-600' />
                            <input
                                className="input w-full pl-10 pr-10 px-4 py-3 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 
                                placeholder-gray-500 dark:placeholder-gray-600 rounded-lg border border-gray-700 dark:border-gray-300 
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                                focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100"
                                type={showPassword ? 'text' : 'password'} // Toggle input type
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600 focus:outline-none'
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </fieldset>

                    <div className='flex items-center mb-6 mt-2'>
                        <Link to='/forgot-password' className='text-sm text-green-400 dark:text-green-600 hover:underline'>
                            Forgot password?
                        </Link>
                    </div>
                    {error && <p className='text-red-500 dark:text-red-600 font-semibold mb-2'>{error}</p>}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                        text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                        focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100 transition duration-200'
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login"}
                    </motion.button>
                </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 dark:bg-gray-100 bg-opacity-50 dark:bg-opacity-100 flex justify-center'>
                <p className='text-sm text-gray-400 dark:text-gray-700'>
                    Don't have an account?{" "}
                    <Link to='/signup' className='text-green-400 dark:text-green-600 hover:underline'>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;