import { useEffect, useRef, useState } from "react";
import { Search, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionTimer = useRef<ReturnType<typeof setTimeout>>();
  const suggestions = [
    "Previous year papers",
    "Department quick notes",
    "Download-ready lab manuals",
  ];
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      event.preventDefault();
      searchRef.current?.focus();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const handleSuggestionClick = (value: string) => {
    setSearchValue(value);
    setShowSuggestions(false);
    searchRef.current?.focus();
  };
  
  return (
    <header className="sticky top-0 z-[60] w-full border-b-[3px] border-navy/15 bg-background/95 shadow-[0_6px_0_rgba(10,34,48,0.12)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-20 sm:h-24 md:h-28 items-center justify-between gap-4 px-4 sm:px-6">
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
        <div className="hidden lg:flex flex-1 mx-6" role="search" aria-label="Primary site search">
          <div className="relative w-full max-w-2xl">
            <div className="group relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Input
                ref={searchRef}
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onFocus={() => {
                  if (suggestionTimer.current) clearTimeout(suggestionTimer.current);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  suggestionTimer.current = setTimeout(() => setShowSuggestions(false), 120);
                }}
                aria-label="Search resources"
                placeholder="Search resources, subjects, or departments..."
                className="pl-12 pr-12 bg-white placeholder:text-xs focus:border-navy"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-full border-[3px] border-navy/40 px-3 py-0.5 text-xs font-semibold text-muted-foreground"
              >
                /
              </span>
            </div>
            {showSuggestions && (
              <div
                role="listbox"
                aria-label="Suggested searches"
                className="absolute left-0 right-0 mt-3 rounded-[16px] border-[3px] border-navy bg-white p-3 shadow-hand animate-[suggestion-fade_0.2s_ease-out]"
              >
                <p className="px-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Suggestions
                </p>
                <ul className="mt-2 space-y-1">
                  {suggestions.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={searchValue === item}
                        className="flex w-full items-center justify-between rounded-[12px] px-3 py-2 text-left text-sm font-semibold text-navy hover:bg-primary/10 focus-visible:outline-none"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSuggestionClick(item)}
                      >
                        {item}
                        <span className="text-xs text-muted-foreground">Enter</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/browse">
            <Button 
              variant={isActive("/browse") ? "default" : "ghost"}
              size="sm"
            >
              Browse
            </Button>
          </Link>
          <Link to="/about">
            <Button 
              variant={isActive("/about") ? "default" : "ghost"}
              size="sm"
            >
              About
            </Button>
          </Link>
          <Link to="/admin">
            <Button 
              variant={isActive("/admin") ? "default" : "outline"}
              size="sm"
            >
              Admin
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]" aria-label="Mobile navigation drawer">
            <div className="flex flex-col gap-4 mt-8">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  aria-label="Search resources on mobile"
                  className="pl-11"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2">
                <Link to="/browse" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={isActive("/browse") ? "default" : "outline"} className="w-full justify-start">
                    Browse
                  </Button>
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={isActive("/about") ? "default" : "outline"} className="w-full justify-start">
                    About
                  </Button>
                </Link>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant={isActive("/admin") ? "default" : "outline"}
                    className="w-full justify-start"
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
