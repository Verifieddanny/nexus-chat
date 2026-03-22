import axios from "axios";

export const uploadToCDN = async (
  file: File,
  previewUrl: string | null,
  setIsUploading: (value: boolean) => void,
): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    console.warn("⚠️ CDN not configured in .env. Skipping real upload.");
    return previewUrl || "";
  }

  setIsUploading(true);
  try {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      uploadData,
    );

    console.log("✅ CDN Upload Success:", response.data.secure_url);
    return response.data.secure_url;
  } catch (err: any) {
    console.error("❌ CDN Upload Failed:", err);
    throw new Error(
      "Image upload failed. Check your Cloudinary configuration.",
    );
  } finally {
    setIsUploading(false);
  }
};
