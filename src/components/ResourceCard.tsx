import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";

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
}

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  const [bursting, setBursting] = useState(false);

  const handleDownloadPulse = () => {
    setBursting(true);
    setTimeout(() => setBursting(false), 420);
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
            
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                {resource.views} views
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                {resource.downloads} downloads
              </span>
            </div>
            
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
                onClick={handleDownloadPulse}
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
