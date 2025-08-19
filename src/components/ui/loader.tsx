"use client";

import { useTheme } from "@/context/theme-context";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react"; 

const Loader: React.FC = () => {
  const { theme } = useTheme();

  // Dynamic theme-based styles
  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen transition-colors duration-500 
        ${isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50"}
      `}
    >
      {/* Animated GitHub Branch Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="mb-6"
      >
        <GitBranch
          className={`w-12 h-12 ${
            isDark ? "text-purple-400" : "text-purple-600"
          }`}
        />
      </motion.div>

      {/* Dots Animation */}
      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${
              isDark ? "bg-blue-400" : "bg-blue-500"
            }`}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Text */}
      <motion.p
        className={`text-lg font-semibold transition-colors duration-500 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Analyzing Repository...
      </motion.p>
    </div>
  );
};

export default Loader;
