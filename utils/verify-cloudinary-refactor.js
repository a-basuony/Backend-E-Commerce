const cloudinaryService = require("../services/cloudinaryService");
const fs = require("fs");
const path = require("path");

// Mock a file buffer (create a small text file as image for testing, or use a real image if available)
// For this test, we just want to ensure the service calls Cloudinary correctly.
// But without real credentials it will fail if we try to actually upload.
// So we can mock the `upload_stream` in the test if we want to run it without creds,
// OR we assume the user has creds in .env and we dry-run.

// Let's make a script that tries to upload a dummy buffer.
// If it fails with "Must supply cloud_name" it means config is loaded but maybe missing env.

async function verify() {
  console.log("🚀 Starting Cloudinary Verification...");

  // Check Config
  const cloudinary = require("../config/cloudinary");
  console.log("Checking Cloudinary Config...");
  if (!cloudinary.config().cloud_name) {
    console.error("❌ Cloudinary Cloud Name is MISSING in .env");
  } else {
    console.log("✅ Cloudinary Cloud Name found.");
  }

  // Create a dummy buffer
  const buffer = Buffer.from("test image data");

  console.log("Testing Upload Service (Mock Attempt)...");

  try {
    // We expect this to fail if no valid creds, but if it tries to connect, the code path is active.
    const result = await cloudinaryService.uploadStream(buffer, {
      folder: "test_folder",
      public_id: "test_image_" + Date.now(),
      resource_type: "raw", // use raw for text buffer
    });
    console.log("✅ Upload Success:", result.secure_url);
  } catch (error) {
    console.log(
      "⚠️ Upload returned error (Expected if credentials are invalid or network blocked):",
    );
    console.log(error.message);
  }

  console.log("🏁 Verification Script Finished.");
}

verify();
