import React, { useState, useEffect, useContext } from "react";
import {
  User,
  Settings,
  Bell,
  BookOpen,

  ChevronRight,
  Edit3,
  Search,
  Download,
  Calendar,
  Clock as ClockIcon,
  Target,
  Zap,
  Star,
  FileText,
  X,
  CheckCircle,
  Code,
  Mail,
  Menu,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Navbar from "@/shared/Navbar";
import { UserContext } from "@/contexts/UserContext";


const Profile = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("learned-concepts");
  const [userData, setUserData] = useState(null);
  const [learnedConcepts, setLearnedConcepts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConceptList, setShowConceptList] = useState(true);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Check mobile view on resize and initial load
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1280);
      if (window.innerWidth < 1280) {
        setShowConceptList(!selectedItem);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [selectedItem]);

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch user profile and data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please log in to view your profile");
      }

      // Fetch user profile
      const profileResponse = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const profileData = await profileResponse.json();
      setUserData(profileData);

      // Fetch learned concepts
      const conceptsResponse = await fetch(`${API_URL}/api/my-concepts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (conceptsResponse.ok) {
        const conceptsData = await conceptsResponse.json();
        setLearnedConcepts(conceptsData.concepts || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchUserData();
    }
  }, [user.isLoggedIn]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (isMobileView) {
      setShowConceptList(false);
    }
  };

  const handleBackToList = () => {
    setShowConceptList(true);
    setSelectedItem(null);
  };

  const handleDownload = (item) => {
    const content =
      item.markdown_content || `# ${item.title}\n\n${item.content}`;
    const filename = `${item.title.toLowerCase().replace(/\s+/g, "-")}.md`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredItems = learnedConcepts.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    return (
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-2xl font-bold mt-6 mb-4 text-[var(--color-primary)]"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-xl font-bold mt-6 mb-3 text-[var(--color-primary)]"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-lg font-semibold mt-4 mb-2 text-[var(--color-primary)]"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-4 leading-relaxed text-base" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal list-inside mb-4 space-y-1"
                {...props}
              />
            ),
            li: ({ node, ...props }) => <li className="ml-4" {...props} />,
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div className="my-4">
                  <div className="flex justify-between items-center bg-gray-800 px-4 py-2 text-sm text-gray-400 rounded-t-lg">
                    <span>{match[1]}</span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(String(children))
                      }
                      className="hover:text-white transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                  <pre
                    className={`${className} overflow-x-auto p-4 bg-gray-900 text-sm rounded-b-lg`}
                    {...props}
                  >
                    <code className={className}>{children}</code>
                  </pre>
                </div>
              ) : (
                <code
                  className="bg-gray-800 px-1.5 py-0.5 rounded text-sm text-[var(--color-primary)]"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-[var(--color-primary)] pl-4 italic my-4 text-gray-400"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table
                  className="w-full border-collapse border border-gray-600 text-sm"
                  {...props}
                />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th
                className="border border-gray-600 px-3 py-2 bg-gray-800 font-semibold text-left"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="border border-gray-600 px-3 py-2" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[var(--font-main)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[var(--font-main)] flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-800/50 p-6 rounded-xl max-w-md mx-4">
              <div className="text-red-400 text-lg font-medium mb-2">Error</div>
              <p className="text-gray-400">{error}</p>
              <button
                onClick={fetchUserData}
                className="mt-4 bg-[var(--color-primary)] hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[var(--font-main)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">No user data found</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[var(--font-main)]">
        <div className="max-w-full mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
          {/* Top Row - Compact Profile and Stats */}
          {/* Top Row - Compact Profile and Stats */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 my-8">
            {/* Profile Section */}
            <div className="xl:col-span-1 bg-black rounded-2xl border border-gray-700/50 p-6 flex flex-col justify-center h-full">
              <div className="flex items-center gap-4">
                <img
                  src={userData.profilePhoto || "/default-avatar.png"}
                  alt={userData.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-primary)]/30 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold mb-1 truncate">
                    {userData.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-gray-300 text-sm md:text-base">
                      <Mail className="w-4 h-4 mr-1 text-[var(--color-primary)]" />
                      <span className="truncate">{userData.email}</span>
                    </div>
                    <div className="px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-full text-sm md:text-base font-medium border border-[var(--color-primary)]/30">
                      {userData.level || "Beginner"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="xl:col-span-2 bg-black rounded-2xl border border-gray-700/50 p-6 h-full flex items-center justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {[
                  {
                    icon: CheckCircle,
                    value: userData.profile?.problems_solved?.length || 50,
                    label: "Problems",
                    color: "text-green-400",
                  },
                  {
                    icon: Target,
                    value: 10,

                    label: "Quizzes",
                    color: "text-blue-400",
                  },
                  {
                    icon: BookOpen,
                    value: learnedConcepts.length,
                    label: "Topics",
                    color: "text-purple-400",
                  },
                  {
                    icon: Zap,
                    value: userData.profile?.streak || 0,
                    label: "Streak",
                    color: "text-yellow-400",
                  },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-black rounded-xl border border-gray-700/50 p-6 flex flex-col items-center justify-center text-center"
                    >
                      <Icon className={`w-6 h-6 mb-2 ${card.color}`} />
                      <div
                        className={`text-lg md:text-2xl font-bold ${card.color}`}
                      >
                        {card.value}
                      </div>
                      <div className="text-sm md:text-base text-gray-400">
                        {card.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Second Row - Horizontal Tabs */}
          <div className="bg-black rounded-2xl border border-gray-700/50 p-1 mb-6">
            <div className="grid grid-cols-3 gap-1">
              <button
                className={`py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "learned-concepts"
                    ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-lg"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
                onClick={() => setActiveTab("learned-concepts")}
              >
                <div className="flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Concepts</span>
                </div>
              </button>
              <button
                className={`py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "progress"
                    ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-lg"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
                onClick={() => setActiveTab("progress")}
              >
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Progress</span>
                </div>
              </button>
              <button
                className={`py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === "settings"
                    ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-lg"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Row - Learning Concepts Area */}
          {activeTab === "learned-concepts" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 min-h-[500px]">
              {/* Concept List */}
              <div
                className={`xl:col-span-1 bg-black rounded-2xl border border-gray-700/50 p-4 flex flex-col ${
                  isMobileView && selectedItem ? "hidden" : "block"
                }`}
              >
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-3">Learned Concepts</h3>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search concepts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8 h-full flex items-center justify-center">
                      <div>
                        <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <h4 className="text-base font-medium text-gray-400 mb-2">
                          {searchQuery
                            ? "No concepts found"
                            : "No concepts learned yet"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {searchQuery
                            ? "Try a different search term"
                            : "Start learning to see concepts here."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 h-full overflow-y-auto custom-scrollbar-thin">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                            selectedItem?.id === item.id
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-lg"
                              : "border-gray-600/30 hover:border-gray-500/50 bg-black hover:bg-gray-800/20"
                          }`}
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-2 line-clamp-2">
                                {item.title}
                              </h4>
                              <div className="flex flex-wrap gap-1 mb-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.difficulty === "beginner"
                                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                      : item.difficulty === "intermediate"
                                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                                  }`}
                                >
                                  {item.difficulty}
                                </span>
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                                  {item.language}
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-gray-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(item.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 mt-1 ${
                                selectedItem?.id === item.id
                                  ? "text-[var(--color-primary)]"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Markdown Content */}
              <div
                className={`xl:col-span-2 bg-black rounded-2xl border border-gray-700/50 p-4 flex flex-col ${
                  isMobileView && !selectedItem ? "hidden" : "block"
                }`}
              >
                {/* Mobile Back Button */}
                {isMobileView && selectedItem && (
                  <button
                    onClick={handleBackToList}
                    className="flex items-center space-x-2 mb-4 p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors w-fit"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back to List</span>
                  </button>
                )}

                {selectedItem ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 pb-4 border-b border-gray-700/50">
                      <div className="flex-1">
                        <h1 className="text-xl font-bold mb-2">
                          {selectedItem.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedItem.difficulty === "beginner"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : selectedItem.difficulty === "intermediate"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {selectedItem.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                            {selectedItem.language}
                          </span>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/30">
                            {new Date(
                              selectedItem.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(selectedItem)}
                        className="flex items-center justify-center px-3 py-2 bg-[var(--color-primary)] hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto mt-2 sm:mt-0"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="h-full overflow-y-auto custom-scrollbar pr-2">
                        <MarkdownRenderer
                          content={
                            selectedItem.markdown_content ||
                            selectedItem.content
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <h4 className="text-lg font-medium text-gray-400 mb-2">
                        {isMobileView ? "Select a Concept" : "Select a Concept"}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {isMobileView
                          ? "Tap on a concept from the list to view its content"
                          : "Choose a concept from the list to view its detailed content here."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs remain the same... */}
        </div>
      </div>
    </>
  );
};

export default Profile;
