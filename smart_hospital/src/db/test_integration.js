import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  const dbUrl = "mysql://hospital_user:smart_hospital@localhost:3306/smart_hospital";
  console.log("Connecting to database at:", dbUrl);
  const connection = await mysql.createConnection(dbUrl);

  // 1. Ensure test patient exists
  console.log("Ensuring test patient PAT001 exists...");
  const [patients] = await connection.query(
    "SELECT * FROM patients WHERE patientId = 'PAT001'"
  );

  let patientIdInt;
  if (patients.length === 0) {
    console.log("Patient PAT001 not found, inserting...");
    const [result] = await connection.query(
      "INSERT INTO patients (patientId, firstName, lastName, email, phone, gender, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
      ["PAT001", "John", "Doe", "john.doe@example.com", "555-0199", "male"]
    );
    patientIdInt = result.insertId;
    console.log(`Inserted patient with ID: ${patientIdInt}`);
  } else {
    patientIdInt = patients[0].id;
    console.log(`Patient PAT001 already exists with ID: ${patientIdInt}`);
  }

  // 2. Read test image and encode to base64
  const testImagePath = "c:\\Users\\youna\\Desktop\\hoos\\smart_hospital\\mri_test.png";
  console.log("Reading test image:", testImagePath);
  if (!fs.existsSync(testImagePath)) {
    throw new Error(`Test image not found at ${testImagePath}`);
  }
  const imageBuffer = fs.readFileSync(testImagePath);
  const base64Image = imageBuffer.toString("base64");

  // 3. Call ML Service
  console.log("Calling ML Service at http://127.0.0.1:8000/predict/brain_tumor...");
  const blob = new Blob([imageBuffer], { type: "image/png" });
  const formData = new FormData();
  formData.append("file", blob, "mri_test.png");

  const mlResponse = await fetch("http://127.0.0.1:8000/predict/brain_tumor", {
    method: "POST",
    body: formData,
  });

  if (!mlResponse.ok) {
    const errMsg = await mlResponse.text();
    throw new Error(`ML Service failed: ${errMsg}`);
  }

  const mlResult = await mlResponse.json();
  console.log("ML Service Prediction Success! Result:", mlResult);

  // 4. Save to Database
  console.log("Saving results to MySQL database...");
  const [insertedResult] = await connection.query(
    "INSERT INTO analysisResults (patientId, doctorId, analysisType, diagnosis, confidenceScore, imageUrl, modelOutput, notes, timestamp, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())",
    [
      patientIdInt,
      1, // doctorId
      "brain_tumor",
      mlResult.diagnosis,
      mlResult.confidence.toFixed(4),
      `data:image/png;base64,${base64Image.substring(0, 100)}...[truncated]`,
      JSON.stringify(mlResult.rawBoxes),
      "Test run note",
    ]
  );

  const analysisResultId = insertedResult.insertId;
  console.log(`Inserted analysisResult with ID: ${analysisResultId}`);

  await connection.query(
    "INSERT INTO brainTumorAnalysis (analysisResultId, tumorType, tumorLocation, tumorSize, malignancyScore, createdAt) VALUES (?, ?, ?, ?, ?, NOW())",
    [
      analysisResultId,
      mlResult.tumorType,
      mlResult.tumorLocation,
      mlResult.tumorSize,
      mlResult.malignancyScore.toFixed(4),
    ]
  );
  console.log("BrainTumorAnalysis details successfully saved.");

  // 5. Query and print saved records to verify
  console.log("\nVerifying database state...");
  const [analysisRows] = await connection.query(
    "SELECT ar.*, bta.tumorType, bta.tumorLocation, bta.tumorSize, bta.malignancyScore FROM analysisResults ar JOIN brainTumorAnalysis bta ON ar.id = bta.analysisResultId WHERE ar.id = ?",
    [analysisResultId]
  );
  console.log("Database verification query results:", analysisRows[0]);

  await connection.end();
  console.log("\nAll integration checks passed successfully!");
}

runTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
