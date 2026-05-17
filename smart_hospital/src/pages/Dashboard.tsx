import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, Wind, Bone, FileText, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const radiologyServices = [
    {
      icon: Brain,
      title: "Brain Tumor Detection",
      description: "Analyze MRI and CT scans for brain tumor detection with high accuracy",
      color: "from-blue-500 to-blue-600",
      path: "/radiology/brain",
    },
    {
      icon: Wind,
      title: "Chest Disease Detection",
      description: "Detect chest diseases and abnormalities from X-ray and CT images",
      color: "from-green-500 to-green-600",
      path: "/radiology/chest",
    },
    {
      icon: Bone,
      title: "Bone Fracture Detection",
      description: "Identify and classify bone fractures from radiographic images",
      color: "from-amber-500 to-amber-600",
      path: "/radiology/bone",
    },
    {
      icon: Wind,
      title: "Lung Cancer Risk Assessment",
      description: "Evaluate lung cancer risk based on patient factors and medical history",
      color: "from-red-500 to-red-600",
      path: "/lung-cancer",
    },
  ];

  const quickActions = [
    {
      icon: FileText,
      label: "Patient Records",
      path: "/patient-records",
    },
    {
      icon: Users,
      label: "Manage Patients",
      path: "/patients",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name || "Doctor"}</h1>
          <p className="text-slate-300">Smart Hospital AI Diagnostic System</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.path}
                onClick={() => setLocation(action.path)}
                variant="outline"
                className="h-20 text-left justify-start px-6"
              >
                <Icon className="w-6 h-6 mr-4" />
                <span className="text-lg font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Radiology Services Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Diagnostic Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {radiologyServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.path}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(service.path)}
                >
                  <CardHeader>
                    <div className={`bg-gradient-to-br ${service.color} p-3 rounded-lg w-fit mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-slate-500 mt-1">Completed this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-slate-500 mt-1">In the system</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600">Accuracy Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">96%</div>
              <p className="text-xs text-slate-500 mt-1">Average confidence</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
