const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { verifyJwt } = require("../../middleware/auth");
const { uploadToCloudinary } = require("../../config/cloudinary");

const router = express.Router();

// Ensure temporary uploads directory exists
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
const baseUploadDir = isVercel ? "/tmp/uploads" : path.join(__dirname, "../../public/uploads");
const uploadDir = path.join(baseUploadDir, "receipts");
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    console.error("Failed to create uploadDir:", e);
  }
}

// Configure Multer disk storage for temporary handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "receipt-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

router.post("/receipt", verifyJwt, upload.single("receipt"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded or invalid file format" });
  }

  const filePath = req.file.path;

  try {
    let fileUrl = "";

    // Check if Cloudinary is configured
    const isCloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_URL ||
        (process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET)
    );

    if (isCloudinaryConfigured) {
      try {
        const cloudinaryResult = await uploadToCloudinary(filePath, "login2k26/receipts");
        fileUrl = cloudinaryResult.url;
      } catch (cloudinaryErr) {
        console.warn("Cloudinary upload failed, falling back to local processing:", cloudinaryErr.message || cloudinaryErr);
        if (req.file.mimetype === "application/pdf") {
          const fileData = fs.readFileSync(filePath);
          fileUrl = `data:application/pdf;base64,${fileData.toString("base64")}`;
        } else {
          const processedBuffer = await sharp(filePath)
            .resize(800, null, { withoutEnlargement: true })
            .webp({ quality: 70 })
            .toBuffer();
          fileUrl = `data:image/webp;base64,${processedBuffer.toString("base64")}`;
        }
      }
    } else {
      // Local fallback (Base64 data URL)
      if (req.file.mimetype === "application/pdf") {
        const fileData = fs.readFileSync(filePath);
        fileUrl = `data:application/pdf;base64,${fileData.toString("base64")}`;
      } else {
        const processedBuffer = await sharp(filePath)
          .resize(800, null, { withoutEnlargement: true })
          .webp({ quality: 70 })
          .toBuffer();
        fileUrl = `data:image/webp;base64,${processedBuffer.toString("base64")}`;
      }
    }

    // Clean up local temp file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    return res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Receipt upload error:", error);
    // Ensure temp file is cleaned up on error
    fs.unlink(filePath, () => {});
    return res.status(500).json({ message: "Failed to process receipt" });
  }
});

const bonafideDir = path.join(baseUploadDir, "bonafides");
if (!fs.existsSync(bonafideDir)) {
  try {
    fs.mkdirSync(bonafideDir, { recursive: true });
  } catch (e) {
    console.error("Failed to create bonafideDir:", e);
  }
}

const bonafideStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, bonafideDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "bonafide-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadBonafide = multer({
  storage: bonafideStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

router.post("/bonafide", verifyJwt, uploadBonafide.single("bonafide"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded or invalid file format" });
  }

  const filePath = req.file.path;

  try {
    let fileUrl = "";

    const isCloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_URL ||
        (process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET)
    );

    if (isCloudinaryConfigured) {
      try {
        const cloudinaryResult = await uploadToCloudinary(filePath, "login2k26/bonafides");
        fileUrl = cloudinaryResult.url;
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete temp file:", err);
        });
      } catch (cloudinaryErr) {
        console.warn("Cloudinary bonafide upload failed, falling back to local storage:", cloudinaryErr.message || cloudinaryErr);
        fileUrl = `/uploads/bonafides/${req.file.filename}`;
      }
    } else {
      fileUrl = `/uploads/bonafides/${req.file.filename}`;
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Bonafide upload error:", error);
    fs.unlink(filePath, () => {});
    return res.status(500).json({ message: "Failed to process bonafide" });
  }
});

module.exports = router;

