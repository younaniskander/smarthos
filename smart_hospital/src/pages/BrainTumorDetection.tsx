import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Brain, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "../lib/trpc";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function BrainTumorDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [patientId, setPatientId] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  const analyzeMutation = trpc.patients.analyzeBrainTumor.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/dicom"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".dcm")) {
      toast.error("Please upload a valid medical image (PNG, JPG, or DICOM)");
      return;
    }

    setSelectedFile(file);

    // Create preview
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
      const base64Image = await fileToBase64(selectedFile);
      const result = await analyzeMutation.mutateAsync({
        patientId,
        imageName: selectedFile.name,
        imageBase64: base64Image,
        notes: doctorNotes,
      });

      setAnalysisResult(result);
      toast.success("Analysis completed and saved successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Analysis failed. Please make sure the patient ID exists.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold">Brain Tumor Detection</h1>
          </div>
          <p className="text-slate-600">Analyze MRI and CT scans for brain tumor detection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
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

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
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

                {/* Image Preview */}
                {preview && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Preview</p>
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
                    <p className="text-xs text-slate-500 mt-2">{selectedFile?.name}</p>
                  </div>
                )}

                {/* Doctor Notes */}
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

          {/* Results Section */}
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
                      <p className="text-slate-600">Tumor Type</p>
                      <p className="font-medium">{analysisResult.tumorType}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Location</p>
                      <p className="font-medium">{analysisResult.tumorLocation}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Size</p>
                      <p className="font-medium">{analysisResult.tumorSize}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Malignancy Score</p>
                      <p className="font-medium">{(analysisResult.malignancyScore * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <Button className="w-full text-green-700 bg-green-100 hover:bg-green-100 border-green-300" disabled>
                    Saved to History
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
