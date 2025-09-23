import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { applyTheme } from "@/components/theme";
import {
  Eye,
  EyeOff,
  Bot,
  Users,
  BookOpen,
  CheckSquare,
  Target,
  BarChart3,
} from "lucide-react";
import Navbar from "@/shared/Navbar";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
const Login = () => {
  // Apply theme on mount
  useEffect(() => {
    applyTheme();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_BACKEND_URL;
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
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
      const response=await axios.post(`${API_URL}/login`,{
        email,
        password,
      });
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_name", response.data.user_name);
      localStorage.setItem("user_email", response.data.email);
      localStorage.setItem("user_photo", response.data.profilephoto || "");
      setUser({
        name: response.data.user_name,
        email: response.data.email,
        photo: response.data.profilephoto || "",
        isLoggedIn: true,
      });
      setEmail("");
      setPassword("");
      setRememberMe(false);
      
        navigate("/");
      
    }catch(err){
toast.error(err.response?.data?.detail || "Login failed. Try again.");
    }finally{
setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#000",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex">
        {/* Left Panel - Login Form */}
        <div className="w-full lg:w-5/12 flex items-start justify-center pt-28">
          <Card className="w-100 max-w-md bg-gray-950 border-gray-800">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-[var(--color-text)]">
                Sign in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium ">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-gray-900 mt-3 border-gray-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-gray-900 border-gray-700 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                      className="data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)] h-4 w-4"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-[var(--color-primary)] hover:brightness-110 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-[var(--color-primary)] hover:underline cursor-pointer font-medium"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Agent Showcase */}
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
              An intelligent learning platform using multiple AI agents to
              simulate tutors, examiners, and mentors.
            </p>

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

export default Login;
