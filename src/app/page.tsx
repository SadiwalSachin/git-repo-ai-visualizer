"use client";

import { useState } from "react";
import SleekButton from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useReactFlowData } from "@/context/react-flow-data-context";
import Loader from "@/components/ui/loader";
import { useTheme } from "@/context/theme-context";
import { useUser } from "@clerk/nextjs";

const LandingPage: React.FC = () => {
  const [repoLink, setRepoLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setNodeData ,setRepoUrl } = useReactFlowData();
  const router = useRouter();
  const { theme } = useTheme();
  const { isSignedIn } = useUser();

  const isDark = theme === "dark";

  const handleSubmit = async (): Promise<void> => {
    if (!repoLink.trim()) return;
    try {
      setRepoUrl(repoLink)
      setLoading(true);
      const response = await axios.post("/api/analyze", {
        url: repoLink,
      });
      if (response?.data?.success) {
        setNodeData(response.data);
        router.push("/analyze");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900"
      }`}
    >
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-8 sm:py-16">
        {/* Intro Section */}
        <div className="max-w-4xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Understand Any GitHub Repo, Instantly ⚡
          </h1>
          <p
            className={`text-lg md:text-xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            } mb-8 max-w-2xl mx-auto`}
          >
            Paste a GitHub repository link and let our AI agent generate a
            visual diagram, explain the architecture, and chat with you about
            the code.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className={`p-6 bg-blue rounded-2xl shadow-lg border border-gray-200 ${isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900"}`}>
              <h3 className="font-semibold text-xl mb-2">
                📊 Visualize Structure
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get instant diagrams of your repo’s architecture for quick
                understanding.
              </p>
            </div>
            <div className={`p-6 bg-blue rounded-2xl shadow-lg border border-gray-200 ${isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900"}`}>
              <h3 className="font-semibold text-xl mb-2">💬 Chat with Code</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ask AI questions about the repository like a real teammate.
              </p>
            </div>
            <div className={`p-6 bg-blue rounded-2xl shadow-lg border border-gray-200 ${isDark ? "bg-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900"}`}>
              <h3 className="font-semibold text-xl mb-2">⚡ Quick Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Save hours by instantly understanding dependencies & functions.
              </p>
            </div>
          </div>
        </div>

        {/* Main Input Section */}
        <div
          className={`max-w-3xl w-full text-center p-6 md:p-10 rounded-3xl shadow-2xl border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          } transform transition-all duration-500 ease-in-out hover:scale-[1.01]`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Try it out yourself 🚀
          </h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter GitHub Repository URL (e.g., https://github.com/user/repo)"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              className={`flex-grow p-4 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg shadow-sm ${
                isDark
                  ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border border-gray-300 text-black"
              }`}
            />
            <button
            disabled={!isSignedIn}
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500"
            >
              Analyze Repository
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
