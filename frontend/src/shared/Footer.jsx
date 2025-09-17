// src/components/Footer.jsx
import React from "react";
import {
  Code2,
  Github,
  Twitter,
  Linkedin,
  Mail,
  BookOpen,
  MessageCircle,
  Users,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer
      className="mt-auto"
      style={{
        backgroundColor: "var(--color-bg)",
        borderTop: "1px solid var(--color-border, #1f2937)", // fallback gray-800
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span
                className="text-xl font-bold"
                style={{ color: "var(--color-text)" }}
              >
                DSA Tutor
              </span>
            </div>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--color-muted, #9ca3af)" }}
            >
              Master Data Structures and Algorithms with our AI-powered learning
              platform. Get personalized guidance and accelerate your coding
              journey.
            </p>
            <div className="flex space-x-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    borderColor: "var(--color-border, #374151)",
                    color: "var(--color-text)",
                  }}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Features
            </h3>
            <ul className="space-y-2">
              {[
                { icon: BookOpen, text: "Concept Learning" },
                { icon: Code2, text: "Practice Problems" },
                { icon: MessageCircle, text: "AI Mentor" },
                { icon: Users, text: "Progress Tracking" },
              ].map(({ icon: Icon, text }, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-sm flex items-center transition-colors"
                    style={{ color: "var(--color-muted, #9ca3af)" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "var(--color-primary)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-muted, #9ca3af)")
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Resources
            </h3>
            <ul className="space-y-2">
              {["Documentation", "Tutorials", "Blog", "Community", "API"].map(
                (item, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-sm transition-colors"
                      style={{ color: "var(--color-muted, #9ca3af)" }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "var(--color-primary)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color =
                          "var(--color-muted, #9ca3af)")
                      }
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Support
            </h3>
            <ul className="space-y-2">
              {[
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
                "Status",
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: "var(--color-muted, #9ca3af)" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "var(--color-primary)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-muted, #9ca3af)")
                    }
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
          style={{ borderTop: "1px solid var(--color-border, #1f2937)" }}
        >
          <p
            className="text-sm flex items-center"
            style={{ color: "var(--color-muted, #9ca3af)" }}
          >
            Made with{" "}
            <Heart
              className="h-4 w-4 mx-1"
              style={{ color: "var(--color-primary)" }}
            />{" "}
            for developers worldwide
          </p>
          <p
            className="text-sm mt-2 md:mt-0"
            style={{ color: "var(--color-muted, #9ca3af)" }}
          >
            © {new Date().getFullYear()} DSA Tutor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
