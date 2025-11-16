import axiosInstance from "@/configs/axios";

export const uploadToCloudinary = async (
  file: File,
  folder: string,
  resourceType: "image" | "video" = "image"
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );
  formData.append("folder", folder);

  const response = await axiosInstance.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    formData
  );
  return response.data;
};

export const deleteFromCloudinary = async (publicId: string) => {
  const response = await axiosInstance.post("/cloudinary/delete", { publicId });
  return response.data;
};

export const extractPublicId = (url: string): string => {
  const regex = /v\d+\/([^\/]+)\/([^\/.]+)/;
  const match = url.match(regex);
  return match ? `${match[1]}/${match[2]}` : "";
};
