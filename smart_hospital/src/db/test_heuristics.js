import fs from "fs";
import path from "path";

async function testHeuristics() {
  const uploadsDir = "c:\\Users\\youna\\Desktop\\hoos\\smart_hospital\\public\\uploads";
  const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith(".jpg") || f.endsWith(".jpeg"));
  if (files.length === 0) {
    console.log("No uploaded test files found.");
    return;
  }
  
  const testFile = files[files.length - 1];
  const testFilePath = path.join(uploadsDir, testFile);
  console.log(`Testing image file: ${testFile} (${fs.statSync(testFilePath).size} bytes)`);

  const imageBuffer = fs.readFileSync(testFilePath);
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });
  const formData = new FormData();
  formData.append("file", blob, testFile);

  try {
    const mlResponse = await fetch("http://127.0.0.1:8000/predict/brain_tumor", {
      method: "POST",
      body: formData,
    });

    if (!mlResponse.ok) {
      const errMsg = await mlResponse.text();
      console.error("ML Service failed:", errMsg);
      return;
    }

    const mlResult = await mlResponse.json();
    console.log("ML Service Prediction Result:", mlResult);
  } catch (err) {
    console.error("Error during fetch:", err);
  }
}

testHeuristics();
