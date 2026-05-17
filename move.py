import os
import shutil

base = "c:/Users/youna/Desktop/hoos"
target = os.path.join(base, "smart_hospital")

os.makedirs(os.path.join(target, "src/pages"), exist_ok=True)
os.makedirs(os.path.join(target, "src/components/ui"), exist_ok=True)
os.makedirs(os.path.join(target, "src/server/routers"), exist_ok=True)
os.makedirs(os.path.join(target, "src/db/migrations"), exist_ok=True)
os.makedirs(os.path.join(target, "src/_core/hooks"), exist_ok=True)
os.makedirs(os.path.join(target, "src/contexts"), exist_ok=True)

files = [
  ("App", "src/App.tsx"),
  ("Dashboard", "src/pages/Dashboard.tsx"),
  ("BrainTumorDetection", "src/pages/BrainTumorDetection.tsx"),
  ("ChestDiseaseDetection", "src/pages/ChestDiseaseDetection.tsx"),
  ("BoneFractureDetection", "src/pages/BoneFractureDetection.tsx"),
  ("LungCancerAssessment", "src/pages/LungCancerAssessment.tsx"),
  ("PatientRecords", "src/pages/PatientRecords.tsx"),
  ("Patients", "src/pages/Patients.tsx"),
  ("schema.ts", "src/db/schema.ts"),
  ("db.ts", "src/db/index.ts"),
  ("trpc.ts", "src/_core/trpc.ts"),
  ("routers.ts", "src/server/routers.ts"),
  ("patients.ts", "src/server/routers/patients.ts"),
  ("0001_chunky_rocket_racer.sql", "src/db/migrations/0001_chunky_rocket_racer.sql"),
  ("Dockerfile", "Dockerfile"),
  ("DOCKER_DEPLOYMENT.md", "DOCKER_DEPLOYMENT.md")
]

for src, dst in files:
    src_path = os.path.join(base, src)
    dst_path = os.path.join(target, dst)
    if os.path.exists(src_path):
        shutil.move(src_path, dst_path)
