// "use client";

// import SleekButton from "@/components/ui/button";
// import { useTheme } from "@/context/theme-context";
// import { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";
// import Link from "next/link";
// import { useReactFlowData } from "@/context/react-flow-data-context";

// interface StreamResponse {
//   type: 'chunk' | 'complete' | 'error';
//   data: any;
// }

// const ChatPage: React.FC = () => {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const { repoUrl } = useReactFlowData();
  
//   // Streaming states
//   const [currentResponse, setCurrentResponse] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const [messages, setMessages] = useState<
//     { role: "user" | "ai" | "assistant"; content: string }[]
//   >([
//     {
//       role: "assistant",
//       content: "Hello! How can I help you understand this repository today?",
//     },
//   ]);

//   const [inputMessage, setInputMessage] = useState("");

//   const [history, setHistory] = useState<
//     { id: number; title: string; messages: { role: "user" | "ai"; text: string }[] }[]
//   >([
//     { id: 1, title: "Repo Q&A Session 1", messages: [] },
//     { id: 2, title: "Bug Fix Discussion", messages: [] },
//   ]);

//   const [activeChatId, setActiveChatId] = useState<number>(1);
//   const [showHistory, setShowHistory] = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const handleSendMessage = async () => {
//     if (inputMessage.trim() && !isLoading) {
//       // Add user message
//       const userMessage = { role: "user" as const, content: inputMessage };
//       setMessages((prev) => [...prev, userMessage]);
      
//       const currentQuery = inputMessage;
//       setInputMessage("");
//       setCurrentResponse("");
//       setIsLoading(true);

//       console.log("Sending query:", currentQuery);
//       console.log("Repo URL:", repoUrl);

//       try {
//         // Call your streaming API endpoint
//         const response = await fetch("/api/chat", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ 
//             userQuery: currentQuery, 
//              repoUrl // Changed from repoUrl to url to match your backend
//           }),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const reader = response.body?.getReader();
//         const decoder = new TextDecoder();

//         if (!reader) {
//           throw new Error("No reader available");
//         }

//         let accumulatedResponse = "";

//         while (true) {
//           const { done, value } = await reader.read();
          
//           if (done) break;

//           const chunk = decoder.decode(value, { stream: true });
//           const lines = chunk.split('\n').filter(line => line.trim());

//           for (const line of lines) {
//             try {
//               const parsed: StreamResponse = JSON.parse(line);
              
//               switch (parsed.type) {
//                 case 'chunk':
//                   accumulatedResponse += parsed.data;
//                   setCurrentResponse(accumulatedResponse);
//                   break;
                  
//                 case 'complete':
//                   setCurrentResponse("");
//                   const systemMessage = {
//                     role: "assistant" as const,
//                     content: parsed.data.content || parsed.data.toString()
//                   };
//                   setMessages(prev => [...prev, systemMessage]);
//                   break;
                  
//                 case 'error':
//                   console.error('Stream error:', parsed.data);
//                   setCurrentResponse("");
//                   const errorMessage = {
//                     role: "assistant" as const,
//                     content: `Error: ${parsed.data}`
//                   };
//                   setMessages(prev => [...prev, errorMessage]);
//                   break;
//               }

//               setIsLoading(false)
//             } catch (parseError) {
//               console.error('Parse error:', parseError, 'Line:', line);
//             }
//           }
//           setIsLoading(false)
//         }

//         setIsLoading(false)

//       } catch (error) {
//         setIsLoading(false)
//         console.error("Streaming error:", error);
//         setCurrentResponse("");
//         const errorMessage = {
//           role: "assistant" as const,
//           content: "Sorry, there was an error processing your request. Please try again."
//         };
//         setMessages(prev => [...prev, errorMessage]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, currentResponse]);

//   const handleSelectChat = (id: number) => {
//     setActiveChatId(id);
//     const selectedChat = history.find((chat) => chat.id === id);
//     setMessages(selectedChat ? selectedChat.messages : []);
//     setShowHistory(false);
//   };

//   return (
//     <div
//       className={`h-screen flex transition-colors duration-300 w-screen relative
//         ${isDark ? "bg-gray-900" : "bg-gray-100"}
//       `}
//     >
//       {/* Mobile Slide-In History Drawer */}
//       {showHistory && (
//         <div className={`fixed inset-0 z-50 flex md:hidden`}>
//           <div
//             className={`w-64 p-4 h-full shadow-xl transition-colors duration-300
//               ${isDark ? "bg-gray-800" : "bg-white"}
//             `}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-bold">Chat History</h3>
//               <button onClick={() => setShowHistory(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="space-y-2">
//               {history.map((chat) => (
//                 <button
//                   key={chat.id}
//                   onClick={() => handleSelectChat(chat.id)}
//                   className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 truncate
//                     ${
//                       chat.id === activeChatId
//                         ? isDark
//                           ? "bg-blue-600 text-white"
//                           : "bg-blue-100 text-blue-900"
//                         : isDark
//                         ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                         : "bg-gray-50 text-gray-700 hover:bg-gray-200"
//                     }
//                   `}
//                 >
//                   {chat.title}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div
//             className="flex-1 bg-black/50"
//             onClick={() => setShowHistory(false)}
//           />
//         </div>
//       )}

//       {/* Main Chat Window */}
//       <div
//         className={`flex-1 flex flex-col items-center p-4 transition-colors duration-300
//           ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"}
//         `}
//       >
//         <div
//           className={`md:w-full p-4 md:p-4 rounded-3xl shadow-2xl border flex flex-col h-[80vh] md:h-[95vh] transition-colors duration-300
//             ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"}
//           `}
//         >
//           <h2
//             className={`text-3xl md:text-4xl font-bold mb-3 text-center transition-colors duration-300
//               ${isDark ? "text-gray-100" : "text-gray-900"}
//             `}
//           >
//             Chat with AI about Code
//           </h2>

//           {/* Chat Window */}
//           <div
//             className={`flex-grow overflow-y-auto p-4 rounded-2xl border mb-6 custom-scrollbar transition-colors duration-300
//               ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}
//             `}
//           >
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.role === "user" ? "justify-end" : "justify-start"
//                 } mb-4`}
//               >
//                 <div
//                   className={`max-w-[75%] p-3 rounded-xl shadow-md transition-colors duration-300 whitespace-pre-wrap ${
//                     msg.role === "user"
//                       ? "bg-blue-500 text-white rounded-br-none"
//                       : isDark
//                       ? "bg-gray-700 text-gray-100 rounded-bl-none"
//                       : "bg-gray-200 text-gray-800 rounded-bl-none"
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))}
            
//             {/* Current streaming response */}
//             {currentResponse && (
//               <div className="flex justify-start mb-4">
//                 <div
//                   className={`max-w-[75%] p-3 rounded-xl shadow-md transition-colors duration-300 whitespace-pre-wrap ${
//                     isDark
//                       ? "bg-gray-700 text-gray-100 rounded-bl-none"
//                       : "bg-gray-200 text-gray-800 rounded-bl-none"
//                   }`}
//                 >
//                   {currentResponse}
                  
//                   {/* Typing indicator */}
//                   <div className="flex items-center mt-2">
//                     <div className="animate-pulse flex space-x-1">
//                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
//                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="flex gap-3">
//             <input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask a question about the code..."
//               disabled={isLoading}
//               className={`flex-grow p-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
//                 ${
//                   isDark
//                     ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-400"
//                     : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-400"
//                 }
//               `}
//             />
//             <button 
//               className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
//                 ${isLoading ? '' : 'hover:scale-105 hover:shadow-xl'}
//               `}
//               onClick={handleSendMessage}
//               disabled={isLoading || !inputMessage.trim()}
//             >
//               {isLoading ? 'Sending...' : 'Send'}
//             </button>
//           </div>
//         </div>

//         {/* Floating Mobile History Button */}
//         <button
//           className="fixed bottom-6 right-6 md:hidden px-4 py-2 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
//           onClick={() => setShowHistory(true)}
//         >
//           History
//         </button>

//         {/* Custom Scrollbar */}
//         <style jsx>{`
//           .custom-scrollbar::-webkit-scrollbar {
//             width: 8px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-track {
//             background: transparent;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb {
//             background: ${isDark ? "#555" : "#888"};
//             border-radius: 10px;
//           }
//           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//             background: ${isDark ? "#777" : "#555"};
//           }
//         `}</style>``
//       </div>
//     </div>
//   );
// };

// export default ChatPage;