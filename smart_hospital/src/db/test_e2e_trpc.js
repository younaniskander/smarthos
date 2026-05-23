import fs from "fs";

async function testE2eTrpc() {
  const testImagePath = "c:\\Users\\youna\\Desktop\\hoos\\smart_hospital\\mri_test.png";
  const imageBuffer = fs.readFileSync(testImagePath);
  const base64Image = imageBuffer.toString("base64");

  // tRPC uses superjson, which wraps the input inside "json" key for each batch item
  const payload = {
    "0": {
      "json": {
        patientId: "PAT001",
        imageName: "mri_test.png",
        imageBase64: `data:image/png;base64,${base64Image}`,
        notes: "E2E tRPC database verification test"
      }
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
    const text = await response.text();
    console.log("Response Body (first 500 chars):", text.substring(0, 500));
    
    // Parse response
    const json = JSON.parse(text);
    if (json[0]?.error) {
      console.error("tRPC execution error:", json[0].error);
    } else {
      console.log("tRPC execution success! Response data:", json[0].result);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testE2eTrpc();
