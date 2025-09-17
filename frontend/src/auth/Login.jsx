import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Github,
  Twitter,
  BookOpen,
  Code,
  CheckSquare,
  BarChart3,
  Bot,
  Cpu,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  Play,
} from "lucide-react";
import Navbar from "@/shared/Navbar";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const agents = [
    {
      name: "Teacher Agent",
      role: "Explains DSA concepts",
      gradient: `linear-gradient(90deg, var(--color-primary), #3b82f6)`,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Examiner Agent",
      role: "Creates practice problems",
      gradient: `linear-gradient(90deg, var(--color-primary), #d946ef)`,
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      name: "Checker Agent",
      role: "Evaluates your solutions",
      gradient: `linear-gradient(90deg, var(--color-primary), #10b981)`,
      icon: <Target className="h-5 w-5" />,
    },
    {
      name: "Mentor Agent",
      role: "Personalizes your learning",
      gradient: `linear-gradient(90deg, var(--color-primary), #f43f5e)`,
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Concept Learning",
      description: "Detailed explanations with examples from basic to advanced",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Practice Problems",
      description: "Personalized practice with varying difficulty levels",
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      title: "Intelligent Feedback",
      description:
        "Detailed evaluation of your solutions with improvement suggestions",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login attempted with:", { email, password, rememberMe });
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex">
        {/* Left Panel - Login Form */}
        <div className="w-full lg:w-5/12 flex items-center justify-center p-8">
          <Card className="w-full max-w-md bg-gray-950 border-gray-800">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-[var(--color-text)]">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                Enter your credentials to access the DSA Tutor platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-900 border-gray-700 focus:border-[var(--color-primary)]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="text-sm text-[var(--color-primary)] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-900 border-gray-700 focus:border-[var(--color-primary)] pr-10"
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                    className="data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)]"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[var(--color-primary)] hover:brightness-110"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-[var(--color-primary)] hover:underline cursor-pointer"
                  ononClick={() => navigate("/signup")}
                >
                  Sign up
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Enhanced Feature Showcase */}
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

export default Login;
