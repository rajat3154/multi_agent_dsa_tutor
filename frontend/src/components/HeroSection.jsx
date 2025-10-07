import React, { useState, useEffect, useRef } from "react";
import {
  Code,
  BookOpen,
  BarChart3,
  MessageSquare,
  Users,
  Award,
  Clock,
  ChevronRight,
  Play,
  Brain,
  CheckCircle,
  Zap,
  X,
  Maximize2,
} from "lucide-react";

import { applyTheme } from "./theme"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const HeroSection = ({ scrollToFeatures }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [codeComplete, setCodeComplete] = useState(false);
  const codeRef = useRef(null);
  const navigate=useNavigate();

  const codeSnippet = `# Binary Search in Python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found
        elif arr[mid] < target:
            left = mid + 1  # Right half
        else:
            right = mid - 1  # Left half
            
    return -1  # Not found

# Example usage
numbers = [2, 5, 8, 12, 16, 23, 38, 45]
result = binary_search(numbers, 16)
print(f"Found at index: {result}")`;

  // Apply theme + start animation
  useEffect(() => {
    applyTheme();

    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
      const typeTimer = setTimeout(() => {
        typeCode();
      }, 500);
      return () => clearTimeout(typeTimer);
    }, 3000);

    return () => clearTimeout(flipTimer);
  }, []);

  const typeCode = () => {
    const codeElement = codeRef.current;
    if (!codeElement) return;

    let i = 0;
    codeElement.innerHTML = "";

    const typeInterval = setInterval(() => {
      if (i < codeSnippet.length) {
        const char = codeSnippet.charAt(i);

        if (char === "#") {
          const commentEnd = codeSnippet.indexOf("\n", i);
          if (commentEnd !== -1) {
            const comment = codeSnippet.substring(i, commentEnd);
            codeElement.innerHTML += `<span class="code-comment">${comment}</span>`;
            i = commentEnd - 1;
          } else {
            const comment = codeSnippet.substring(i);
            codeElement.innerHTML += `<span class="code-comment">${comment}</span>`;
            i = codeSnippet.length - 1;
          }
        } else if (char === '"' || char === "'") {
          const stringEnd = codeSnippet.indexOf(char, i + 1);
          if (stringEnd !== -1) {
            const str = codeSnippet.substring(i, stringEnd + 1);
            codeElement.innerHTML += `<span class="code-string">${str}</span>`;
            i = stringEnd;
          } else {
            codeElement.innerHTML += char;
          }
        } else if (/\d/.test(char)) {
          codeElement.innerHTML += `<span class="code-number">${char}</span>`;
        } else if (/\w/.test(char)) {
          const wordEnd = codeSnippet.substring(i).search(/\W/);
          if (wordEnd !== -1) {
            const word = codeSnippet.substring(i, i + wordEnd);
            if (
              [
                "def",
                "return",
                "if",
                "elif",
                "else",
                "while",
                "print",
              ].includes(word)
            ) {
              codeElement.innerHTML += `<span class="code-keyword">${word}</span>`;
              i += wordEnd - 1;
            } else if (["len"].includes(word)) {
              codeElement.innerHTML += `<span class="code-builtin">${word}</span>`;
              i += wordEnd - 1;
            } else {
              codeElement.innerHTML += char;
            }
          } else {
            codeElement.innerHTML += char;
          }
        } else {
          codeElement.innerHTML += char;
        }
        i++;
      } else {
        clearInterval(typeInterval);
        setCodeComplete(true);
        const flipBackTimer = setTimeout(() => {
          setIsFlipped(false);
        }, 3000);
        return () => clearTimeout(flipBackTimer);
      }
    }, 3);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[var(--font-main)]">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-start justify-center overflow-hidden px-4 sm:px-6 md:px-10 pt-20">
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
          {/* Left Content */}
          {/* Left Content */}
          <div className="flex-1 lg:max-w-[50%]">
            <div className="mb-6 inline-flex items-center gap-2 bg-[var(--color-primary)]/10 px-4 py-2 rounded-full border border-[var(--color-primary)]/20">
              <Zap className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-[var(--color-primary)] text-sm font-medium">
                AI-Powered Learning Platform
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--color-primary)]/80">
                Multi-Agent DSA Tutor
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-300 mb-8 md:mb-10 leading-relaxed max-w-4xl">
              Learn Data Structures and Algorithms like never before. Our{" "}
              <span className="text-[var(--color-primary)] font-medium">
                Multi-Agent DSA Tutor
              </span>{" "}
              combines the power of multiple AI agents—acting as teacher,
              examiner, checker, and mentor—to guide you step by step.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-8">
              <button
                className="bg-[var(--color-primary)] hover:bg-orange-600 text-white font-medium py-3 px-6 md:px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                onClick={scrollToFeatures}
              >
                Start Learning Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-transparent hover:bg-white/5 text-white font-medium py-3 px-6 md:px-8 rounded-lg border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer" onClick={()=>{navigate("/practice")}}>
                <Play className="w-5 h-5" />
                Code Along with AI
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[
                { icon: Users, value: "10K+", label: "Active Learners" },
                { icon: Award, value: "95%", label: "Success Rate" },
                { icon: Code, value: "500+", label: "DSA Concepts" },
                { icon: Clock, value: "24/7", label: "AI Support" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-white/10 flex flex-col items-center text-center"
                >
                  <stat.icon className="w-6 h-6 text-[var(--color-primary)] mb-2" />
                  <div className="text-lg md:text-xl font-semibold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex justify-center lg:justify-end mt-6 lg:mt-0 w-full lg:max-w-[45%]">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[var(--color-primary)]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>

              {/* Flipping Card */}
              <div className={`relative w-full h-[460px] perspective-1000`}>
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front Card */}
                  <div
                    className={`absolute w-full h-full backface-hidden ${
                      isFlipped ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-300`}
                  >
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
                      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center mb-6">
                          <div className="bg-[var(--color-primary)]/10 p-2 rounded-lg">
                            <Brain className="h-6 w-6 text-[var(--color-primary)]" />
                          </div>
                          <h3 className="ml-3 text-lg font-semibold">
                            Multi-Agent System Active
                          </h3>
                        </div>

                        <div className="flex-1">
                          {[
                            {
                              icon: BookOpen,
                              color: "text-blue-400",
                              bg: "bg-blue-500/10",
                              title: "Teacher Agent",
                              desc: "Explaining Binary Search",
                            },
                            {
                              icon: BarChart3,
                              color: "text-green-400",
                              bg: "bg-green-500/10",
                              title: "Examiner Agent",
                              desc: "Generating practice problems",
                            },
                            {
                              icon: CheckCircle,
                              color: "text-purple-400",
                              bg: "bg-purple-500/10",
                              title: "Checker Agent",
                              desc: "Evaluating your solution",
                            },
                            {
                              icon: MessageSquare,
                              color: "text-amber-400",
                              bg: "bg-amber-500/10",
                              title: "Mentor Agent",
                              desc: "Creating learning path",
                            },
                          ].map((agent, idx) => (
                            <div
                              key={idx}
                              className="flex items-start mb-4 last:mb-0"
                            >
                              <div className={`${agent.bg} p-2 rounded-lg`}>
                                <agent.icon
                                  className={`h-5 w-5 ${agent.color}`}
                                />
                              </div>
                              <div className="ml-3">
                                <h4 className="font-medium text-sm md:text-base">
                                  {agent.title}
                                </h4>
                                <p className="text-xs md:text-sm text-gray-400">
                                  {agent.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          className="w-full bg-[var(--color-primary)] hover:bg-orange-600 text-white py-2.5 rounded-lg transition-colors text-sm md:text-base mt-4"
                          onClick={() => setIsFlipped(true)}
                        >
                          View Concept Walkthrough
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Back Card */}
                  <div
                    className={`absolute w-full h-full backface-hidden rotate-y-180 ${
                      isFlipped ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300`}
                  >
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
                      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-center text-sm font-medium text-[var(--color-primary)] flex-1">
                          Concept Walkthrough
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-200">
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-200"
                            onClick={() => setIsFlipped(false)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 p-4 bg-gray-950 overflow-hidden">
                        <div className="mb-2 flex items-center">
                          <div className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
                            Python
                          </div>
                          <div className="ml-2 text-xs text-gray-500">
                            binary_search.py
                          </div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg h-[calc(100%-30px)]">
                          <pre className="text-xs font-mono leading-tight h-full overflow-hidden">
                            <code
                              ref={codeRef}
                              className="block whitespace-pre"
                            ></code>
                          </pre>
                        </div>

                        {codeComplete && (
                          <div className="mt-4 p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
                            <p className="text-green-300 text-sm flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                              Code demonstration complete.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                        <button
                          className="w-full bg-[var(--color-primary)] hover:bg-orange-600 text-white py-2.5 rounded-lg transition-colors text-sm md:text-base"
                          onClick={() => {
                            setIsFlipped(false);
                            setCodeComplete(false);
                          }}
                        >
                          Return to Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for flip effect and code highlighting */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .code-comment {
          color: #6a9955;
        }
        .code-string {
          color: #ce9178;
        }
        .code-keyword {
          color: #c586c0;
        }
        .code-number {
          color: #b5cea8;
        }
        .code-builtin {
          color: #dcdcaa;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
