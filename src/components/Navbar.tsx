import { useTheme } from "@/context/theme-context";
import SleekButton from "./ui/button";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import {
  SignInButton,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn } = useUser();

  return (
    <nav
      className={`
        z-50 py-2 px-3 sm:py-3 sm:px-6 md:px-12 flex justify-between items-center 
        bg-opacity-90 backdrop-blur-md shadow-md transition-colors duration-300
        ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-900 text-gray-100"}
      `}
    >
      {/* Brand */}
      <div className="flex items-center">
        <span className="text-2xl sm:text-xl md:text-2xl font-bold">
          View Repo
        </span>
      </div>

      {/* Nav Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full border shadow-md hover:scale-105 transition 
            ${theme === "light" ? "border-gray-300" : "border-gray-700" }`}
        >
          {theme === "light" ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-200" />
          )}
        </button>

        <SignedOut>
            <SleekButton className="bg-purple-600 hover:bg-purple-700">
              <SignInButton />
            </SleekButton>
          </SignedOut>
          {isSignedIn && (
            <Link href="/profile">
              <SleekButton className="bg-purple-600 hover:bg-purple-700">
                Profile
              </SleekButton>
            </Link>
          )}
        </div>
    </nav>
  )
};

export default Navbar;
