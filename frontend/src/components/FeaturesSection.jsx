import React from "react";
import {
  BookOpen,
  Code,
  HelpCircle,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeaturesSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Learn Concepts",
      description: "Master DSA with AI explanations",
      features: ["Step-by-step", "Simple AI explanations", "Revisit anytime"],
      buttonText: "Explore Concepts",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      route: "/topic",
    },
    {
      icon: Code,
      title: "Practice Problems",
      description: "Upscaling with dynamic problems",
      features: ["500+ problems", "Instant feedback", "Starter templates"],
      buttonText: "Start Practicing",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
      route: "/practice",
    },
    {
      icon: HelpCircle,
      title: "Answer Quizzes",
      description: "Test knowledge with AI quizzes",
      features: ["Concept quizzes", "Instant feedback", "Unlimited attempts"],
      buttonText: "Take Quiz",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      route: "/quizzes",
    },
    {
      icon: BarChart3,
      title: "Dashboard Analytics",
      description: "Track learning progress",
      features: ["Analytics", "Milestones", "Recommendations"],
      buttonText: "View Dashboard",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-400",
      route: "/dashboard",
    },
  ];

  const handleExploreClick = (route) => {
    navigate(route);
  };

  return (
    <section className="py-10 md:py-20 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-white">
            Explore Features
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience a complete learning ecosystem designed to take you from
            beginner to expert in Data Structures and Algorithms
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-white group relative bg-gray-950 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => handleExploreClick(feature.route)}
                  className="w-full bg-orange-600 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
                >
                  {feature.buttonText}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Hover Gradient Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
