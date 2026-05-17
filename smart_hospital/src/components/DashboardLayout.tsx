import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Brain, Wind, Bone, FileText, Users, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [location] = useLocation();

  const links = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Brain Tumor", icon: Brain, path: "/radiology/brain" },
    { name: "Chest Disease", icon: Wind, path: "/radiology/chest" },
    { name: "Bone Fracture", icon: Bone, path: "/radiology/bone" },
    { name: "Lung Cancer", icon: Activity, path: "/lung-cancer" },
    { name: "Patient Records", icon: FileText, path: "/patient-records" },
    { name: "Patients", icon: Users, path: "/patients" },
  ];

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex flex-col">
        <div className="p-6 border-b dark:border-slate-700">
          <h1 className="text-2xl font-bold text-primary">Smart Hospital</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.path;
              return (
                <li key={link.path}>
                  <Link href={link.path}>
                    <a className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                      <Icon className="w-5 h-5" />
                      {link.name}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
