import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Grid3x3, List, Loader2 } from "lucide-react";
import { departments, years, resourceTypes } from "@/data/mockResources";
import { useResources } from "@/hooks/useSupabase";

const Browse = () => {
  const { resources, loading, error } = useResources();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesDept = selectedDept === "All" || resource.department === selectedDept;
      const matchesYear = selectedYear === "All Years" || `Year ${resource.year}` === selectedYear;
      const matchesType = selectedType === "All" || resource.type === selectedType;
      const matchesSearch = searchQuery === "" || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDept && matchesYear && matchesType && matchesSearch;
    });
  }, [resources, selectedDept, selectedYear, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 hand-heading text-navy font-display">
            EXPLORE RESOURCES
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our collection of educational materials
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, subject, or description..."
              className="pl-10 sketchy-border bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-navy font-display">DEPARTMENT</span>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="w-[180px] sketchy-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-navy font-display">YEAR</span>
              <div className="flex gap-2">
                {years.map((year) => (
                  <Badge
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className={`cursor-pointer ${selectedYear === year ? "sketchy-border bg-primary" : "border-2 border-navy"}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-navy font-display">TYPE</span>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px] sketchy-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "sketchy-shadow" : "sketchy-border"}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "sketchy-shadow" : "sketchy-border"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading resources...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-xl text-destructive mb-4">Error loading resources</p>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="mb-6">
              <p className="text-lg font-semibold text-navy">
                Found <span className="text-primary">{filteredResources.length}</span> resources
              </p>
            </div>

            {/* Resource Grid */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">No resources found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
