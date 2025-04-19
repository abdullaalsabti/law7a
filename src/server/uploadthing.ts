import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

const f = createUploadthing();

// Define file routes for different types of uploads
export const ourFileRouter = {
  // Route for profile image uploads
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // You can authenticate here and provide additional data

      // Return metadata that is accessible in onUploadComplete
      return { userId: "user_id_placeholder" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload is complete
      
      // Return the file URL or any other data you want
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
