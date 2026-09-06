/**
 * Cloudinary upload utility
 * For MVP this is a stub that can be replaced with real Cloudinary credentials.
 * In production, configure CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env
 */

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
}

export async function uploadToCloudinary(
  file: File | Blob,
  folder = "farmlink"
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret || cloudName === "demo") {
    // Return a placeholder URL for development without cloudinary
    return {
      url: `https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=400`,
      publicId: `placeholder-${Date.now()}`,
      secureUrl: `https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=400`,
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned");
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Failed to upload to Cloudinary");
  }

  const result = await response.json();
  return {
    url: result.url,
    publicId: result.public_id,
    secureUrl: result.secure_url,
  };
}
