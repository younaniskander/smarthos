import fs from "fs";

async function testTrpc() {
  const testImagePath = "c:\\Users\\youna\\Desktop\\hoos\\smart_hospital\\mri_test.png";
  const imageBuffer = fs.readFileSync(testImagePath);
  const base64Image = imageBuffer.toString("base64");

  const payload = {
    "0": {
      patientId: "PAT001",
      imageName: "mri_test.png",
      imageBase64: `data:image/png;base64,${base64Image}`,
      notes: "Testing tRPC size and connection"
    }
  };

  console.log("Sending payload of size:", JSON.stringify(payload).length, "bytes");

  try {
    const response = await fetch("http://localhost:3001/api/trpc/patients.analyzeBrainTumor?batch=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    console.log("Status Code:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    const text = await response.text();
    console.log("Response Body (first 500 chars):", text.substring(0, 500));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testTrpc();
