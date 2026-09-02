const cloudinary = require("cloudinary").v2;

// Auto-configure from CLOUDINARY_URL or individual environment variables
if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Uploads a local file to Cloudinary with automatic optimizations.
 * @param {string} filePath - Absolute path to local temporary file
 * @param {string} folder - Folder path on Cloudinary (e.g. 'login2k26/receipts')
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadToCloudinary = async (filePath, folder = "login2k26/uploads") => {
  const isConfigured = Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
  );

  if (!isConfigured) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: folder,
    resource_type: "auto",
    transformation: [
      { width: 1200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" }
    ],
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
