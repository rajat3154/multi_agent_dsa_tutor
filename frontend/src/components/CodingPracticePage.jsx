import React, { useState, useEffect, useContext, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  Code2,
  Lightbulb,
  Copy,
  Download,
  Share2,
  Settings,
  Maximize2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ChevronsUpDown,
  Search,
  Plus,
  Filter,
  Menu,
  X,
  Star,
  Sparkles,
  GripVertical,
  Zap,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/shared/Navbar";
import { UserContext } from "@/contexts/UserContext";

const CodingPracticePage = () => {
  const { user } = useContext(UserContext);
  const [dsTopic, setDsTopic] = useState("");
  const [dsSubTopic, setDsSubTopic] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [showOptimalSolution, setShowOptimalSolution] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [language, setLanguage] = useState("python");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // New states for dropdown suggestions
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [showSubTopicSuggestions, setShowSubTopicSuggestions] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubTopics, setFilteredSubTopics] = useState([]);

  // Refs for click outside detection
  const topicInputRef = useRef(null);
  const subTopicInputRef = useRef(null);
  const topicSuggestionsRef = useRef(null);
  const subTopicSuggestionsRef = useRef(null);

  // Adjustable panel heights
  const [editorHeight, setEditorHeight] = useState(60);
  const [isResizing, setIsResizing] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const languages = [
    { id: "python", name: "Python", extension: "py" },
    { id: "java", name: "Java", extension: "java" },
    { id: "javascript", name: "JavaScript", extension: "js" },
    { id: "c++", name: "C++", extension: "cpp" },
  ];

  // Data structures and subtopics
  const dataStructures = [
    {
      id: 1,
      name: "Arrays",
      subtopics: [
        { id: 11, name: "Introduction to Arrays" },
        { id: 12, name: "Array Operations" },
        { id: 13, name: "Multi-dimensional Arrays" },
        { id: 14, name: "Dynamic Arrays" },
        { id: 15, name: "Array Problems & Patterns" },
      ],
    },
    {
      id: 2,
      name: "Linked Lists",
      subtopics: [
        { id: 21, name: "Singly Linked Lists" },
        { id: 22, name: "Doubly Linked Lists" },
        { id: 23, name: "Circular Linked Lists" },
        { id: 24, name: "Linked List Operations" },
        { id: 25, name: "Advanced Linked List Problems" },
      ],
    },
    {
      id: 3,
      name: "Stacks",
      subtopics: [
        { id: 31, name: "Introduction to Stacks" },
        { id: 32, name: "Implementation (Array & Linked List)" },
        { id: 33, name: "Applications of Stacks" },
        { id: 34, name: "Stack Problems (Parentheses, Next Greater)" },
      ],
    },
    {
      id: 4,
      name: "Queues",
      subtopics: [
        { id: 41, name: "Introduction to Queues" },
        { id: 42, name: "Circular Queue" },
        { id: 43, name: "Deque (Double-Ended Queue)" },
        { id: 44, name: "Priority Queue" },
        { id: 45, name: "Queue Problems" },
      ],
    },
    {
      id: 5,
      name: "Trees",
      subtopics: [
        { id: 51, name: "Binary Trees" },
        { id: 52, name: "Binary Search Trees (BST)" },
        { id: 53, name: "Tree Traversals (DFS, BFS)" },
        { id: 54, name: "Heaps" },
        { id: 55, name: "Advanced Trees (AVL, Segment Tree, Trie)" },
      ],
    },
    {
      id: 6,
      name: "Graphs",
      subtopics: [
        { id: 61, name: "Graph Representation" },
        { id: 62, name: "Graph Traversal (BFS, DFS)" },
        { id: 63, name: "Shortest Path Algorithms" },
        { id: 64, name: "Minimum Spanning Tree" },
        { id: 65, name: "Topological Sort" },
      ],
    },
    {
      id: 7,
      name: "Hash Tables",
      subtopics: [
        { id: 71, name: "Hash Functions" },
        { id: 72, name: "Collision Resolution" },
        { id: 73, name: "Hash Table Operations" },
        { id: 74, name: "Hash Table Applications" },
      ],
    },
    {
      id: 8,
      name: "Sorting Algorithms",
      subtopics: [
        { id: 81, name: "Bubble Sort" },
        { id: 82, name: "Selection Sort" },
        { id: 83, name: "Insertion Sort" },
        { id: 84, name: "Merge Sort" },
        { id: 85, name: "Quick Sort" },
        { id: 86, name: "Heap Sort" },
      ],
    },
    {
      id: 9,
      name: "Searching Algorithms",
      subtopics: [
        { id: 91, name: "Linear Search" },
        { id: 92, name: "Binary Search" },
        { id: 93, name: "Depth-First Search" },
        { id: 94, name: "Breadth-First Search" },
      ],
    },
    {
      id: 10,
      name: "Dynamic Programming",
      subtopics: [
        { id: 101, name: "Introduction to DP" },
        { id: 102, name: "Memoization vs Tabulation" },
        { id: 103, name: "Classic DP Problems" },
        { id: 104, name: "Advanced DP Patterns" },
      ],
    },
  ];

  // Get all unique topics for suggestions
  const allTopics = dataStructures.map((ds) => ds.name);

  // Get all subtopics for a specific topic
  const getSubTopicsForTopic = (topicName) => {
    const topic = dataStructures.find((ds) => ds.name === topicName);
    return topic ? topic.subtopics.map((st) => st.name) : [];
  };

  // Filter topics based on input
  useEffect(() => {
    if (dsTopic.trim()) {
      const filtered = allTopics.filter((topic) =>
        topic.toLowerCase().includes(dsTopic.toLowerCase())
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics(allTopics);
    }
  }, [dsTopic]);

  // Filter subtopics based on input and selected topic
  useEffect(() => {
    if (dsTopic) {
      const allSubTopics = getSubTopicsForTopic(dsTopic);
      if (dsSubTopic.trim()) {
        const filtered = allSubTopics.filter((subtopic) =>
          subtopic.toLowerCase().includes(dsSubTopic.toLowerCase())
        );
        setFilteredSubTopics(filtered);
      } else {
        setFilteredSubTopics(allSubTopics);
      }
    } else {
      setFilteredSubTopics([]);
    }
  }, [dsSubTopic, dsTopic]);

  // Handle topic selection from suggestions
  const handleTopicSelect = (topic) => {
    setDsTopic(topic);
    setShowTopicSuggestions(false);
    // Clear subtopic when topic changes
    setDsSubTopic("");
    // Focus on subtopic input after selecting topic
    setTimeout(() => {
      subTopicInputRef.current?.focus();
    }, 100);
  };

  // Handle subtopic selection from suggestions
  const handleSubTopicSelect = (subtopic) => {
    setDsSubTopic(subtopic);
    setShowSubTopicSuggestions(false);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close topic suggestions if click is outside
      if (
        topicInputRef.current &&
        !topicInputRef.current.contains(event.target) &&
        topicSuggestionsRef.current &&
        !topicSuggestionsRef.current.contains(event.target)
      ) {
        setShowTopicSuggestions(false);
      }

      // Close subtopic suggestions if click is outside
      if (
        subTopicInputRef.current &&
        !subTopicInputRef.current.contains(event.target) &&
        subTopicSuggestionsRef.current &&
        !subTopicSuggestionsRef.current.contains(event.target)
      ) {
        setShowSubTopicSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close subtopic suggestions when topic is cleared
  useEffect(() => {
    if (!dsTopic) {
      setShowSubTopicSuggestions(false);
      setDsSubTopic("");
    }
  }, [dsTopic]);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
        setEditorHeight(50);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle resize events
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const container = document.querySelector(".editor-results-container");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newHeight =
        ((e.clientY - containerRect.top) / containerRect.height) * 100;

      const clampedHeight = Math.max(20, Math.min(80, newHeight));
      setEditorHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  // Get token from localStorage using UserContext
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Check if user is authenticated
  const isAuthenticated = user.isLoggedIn;

  // Generate problems based on DS topic and subtopic
  const generateProblems = async () => {
    if (!dsTopic.trim() || !dsSubTopic.trim()) {
      setError("Please enter both Data Structure and Topic");
      return;
    }

    if (!isAuthenticated) {
      setError("Please log in to generate problems");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProblems([]);
    setSelectedProblem(null);
    setTestResults(null);
    setShowOptimalSolution(false);
    setShowHint(false);

    try {
      const response = await fetch(`${API_URL}/api/generate-problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data_structure: dsTopic,
          topic: dsSubTopic,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate problems");
      }

      const data = await response.json();
      setProblems(data.problems);
      if (data.problems.length > 0) {
        setSelectedProblem(data.problems[0]);
        setCode(data.problems[0].starter_code || "");
      }
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error generating problems:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit code for evaluation
  const submitCode = async () => {
    if (!selectedProblem) return;
    const token = getAuthToken();
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }
    setIsSubmitting(true);
    setIsResultsOpen(true);
    setTestResults(null);
    setError(null);
    setShowHint(false);

    try {
      const response = await fetch(`${API_URL}/api/evaluate-solution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problem_id: selectedProblem.id,
          code: code,
          language: language.toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to evaluate solution");
      }

      const data = await response.json();
      setTestResults(data);

      if (data.passed) {
        setShowOptimalSolution(true);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error submitting code:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run test cases
  const runTests = async () => {
    if (!selectedProblem) return;
    const token = getAuthToken();
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }
    setIsTesting(true);
    setIsResultsOpen(true);
    setTestResults(null);
    setError(null);
    setShowHint(false); // Always reset hint visibility on new test run

    try {
      const response = await fetch(`${API_URL}/api/run-tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problem_id: selectedProblem.id,
          code: code,
          language: language.toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to run tests");
      }

      const data = await response.json();
      setTestResults(data);

      // Don't automatically show hint - user must click the hint button
    } catch (err) {
      setError(err.message);
      console.error("Error running tests:", err);
    } finally {
      setIsTesting(false);
    }
  };

  // Handle problem selection
  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setCode(problem.starter_code || "");
    setShowOptimalSolution(false);
    setTestResults(null);
    setError(null);
    setShowHint(false);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      console.log("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = getFileName();
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileName = () => {
    const lang = languages.find((l) => l.id === language);
    return `solution.${lang?.extension || "py"}`;
  };

  // Code editor component
  const CodeEditor = ({ code, setCode, language }) => {
    const handleCodeChange = (e) => {
      setCode(e.target.value);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const newCode = code.substring(0, start) + "  " + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 2;
        }, 0);
      }
    };

    return (
      <div className="relative h-full bg-black">
        <textarea
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-black p-4 font-mono text-sm outline-none resize-none text-white caret-white"
          style={{
            tabSize: 2,
          }}
          spellCheck="false"
          placeholder="Write your code here..."
        />
      </div>
    );
  };

  // Render hint section
  const renderHint = () => {
    if (!testResults?.hint || !showHint) return null;

    return (
      <div className="mb-6">
        <div className="bg-black border-2 border-blue-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-blue-300">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg">Need a Hint?</span>
                <div className="text-blue-400 text-sm">
                  Here's some guidance to help you debug
                </div>
              </div>
            </div>
            <button
              className="text-blue-300 hover:text-blue-200 transition-colors"
              onClick={() => setShowHint(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-200 text-sm leading-relaxed">
              {testResults.hint}
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              className="text-blue-300 hover:text-blue-200 text-sm flex items-center transition-colors"
              onClick={() => setShowHint(false)}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Problems Sidebar */}
        <div
          className={`${
            isSidebarOpen
              ? isMobile
                ? "fixed inset-0 z-40 w-full"
                : "w-80"
              : "w-0"
          } transition-all duration-300 bg-black border-r border-gray-800 flex flex-col overflow-hidden custom-scrollbar`}
        >
          {/* Mobile header */}
          {isMobile && isSidebarOpen && (
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-bold text-lg">Coding Practice</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Desktop header */}
          {!isMobile && (
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Coding Practice</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-4">
              {/* Authentication Warning */}
              {!isAuthenticated && (
                <div className="bg-yellow-900/20 border border-yellow-800/50 p-3 rounded-xl">
                  <div className="flex items-center text-yellow-300">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">
                      Authentication Required
                    </span>
                  </div>
                  <p className="text-yellow-300 mt-2 text-xs">
                    Please log in to generate AI-powered coding problems and
                    track your progress.
                  </p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-900/20 border border-red-800/50 p-3 rounded-lg">
                  <div className="flex items-center text-red-300">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Data Structure Input with Suggestions */}
              <div className="relative" ref={topicInputRef}>
                <label className="block text-sm font-medium mb-2 text-white">
                  Data Structure
                </label>
                <input
                  type="text"
                  value={dsTopic}
                  onChange={(e) => {
                    setDsTopic(e.target.value);
                    setShowTopicSuggestions(true);
                  }}
                  onFocus={() => setShowTopicSuggestions(true)}
                  placeholder="e.g., Arrays, Linked Lists, Trees"
                  className="w-full p-3 bg-gray-950 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 text-white"
                />

                {/* Topic Suggestions Dropdown */}
                {showTopicSuggestions && filteredTopics.length > 0 && (
                  <div
                    ref={topicSuggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-gray-950 border border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
                  >
                    {filteredTopics.map((topic, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 hover:bg-gray-800 text-white text-sm border-b border-gray-700 last:border-b-0 transition-colors duration-150"
                        onClick={() => handleTopicSelect(topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtopic Input with Suggestions */}
              <div className="relative" ref={subTopicInputRef}>
                <label className="block text-sm font-medium mb-2 text-white">
                  Subtopic
                </label>
                <input
                  type="text"
                  value={dsSubTopic}
                  onChange={(e) => {
                    setDsSubTopic(e.target.value);
                    setShowSubTopicSuggestions(true);
                  }}
                  onFocus={() => dsTopic && setShowSubTopicSuggestions(true)}
                  placeholder={
                    dsTopic
                      ? "e.g., Introduction, Operations, Traversal"
                      : "Select data structure first"
                  }
                  disabled={!dsTopic}
                  className={`w-full p-3 bg-gray-950 border rounded-lg text-sm focus:outline-none text-white ${
                    dsTopic
                      ? "border-gray-700 focus:border-orange-500"
                      : "border-gray-800 cursor-not-allowed opacity-50"
                  }`}
                />

                {/* Subtopic Suggestions Dropdown */}
                {showSubTopicSuggestions &&
                  filteredSubTopics.length > 0 &&
                  dsTopic && (
                    <div
                      ref={subTopicSuggestionsRef}
                      className="absolute top-full left-0 right-0 mt-1 bg-gray-950 border border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
                    >
                      {filteredSubTopics.map((subtopic, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 hover:bg-gray-950 text-white text-sm border-b border-gray-700 last:border-b-0 transition-colors duration-150"
                          onClick={() => handleSubTopicSelect(subtopic)}
                        >
                          {subtopic}
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* Generate Problems Button */}
              <button
                onClick={generateProblems}
                disabled={
                  isGenerating || !isAuthenticated || !dsTopic || !dsSubTopic
                }
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isGenerating ? (
                  <>
                    <div className="relative z-10 flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Generating...</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1 relative z-10" />
                    <span className="relative z-10">
                      {isAuthenticated ? "Generate Problems" : "Please Log In"}
                    </span>
                  </>
                )}
              </button>

              {/* Problems List */}
              {problems.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-lg mb-3 text-white">
                    Generated Problems ({problems.length})
                  </h3>
                  <div className="space-y-2 max-h-96 ">
                    {problems.map((problem) => (
                      <div
                        key={problem.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                          selectedProblem?.id === problem.id
                            ? "bg-gray-950 border-orange-500/30"
                            : "hover:bg-gray-800/50 border-gray-800"
                        }`}
                        onClick={() => handleProblemSelect(problem)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">
                            {problem.title}
                          </span>
                          {testResults?.passed &&
                            selectedProblem?.id === problem.id && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                        </div>
                        <div className="flex items-center mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              problem.difficulty === "easy"
                                ? "bg-green-500/20 text-green-400"
                                : problem.difficulty === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center">
              {!isSidebarOpen && !isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1 rounded hover:bg-gray-800 mr-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <h1 className="text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-none text-white">
                {selectedProblem?.title || "Select a Problem"}
              </h1>
              {selectedProblem && (
                <span
                  className={`ml-3 text-xs px-2 py-1 rounded-full hidden sm:inline-block ${
                    selectedProblem.difficulty === "easy"
                      ? "bg-green-500/20 text-green-400"
                      : selectedProblem.difficulty === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {selectedProblem.difficulty}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <div className="hidden sm:flex items-center mr-4 text-sm text-gray-400">
                  <span>Welcome, {user.name}</span>
                </div>
              )}
              <button className="p-2 rounded hover:bg-gray-800 hidden sm:block">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 rounded hover:bg-gray-800 hidden sm:block">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Problem Description */}
            <div className="w-full md:w-1/2 overflow-y-auto p-4 md:p-6 border-b md:border-r border-gray-800 custom-scrollbar">
              {selectedProblem ? (
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-white">
                    <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
                    Description
                  </h3>
                  <p className="whitespace-pre-line text-gray-300 mb-6">
                    {selectedProblem.description}
                  </p>

                  {selectedProblem.examples &&
                    selectedProblem.examples.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-bold mb-3 flex items-center text-white">
                          <FileText className="w-4 h-4 mr-2 text-orange-500" />
                          Examples
                        </h4>
                        {selectedProblem.examples.map((example, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-950 p-4 rounded-lg mb-3"
                          >
                            <div className="mb-2">
                              <span className="text-sm text-gray-400">
                                Input:{" "}
                              </span>
                              <code className="text-sm bg-black p-1 rounded break-all text-white">
                                {example.input}
                              </code>
                            </div>
                            <div className="mb-2">
                              <span className="text-sm text-gray-400">
                                Output:{" "}
                              </span>
                              <code className="text-sm bg-gray-700 p-1 rounded break-all text-white">
                                {example.expected_output}
                              </code>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="text-sm text-gray-400">
                                  Explanation:{" "}
                                </span>
                                <span className="text-sm text-white">
                                  {example.explanation}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                  {selectedProblem.constraints &&
                    selectedProblem.constraints.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-md font-bold mb-3 flex items-center text-white">
                          <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                          Constraints
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-gray-300">
                          {selectedProblem.constraints.map(
                            (constraint, idx) => (
                              <li key={idx} className="mb-1">
                                {constraint}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      {isAuthenticated
                        ? "Select a problem to start coding"
                        : "Log in to generate and solve problems"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Code Editor and Results Section */}
            <div className="w-full md:w-1/2 flex flex-col editor-results-container">
              {/* Code Editor Section */}
              <div
                className="flex flex-col border-b border-gray-800"
                style={{ height: `${editorHeight}%`, minHeight: "30%" }}
              >
                <div className="p-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center">
                    <div className="text-sm font-medium hidden sm:block text-white">
                      {getFileName()}
                    </div>
                    <div className="relative ml-0 sm:ml-3">
                      <button
                        className="flex items-center text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-700"
                        onClick={() =>
                          setShowLanguageDropdown(!showLanguageDropdown)
                        }
                      >
                        <span className="text-white">
                          {languages.find((l) => l.id === language)?.name}
                        </span>
                        <ChevronsUpDown className="w-3 h-3 ml-1" />
                      </button>

                      {showLanguageDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                          {languages.map((lang) => (
                            <button
                              key={lang.id}
                              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-700 ${
                                language === lang.id
                                  ? "text-orange-500"
                                  : "text-white"
                              }`}
                              onClick={() => {
                                setLanguage(lang.id);
                                setShowLanguageDropdown(false);
                              }}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 rounded hover:bg-gray-800"
                      onClick={copyCode}
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-gray-800"
                      onClick={downloadCode}
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-800 hidden sm:block">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <CodeEditor
                    code={code}
                    setCode={setCode}
                    language={language}
                  />
                </div>

                {/* Resize Handle */}
                <div
                  className="relative group cursor-row-resize bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center"
                  style={{ height: "8px" }}
                  onMouseDown={() => setIsResizing(true)}
                >
                  <GripVertical className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                </div>

                {/* Buttons */}
                <div className="p-4 border-t border-gray-800 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-medium py-2 px-3 sm:px-4 rounded transition-colors flex items-center text-sm"
                      onClick={runTests}
                      disabled={!selectedProblem || isTesting}
                    >
                      {isTesting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                          <span className="hidden sm:inline">Running...</span>
                          <span className="sm:hidden">Run</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">Run Code</span>
                          <span className="sm:hidden">Run</span>
                        </>
                      )}
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-500 text-white font-medium py-2 px-3 sm:px-4 rounded transition-colors flex items-center text-sm"
                      onClick={submitCode}
                      disabled={!selectedProblem || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                          <span className="hidden sm:inline">
                            Submitting...
                          </span>
                          <span className="sm:hidden">Submit</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">Submit</span>
                          <span className="sm:hidden">Submit</span>
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    className="text-sm text-gray-400 hover:text-white flex items-center"
                    onClick={() => setIsResultsOpen(!isResultsOpen)}
                  >
                    {isResultsOpen ? (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Hide Results</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Show Results</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Test Results Panel */}
              <div
                className="overflow-y-auto custom-scrollbar bg-black"
                style={{
                  height: `${100 - editorHeight}%`,
                  minHeight: "20%",
                  display: isResultsOpen ? "block" : "none",
                }}
              >
                {testResults ? (
                  <div className="p-4">
                    {/* Hint Section - Only shows when user clicks "Show Hint" */}
                    {renderHint()}

                    {testResults.passed ? (
                      <div className="bg-black border-2 border-green-500/30 p-4 rounded-xl mb-6">
                        <div className="flex items-center text-green-300">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="font-bold text-lg">
                              All test cases passed!
                            </span>
                            <div className="text-green-400 text-sm">
                              Your solution was accepted!
                            </div>
                          </div>
                        </div>
                        <button
                          className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg flex items-center transition-colors"
                          onClick={() =>
                            setShowOptimalSolution(!showOptimalSolution)
                          }
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          {showOptimalSolution ? "Hide" : "View"} Optimal
                          Solution
                        </button>
                      </div>
                    ) : (
                      <div className="bg-black border-2 border-red-500/30 p-4 rounded-xl mb-6">
                        <div className="flex items-center text-red-300">
                          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                            <XCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="font-bold text-lg">
                              {testResults.errors?.length > 0
                                ? "Solution Failed"
                                : "Some test cases failed"}
                            </span>
                          </div>
                        </div>

                        {/* Show hint button - Only appears if hint exists and not already shown */}
                        {testResults.hint && !showHint && (
                          <button
                            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg flex items-center transition-colors"
                            onClick={() => setShowHint(true)}
                          >
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Show Hint
                          </button>
                        )}

                        {testResults.errors?.map((error, idx) => (
                          <div
                            key={idx}
                            className="mt-3 p-3 bg-black rounded-lg border border-red-500/20"
                          >
                            <span className="font-medium text-red-400">
                              {error.type}:
                            </span>{" "}
                            <span className="text-white">{error.message}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {testResults.test_cases && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-lg flex items-center text-white">
                            <FileText className="w-5 h-5 mr-2 text-blue-400" />
                            Test Cases
                          </h4>
                          <div className="flex items-center">
                            <div className="text-sm text-gray-400">
                              {
                                testResults.test_cases.filter((tc) => tc.passed)
                                  .length
                              }
                              /{testResults.test_cases.length} passed
                            </div>
                          </div>
                        </div>

                        {/* Test Cases List */}
                        <div className="space-y-3">
                          {testResults.test_cases.map((testCase, idx) => (
                            <div
                              key={idx}
                              className={`border rounded-lg p-4 transition-all duration-200 ${
                                testCase.passed
                                  ? "border-green-500/30 bg-black"
                                  : "border-red-500/30 bg-black"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  {testCase.passed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                                  )}
                                  <span className="font-medium text-white">
                                    Test Case {idx + 1}
                                  </span>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    testCase.passed
                                      ? "bg-black text-green-400"
                                      : "bg-black text-red-400"
                                  }`}
                                >
                                  {testCase.passed ? "Passed" : "Failed"}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {/* Input Section */}
                                <div>
                                  <div className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">
                                    Input
                                  </div>
                                  <div className="bg-gray-900 rounded p-3 font-mono text-white text-sm">
                                    {testCase.input}
                                  </div>
                                </div>

                                {/* Expected Output Section */}
                                <div>
                                  <div className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">
                                    Expected Output
                                  </div>
                                  <div className="bg-gray-900 rounded p-3 font-mono text-white text-sm">
                                    {testCase.expected_output}
                                  </div>
                                </div>

                                {/* Your Output Section */}
                                <div className="md:col-span-2">
                                  <div className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">
                                    Your Output
                                  </div>
                                  <div
                                    className={`rounded p-3 font-mono text-sm ${
                                      testCase.passed
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}
                                  >
                                    {testCase.actual_output}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Efficiency Analysis */}
                    {testResults.efficiency && (
                      <div className="mb-6">
                        <h4 className="font-bold text-lg mb-4 flex items-center text-white">
                          <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                          Efficiency Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Time Complexity */}
                          <div className="bg-gray-950 rounded-xl p-4 border border-gray-700">
                            <div className="text-white text-sm font-medium mb-3">
                              Time Complexity
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-white text-xs mb-1">
                                  Your Solution
                                </div>
                                <div className="text-white font-mono text-sm bg-blue-500/10 px-3 py-2 rounded border border-blue-500/20">
                                  {testResults.efficiency.time_complexity}
                                </div>
                              </div>
                              <div>
                                <div className="text-white text-xs mb-1">
                                  Optimal
                                </div>
                                <div className="text-green-400 font-mono text-sm bg-green-500/10 px-3 py-2 rounded border border-green-500/20">
                                  {
                                    testResults.efficiency
                                      .optimal_time_complexity
                                  }
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Space Complexity */}
                          <div className="bg-gray-950 rounded-xl p-4 border border-gray-700">
                            <div className="text-white text-sm font-medium mb-3">
                              Space Complexity
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-white text-xs mb-1">
                                  Your Solution
                                </div>
                                <div className="text-white font-mono text-sm bg-blue-500/10 px-3 py-2 rounded border border-blue-500/20">
                                  {testResults.efficiency.space_complexity}
                                </div>
                              </div>
                              <div>
                                <div className="text-white text-xs mb-1">
                                  Optimal
                                </div>
                                <div className="text-green-400 font-mono text-sm bg-green-500/10 px-3 py-2 rounded border border-green-500/20">
                                  {
                                    testResults.efficiency
                                      .optimal_space_complexity
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {testResults.efficiency.comparison && (
                          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="text-blue-300 text-sm">
                              {testResults.efficiency.comparison}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {testResults.passed &&
                      showOptimalSolution &&
                      selectedProblem?.optimal_solution && (
                        <div className="mt-6">
                          <h4 className="font-bold text-lg mb-4 flex items-center text-white">
                            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                            Optimal Solution
                          </h4>
                          <div className="bg-gray-950 rounded-xl p-4 border border-gray-700 mb-4">
                            <pre className="text-sm font-mono whitespace-pre-wrap text-white overflow-x-auto">
                              {selectedProblem.optimal_solution}
                            </pre>
                          </div>
                          {selectedProblem.optimal_explanation && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                              <h5 className="font-bold text-blue-300 mb-2 text-sm">
                                Explanation
                              </h5>
                              <p className="text-blue-300 text-sm">
                                {selectedProblem.optimal_explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
                    <div>
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium mb-2">No Results Yet</p>
                      <p className="text-sm">
                        Run your code to see test results
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CSS for custom scrollbars */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(55, 65, 81, 0.3);
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(75, 85, 99, 0.5);
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 0.7);
          }
        `}</style>
      </div>
    </>
  );
};

export default CodingPracticePage;
