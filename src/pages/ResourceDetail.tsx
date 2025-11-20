import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Download, Share2, Flag, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { useResource } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { useState } from "react";

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { resource, loading, error } = useResource(id || "");
  const [isBursting, setIsBursting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-black mb-4">Resource Not Found</h1>
          <p className="text-muted-foreground mb-4">{error?.message || "The resource you're looking for doesn't exist."}</p>
          <Link to="/browse">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    setIsBursting(true);
    setTimeout(() => setIsBursting(false), 420);
    toast.success("Download started!");
  };

  const handleShare = () => {
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link to="/browse" aria-label="Back to browse resources">
          <Button variant="outline" className="mb-4 sm:mb-6 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 hand-heading text-navy font-display">
                {resource.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="active" aria-label={`Year ${resource.year}`}>
                  Year {resource.year}
                </Badge>
                <Badge variant="default" aria-label={`Semester ${resource.sem}`}>
                  Sem {resource.sem}
                </Badge>
                <Badge variant="outline" aria-label={`Resource type ${resource.type}`}>
                  {resource.type}
                </Badge>
                <Badge variant="outline" aria-label={`Department ${resource.department}`}>
                  {resource.department}
                </Badge>
              </div>
            </div>

            {/* Preview Area */}
            <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 bg-white paper-texture">
              <div className="text-center py-8 sm:py-12 md:py-16 border-[3px] border-dashed border-navy/40 rounded-[12px]">
                <FileText className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-primary mx-auto mb-3 sm:mb-4" />
                <p className="text-lg sm:text-xl font-semibold mb-2">PDF Preview</p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Full preview would load here in production
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button 
                className="flex-1 download-pulse text-sm sm:text-base"
                data-burst={isBursting}
                onClick={handleDownload}
                aria-label={`Download ${resource.title}`}
              >
                <Download className="h-4 w-4 mr-2" />
                DOWNLOAD
              </Button>
              <Button 
                variant="outline" 
                className="text-sm sm:text-base"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="text-sm sm:text-base">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>

            {/* About Section */}
            <Card className="p-4 sm:p-6 paper-texture">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-display">ABOUT THIS RESOURCE</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {resource.description || "Detailed description of the resource would appear here."}
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 lg:sticky lg:top-24 paper-texture bg-white/95 border-navy/60">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-display text-navy">DETAILS</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Subject</p>
                  <p className="font-medium">{resource.subject}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Department</p>
                  <p className="font-medium">{resource.department}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Year</p>
                  <p className="font-medium">Year {resource.year}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Semester</p>
                  <p className="font-medium">Semester {resource.sem}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">File Type</p>
                  <p className="font-medium">{resource.type}</p>
                </div>
                
                {resource.fileSize && (
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">File Size</p>
                    <p className="font-medium">{resource.fileSize}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <span className="font-semibold">{resource.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Downloads</span>
                    <span className="font-semibold">{resource.downloads}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
