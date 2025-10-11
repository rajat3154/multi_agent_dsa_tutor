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
  RotateCcw,
  Award,
  BarChart3,
  Brain,
  Target,
  Rocket,
  Crown,
  Trophy,
  Frown,
  Smile,
  Laugh,
  Zap as Lightning,
  Feather,
  Shield,
  Gem,
  PieChart,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Medal,
  Flame,
  Sparkles as SparkleIcon,
  MessageSquare,
  Bookmark,
  ThumbsUp,
  GraduationCap,
  Minimize2,
  Lock,
} from "lucide-react";
import Navbar from "@/shared/Navbar";
import { UserContext } from "@/contexts/UserContext";

const QuizPage = () => {
  const { user } = useContext(UserContext);
  const [quizTopic, setQuizTopic] = useState("");
  const [quizSubTopic, setQuizSubTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [language, setLanguage] = useState("python");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particles, setParticles] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [streamingFeedback, setStreamingFeedback] = useState({});
  const [currentStreamingQuestion, setCurrentStreamingQuestion] =
    useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullScreenWarning, setShowFullScreenWarning] = useState(false);

  // Suggestions states
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [showSubTopicSuggestions, setShowSubTopicSuggestions] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubTopics, setFilteredSubTopics] = useState([]);

  // Refs
  const topicInputRef = useRef(null);
  const subTopicInputRef = useRef(null);
  const topicSuggestionsRef = useRef(null);
  const subTopicSuggestionsRef = useRef(null);
  const mainContainerRef = useRef(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Check if user is authenticated
  const isAuthenticated = user.isLoggedIn;

  // Get token from localStorage using UserContext
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Quiz topics and subtopics - Using the same structure as CodingPracticePage
  const quizTopics = [
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

  const languages = [
    { id: "python", name: "Python", icon: Gem, color: "text-blue-400" },
    { id: "java", name: "Java", icon: Code2, color: "text-red-400" },
    {
      id: "javascript",
      name: "JavaScript",
      icon: Zap,
      color: "text-yellow-400",
    },
    { id: "cpp", name: "C++", icon: Settings, color: "text-purple-400" },
    { id: "c", name: "C", icon: Code2, color: "text-gray-400" },
  ];

  const difficulties = [
    {
      id: "easy",
      name: "Easy",
      color: "from-green-500 to-emerald-500",
      icon: Feather,
      description: "Perfect for beginners",
    },
    {
      id: "medium",
      name: "Medium",
      color: "from-yellow-500 to-orange-500",
      icon: Target,
      description: "Balanced challenge",
    },
    {
      id: "hard",
      name: "Hard",
      color: "from-red-500 to-pink-500",
      icon: Crown,
      description: "Expert level",
    },
  ];

  // Enter full screen mode
  const enterFullScreen = async () => {
    try {
      if (mainContainerRef.current) {
        if (mainContainerRef.current.requestFullscreen) {
          await mainContainerRef.current.requestFullscreen();
        } else if (mainContainerRef.current.webkitRequestFullscreen) {
          await mainContainerRef.current.webkitRequestFullscreen();
        } else if (mainContainerRef.current.msRequestFullscreen) {
          await mainContainerRef.current.msRequestFullscreen();
        }
      }
    } catch (err) {
      console.error("Error entering full screen:", err);
    }
  };

  // Exit full screen mode
  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (err) {
      console.error("Error exiting full screen:", err);
    }
  };

  // Handle full screen change
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("msfullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullScreenChange
      );
    };
  }, []);

  // Prevent context menu and keyboard shortcuts during quiz
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
      };

      const handleKeyDown = (e) => {
        // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === "F12" ||
          (e.ctrlKey &&
            e.shiftKey &&
            (e.key === "I" ||
              e.key === "i" ||
              e.key === "J" ||
              e.key === "j")) ||
          (e.ctrlKey && e.key === "u")
        ) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [quizStarted, quizCompleted]);

  // Simulate processing with progress
  const simulateProcessing = () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 100);
  };

  // Particle animation for celebrations
  useEffect(() => {
    if (quizCompleted && evaluationResult?.score >= 70) {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 1 + Math.random() * 2,
        });
      }
      setParticles(newParticles);
    }
  }, [quizCompleted, evaluationResult]);

  // Get all unique topics for suggestions
  const allTopics = quizTopics.map((topic) => topic.name);

  // Get all subtopics for a specific topic
  const getSubTopicsForTopic = (topicName) => {
    const topic = quizTopics.find((t) => t.name === topicName);
    return topic ? topic.subtopics.map((st) => st.name) : [];
  };

  // Filter topics based on input
  useEffect(() => {
    if (quizTopic.trim()) {
      const filtered = allTopics.filter((topic) =>
        topic.toLowerCase().includes(quizTopic.toLowerCase())
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics(allTopics);
    }
  }, [quizTopic]);

  // Filter subtopics based on input and selected topic
  useEffect(() => {
    if (quizTopic) {
      const allSubTopics = getSubTopicsForTopic(quizTopic);
      if (quizSubTopic.trim()) {
        const filtered = allSubTopics.filter((subtopic) =>
          subtopic.toLowerCase().includes(quizSubTopic.toLowerCase())
        );
        setFilteredSubTopics(filtered);
      } else {
        setFilteredSubTopics(allSubTopics);
      }
    } else {
      setFilteredSubTopics([]);
    }
  }, [quizSubTopic, quizTopic]);

  // Handle topic selection from suggestions
  const handleTopicSelect = (topic) => {
    setQuizTopic(topic);
    setShowTopicSuggestions(false);
    setQuizSubTopic("");
    setTimeout(() => {
      subTopicInputRef.current?.focus();
    }, 100);
  };

  // Handle subtopic selection from suggestions
  const handleSubTopicSelect = (subtopic) => {
    setQuizSubTopic(subtopic);
    setShowSubTopicSuggestions(false);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        topicInputRef.current &&
        !topicInputRef.current.contains(event.target) &&
        topicSuggestionsRef.current &&
        !topicSuggestionsRef.current.contains(event.target)
      ) {
        setShowTopicSuggestions(false);
      }

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

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  // Stream evaluation feedback
  const streamEvaluationFeedback = async (quizId, answers) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/evaluate-quiz/${quizId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: answers,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error("Failed to evaluate quiz");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "feedback" && data.questionId) {
                setCurrentStreamingQuestion(data.questionId);
                setStreamingFeedback((prev) => ({
                  ...prev,
                  [data.questionId]: data.content,
                }));
              } else if (data.type === "result") {
                setEvaluationResult(data.data);
              }
            } catch (e) {
              console.log("Non-JSON line:", line);
            }
          }
        }
        buffer = lines[lines.length - 1];
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Generate quiz
  const generateQuiz = async () => {
    if (!quizTopic.trim() || !quizSubTopic.trim()) {
      setError("Please enter both Topic and Subtopic");
      return;
    }

    if (!isAuthenticated) {
      setError("Please log in to generate quizzes");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setQuiz(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setUserAnswers({});
    setEvaluationResult(null);
    setStreamingFeedback({});
    setCurrentStreamingQuestion(null);
    setParticles([]);

    try {
      const response = await fetch(`${API_URL}/api/generate-quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: quizTopic,
          subtopic: quizSubTopic,
          difficulty: difficulty,
          language: language,
          num_questions: numQuestions,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate quiz");
      }

      const data = await response.json();
      setQuiz(data);
      setTimeLeft(data.time_limit * 60);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error generating quiz:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Evaluate quiz answers with streaming
  const evaluateQuiz = async () => {
    if (!quiz || Object.keys(userAnswers).length === 0) return;

    setIsEvaluating(true);
    setStreamingFeedback({});
    setCurrentStreamingQuestion(null);

    try {
      await streamEvaluationFeedback(quiz.quiz_id, userAnswers);
    } catch (err) {
      setError(err.message);
      console.error("Error evaluating quiz:", err);
    } finally {
      setIsEvaluating(false);
      setCurrentStreamingQuestion(null);
    }
  };

  // Start quiz with full screen
  const startQuiz = async () => {
    if (!isAuthenticated) {
      setError("Please log in to start a quiz");
      return;
    }
    setShowFullScreenWarning(true);
  };

  const confirmStartQuiz = async () => {
    setShowFullScreenWarning(false);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setShowExplanation(false);
    setSelectedOption(null);
    setEvaluationResult(null);
    setStreamingFeedback({});
    setCurrentStreamingQuestion(null);

    // Enter full screen
    await enterFullScreen();
  };

  // Handle answer selection with animation
  const handleAnswerSelect = (questionId, answer) => {
    setSelectedOption(answer);
    setIsSubmitting(true);

    setTimeout(() => {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
      setIsSubmitting(false);

      // Auto-advance after selection
      setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
        } else {
          handleQuizComplete();
        }
      }, 1000);
    }, 500);
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      handleQuizComplete();
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
      setSelectedOption(null);
    }
  };

  // Complete quiz
  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    setQuizStarted(false);

    // Exit full screen when quiz completes
    await exitFullScreen();

    // Show processing state before starting evaluation
    simulateProcessing();

    // Wait for processing to complete before starting evaluation
    setTimeout(async () => {
      await evaluateQuiz();
    }, 2500);
  };

  // Restart quiz
  const restartQuiz = async () => {
    await exitFullScreen();
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setShowExplanation(false);
    setSelectedOption(null);
    setEvaluationResult(null);
    setStreamingFeedback({});
    setCurrentStreamingQuestion(null);
    setTimeLeft(quiz.time_limit * 60);
    setParticles([]);
    setIsProcessing(false);
    setProcessingProgress(0);

    // Re-enter full screen
    await enterFullScreen();
  };

  // Calculate score
  const calculateScore = () => {
    if (evaluationResult) {
      return evaluationResult.score;
    }

    if (!quiz) return 0;

    let correct = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer === question.correct_answer) {
        correct++;
      }
    });

    return Math.round((correct / quiz.questions.length) * 100);
  };

  // Get performance emoji
  const getPerformanceEmoji = () => {
    const score = calculateScore();
    if (score >= 90)
      return {
        icon: Crown,
        color: "text-yellow-400",
        text: "Master Level!",
        bg: "from-yellow-500 to-orange-500",
      };
    if (score >= 80)
      return {
        icon: Medal,
        color: "text-purple-400",
        text: "Excellent!",
        bg: "from-purple-500 to-pink-500",
      };
    if (score >= 70)
      return {
        icon: Trophy,
        color: "text-blue-400",
        text: "Great Job!",
        bg: "from-blue-500 to-cyan-500",
      };
    if (score >= 60)
      return {
        icon: TrendingUp,
        color: "text-green-400",
        text: "Good Progress!",
        bg: "from-green-500 to-emerald-500",
      };
    if (score >= 50)
      return {
        icon: Smile,
        color: "text-orange-400",
        text: "Keep Going!",
        bg: "from-orange-500 to-red-500",
      };
    return {
      icon: GraduationCap,
      color: "text-gray-400",
      text: "Learning Phase",
      bg: "from-gray-500 to-gray-700",
    };
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get question status
  const getQuestionStatus = (questionId) => {
    if (!userAnswers[questionId]) return "unanswered";
    const isCorrect =
      userAnswers[questionId] ===
      quiz.questions.find((q) => q.id === questionId)?.correct_answer;
    return isCorrect ? "correct" : "incorrect";
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return "from-yellow-400 to-orange-500";
    if (score >= 80) return "from-purple-400 to-pink-500";
    if (score >= 70) return "from-blue-400 to-cyan-500";
    if (score >= 60) return "from-green-400 to-emerald-500";
    return "from-orange-400 to-red-500";
  };

  // Full Screen Warning Modal
  const FullScreenWarningModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 rounded-3xl p-8 max-w-md w-full border border-gray-900 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Full Screen Required
          </h3>
          <p className="text-gray-300 mb-6 leading-relaxed">
            For the best testing experience and to maintain quiz integrity, the
            quiz will open in full screen mode. You won't be able to exit until
            you complete the test.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={confirmStartQuiz}
              className="bg-orange-500 hover:bg-orange-600  text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Quiz in Full Screen
            </button>
            <button
              onClick={() => setShowFullScreenWarning(false)}
              className="border-2 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Processing Component with Fixed Loader
  const ProcessingDisplay = () => (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="text-center max-w-2xl w-full">
        {/* Fixed Animated Processing Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-20 blur-xl"></div>

            {/* Main Processing Circle */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl">
              <div className="relative">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Fixed Smooth Rotating Progress Ring */}
            <div
              className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin"
              style={{ animationDuration: "1.5s" }}
            ></div>

            {/* Additional rotating ring for better effect */}
            <div
              className="absolute inset-2 border-2 border-transparent border-b-cyan-400 border-l-pink-400 rounded-full animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            ></div>
          </div>
        </div>

        <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Processing Your Results
        </h3>
        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
          Our AI is carefully analyzing your answers and generating personalized
          feedback...
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span>Processing</span>
            <span>{Math.round(processingProgress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out shadow-lg shadow-cyan-500/25"
              style={{
                width: `${processingProgress}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { text: "Analyzing Answers", active: processingProgress > 0 },
            { text: "Generating Feedback", active: processingProgress > 33 },
            { text: "Finalizing Results", active: processingProgress > 66 },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-2 transition-all duration-300 ${
                  step.active
                    ? "bg-green-400 shadow-lg shadow-green-400/25"
                    : "bg-gray-600"
                }`}
              ></div>
              <div
                className={`text-xs transition-all duration-300 ${
                  step.active ? "text-green-400" : "text-gray-500"
                }`}
              >
                {step.text}
              </div>
            </div>
          ))}
        </div>

        {/* Fun Message */}
        <div className="mt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black/50 rounded-full border border-cyan-500/30">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">
              {processingProgress < 30 && "Starting analysis..."}
              {processingProgress >= 30 &&
                processingProgress < 60 &&
                "Evaluating your responses..."}
              {processingProgress >= 60 &&
                processingProgress < 90 &&
                "Generating insights..."}
              {processingProgress >= 90 && "Almost ready..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const performance = getPerformanceEmoji();
  const score = calculateScore();

  // Beautiful Results Component
  const ResultsDisplay = () => {
    if (isProcessing) {
      return <ProcessingDisplay />;
    }

    if (isEvaluating) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-purple-900">
          <div className="text-center max-w-4xl w-full">
            {/* Evaluating animation */}
            <div className="relative mb-12">
              <div className="w-48 h-48 mx-auto relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-20 blur-xl"></div>

                {/* Neural Network Connections */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                      style={{
                        top: `${25 + 15 * Math.sin(i * 0.785)}%`,
                        left: `${25 + 15 * Math.cos(i * 0.785)}%`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Brain Container */}
                <div className="absolute inset-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="relative">
                    <Brain className="w-20 h-20 text-white animate-pulse" />

                    {/* Floating Particles */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{
                          top: `${-10 + 20 * Math.sin(i * 0.523)}px`,
                          left: `${-10 + 20 * Math.cos(i * 0.523)}px`,
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Rotating Orbit */}
                <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-spin">
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg"></div>
                </div>
              </div>

              {/* Progress Rings */}
              <div className="absolute -inset-8">
                <div
                  className="absolute inset-0 border-2 border-green-400/20 rounded-full animate-spin"
                  style={{ animationDuration: "8s" }}
                ></div>
                <div
                  className="absolute inset-4 border-2 border-purple-400/20 rounded-full animate-spin"
                  style={{
                    animationDuration: "6s",
                    animationDirection: "reverse",
                  }}
                ></div>
              </div>
            </div>

            <h3 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Analyzing Your Masterpiece
            </h3>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Our AI is carefully examining each response, uncovering patterns
              and insights...
            </p>

            {/* Elegant Progress Visualization */}
            <div className="max-w-2xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-3">
                  <span>Processing Questions</span>
                  <span>
                    {Math.round(
                      (Object.keys(streamingFeedback).length /
                        quiz.questions.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-cyan-500/25"
                    style={{
                      width: `${
                        (Object.keys(streamingFeedback).length /
                          quiz.questions.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* AI Insights Counter */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20">
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">
                      {Object.keys(streamingFeedback).length}
                    </div>
                    <div className="text-sm text-gray-400">
                      Questions Analyzed
                    </div>
                  </div>
                  <div className="w-px h-12 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">
                      {quiz.questions.length -
                        Object.keys(streamingFeedback).length}
                    </div>
                    <div className="text-sm text-gray-400">Remaining</div>
                  </div>
                  <div className="w-px h-12 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {Math.round(
                        (Object.keys(streamingFeedback).length /
                          quiz.questions.length) *
                          100
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-400">Complete</div>
                  </div>
                </div>
              </div>

              {/* Fun AI Messages */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black/50 rounded-full border border-cyan-500/30">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300">
                    {Object.keys(streamingFeedback).length === 0 &&
                      "Initializing neural networks..."}
                    {Object.keys(streamingFeedback).length > 0 &&
                      Object.keys(streamingFeedback).length <
                        quiz.questions.length / 2 &&
                      "Discovering patterns in your answers..."}
                    {Object.keys(streamingFeedback).length >=
                      quiz.questions.length / 2 &&
                      Object.keys(streamingFeedback).length <
                        quiz.questions.length &&
                      "Generating personalized insights..."}
                    {Object.keys(streamingFeedback).length ===
                      quiz.questions.length &&
                      "Finalizing your performance analysis..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-6 bg-black">
        {/* Hero Score Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div
              className={`w-48 h-48 bg-gradient-to-r ${getScoreColor(
                score
              )} rounded-full flex items-center justify-center mx-auto shadow-2xl animate-float`}
            >
              <div className="text-center text-white">
                <div className="text-5xl font-bold">{score}%</div>
                <div className="text-sm opacity-90">Overall Score</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${performance.bg} rounded-full flex items-center justify-center shadow-lg`}
              >
                <performance.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            {performance.text}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {evaluationResult?.recommendation ||
              `You answered ${
                evaluationResult?.correct_answers ||
                Math.round((score / 100) * quiz.questions.length)
              } out of ${quiz.questions.length} questions correctly`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-3xl border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {evaluationResult?.correct_answers ||
                    Math.round((score / 100) * quiz.questions.length)}
                </div>
                <div className="text-blue-400 text-sm">Correct Answers</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-3xl border border-green-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{score}%</div>
                <div className="text-green-400 text-sm">Accuracy Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-3xl border border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {quiz.time_limit}
                </div>
                <div className="text-purple-400 text-sm">Time Limit (min)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Question Analysis */}
        <div className="bg-gray-950/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-blue-400" />
            Detailed Analysis
          </h3>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = userAnswer === question.correct_answer;
              const feedback = streamingFeedback[question.id];

              return (
                <div
                  key={question.id}
                  className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCorrect
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-white font-semibold">
                        Question {index + 1}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCorrect
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 text-sm mb-3">
                      {question.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-900/50 p-3 rounded-xl">
                        <div className="text-blue-400 font-medium mb-1">
                          Your Answer
                        </div>
                        <div className="text-white">
                          {question.type === "mcq"
                            ? question.options?.[userAnswer] || "Not answered"
                            : userAnswer || "Not answered"}
                        </div>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-xl">
                        <div className="text-green-400 font-medium mb-1">
                          Correct Answer
                        </div>
                        <div className="text-white">
                          {question.type === "mcq"
                            ? question.options?.[question.correct_answer]
                            : question.correct_answer}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Streaming Feedback */}
                  {feedback && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <SparkleIcon className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-blue-400 font-medium">
                          AI Feedback
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {feedback}
                      </p>
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="mt-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-green-400 font-medium">
                          Explanation
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Insights */}
        {evaluationResult && (
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20 mb-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Strengths</h4>
                <div className="space-y-2">
                  {score >= 70 && (
                    <div className="flex items-center space-x-3 text-green-400">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Strong understanding of core concepts</span>
                    </div>
                  )}
                  {score >= 80 && (
                    <div className="flex items-center space-x-3 text-green-400">
                      <Flame className="w-4 h-4" />
                      <span>Excellent problem-solving skills</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">
                  Areas to Improve
                </h4>
                <div className="space-y-2">
                  {score < 70 && (
                    <div className="flex items-center space-x-3 text-orange-400">
                      <Bookmark className="w-4 h-4" />
                      <span>Review fundamental concepts</span>
                    </div>
                  )}
                  {score < 60 && (
                    <div className="flex items-center space-x-3 text-orange-400">
                      <GraduationCap className="w-4 h-4" />
                      <span>Practice more examples</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={restartQuiz}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 font-semibold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          <button
            onClick={() => {
              setQuiz(null);
              setQuizStarted(false);
              setQuizCompleted(false);
              setUserAnswers({});
              setEvaluationResult(null);
              setStreamingFeedback({});
              setIsProcessing(false);
              setProcessingProgress(0);
            }}
            className="flex items-center justify-center px-8 py-4 border-2 border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600/50 rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            New Quiz
          </button>
          <button className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 font-semibold">
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </button>
        </div>
      </div>
    );
  };

  // Modified MCQ Options Component
  const MCQOptions = ({
    question,
    onAnswerSelect,
    userAnswer,
    isSubmitting,
  }) => {
    const showCorrectness = quizCompleted;

    return (
      <div className="space-y-4 mb-8">
        {question.options.map((option, index) => {
          const isSelected = userAnswer === index;
          const isCorrect = index === question.correct_answer;
          const showAsCorrect = showCorrectness && isCorrect;
          const showAsIncorrect = showCorrectness && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(question.id, index)}
              disabled={isSubmitting || quizCompleted}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-500 transform ${
                showAsCorrect
                  ? "border-green-500 bg-green-500/10 scale-105 shadow-lg shadow-green-500/25"
                  : showAsIncorrect
                  ? "border-red-500 bg-red-500/10 scale-105 shadow-lg shadow-red-500/25"
                  : isSelected
                  ? "border-orange-500 bg-orange-500/10 scale-105 shadow-lg shadow-orange-500/25"
                  : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50 hover:scale-105"
              } ${isSubmitting ? "animate-pulse" : ""}`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                    showAsCorrect
                      ? "border-green-500 bg-green-500"
                      : showAsIncorrect
                      ? "border-red-500 bg-red-500"
                      : isSelected
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-600"
                  }`}
                >
                  {(isSelected || showAsCorrect || showAsIncorrect) && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-lg text-gray-200">{option}</span>
                {showCorrectness && (
                  <div className="ml-auto">
                    {isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {showAsIncorrect && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {/* Full Screen Warning Modal */}
      {showFullScreenWarning && <FullScreenWarningModal />}

      <div
        ref={mainContainerRef}
        className={`flex h-screen bg-black text-white font-sans overflow-hidden ${
          quizStarted && !quizCompleted ? "quiz-active" : ""
        }`}
      >
        {/* Mobile Menu Button */}
        {isMobile && !quizStarted && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Quiz Configuration Sidebar - Hidden during quiz */}
        {!quizStarted && (
          <div
            className={`${
              isSidebarOpen
                ? isMobile
                  ? "fixed inset-0 z-40 w-full"
                  : "w-90 "
                : "w-0"
            } transition-all duration-300 bg-black border-r border-gray-800 flex flex-col overflow-hidden custom-scrollbar`}
          >
            {/* Mobile header */}
            {isMobile && isSidebarOpen && (
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="font-bold text-lg">Quiz Generator</h2>
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
                  <h2 className="font-bold text-lg">Quiz Generator</h2>
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
                      Please log in to generate AI-powered quizzes and track
                      your progress.
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

                {/* Topic Input with Suggestions */}
                <div className="relative" ref={topicInputRef}>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => {
                      setQuizTopic(e.target.value);
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
                    value={quizSubTopic}
                    onChange={(e) => {
                      setQuizSubTopic(e.target.value);
                      setShowSubTopicSuggestions(true);
                    }}
                    onFocus={() =>
                      quizTopic && setShowSubTopicSuggestions(true)
                    }
                    placeholder={
                      quizTopic
                        ? "e.g., Introduction, Operations, Traversal"
                        : "Select topic first"
                    }
                    disabled={!quizTopic}
                    className={`w-full p-3 bg-gray-950 border rounded-lg text-sm focus:outline-none text-white ${
                      quizTopic
                        ? "border-gray-700 focus:border-orange-500"
                        : "border-gray-800 cursor-not-allowed opacity-50"
                    }`}
                  />

                  {/* Subtopic Suggestions Dropdown */}
                  {showSubTopicSuggestions &&
                    filteredSubTopics.length > 0 &&
                    quizTopic && (
                      <div
                        ref={subTopicSuggestionsRef}
                        className="absolute top-full left-0 right-0 mt-1 bg-gray-950 border border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
                      >
                        {filteredSubTopics.map((subtopic, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-4 py-3 hover:bg-gray-800 text-white text-sm border-b border-gray-700 last:border-b-0 transition-colors duration-150"
                            onClick={() => handleSubTopicSelect(subtopic)}
                          >
                            {subtopic}
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                {/* Difficulty Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff.id}
                        onClick={() => setDifficulty(diff.id)}
                        className={`p-3 rounded-lg border text-sm transition-colors ${
                          difficulty === diff.id
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        {diff.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 bg-gray-950 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 text-white"
                  >
                    {languages.map((lang) => (
                      <option
                        key={lang.id}
                        value={lang.id}
                        className="bg-gray-900"
                      >
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Questions:{" "}
                    <span className="text-orange-400">{numQuestions}</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>3</span>
                    <span>Balanced</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Generate Quiz Button */}
                <button
                  onClick={generateQuiz}
                  disabled={
                    isGenerating ||
                    !isAuthenticated ||
                    !quizTopic ||
                    !quizSubTopic
                  }
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center relative overflow-hidden group"
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
                      <Sparkles className="w-4 h-4 mr-2 relative z-10" />
                      <span className="relative z-10">
                        {isAuthenticated ? "Generate Quiz" : "Please Log In"}
                      </span>
                    </>
                  )}
                </button>

                {/* Generated Quiz Info */}
                {quiz && !quizStarted && !quizCompleted && (
                  <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <h3 className="font-bold text-lg mb-3 text-white">
                      Quiz Ready! 🎉
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Title:</span>
                        <span className="text-white">{quiz.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Questions:</span>
                        <span className="text-white">
                          {quiz.questions.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-orange-400">
                          {quiz.time_limit} min
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={startQuiz}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      <span>Start Quiz</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Overlay for mobile sidebar */}
        {isMobile && isSidebarOpen && !quizStarted && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-black animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black to-black"></div>

          {/* Celebration Particles */}
          {quizCompleted &&
            particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                }}
              />
            ))}

          {/* Top Bar - Modified for quiz mode */}
          <div className="p-6 border-b border-gray-800/50 bg-black backdrop-blur-sm flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              {!isSidebarOpen && !isMobile && !quizStarted && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/25">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {quiz ? quiz.title : "AI Quiz Master"}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {quiz
                      ? quiz.description
                      : "Test your programming knowledge"}
                  </p>
                </div>
              </div>
              {quizStarted && (
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-2xl border border-orange-500/30">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="font-mono text-lg font-bold text-orange-400">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-xl">
                    Question{" "}
                    <span className="text-white font-bold">
                      {currentQuestionIndex + 1}
                    </span>{" "}
                    of{" "}
                    <span className="text-white font-bold">
                      {quiz.questions.length}
                    </span>
                  </div>
                  {isFullScreen && (
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-3 py-2 rounded-2xl border border-blue-500/30">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm font-medium">
                        Full Screen
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {quizStarted && !quizCompleted && (
              <div className="text-sm text-orange-400 bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/30">
                <Lock className="w-4 h-4 inline mr-2" />
                Test in Progress
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            {!quiz ? (
              // Welcome State
              <div className="h-full flex mt-7 justify-center p-8 relative">
                <div className="text-center max-w-2xl space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/25 animate-pulse">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <h2 className="text-5xl font-bold bg-white bg-clip-text text-transparent">
                    Ready to Test Your Skills?
                  </h2>
                  <p className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed">
                    {isAuthenticated
                      ? "Generate personalized programming quizzes powered by AI. Challenge yourself and level up your coding expertise."
                      : "Log in to generate AI-powered quizzes and test your programming knowledge."}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                    {[
                      {
                        icon: Brain,
                        text: "AI-Powered",
                        color: "from-purple-500 to-pink-500",
                      },
                      {
                        icon: Zap,
                        text: "Instant",
                        color: "from-yellow-500 to-orange-500",
                      },
                      {
                        icon: Target,
                        text: "Focused",
                        color: "from-green-500 to-cyan-500",
                      },
                      {
                        icon: Crown,
                        text: "Adaptive",
                        color: "from-blue-500 to-indigo-500",
                      },
                    ].map((item, index) => (
                      <div key={index} className="text-center group">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-300">
                          {item.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : quizStarted ? (
              // Quiz in Progress
              <div className="max-w-4xl mx-auto p-6">
                {currentQuestion && (
                  <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl p-8 border border-gray-800/50 shadow-2xl backdrop-blur-sm">
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-2xl text-sm font-medium shadow-lg shadow-orange-500/25">
                          {currentQuestion.type.toUpperCase()}
                        </span>
                        <div className="w-32 bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${
                                ((currentQuestionIndex + 1) /
                                  quiz.questions.length) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-medium text-white mb-6 leading-relaxed">
                        {currentQuestion.question}
                      </h3>
                    </div>

                    {/* Options for MCQ */}
                    {currentQuestion.type === "mcq" &&
                      currentQuestion.options && (
                        <MCQOptions
                          question={currentQuestion}
                          onAnswerSelect={handleAnswerSelect}
                          userAnswer={userAnswers[currentQuestion.id]}
                          isSubmitting={isSubmitting}
                        />
                      )}

                    {/* Text Answer Input */}
                    {currentQuestion.type === "text" && (
                      <div className="mb-8">
                        <textarea
                          value={userAnswers[currentQuestion.id] || ""}
                          onChange={(e) => {
                            const answer = e.target.value;
                            setUserAnswers((prev) => ({
                              ...prev,
                              [currentQuestion.id]: answer,
                            }));
                          }}
                          placeholder="Type your answer here... ✨"
                          className="w-full h-32 p-6 bg-gray-800/30 border-2 border-gray-700/50 rounded-2xl text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 resize-none backdrop-blur-sm transition-all duration-300 placeholder-gray-500 text-lg"
                          disabled={quizCompleted}
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-800/50">
                      <button
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center px-6 py-3 rounded-2xl border-2 border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous
                      </button>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={nextQuestion}
                          className="flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 font-semibold"
                        >
                          {currentQuestionIndex === quiz.questions.length - 1
                            ? "Finish Quiz"
                            : "Next Question"}
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : quizCompleted ? (
              // Quiz Results with Processing State
              <ResultsDisplay />
            ) : (
              // Quiz Preview
              <div className="max-w-4xl mx-auto p-6 mt-10">
                <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl p-8 border border-gray-800/50 shadow-2xl backdrop-blur-sm">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                    {quiz.title}
                  </h2>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {[
                      {
                        label: "Questions",
                        value: quiz.questions.length,
                        icon: FileText,
                        color: "from-blue-500 to-cyan-500",
                      },
                      {
                        label: "Minutes",
                        value: quiz.time_limit,
                        icon: Clock,
                        color: "from-orange-500 to-red-500",
                      },
                      {
                        label: "Difficulty",
                        value:
                          difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1).toLowerCase(),
                        icon: Crown,
                        color: "from-purple-500 to-pink-500",
                      },
                      {
                        label: "Language",
                        value: languages.find((l) => l.id === language)?.name,
                        icon: Code2,
                        color: "from-green-500 to-emerald-500",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50 text-center group hover:scale-105 transition-transform duration-300"
                      >
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                        >
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {item.value}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={startQuiz}
                      className="flex-1 bg-orange-500 hover:bg-orange-600  text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-3"
                    >
                      <Play className="w-6 h-6" />
                      <span className="text-lg">Start Quiz</span>
                    </button>
                    <button
                      onClick={() => {
                        setQuiz(null);
                        setQuizStarted(false);
                        setQuizCompleted(false);
                        setIsProcessing(false);
                        setProcessingProgress(0);
                      }}
                      className="px-8 py-4 border-2 border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600/50 rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      Generate New
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CSS for custom scrollbars and slider */}
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

          .slider-thumb::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
            border: 2px solid #000;
          }

          .slider-thumb::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
            border: 2px solid #000;
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          /* Prevent user selection during quiz */
          .quiz-active {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }

          .quiz-active * {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }
        `}</style>
      </div>
    </>
  );
};

export default QuizPage;
