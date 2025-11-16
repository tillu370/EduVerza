import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Upload, Loader2 } from "lucide-react";
import { departments, resourceTypes } from "@/data/mockResources";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    year: "",
    sem: "",
    subject: "",
    type: "",
    description: "",
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for Supabase (file upload would be handled separately with Supabase Storage)
      const resourceData = {
        title: formData.title,
        department: formData.department,
        year: parseInt(formData.year),
        sem: parseInt(formData.sem),
        subject: formData.subject,
        type: formData.type,
        description: formData.description || null,
        views: 0,
        downloads: 0,
        file_size: formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : null,
        // file_url would be set after uploading to Supabase Storage
      };

      const { data, error } = await supabase
        .from('resources')
        .insert([resourceData])
        .select()
        .single();

      if (error) throw error;

      toast.success("Resource uploaded successfully!");
      
      // Reset form
      setFormData({
        title: "",
        department: "",
        year: "",
        sem: "",
        subject: "",
        type: "",
        description: "",
        file: null,
      });

      // Navigate to browse page
      setTimeout(() => {
        navigate("/browse");
      }, 1500);
    } catch (error: any) {
      console.error("Error uploading resource:", error);
      toast.error(error.message || "Failed to upload resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 hand-heading text-navy font-display">
              ADMIN PANEL
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Upload new educational resources for students to access
            </p>
          </div>

          <Alert className="mb-4 sm:mb-6 border-primary/50 bg-primary/10">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm sm:text-base text-foreground/80">
              <strong>Admin Access Required</strong>
              <br />
              This is a mock admin panel for prototype purposes. In production, this would be 
              protected with authentication and connect to a real backend API.
            </AlertDescription>
          </Alert>

          <Card className="p-4 sm:p-6 md:p-8 sketchy-border paper-texture">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 font-display text-navy">UPLOAD RESOURCE</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="title" className="text-navy font-semibold text-sm sm:text-base">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Data Structures Lecture Notes - Module 1"
                  className="mt-2 sketchy-border w-full"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="department" className="text-navy font-semibold text-sm sm:text-base">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    required
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger id="department" className="mt-2 sketchy-border w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter(d => d !== "All").map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year" className="text-navy font-semibold text-sm sm:text-base">
                    Year <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    required
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger id="year" className="mt-2 sketchy-border w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="sem" className="text-navy font-semibold text-sm sm:text-base">
                  Semester <span className="text-destructive">*</span>
                </Label>
                <Select 
                  required
                  value={formData.sem}
                  onValueChange={(value) => setFormData({ ...formData, sem: value })}
                >
                  <SelectTrigger id="sem" className="mt-2 sketchy-border w-full">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                    <SelectItem value="8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="subject" className="text-navy font-semibold text-sm sm:text-base">
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Data Structures"
                    className="mt-2 sketchy-border w-full"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="text-navy font-semibold text-sm sm:text-base">
                    Resource Type <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    required
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type" className="mt-2 sketchy-border w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.filter(t => t !== "All").map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-navy font-semibold text-sm sm:text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the resource content..."
                  className="mt-2 sketchy-border min-h-24 w-full"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="file" className="text-navy font-semibold text-sm sm:text-base">
                  File Upload <span className="text-destructive">*</span>
                </Label>
                <div className="mt-2 border-2 border-dashed border-navy rounded-lg p-6 sm:p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX (MAX. 50MB)
                  </p>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="submit"
                  className="flex-1 sketchy-shadow bg-primary hover:bg-primary-dark font-bold font-display text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      UPLOADING...
                    </>
                  ) : (
                    "UPLOAD RESOURCE"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="sketchy-border text-sm sm:text-base"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
