"use client";

import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/theme-context";

const ProfileSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen flex flex-col items-center p-4 transition-colors duration-300
          ${isDark ? "bg-gray-900" : "bg-blue-50"}
        `}
      >
        <div
          className={`max-w-5xl w-full p-8 md:p-12 rounded-3xl shadow-2xl border mt-20 flex flex-col transition-colors duration-300
            ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}
          `}
        >
          {/* Profile Header Skeleton */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 rounded bg-gray-300 animate-pulse"></div>
              <div className="h-4 w-64 rounded bg-gray-300 animate-pulse"></div>
              <div className="h-4 w-32 rounded bg-gray-300 animate-pulse"></div>
            </div>
          </div>

          {/* Repositories Section Skeleton */}
          <div className="mt-8">
            <div className="h-6 w-48 rounded bg-gray-300 animate-pulse mb-4"></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border shadow-md transition-all duration-300
                    ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}
                  `}
                >
                  <div className="h-5 w-32 rounded bg-gray-300 animate-pulse mb-2"></div>
                  <div className="h-4 w-full rounded bg-gray-300 animate-pulse mb-4"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 w-16 rounded bg-gray-300 animate-pulse"></div>
                    <div className="h-8 w-20 rounded bg-gray-300 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home Skeleton */}
          <div className="mt-10 flex justify-center">
            <div className="h-10 w-40 rounded bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;
