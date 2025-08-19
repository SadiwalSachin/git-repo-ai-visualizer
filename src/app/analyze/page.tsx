"use client"

import ReactFlowApp from "@/components/ReactFlow";
import SleekButton from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
import { useReactFlowData } from "@/context/react-flow-data-context";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";

const DiagramPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {nodeData,setNodeData} = useReactFlowData()
  const {repoUrl} = useReactFlowData()
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    if (nodeData?.nodes?.length === 0) {
      const getNodeData = async (): Promise<void> => {
        try {
          setLoading(true);
          const response = await axios.post("/api/analyze", { url: repoUrl });
          if (response?.data?.success) {
            setNodeData(response.data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      getNodeData();
    }
  }, [nodeData, repoUrl, setNodeData]); 

  if(loading){
    return <Loader/>
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-2 sm:p-4 transition-colors duration-300
        ${isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-purple-50"}
      `}
    >
      <div
        className={`w-full h-[95vh] px-4 sm:px-6 md:px-8 py-6 rounded-2xl sm:rounded-3xl shadow-2xl border flex flex-col transition-colors duration-300
          ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}
        `}
      >
        {/* Heading */}
        <h2
          className={`text-2xl sm:text-3xl font-bold text-center mb-2 transition-colors duration-300
            ${isDark ? "text-gray-100" : "text-gray-900"}
          `}
        >
          Repository Overview
        </h2>

        <p
          className={`text-base sm:text-lg text-center break-all mb-6 transition-colors duration-300
            ${isDark ? "text-gray-400" : "text-gray-600"}
          `}
        >
          Insights for:{" "}
          <Link
            href="/asjkfaksjf"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:underline transition-colors duration-300
              ${isDark ? "text-blue-400" : "text-blue-600"}
            `}
          >
            {nodeData?.owner} {nodeData?.repoName}
          </Link>
        </p>

        {/* Diagram */}
        <div
          className={`flex-grow p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border mb-6 flex items-center justify-center italic overflow-hidden transition-colors duration-300
            ${isDark ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-500"}
          `}
        >
          <ReactFlowApp reactClass="w-full h-full" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-auto">
          <Link href="/chat" className="w-full sm:w-auto">
            <SleekButton primary className="w-full sm:w-auto cursor-pointer">
              Ask About the Code
            </SleekButton>
          </Link>
          <Link href="/" className="w-full sm:w-auto ">
            <SleekButton className="w-full sm:w-auto cursor-pointer">
              Back to Home
            </SleekButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiagramPage;
