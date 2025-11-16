"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  FileText,
  Star,
  Bell,
  LogOut,
  User,
  ChevronRight,
  Home,
  MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import IcoLogo from "@/assets/icons/ico-logo";
import { useGetMe } from "@/hooks/useGetMe";
import { logout } from "@/api/auth/logout";
import { toast } from "sonner";

// Types
interface SubNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  subItems?: SubNavItem[];
}

// Navigation configuration
const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="w-4 h-4" />,
  },
  {
    title: "Content",
    icon: <FileText className="w-4 h-4" />,
    subItems: [
      {
        title: "Hero Sliders",
        href: "/sliders",
        description: "Manage banner sliders",
      },
      {
        title: "Categories",
        href: "/categories",
        description: "Service categories",
      },
      {
        title: "Services",
        href: "/services",
        description: "Service listings",
      },
      {
        title: "Testimonials",
        href: "/testimonials",
        description: "Customer reviews",
      },
      {
        title: "Galleries",
        href: "/galleries",
        description: "Gallery images",
      },
    ],
  },
  {
    title: "Inquiries",
    icon: <MessagesSquare className="w-4 h-4" />,
    subItems: [
      {
        title: "Contact Submissions",
        href: "/contact-us",
        description: "Customer inquiries",
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [notificationCount] = useState(3); // Mock notification count

  // Fetch user data
  const { user } = useGetMe();

  // Handle logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center space-x-3 transition-opacity hover:opacity-80"
          >
            <div className="relative">
              <IcoLogo className="h-12 w-auto" />
            </div>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navigationItems.map((item) => (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.title)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.subItems ? (
                <DropdownMenu
                  open={openDropdown === item.title}
                  onOpenChange={(open) =>
                    setOpenDropdown(open ? item.title : null)
                  }
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        pathname.startsWith(
                          item.href || item.subItems![0].href.split("/")[1]
                        )
                          ? "secondary"
                          : "ghost"
                      }
                      className="gap-2 px-4 py-2.5 text-sm font-medium"
                    >
                      {item.icon && (
                        <span className="h-4 w-4">{item.icon}</span>
                      )}
                      {item.title}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openDropdown === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="w-64 p-2"
                  >
                    {item.subItems.map((subItem, index) => (
                      <DropdownMenuItem
                        key={subItem.title}
                        asChild
                        className={cn(
                          "gap-2 cursor-pointer",
                          index === 0 && "rounded-t-md",
                          index === item.subItems!.length - 1 && "rounded-b-md"
                        )}
                      >
                        <Link href={subItem.href}>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium">{subItem.title}</div>
                            {subItem.description && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {subItem.description}
                              </div>
                            )}
                          </div>
                          {subItem.title === "Testimonials" && (
                            <Star className="h-4 w-4 text-primary fill-primary" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href={item.href!}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="gap-2 px-4 py-2.5 text-sm font-medium"
                  >
                    {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                    {item.title}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-4 py-2">
                <h4 className="font-semibold">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  You have {notificationCount} new messages
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex-1">
                  <div className="text-sm font-medium">New contact inquiry</div>
                  <div className="text-xs text-muted-foreground">
                    John Doe requested a quote
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">2m ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex-1">
                  <div className="text-sm font-medium">System update</div>
                  <div className="text-xs text-muted-foreground">
                    Dashboard analytics are ready
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">1h ago</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/notifications">
                  <span>View all notifications</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.profileUrl || "/avatars/user.jpg"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {user?.name ? (
                      user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-4 py-2">
                <div className="font-semibold">
                  {user?.name || "Loading..."}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {user?.email || "..."}
                </div>
                {user?.role && (
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {user.role === "superadmin"
                        ? "Super Admin"
                        : user.role === "admin"
                          ? "Admin"
                          : "User"}
                    </Badge>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="container px-4 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.title)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all",
                          openDropdown === item.title &&
                            "bg-accent text-accent-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <span className="h-4 w-4">{item.icon}</span>
                          )}
                          {item.title}
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openDropdown === item.title ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openDropdown === item.title && (
                        <div className="pl-4 pr-2 space-y-1 mt-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              onClick={closeMobileMenu}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-all",
                                pathname === subItem.href &&
                                  "bg-accent text-accent-foreground"
                              )}
                            >
                              {subItem.title === "Testimonials" && (
                                <Star className="h-4 w-4 text-primary fill-primary" />
                              )}
                              <div className="flex-1">
                                <div className="font-medium">
                                  {subItem.title}
                                </div>
                                {subItem.description && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {subItem.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-all",
                        pathname === item.href &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.icon && (
                        <span className="h-4 w-4">{item.icon}</span>
                      )}
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 space-y-3">
              <div className="px-4 py-2 border-b border-border/40">
                <div className="font-semibold text-sm">
                  {user?.name || "Loading..."}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.email || "..."}
                </div>
                {user?.role && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {user.role === "superadmin"
                      ? "Super Admin"
                      : user.role === "admin"
                        ? "Admin"
                        : "User"}
                  </Badge>
                )}
              </div>
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-base hover:bg-accent hover:text-accent-foreground transition-all"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/notifications"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-base hover:bg-accent hover:text-accent-foreground transition-all"
              >
                <div className="relative">
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </div>
                <span>Notifications</span>
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-destructive hover:bg-accent transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
