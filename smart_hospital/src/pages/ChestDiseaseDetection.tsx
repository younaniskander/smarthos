import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Heart, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ChestDiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [patientId, setPatientId] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/dicom"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".dcm")) {
      toast.error("Please upload a valid medical image (PNG, JPG, or DICOM)");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !patientId) {
      toast.error("Please select an image and enter patient ID");
      return;
    }

    setIsAnalyzing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResult = {
        diagnosis: "Mild pneumonia detected",
        confidence: 0.92,
        diseaseType: "Pneumonia",
        affectedArea: "Right lower lobe",
        severity: "mild",
      };

      setAnalysisResult(mockResult);
      toast.success("Analysis completed successfully");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Chest Disease Detection</h1>
          </div>
          <p className="text-slate-600">Detect chest diseases and abnormalities from X-ray and CT images</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Medical Image</CardTitle>
                <CardDescription>Supported formats: PNG, JPG, DICOM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="patient-id">Patient ID *</Label>
                  <Input
                    id="patient-id"
                    placeholder="Enter patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.dcm"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500">PNG, JPG, or DICOM (max 50MB)</p>
                  </label>
                </div>

                {preview && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Preview</p>
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
                    <p className="text-xs text-slate-500 mt-2">{selectedFile?.name}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Doctor Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any relevant clinical notes..."
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || !patientId || isAnalyzing}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            {analysisResult ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-900">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Diagnosis</p>
                    <p className="text-lg font-semibold">{analysisResult.diagnosis}</p>
                  </div>

                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-slate-600">Confidence Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${analysisResult.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-green-600">{(analysisResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-slate-600">Disease Type</p>
                      <p className="font-medium">{analysisResult.diseaseType}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Affected Area</p>
                      <p className="font-medium">{analysisResult.affectedArea}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Severity</p>
                      <p className="font-medium capitalize">{analysisResult.severity}</p>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Save Result
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-600">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">Upload an image and click analyze to see results</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

