import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Users, Upload, BookOpen, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 hand-heading text-navy font-display px-4">
              ABOUT EDUVERZA
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              A student-friendly platform for sharing and discovering educational resources.
              Hand-crafted with care, designed with students in mind.
            </p>
          </div>

          <Card className="p-6 sm:p-8 mb-6 sm:mb-8 sketchy-border paper-texture">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 font-display text-navy">OUR MISSION</h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed">
              EduVerza was born from a simple idea: educational resources should be easily 
              accessible to all students. We believe in collaborative learning and the power 
              of sharing knowledge. Our platform provides a centralized, organized, and 
              friendly space where students can find notes, previous papers, lab records, 
              and more — all in one place.
            </p>
          </Card>

          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center hand-heading text-navy font-display px-4">
            WHAT MAKES US SPECIAL
          </h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="p-6 sm:p-8 sketchy-border hover:rotate-[-0.5deg] transition-transform paper-texture">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-primary/20 flex items-center justify-center sketchy-border mb-3 sm:mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">STUDENT-CENTERED</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Built by students, for students. We understand what you need and designed 
                the platform to be intuitive and easy to navigate.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 sketchy-border hover:rotate-[0.5deg] transition-transform paper-texture">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-primary/20 flex items-center justify-center sketchy-border mb-3 sm:mb-4">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">EASY UPLOAD</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Admins can quickly upload new resources with proper metadata, making it 
                easy for others to find exactly what they need.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 sketchy-border hover:rotate-[-0.5deg] transition-transform paper-texture">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-primary/20 flex items-center justify-center sketchy-border mb-3 sm:mb-4">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">ORGANIZED LIBRARY</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Resources are systematically categorized by department, year, and subject. 
                Find what you need in seconds, not hours.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 sketchy-border hover:rotate-[0.5deg] transition-transform paper-texture">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-primary/20 flex items-center justify-center sketchy-border mb-3 sm:mb-4">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">COMMUNITY DRIVEN</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                A platform by the community, for the community. Every resource shared 
                helps countless students in their academic journey.
              </p>
            </Card>
          </div>

          <Card className="p-6 sm:p-8 sketchy-border sketchy-shadow bg-primary/10 paper-texture">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center font-display text-navy">
              JOIN THE COMMUNITY
            </h2>
            <p className="text-center text-sm sm:text-base md:text-lg text-foreground/80">
              Whether you're looking for study materials or contributing your own resources, 
              EduVerza is here to support your academic success. Together, we make learning 
              more accessible for everyone.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
