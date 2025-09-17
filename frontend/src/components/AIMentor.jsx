// src/components/AIMentorChat.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { applyTheme } from "@/components/theme";

const AIMentor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your AI Mentor. I can help you with DSA concepts, code explanations, and learning guidance. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    applyTheme();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I help you with your DSA learning today?";
    } else if (lowerMessage.includes("binary search")) {
      return "Binary search is an efficient algorithm for finding an item from a sorted list. It works by halving the search space each time. Time complexity: O(log n).";
    } else if (lowerMessage.includes("linked list")) {
      return "A linked list is a linear data structure where each node contains data and a reference to the next node. Efficient for insertions/removals.";
    } else if (lowerMessage.includes("time complexity")) {
      return "Time complexity describes how the runtime of an algorithm scales with input size. Common examples: O(1), O(log n), O(n), O(n log n), O(n²).";
    } else if (lowerMessage.includes("thank")) {
      return "You're welcome! Anything else you'd like to know?";
    } else {
      return "That's a great question! Could you be more specific about which DSA topic you'd like to explore?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="rounded-full h-14 w-14 shadow-lg cursor-pointer"
          style={{ backgroundColor: "var(--color-primary)", color: "white" }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96">
      <Card
        className="shadow-xl border-0"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <CardHeader className="p-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/ai-mentor.jpg" alt="AI Mentor" />
                <AvatarFallback
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">AI Mentor</h3>
                <p className="text-xs text-gray-400">Online • 24/7 Support</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                style={{ color: "var(--color-text)" }}
                onClick={toggleMinimize}
              >
                {isMinimized ? (
                  <Maximize2 className="h-3 w-3" />
                ) : (
                  <Minimize2 className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                }}
                onClick={toggleChat}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3`}
                    style={{
                      backgroundColor:
                        message.sender === "user"
                          ? "var(--color-primary)"
                          : "var(--color-bg)",
                      color: "var(--color-text)",
                    }}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything about DSA..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-gray-700"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === ""}
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIMentor;
