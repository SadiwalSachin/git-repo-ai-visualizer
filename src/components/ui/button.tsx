const SleekButton: React.FC<{
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
}> = ({ children, primary = false, className = "" }) => (
  <button
    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-blue-500"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400"
    } ${className}`}
  >
    {children}
  </button>
);

export default SleekButton;
