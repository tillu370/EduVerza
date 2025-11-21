import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export interface Resource {
  id: string;
  title: string;
  subject: string;
  department: string;
  year: number;
  sem: number;
  type: string;
  views: number;
  downloads: number;
  fileSize?: string;
  description?: string;
  fileUrl?: string;
}

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  const [bursting, setBursting] = useState(false);

  const handleDownload = async () => {
    setBursting(true);
    setTimeout(() => setBursting(false), 420);

    if (!resource.fileUrl) {
      toast.error("Download link not available yet.");
      return;
    }

    const newWindow = window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      window.location.href = resource.fileUrl;
    }

    const { error } = await supabase
      .from("resources")
      .update({ downloads: (resource.downloads || 0) + 1 })
      .eq("id", resource.id);

    if (error) {
      console.error("Failed to increment downloads", error);
    }
  };

  return (
    <Card className="overflow-hidden hover:-translate-y-1 hover:rotate-[-0.5deg] transition-all duration-200 hover:shadow-hand-lg bg-card">
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-[12px] border-[3px] border-navy bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <Link to={`/resource/${resource.id}`}>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 hover:text-primary transition-colors line-clamp-2 font-display">
                {resource.title}
              </h3>
            </Link>
            
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-1">
              {resource.subject} • {resource.department}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              <Badge variant="active" aria-label={`Year ${resource.year}`}>
                Year {resource.year}
              </Badge>
              <Badge variant="default" aria-label={`Semester ${resource.sem}`}>
                Sem {resource.sem}
              </Badge>
              <Badge variant="outline" aria-label={`Resource type ${resource.type}`}>
                {resource.type}
              </Badge>
            </div>
            
            <div className="mb-3 sm:mb-4" />
            
            <div className="mt-4 border-t border-dashed border-navy/30 pt-4 flex flex-col sm:flex-row gap-2">
              <Link to={`/resource/${resource.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  aria-label={`Preview ${resource.title}`}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </Link>
              <Button
                className="flex-1 justify-center download-pulse"
                data-burst={bursting}
                aria-label={`Download ${resource.title}`}
                onClick={handleDownload}
                disabled={!resource.fileUrl}
                title={resource.fileUrl ? undefined : "Download link coming soon"}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
