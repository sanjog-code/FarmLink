"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Star, CheckCircle, AlertCircle } from "lucide-react";
import { getGradeLabel, getGradeColor } from "@/lib/utils";
import toast from "react-hot-toast";

export default function GradeProducePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleGrade = async () => {
    if (!selectedFile) {
      toast.error("Please upload an image first");
      return;
    }
    setGrading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/grade-produce", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        toast.success("Produce graded successfully!");
      } else {
        toast.error(data.error || "Grading failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AI Produce Grading</h1>
      <p className="text-muted-foreground">Upload a photo of your produce and our AI will analyze and grade it.</p>

      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed rounded-xl p-8 text-center">
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                <Button variant="outline" onClick={() => { setSelectedFile(null); setPreview(null); setResult(null); }}>
                  Change Image
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Upload Produce Image</p>
                <p className="text-sm text-muted-foreground mb-4">JPG, PNG up to 5MB</p>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <Button variant="outline">Choose File</Button>
              </label>
            )}
          </div>

          {preview && !result && (
            <Button className="w-full mt-4" size="lg" onClick={handleGrade} loading={grading}>
              <Star className="h-4 w-4 mr-2" /> Analyze & Grade Produce
            </Button>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" /> Grading Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <Badge className={`text-2xl px-6 py-2 ${getGradeColor(result.grade)}`}>
                Grade {getGradeLabel(result.grade)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Quality Score", value: `${result.qualityScore}%` },
                { label: "Color Uniformity", value: `${result.colorUniformity}%` },
                { label: "Surface Defects", value: `${result.surfaceDefects}%` },
                { label: "Freshness Estimate", value: `${result.freshnessScore}%` },
              ].map((metric) => (
                <div key={metric.label} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-blue-800 dark:text-blue-200">
                This is a simulated AI grading result. In production, this will use computer vision models for accurate quality assessment.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
