import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Download, Share2, Flag, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { useResource } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type ResourceMetric = "views" | "downloads";

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { resource, loading, error } = useResource(id || "");
  const [isBursting, setIsBursting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const trackedViewIdRef = useRef<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const incrementMetric = useCallback(
    async (metric: ResourceMetric) => {
      if (!resource) return;

      const currentValue = resource[metric] || 0;
      const { error: updateError } = await supabase
        .from("resources")
        .update({ [metric]: currentValue + 1 })
        .eq("id", resource.id);

      if (updateError) {
        console.error(`Failed to increment ${metric} for resource ${resource.id}`, updateError);
      }
    },
    [resource]
  );

  useEffect(() => {
    if (!resource?.id) return;
    if (trackedViewIdRef.current === resource.id) return;

    trackedViewIdRef.current = resource.id;
    incrementMetric("views");
  }, [resource?.id, incrementMetric]);

  // Debug: Log preview URL
  useEffect(() => {
    if (resource?.fileUrl) {
      const lowerFileUrl = resource.fileUrl?.toLowerCase() || "";
      const filePath = (() => {
        if (!resource?.fileUrl) return "";
        try {
          const parsed = new URL(resource.fileUrl);
          return parsed.pathname.toLowerCase();
        } catch (error) {
          return lowerFileUrl.split(/[?#]/)[0];
        }
      })();
      const isPdfFile = filePath.endsWith(".pdf");
      const previewUrl = resource.fileUrl ? (isPdfFile ? `${resource.fileUrl}#toolbar=0&navpanes=0&scrollbar=0` : resource.fileUrl) : "";
      
      if (previewUrl) {
        console.log('Preview URL:', previewUrl);
        console.log('Is PDF:', isPdfFile);
        console.log('Resource file URL:', resource.fileUrl);
      }
    }
  }, [resource?.fileUrl]);

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

  const handleDownload = async () => {
    if (!resource?.fileUrl) {
      toast.error("Download link not available yet.");
      return;
    }

    setIsBursting(true);
    setTimeout(() => setIsBursting(false), 420);

    const newWindow = window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      window.location.href = resource.fileUrl;
    }

    toast.success("Download started!");
    await incrementMetric("downloads");
  };

  const handleShare = () => {
    toast.success("Link copied to clipboard!");
  };

  const hasPreview = !!resource.fileUrl;
  const lowerFileUrl = resource.fileUrl?.toLowerCase() || "";
  const filePath = (() => {
    if (!resource?.fileUrl) return "";
    try {
      const parsed = new URL(resource.fileUrl);
      return parsed.pathname.toLowerCase();
    } catch (error) {
      return lowerFileUrl.split(/[?#]/)[0];
    }
  })();
  const isPdfFile = filePath.endsWith(".pdf");
  const previewUrl = resource.fileUrl ? (isPdfFile ? `${resource.fileUrl}#toolbar=0&navpanes=0&scrollbar=0` : resource.fileUrl) : "";

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
            <Card className="p-0 mb-4 sm:mb-6 bg-white paper-texture overflow-hidden border-[3px] border-navy/40">
              {hasPreview ? (
                <>
                  <div className="relative w-full bg-muted border-b border-dashed border-navy/30" style={{ minHeight: isMobile ? '400px' : '420px', height: isMobile ? '400px' : '520px' }}>
                    {isPdfFile ? (
                      <>
                        <iframe
                          key={`iframe-${previewUrl}`}
                          ref={iframeRef}
                          src={previewUrl}
                          title={`${resource.title} preview`}
                          className="w-full"
                          style={{ 
                            minHeight: isMobile ? '400px' : '420px',
                            height: isMobile ? '400px' : '520px',
                            display: 'block',
                            border: 'none'
                          }}
                          loading="lazy"
                          allow="fullscreen"
                        />
                        <div 
                          className="absolute top-2 right-2 z-10"
                        >
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleDownload}
                            className="bg-white/90 hover:bg-white shadow-md"
                          >
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Open
                          </Button>
                        </div>
                        {isMobile && (
                          <div 
                            className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload();
                            }}
                          >
                            <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-xs text-center pointer-events-auto cursor-pointer">
                              Tap here to open PDF in new tab for better viewing
                            </div>
                          </div>
                        )}
                        {/* Fallback message if iframe doesn't load */}
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/95 z-0" style={{ display: 'none' }} id="preview-fallback">
                          <div className="text-center px-6">
                            <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
                            <p className="text-lg font-semibold mb-2">Preview unavailable</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Unable to load preview. Please use the download button to view the file.
                            </p>
                            <Button onClick={handleDownload} size="lg">
                              <Download className="h-5 w-5 mr-2" />
                              Open File
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: isMobile ? '400px' : '420px', height: isMobile ? '400px' : '520px' }}>
                        <FileText className="h-16 w-16 text-primary mb-4" />
                        <p className="text-lg font-semibold mb-2">Preview not supported</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          This file type can&apos;t be previewed in the browser. Use the download button to open it.
                        </p>
                        <Button onClick={handleDownload} size="lg">
                          <Download className="h-5 w-5 mr-2" />
                          Open File
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="px-4 sm:px-6 py-3 bg-muted/50 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                      {isMobile ? "For better viewing on mobile, use the download button." : "Having trouble viewing the file? Use the download button to open it in a new tab."}
                    </p>
                    <Button size="sm" variant="outline" onClick={handleDownload}>
                      <Download className="h-3.5 w-3.5 mr-2" />
                      {isMobile ? "Open in Tab" : "Download"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12 md:py-16 border-[3px] border-dashed border-navy/40 rounded-[12px] m-4">
                  <FileText className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-primary mx-auto mb-3 sm:mb-4" />
                  <p className="text-lg sm:text-xl font-semibold mb-2">Preview coming soon</p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Upload a file URL in Supabase to enable the live document preview.
                  </p>
                </div>
              )}
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button 
                className="flex-1 download-pulse text-sm sm:text-base"
                data-burst={isBursting}
                onClick={handleDownload}
                aria-label={`Download ${resource.title}`}
                disabled={!resource.fileUrl}
                title={resource.fileUrl ? undefined : "Download link coming soon"}
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
