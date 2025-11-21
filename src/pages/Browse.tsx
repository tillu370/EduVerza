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
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedYearNumber = useMemo(() => {
    if (selectedYear === "All Years") return null;
    const matched = selectedYear.match(/Year (\d)/);
    return matched ? parseInt(matched[1]) : null;
  }, [selectedYear]);

  const yearToSemesters: Record<number, number[]> = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };

  const availableSemesters = selectedYearNumber ? yearToSemesters[selectedYearNumber] ?? [] : [];

  const subjectOptions = useMemo(() => {
    if (!selectedYearNumber || !selectedSem) return [];
    const subjects = resources
      .filter((resource) => resource.year === selectedYearNumber && resource.sem === selectedSem)
      .map((resource) => resource.subject);
    return Array.from(new Set(subjects)).sort();
  }, [resources, selectedYearNumber, selectedSem]);

  const isSubjectEnabled = selectedYearNumber !== null && selectedSem !== null && subjectOptions.length > 0;

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setSelectedSem(null);
    setSelectedSubject("All Subjects");
  };

  const handleSemSelect = (sem: number) => {
    setSelectedSem(sem);
    setSelectedSubject("All Subjects");
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesDept = selectedDept === "All" || resource.department === selectedDept;
      const matchesYear = selectedYear === "All Years" || resource.year === selectedYearNumber;
      const matchesSem = selectedSem === null || resource.sem === selectedSem;
      const subjectFilterActive = isSubjectEnabled && selectedSubject !== "All Subjects";
      const matchesSubject = !subjectFilterActive || resource.subject === selectedSubject;
      const matchesType = selectedType === "All" || resource.type === selectedType;
      const matchesSearch = searchQuery === "" || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDept && matchesYear && matchesSem && matchesSubject && matchesType && matchesSearch;
    });
  }, [resources, selectedDept, selectedYear, selectedYearNumber, selectedSem, isSubjectEnabled, selectedSubject, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 hand-heading text-navy font-display">
            EXPLORE RESOURCES
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Explore our collection of educational materials
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, subject, or description..."
              aria-label="Search resources on browse page"
              className="pl-11 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4">
            {/* Filters Row 1 */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <span className="text-xs sm:text-sm font-semibold text-navy font-display whitespace-nowrap">DEPARTMENT</span>
                <Select value={selectedDept} onValueChange={setSelectedDept}>
                  <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by department">
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <span className="text-xs sm:text-sm font-semibold text-navy font-display whitespace-nowrap">TYPE</span>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by resource type">
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

              {selectedYearNumber !== null && selectedSem !== null && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm font-semibold text-navy font-display whitespace-nowrap">SUBJECT</span>
                  <Select
                    value={selectedSubject}
                    onValueChange={handleSubjectSelect}
                    disabled={!isSubjectEnabled}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Subjects">All Subjects</SelectItem>
                      {subjectOptions.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="ml-auto flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Year Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-navy font-display whitespace-nowrap">YEAR</span>
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    aria-pressed={selectedYear === year}
                    className="focus-visible:outline-none"
                  >
                    <Badge variant={selectedYear === year ? "active" : "outline"}>
                      {year}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {selectedYearNumber !== null && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-navy font-display whitespace-nowrap">SEMESTER</span>
                <div className="flex flex-wrap gap-2">
                  {availableSemesters.map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => handleSemSelect(sem)}
                      aria-pressed={selectedSem === sem}
                      className="focus-visible:outline-none"
                    >
                      <Badge variant={selectedSem === sem ? "active" : "outline"}>
                        Sem {sem}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
          <div className="text-center py-16 px-4">
            <div className="max-w-2xl mx-auto">
              <p className="text-xl sm:text-2xl font-bold text-destructive mb-4">Error loading resources</p>
              <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-4 sm:p-6 mb-4 text-left">
                <p className="text-sm sm:text-base text-foreground mb-2 font-semibold">Error Details:</p>
                <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">{error.message}</p>
              </div>
              <div className="bg-muted/50 border-2 border-muted rounded-lg p-4 sm:p-6 text-left">
                <p className="text-sm sm:text-base font-semibold mb-2">Troubleshooting Steps:</p>
                <ol className="text-sm sm:text-base text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Check if environment variables are set in Vercel (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)</li>
                  <li>Verify Supabase project is active and not paused</li>
                  <li>Check if 'resources' table exists in Supabase</li>
                  <li>Open browser console (F12) for more details</li>
                  <li>Redeploy after adding environment variables</li>
                </ol>
              </div>
            </div>
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
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" : "space-y-4"}>
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
