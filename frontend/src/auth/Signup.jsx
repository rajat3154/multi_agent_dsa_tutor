import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { applyTheme } from "@/components/theme";
import { Eye, EyeOff, Bot, Users } from "lucide-react";
import Navbar from "@/shared/Navbar";

const Signup = () => {
  useEffect(() => applyTheme(), []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);

  const fileInputRef = useRef(null);

  const agents = [
    {
      name: "Teacher Agent",
      role: "Explains DSA concepts",
      gradient: `linear-gradient(90deg, var(--color-primary), #3b82f6)`,
    },
    {
      name: "Examiner Agent",
      role: "Creates practice problems",
      gradient: `linear-gradient(90deg, var(--color-primary), #d946ef)`,
    },
    {
      name: "Checker Agent",
      role: "Evaluates your solutions",
      gradient: `linear-gradient(90deg, var(--color-primary), #10b981)`,
    },
    {
      name: "Mentor Agent",
      role: "Personalizes your learning",
      gradient: `linear-gradient(90deg, var(--color-primary), #f43f5e)`,
    },
  ];

  useEffect(() => {
    const interval = setInterval(
      () => setActiveAgent((prev) => (prev + 1) % agents.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex">
        {/* Left Panel */}
        <div className="w-full lg:w-5/12 flex items-center justify-center p-8">
          <Card
            className="w-full max-w-md bg-gray-950 shadow-none"
            style={{ border: "none", boxShadow: "none" }}
          >
            <CardHeader className="pb-2 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="bg-[var(--color-primary)] p-1 rounded-md">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  Create Your Account
                </CardTitle>
              </div>
              <CardDescription className="text-gray-400 text-xs">
                Join the AI-powered DSA learning platform
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-10 text-sm bg-[var(--color-bg)] border border-gray-700 focus:border-[var(--color-primary)]"
                    required
                  />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-10 text-sm bg-[var(--color-bg)] border border-gray-700 focus:border-[var(--color-primary)]"
                    required
                  />
                </div>
                {/* Password */}
                <div className="space-y-2 relative">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="h-10 text-sm bg-[var(--color-bg)] border border-gray-700 pr-8 focus:border-[var(--color-primary)]"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {/* Confirm Password */}
                <div className="space-y-2 relative">
                  <Label
                    htmlFor="confirm-password"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="h-10 text-sm bg-[var(--color-bg)] border border-gray-700 pr-8 focus:border-[var(--color-primary)]"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Profile Photo</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                    className="w-full bg-[var(--color-bg)] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  <p className="text-xs text-gray-400">
                    Upload a clear photo (JPG, PNG, max 2MB).
                  </p>
                </div>
                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-10 bg-[var(--color-primary)] hover:opacity-90 text-sm font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
                {/* Sign-in Link */}
                <p className="text-center text-xs text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:flex lg:w-7/12 p-12 flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div
                className="p-2 rounded-lg animate-float"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h1
                className="text-3xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--color-primary), #ffbf00)",
                }}
              >
                Multi-Agent DSA Tutor
              </h1>
            </div>

            <h2 className="text-5xl font-bold mb-8 leading-tight">
              Master Data Structures & <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, var(--color-primary), #ffbf00)",
                }}
              >
                Algorithms with AI
              </span>
            </h2>

            <p className="text-gray-300 text-lg max-w-2xl mb-12">
              An intelligent learning platform that uses multiple specialized AI
              agents to provide a comprehensive learning experience, simulating
              the support of human tutors, examiners, and mentors.
            </p>

            {/* Multi-Agent Visualization */}
            <div className="mb-12 flex justify-between items-center">
              {agents.map((agent, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-500 ${
                    index === activeAgent
                      ? "bg-[var(--color-bg)] scale-110"
                      : "bg-gray-900 opacity-70"
                  }`}
                  style={{ width: "23%" }}
                >
                  <div
                    className="p-3 rounded-full mb-3"
                    style={{ background: agent.gradient }}
                  >
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-medium text-center">{agent.name}</h4>
                  <p className="text-xs text-gray-400 text-center mt-1">
                    {agent.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
