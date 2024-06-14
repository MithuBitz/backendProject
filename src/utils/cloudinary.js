import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export const uploadInCludinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //TO upload the file in cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", //automatically detect the file type
    });
    // console.log("File is upload in cloudinary ", response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    //unlink or remove the local file path
    fs.unlinkSync(localFilePath);
    console.log("Cloudinary error :: upload file", error);
  }
};
