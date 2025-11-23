import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useStats } from "@/hooks/useSupabase";

const Home = () => {
  const { stats, loading, error } = useStats();

  // Format numbers with commas and "+" sign
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US') + '+';
  };

  // Calculate time-based increase (starts increasing after 1 month)
  // Base date: 1 month ago from now
  const getTimeBasedIncrease = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - oneMonthAgo.getTime()) / (1000 * 60 * 60 * 24));
    
    // After 1 month (30 days), start increasing
    if (daysSince > 30) {
      const extraDays = daysSince - 30;
      // Increase by ~2-3 per day after the first month
      return Math.floor(extraDays * 2.5);
    }
    return 0;
  };

  const timeIncrease = getTimeBasedIncrease();

  // Debug: Log stats in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Home stats:', { stats, loading, error });
    }
  }, [stats, loading, error]);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <h1 className="sr-only">EduVerza — College resources crafted with care</h1>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 relative overflow-hidden">
        {/* Background Doodle Image */}
        <div className="absolute inset-0 z-0 opacity-20 md:opacity-30">
          <img 
            src="/doodles.png" 
            alt="Decorative doodles" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Try alternative formats
              const target = e.target as HTMLImageElement;
              const currentSrc = target.src;
              if (currentSrc.includes('.png')) {
                target.src = '/doodles.webp';
              } else if (currentSrc.includes('.webp')) {
                target.src = '/doodles.jpg';
              }
            }}
          />
        </div>
        
        {/* Decorative Doodles - keeping small CSS doodles */}
        <div className="doodle-decoration top-10 left-10 hidden md:block z-10">
          <div className="doodle-circle"></div>
        </div>
        <div className="doodle-decoration top-20 right-10 hidden md:block z-10">
          <div className="doodle-arrow"></div>
        </div>
        <div className="doodle-decoration bottom-20 left-20 hidden lg:block z-10">
          <div className="doodle-squiggle"></div>
        </div>
        <div className="doodle-decoration top-1/2 right-20 hidden lg:block z-10">
          <div className="doodle-dot"></div>
        </div>
        <div className="doodle-decoration bottom-10 right-1/4 hidden md:block z-10">
          <div className="doodle-check"></div>
        </div>
        
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border-[3px] border-navy bg-primary/10 sketchy-shadow">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-navy font-display">Hand-sketched for Students</span>
          </div>
          
          <div
            aria-hidden="true"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 sm:mb-6 leading-tight px-2"
          >
            <span className="eduverza-text-simple" data-text="COLLEGE RESOURCES,">
            COLLEGE RESOURCES,
            </span>
            <br />
            <span className="eduverza-text-simple" data-text="CRAFTED WITH CARE">
            CRAFTED WITH CARE
            </span>
          </div>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Browse, download, and share educational materials from your college. 
            Notes, papers, records — all in one friendly place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link to="/browse" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto border-transparent bg-[hsl(var(--paint-1))] text-navy hover:bg-[hsl(var(--paint-2))] font-bold font-display"
              >
                BROWSE RESOURCES
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg font-bold font-display bg-transparent"
              >
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Decorative Doodles */}
        <div className="doodle-decoration top-5 left-5 hidden md:block">
          <div className="doodle-check"></div>
        </div>
        <div className="doodle-decoration top-10 right-5 hidden md:block">
          <div className="doodle-arrow"></div>
        </div>
        <div className="doodle-decoration bottom-5 left-1/4 hidden lg:block">
          <div className="doodle-circle"></div>
        </div>
        <div className="doodle-decoration bottom-10 right-1/4 hidden lg:block">
          <div className="doodle-dot"></div>
        </div>
        <div className="doodle-decoration top-1/3 right-10 hidden lg:block">
          <div className="doodle-squiggle"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
          <Card className="p-6 sm:p-8 text-center bg-card hover:rotate-[-1deg] transition-transform paper-texture relative overflow-visible">
            <div className="doodle-decoration -top-2 -right-2">
              <div className="doodle-circle"></div>
            </div>
            <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
            <div className="text-3xl sm:text-4xl font-bold mb-2 font-display text-navy">
              {loading ? '...' : formatNumber(stats.totalResources)}
            </div>
            <div className="text-sm sm:text-base text-muted-foreground font-medium">Resources</div>
          </Card>
          
          <Card className="p-6 sm:p-8 text-center bg-card hover:rotate-[1deg] transition-transform paper-texture relative overflow-visible">
            <div className="doodle-decoration -top-2 -left-2">
              <div className="doodle-dot"></div>
            </div>
            <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
            <div className="text-3xl sm:text-4xl font-bold mb-2 font-display text-navy">
              {loading ? '...' : formatNumber(Math.max(stats.totalDownloads, 45) + timeIncrease)}
            </div>
            <div className="text-sm sm:text-base text-muted-foreground font-medium">Downloads</div>
          </Card>
          
          <Card className="p-6 sm:p-8 text-center bg-card hover:rotate-[-1deg] transition-transform paper-texture relative overflow-visible">
            <div className="doodle-decoration -bottom-2 -right-2">
              <div className="doodle-check"></div>
            </div>
            <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
            <div className="text-3xl sm:text-4xl font-bold mb-2 font-display text-navy">
              {loading ? '...' : formatNumber(Math.max(stats.activeStudents, 23) + Math.floor(timeIncrease * 0.4))}
            </div>
            <div className="text-sm sm:text-base text-muted-foreground font-medium">Active Students</div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
        {/* Decorative Doodles */}
        <div className="doodle-decoration top-0 left-10 hidden lg:block">
          <div className="doodle-arrow"></div>
        </div>
        <div className="doodle-decoration top-20 right-10 hidden lg:block">
          <div className="doodle-squiggle"></div>
        </div>
        <div className="doodle-decoration bottom-20 left-1/3 hidden xl:block">
          <div className="doodle-circle"></div>
        </div>
        <div className="doodle-decoration top-1/2 right-1/4 hidden xl:block">
          <div className="doodle-dot"></div>
        </div>
        <div className="doodle-decoration bottom-10 right-20 hidden lg:block">
          <div className="doodle-check"></div>
        </div>
        <div className="doodle-decoration top-1/3 left-1/4 hidden xl:block">
          <div className="doodle-line" style={{ width: '40px', transform: 'rotate(45deg)' }}></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 hand-heading text-navy font-display px-4">
              WHY EDUVERZA?
            </h2>
            <p className="text-muted-foreground mb-8 sm:mb-12 text-base sm:text-lg px-4">
              Built by students, for students
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <Card className="p-6 sm:p-8 bg-card paper-texture">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-primary/20 flex items-center justify-center sketchy-border mb-3 sm:mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">Student-Centered</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Built by students, for students. We understand what you need and designed 
                the platform to be intuitive and easy to navigate.
              </p>
            </Card>
            
            <Card className="p-6 sm:p-8 bg-card paper-texture">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-primary/20 flex items-center justify-center sketchy-border mb-3 sm:mb-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">Easy Upload</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Admins can quickly upload new resources with proper metadata, making it 
                easy for others to find exactly what they need.
              </p>
            </Card>
            
            <Card className="p-6 sm:p-8 bg-card paper-texture">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-primary/20 flex items-center justify-center sketchy-border mb-3 sm:mb-4">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">Organized Library</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Resources are systematically organized by department, year, and subject. 
                Find what you need in seconds, not hours.
              </p>
            </Card>
            
            <Card className="p-6 sm:p-8 bg-card paper-texture">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-primary/20 flex items-center justify-center sketchy-border mb-3 sm:mb-4">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">Always Growing</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                New resources are added regularly. From lecture notes to previous papers, 
                our library keeps expanding to serve you better.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 relative">
        {/* Decorative Doodles */}
        <div className="doodle-decoration top-5 left-1/4 hidden md:block">
          <div className="doodle-squiggle"></div>
        </div>
        <div className="doodle-decoration top-10 right-1/4 hidden md:block">
          <div className="doodle-check"></div>
        </div>
        <div className="doodle-decoration bottom-5 left-10 hidden lg:block">
          <div className="doodle-arrow"></div>
        </div>
        <div className="doodle-decoration bottom-10 right-10 hidden lg:block">
          <div className="doodle-circle"></div>
        </div>
        <div className="doodle-decoration top-1/2 left-1/3 hidden lg:block">
          <div className="doodle-dot"></div>
        </div>
        <div className="doodle-decoration bottom-1/4 right-1/3 hidden lg:block">
          <div className="doodle-line" style={{ width: '50px', transform: 'rotate(-30deg)' }}></div>
        </div>
        
        <Card className="p-12 text-center bg-primary/10 max-w-3xl mx-auto paper-texture relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 hand-heading text-navy font-display">
            READY TO GET STARTED?
          </h2>
          <p className="text-lg text-foreground/80 mb-6">
            Join hundreds of students accessing quality educational resources
          </p>
          <Link to="/browse">
            <Button size="default" className="text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4 border-transparent bg-[hsl(var(--paint-1))] text-navy w-full sm:w-auto font-bold font-display">
              EXPLORE RESOURCES NOW
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};

export default Home;
