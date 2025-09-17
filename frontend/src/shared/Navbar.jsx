// src/components/Navbar.jsx
import React, { useState } from "react";
import theme from "@/components/theme";
import {
  BookOpen,
  Code2,
  Brain,
  BarChart3,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Badge,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import AIMentor from "@/components/AIMentor";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const menuItems = [
    {
      title: "Concept Mastery",
      icon: <BookOpen />,
      href: "#",
    },
    {
      title: "CodeQuest",
      icon: <Code2 />,
      href: "#",
    },
    {
      title: "Quiz Challenge",
      icon: <Brain />,
      href: "#",
    },
    {
      title: "Progress Hub",
      icon: <BarChart3 />,
      href: "#",
    },
  ];

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: theme.colors.background,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="rounded-full p-2 mr-3"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span
                className="text-xl font-bold cursor-pointer"
                style={{ color: theme.colors.text }}
                onClick={() => navigate("/")}
              >
                DSA Tutor
              </span>
            </div>

            {/* Desktop Navigation - Simple Links */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="space-x-1">
                  {menuItems.map((item, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        href={item.href}
                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center hover:bg-gray-800"
                        style={{
                          color: theme.colors.text,
                        }}
                      >
                        {React.cloneElement(item.icon, {
                          className: "h-5 w-5",
                          style: { color: theme.colors.primary },
                        })}
                        <span className="ml-2">{item.title}</span>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right side: Auth */}
            <div className="flex items-center">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full ml-2"
                    >
                      <Avatar
                        className="h-10 w-10"
                        style={{ border: `2px solid ${theme.colors.primary}` }}
                      >
                        <AvatarImage src="/avatars/user.jpg" alt="User" />
                        <AvatarFallback
                          style={{
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.text,
                          }}
                        >
                          JS
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 border-0 shadow-lg"
                    style={{
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    }}
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          John Smith
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--code-comment)" }}
                        >
                          john.smith@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    style={{ color: theme.colors.text }}
                    className="hover:opacity-80 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </Button>
                  <Button
                    className="text-white cursor-pointer"
                    style={{ backgroundColor: theme.colors.primary }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" style={{ color: theme.colors.text }} />
                ) : (
                  <Menu
                    className="h-6 w-6"
                    style={{ color: theme.colors.text }}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden pb-3"
            style={{ backgroundColor: theme.colors.background }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium"
                  style={{ color: theme.colors.text }}
                >
                  {React.cloneElement(item.icon, {
                    className: "h-5 w-5",
                    style: { color: theme.colors.primary },
                  })}
                  <span className="ml-3">{item.title}</span>
                </a>
              ))}

              {!isLoggedIn && (
                <div className="px-3 pt-2 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    style={{
                      color: theme.colors.text,
                      borderColor: theme.colors.primary,
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Log in
                  </Button>
                  <Button
                    className="w-full text-white"
                    style={{ backgroundColor: theme.colors.primary }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <AIMentor />
    </>
  );
};

export default Navbar;
