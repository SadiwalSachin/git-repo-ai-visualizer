"use client";

import SleekButton from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useReactFlowData } from "@/context/react-flow-data-context";

const ChatPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { repoUrl } = useReactFlowData();

  const [messages, setMessages] = useState<
    { role: "user" | "ai" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: "Hello! How can I help you understand this repository today?",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<
    {
      id: number;
      title: string;
      messages: { role: "user" | "ai"; text: string }[];
    }[]
  >([
    { id: 1, title: "Repo Q&A Session 1", messages: [] },
    { id: 2, title: "Bug Fix Discussion", messages: [] },
  ]);

  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Loading animation component
  const LoadingDots = () => (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
    </div>
  );

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: inputMessage }]);
      setInputMessage("");
      setIsLoading(true);
      console.log(inputMessage);
      console.log(repoUrl);
      try {
        const respone = await axios.post("/api/chat", {
          userQuery: inputMessage,
          repoUrl,
        });
        console.log(respone);
        console.log(respone.data.data);
        if (respone?.data?.success) {
          setMessages((prev) => [...prev, {
            role: "assistant",
            content: respone?.data?.data?.output,
          },]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const handleSelectChat = (id: number) => {
  //   setActiveChatId(id);
  //   const selectedChat = history.find((chat) => chat.id === id);
  //   setMessages(selectedChat ? selectedChat.messages : []);
  //   setShowHistory(false); // close on mobile after selecting
  // };

  return (
    <div
      className={`h-screen flex transition-colors duration-300 w-screen relative
        ${isDark ? "bg-gray-900" : "bg-gray-100"}
      `}
    >
      {/* Sidebar (hidden on mobile, always on desktop) */}
      <aside
        className={`hidden md:block w-32 p-4 border-r transition-colors duration-300
          ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        `}
      >
        {" "}
        <Link href="/">
          <SleekButton className="md:px-2 md:py-1 md:rounded-md cursor-pointer mb-3">
            Back to Diagram
          </SleekButton>
        </Link>
        {/* <h3
          className={`text-lg font-bold mb-4 transition-colors duration-300
            ${isDark ? "text-gray-100" : "text-gray-900"}
          `}
        >
          Chat History
        </h3> */}
        {/* <div className="space-y-2">
          {history.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 truncate
                ${
                  chat.id === activeChatId
                    ? isDark
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-900"
                    : isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {chat.title}
            </button>
          ))}
        </div> */}
      </aside>

      {/* Mobile Slide-In History Drawer */}
      {/* {showHistory && (
        <div className={`fixed inset-0 z-50 flex md:hidden`}>
          <div
            className={`w-64 p-4 h-full shadow-xl transition-colors duration-300
              ${isDark ? "bg-gray-800" : "bg-white"}
            `}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Chat History</h3>
              <button onClick={() => setShowHistory(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {history.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 truncate
                    ${
                      chat.id === activeChatId
                        ? isDark
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-900"
                        : isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowHistory(false)}
          />
        </div>
      )} */}
      {/* Main Chat Window */}
      <div
        className={`flex-1 flex flex-col items-center p-4 transition-colors duration-300
          ${
            isDark
              ? "bg-gray-900"
              : "bg-gradient-to-br from-blue-50 to-purple-50"
          }
        `}
      >
        <div
          className={`md:w-full p-4 md:p-4 rounded-3xl shadow-2xl border flex flex-col h-[94vh] md:h-[95vh] transition-colors duration-300
            ${
              isDark
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-100"
            }
          `}
        >
          <h2
            className={`text-2xl md:text-4xl font-bold mb-3 text-center transition-colors duration-300
              ${isDark ? "text-gray-100" : "text-gray-900"}
            `}
          >
            Chat with AI about Code
          </h2>

          {/* Chat Window */}
          <div
            className={`flex-grow overflow-y-auto p-4 rounded-2xl border mb-6 custom-scrollbar transition-colors duration-300
              ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }
            `}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-xl shadow-md transition-colors duration-300 ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : isDark
                      ? "bg-gray-700 text-gray-100 rounded-bl-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Loading Animation */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div
                  className={`max-w-[75%] p-3 rounded-xl shadow-md transition-colors duration-300 ${
                    isDark
                      ? "bg-gray-700 text-gray-100 rounded-bl-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <LoadingDots />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about the code..."
              className={`flex-grow p-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm
                ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-400"
                }
              `}
            />
            <button
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>

        {/* Floating Mobile History Button */}
        <button
          className="fixed bottom-6 right-6 md:hidden px-4 py-2 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
          onClick={() => setShowHistory(true)}
        >
          History
        </button>

        {/* Custom Scrollbar */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? "#555" : "#888"};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? "#777" : "#555"};
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChatPage;