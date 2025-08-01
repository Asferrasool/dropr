import { Home, Search, Receipt, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/orders", icon: Receipt, label: "Orders", badge: 2 },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-4 py-2 z-30">
      <div className="flex items-center justify-around">
        {navItems.map(({ path, icon: Icon, label, badge }) => {
          const isActive = location === path;
          
          return (
            <Link key={path} href={path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 py-2 px-3 relative ${
                  isActive ? "text-purple-primary" : "text-gray-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{label}</span>
                {badge && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-accent rounded-full flex items-center justify-center">
                    <span className="text-purple-primary text-xs font-bold">{badge}</span>
                  </div>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
