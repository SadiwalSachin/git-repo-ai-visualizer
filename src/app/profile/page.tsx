"use client";

import SleekButton from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "next/navigation";
import { useUser, useClerk, SignOutButton } from "@clerk/nextjs";
import ProfileSkeleton from "@/components/shemer-skeleton/profile";
import { useEffect, useState } from "react";
import axios from "axios";
import { useReactFlowData } from "@/context/react-flow-data-context";

interface Repo {
  owner: string;
  _id: string;
  repoUrl: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { setRepoUrl } = useReactFlowData();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [usersViewedRepo, setUsersViewedRepo] = useState<Repo[]>([]);

  function viewRepoDiagram(url: string) {
    setRepoUrl(url);
    router.push("/analyze");
  }

  function chatWithRepo(url: string) {
    setRepoUrl(url);
    router.push("/chat");
  }

  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      router.push("/");
    }
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    if (isSignedIn) {
      const fetchUserViewedRepo = async () => {
        setLoading(true);
        try {
          const response = await axios.post("/api/viewed-repos", {
            userID: user?.id,
          });
          if (response?.data?.success) {
            setUsersViewedRepo(response.data.data);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserViewedRepo();
    }
  }, [isSignedIn]);

  if (!isLoaded || loading) return <ProfileSkeleton />;

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen flex flex-col items-center p-4 transition-colors duration-300
          ${
            isDark
              ? "bg-gradient-to-br from-gray-900 to-gray-800"
              : "bg-gradient-to-br from-blue-50 to-purple-50"
          }`}
      >
        <div
          className={`max-w-5xl w-full p-8 md:p-12 rounded-3xl shadow-2xl border mt-20 flex flex-col transition-colors duration-300
            ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}
          `}
        >
          {/* Profile Header */}
          <div
            className={`flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 border-b pb-6 transition-colors duration-300
              ${isDark ? "border-gray-700" : "border-gray-200"}
            `}
          >
            <div className="text-center sm:text-left">
              <h1
                className={`text-2xl md:text-3xl font-extrabold transition-colors duration-300
                  ${isDark ? "text-gray-100" : "text-gray-900"}
                `}
              >
                {user?.fullName}
              </h1>
              <p
                className={`transition-colors duration-300 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Joined {user?.createdAt?.toDateString()}
              </p>
            </div>

            {/* Logout Button */}
            <SignOutButton>
            <h2
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
              🚪 Logout
            </h2>
              </SignOutButton>
          </div>

          {/* Repositories Section */}
          <div className="mt-8 flex-grow">
            <h2
              className={`text-xl md:text-2xl font-bold mb-4 transition-colors duration-300
                ${isDark ? "text-gray-100" : "text-gray-900"}
              `}
            >
              Visualized Repositories
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {usersViewedRepo.map((repo) => (
                <div
                  key={repo._id}
                  className={`p-5 rounded-2xl border shadow-md hover:shadow-lg transition-all duration-300
                    ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-gray-200 hover:shadow-gray-700"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    }
                  `}
                >
                  <h3 className="text-lg font-semibold break-words">
                    {repo?.owner}
                  </h3>
                  <Link
                    href={repo?.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm hover:underline break-all transition-colors duration-300
                      ${isDark ? "text-blue-400" : "text-blue-600"}
                    `}
                  >
                    {repo?.repoUrl}
                  </Link>
                  <div className="flex gap-2 mt-4">
                    <div onClick={() => viewRepoDiagram(repo?.repoUrl)}>
                      <SleekButton className="text-sm px-3 py-1">View</SleekButton>
                    </div>
                    <div onClick={() => chatWithRepo(repo?.repoUrl)}>
                      <SleekButton primary className="text-sm px-3 py-1">
                        Ask AI
                      </SleekButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-10 flex justify-center">
            <Link href="/">
              <SleekButton className="px-6 py-2 text-base">
                ⬅ Back to Home
              </SleekButton>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
