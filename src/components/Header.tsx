import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-navy bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-20 sm:h-24 md:h-28 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
          <img 
            src="/eduverza-logo.png" 
            alt="EduVerza" 
            className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain"
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

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search resources, subjects, or departments..."
              className="pl-10 sketchy-border bg-card"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/browse">
            <Button 
              variant={isActive("/browse") ? "default" : "ghost"}
              className={isActive("/browse") ? "sketchy-shadow" : ""}
              size="sm"
            >
              Browse
            </Button>
          </Link>
          <Link to="/about">
            <Button 
              variant={isActive("/about") ? "default" : "ghost"}
              className={isActive("/about") ? "sketchy-shadow" : ""}
              size="sm"
            >
              About
            </Button>
          </Link>
          <Link to="/admin">
            <Button 
              variant={isActive("/admin") ? "default" : "outline"}
              className="sketchy-border sketchy-shadow"
              size="sm"
            >
              Admin
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-4 mt-8">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10 sketchy-border bg-card"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2">
                <Link to="/browse" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant={isActive("/browse") ? "default" : "outline"}
                    className={`w-full justify-start ${isActive("/browse") ? "sketchy-shadow" : "sketchy-border"}`}
                  >
                    Browse
                  </Button>
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant={isActive("/about") ? "default" : "outline"}
                    className={`w-full justify-start ${isActive("/about") ? "sketchy-shadow" : "sketchy-border"}`}
                  >
                    About
                  </Button>
                </Link>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant={isActive("/admin") ? "default" : "outline"}
                    className={`w-full justify-start sketchy-border ${isActive("/admin") ? "sketchy-shadow" : ""}`}
                  >
                    Admin
                  </Button>
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
