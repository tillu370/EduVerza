import { Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-navy bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-24 md:h-28 items-center justify-between px-6">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src="/eduverza-logo.png" 
            alt="EduVerza" 
            className="h-16 md:h-20 lg:h-24 w-auto object-contain"
            onError={(e) => {
              // Try alternative formats if PNG doesn't exist
              const target = e.target as HTMLImageElement;
              const currentSrc = target.src;
              if (currentSrc.includes('.png')) {
                target.src = '/eduverza-logo.jpg';
              } else if (currentSrc.includes('.jpg')) {
                target.src = '/eduverza-logo.svg';
              }
            }}
          />
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search resources, subjects, or departments..."
              className="pl-10 sketchy-border bg-card"
            />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link to="/browse">
            <Button 
              variant={isActive("/browse") ? "default" : "ghost"}
              className={isActive("/browse") ? "sketchy-shadow" : ""}
            >
              Browse
            </Button>
          </Link>
          <Link to="/about">
            <Button 
              variant={isActive("/about") ? "default" : "ghost"}
              className={isActive("/about") ? "sketchy-shadow" : ""}
            >
              About
            </Button>
          </Link>
          <Link to="/admin">
            <Button 
              variant={isActive("/admin") ? "default" : "outline"}
              className="sketchy-border sketchy-shadow"
            >
              Admin
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
