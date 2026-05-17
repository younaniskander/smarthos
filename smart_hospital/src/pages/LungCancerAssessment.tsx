import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Lung } from "lucide-react";
import { toast } from "sonner";

export default function LungCancerAssessment() {
  const [patientId, setPatientId] = useState("");
  const [age, setAge] = useState("");
  const [smokingStatus, setSmokingStatus] = useState("");
  const [packYears, setPackYears] = useState("");
  const [familyHistory, setFamilyHistory] = useState(false);
  const [exposureHistory, setExposureHistory] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAssess = async () => {
    if (!patientId || !age || !smokingStatus) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsAnalyzing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockResult = {
        riskScore: 0.68,
        cancerProbability: 0.15,
        riskLevel: "Moderate",
        recommendation: "Annual CT screening recommended",
      };

      setResult(mockResult);
      toast.success("Assessment completed successfully");
    } catch (error) {
      toast.error("Assessment failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (probability: number) => {
    if (probability < 0.1) return "text-green-600";
    if (probability < 0.3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-2 rounded-lg">
              <Lung className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold">Lung Cancer Risk Assessment</h1>
          </div>
          <p className="text-slate-600">Evaluate lung cancer risk based on patient factors and medical history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Risk Factors</CardTitle>
                <CardDescription>Enter patient information for risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient ID */}
                <div>
                  <Label htmlFor="patient-id">Patient ID *</Label>
                  <Input
                    id="patient-id"
                    placeholder="Enter patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>

                {/* Age */}
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter patient age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="18"
                    max="120"
                  />
                </div>

                {/* Smoking Status */}
                <div>
                  <Label htmlFor="smoking">Smoking Status *</Label>
                  <Select value={smokingStatus} onValueChange={setSmokingStatus}>
                    <SelectTrigger id="smoking">
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never smoked</SelectItem>
                      <SelectItem value="former">Former smoker</SelectItem>
                      <SelectItem value="current">Current smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pack Years */}
                {(smokingStatus === "former" || smokingStatus === "current") && (
                  <div>
                    <Label htmlFor="pack-years">Pack Years</Label>
                    <Input
                      id="pack-years"
                      type="number"
                      placeholder="Number of pack years"
                      value={packYears}
                      onChange={(e) => setPackYears(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Pack years = (cigarettes per day / 20) × years smoked
                    </p>
                  </div>
                )}

                {/* Family History */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="family-history"
                    checked={familyHistory}
                    onCheckedChange={(checked) => setFamilyHistory(checked as boolean)}
                  />
                  <Label htmlFor="family-history" className="font-normal cursor-pointer">
                    Family history of lung cancer
                  </Label>
                </div>

                {/* Exposure History */}
                <div>
                  <Label htmlFor="exposure">Exposure History (Optional)</Label>
                  <Textarea
                    id="exposure"
                    placeholder="Asbestos, radon, air pollution, occupational exposure, etc."
                    value={exposureHistory}
                    onChange={(e) => setExposureHistory(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={handleAssess} disabled={isAnalyzing} className="w-full" size="lg">
                  {isAnalyzing ? "Assessing..." : "Assess Risk"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            {result ? (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900">Assessment Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Risk Level</p>
                    <p className={`text-2xl font-bold ${getRiskColor(result.cancerProbability)}`}>
                      {result.riskLevel}
                    </p>
                  </div>

                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-slate-600">Cancer Probability</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            result.cancerProbability < 0.1
                              ? "bg-green-500"
                              : result.cancerProbability < 0.3
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${result.cancerProbability * 100}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold ${getRiskColor(result.cancerProbability)}`}>
                        {(result.cancerProbability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600">Risk Score</p>
                    <p className="font-semibold">{(result.riskScore * 100).toFixed(1)}/100</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm font-medium text-blue-900">Recommendation</p>
                    <p className="text-sm text-blue-800 mt-1">{result.recommendation}</p>
                  </div>

                  <Button className="w-full" variant="outline">
                    Save Assessment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-600">Assessment Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">Fill in patient information and click assess to see results</p>
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

