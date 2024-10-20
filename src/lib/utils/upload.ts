import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadFiles = async (files: any) => {
  if (files.length === 0) return;

  const uploadedFiles = [];

  for (const f of files) {
    const { file, type } = f;

    // Create a new FormData instance for each file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_APP_CLOUD_SECRET);

    const res = await uploadToCloudinary(formData);
    if (res) {
      uploadedFiles.push({
        file: res,
        type: type,
      });
    }
  }
  return uploadedFiles;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadToCloudinary = async (formData: any) => {
  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME}/raw/upload`,
      formData,
    );

    return data;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null; // Return null if there's an error
  }
};
