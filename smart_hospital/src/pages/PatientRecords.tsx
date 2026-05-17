import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye } from "lucide-react";
import { toast } from "sonner";

const mockRecords = [
  {
    id: 1,
    patientId: "P001",
    patientName: "John Doe",
    diagnosis: "No tumor detected",
    analysisType: "Brain Tumor",
    confidence: 0.96,
    timestamp: "2026-05-15 10:30 AM",
    doctorName: "Dr. Smith",
  },
  {
    id: 2,
    patientId: "P002",
    patientName: "Jane Smith",
    diagnosis: "Mild pneumonia detected",
    analysisType: "Chest Disease",
    confidence: 0.92,
    timestamp: "2026-05-15 09:15 AM",
    doctorName: "Dr. Johnson",
  },
  {
    id: 3,
    patientId: "P003",
    patientName: "Robert Brown",
    diagnosis: "Tibial fracture detected",
    analysisType: "Bone Fracture",
    confidence: 0.94,
    timestamp: "2026-05-14 02:45 PM",
    doctorName: "Dr. Williams",
  },
  {
    id: 4,
    patientId: "P001",
    patientName: "John Doe",
    diagnosis: "Moderate risk",
    analysisType: "Lung Cancer",
    confidence: 0.68,
    timestamp: "2026-05-14 11:20 AM",
    doctorName: "Dr. Smith",
  },
];

export default function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filteredRecords = mockRecords.filter(
    (record) =>
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800";
    if (confidence >= 0.8) return "bg-blue-100 text-blue-800";
    if (confidence >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getAnalysisTypeColor = (type: string) => {
    switch (type) {
      case "Brain Tumor":
        return "bg-blue-100 text-blue-800";
      case "Chest Disease":
        return "bg-green-100 text-green-800";
      case "Bone Fracture":
        return "bg-amber-100 text-amber-800";
      case "Lung Cancer":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const handleExport = () => {
    toast.success("Records exported as PDF");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Patient Records</h1>
          <p className="text-slate-600">View and manage all patient analysis records and medical history</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Search by patient ID, name, or diagnosis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>{filteredRecords.length} records found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Analysis Type</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.patientId}</TableCell>
                        <TableCell>{record.patientName}</TableCell>
                        <TableCell>
                          <Badge className={getAnalysisTypeColor(record.analysisType)}>
                            {record.analysisType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{record.diagnosis}</TableCell>
                        <TableCell>
                          <Badge className={getConfidenceColor(record.confidence)}>
                            {(record.confidence * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>{record.doctorName}</TableCell>
                        <TableCell className="text-sm text-slate-600">{record.timestamp}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRecord(record)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                        No records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Selected Record Details */}
        {selectedRecord && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Record Details</CardTitle>
                  <CardDescription>Patient ID: {selectedRecord.patientId}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-slate-600">Patient ID</p>
                      <p className="font-medium">{selectedRecord.patientId}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Patient Name</p>
                      <p className="font-medium">{selectedRecord.patientName}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Doctor Name</p>
                      <p className="font-medium">{selectedRecord.doctorName}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Analysis Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-slate-600">Analysis Type</p>
                      <p className="font-medium">{selectedRecord.analysisType}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Diagnosis</p>
                      <p className="font-medium">{selectedRecord.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Confidence Score</p>
                      <p className="font-medium">{(selectedRecord.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Timestamp</p>
                      <p className="font-medium">{selectedRecord.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

