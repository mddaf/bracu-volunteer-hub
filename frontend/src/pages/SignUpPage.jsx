import { motion } from "framer-motion";
import { Loader, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import ThemeController from "../components/ThemeController";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility
    const navigate = useNavigate();

    const { signup, error, isLoading } = useAuthStore();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        try {
            await signup(email, password, name);
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-900 dark:bg-gray-100 bg-opacity-50 dark:bg-opacity-100 
            backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                {/* Theme Controller */}
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 
                    text-transparent bg-clip-text dark:from-green-500 dark:to-emerald-700'>
                        Create Account
                    </h2>
                    <ThemeController />
                </div>

                <form onSubmit={handleSignUp}>
                    {/* Full Name Input */}
                    <div className='relative mb-4'>
                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 dark:text-green-600' />
                        <input
                            className="input w-full pl-10 px-4 py-3 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 
                            placeholder-gray-500 dark:placeholder-gray-600 rounded-lg border border-gray-700 dark:border-gray-300 
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                            focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100"
                            type='text'
                            placeholder='Full Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email Input */}
                    <div className='relative mb-4'>
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
                    <div className='relative mb-4'>
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

                    {/* Confirm Password Input */}
                    <div className='relative mb-4'>
                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 dark:text-green-600' />
                        <input
                            className="input w-full pl-10 pr-10 px-4 py-3 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 
                            placeholder-gray-500 dark:placeholder-gray-600 rounded-lg border border-gray-700 dark:border-gray-300 
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                            focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100"
                            type={showConfirmPassword ? 'text' : 'password'} // Toggle input type
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type='button'
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600 focus:outline-none'
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Password Error */}
                    {passwordError && <p className='text-red-500 dark:text-red-600 font-semibold mb-2'>{passwordError}</p>}

                    {/* Error Message */}
                    {error && <p className='text-red-500 dark:text-red-600 font-semibold mb-2'>{error}</p>}

                    {/* Password Strength Meter */}
                    <PasswordStrengthMeter password={password} />

                    {/* Submit Button */}
                    <motion.button
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-green-600
                        hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100 transition duration-200'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
                    </motion.button>
                </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 dark:bg-gray-100 bg-opacity-50 dark:bg-opacity-100 flex justify-center'>
                <p className='text-sm text-gray-400 dark:text-gray-700'>
                    Already have an account?{" "}
                    <Link to={"/login"} className='text-green-400 dark:text-green-600 hover:underline'>
                        Login
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default SignUpPage;