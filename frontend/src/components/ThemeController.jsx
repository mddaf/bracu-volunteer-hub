import { useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeController = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        const theme = !darkMode ? "synthwave" : "light";
        document.documentElement.setAttribute("data-theme", theme);
    };

    return (
        <button onClick={toggleDarkMode} className='focus:outline-none'>
            {darkMode ? (
                <Sun className='hover:text-yellow-400 dark:hover:text-yellow-600 transition' size={24} />
            ) : (
                <Moon className= 'text-gray-100 hover:text-gray-400 dark:hover:text-gray-600 transition' size={24} />
            )}
        </button>
    );
};

export default ThemeController;