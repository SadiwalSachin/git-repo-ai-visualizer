"use client"
import SleekButton from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Welcome Back!
        </h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>
          <Link
          href="/"
          >
          <SleekButton primary className="w-full">
            Login
          </SleekButton>
          </Link>
        </form>
        <div className="mt-6 text-center text-gray-600">
              Don't have an account?
              <Link 
              href="/sign-up"
              >
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                >
                Sign Up
              </span>
                </Link>
        </div>
      </div>
    </div>
  );
};


export default AuthPage