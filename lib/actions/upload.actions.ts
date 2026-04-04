"use server";

import { cloudinary } from "@/lib/cloudinary";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "drip-store/products" }, (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        })
        .end(buffer);
    },
  );

  return { url: result.secure_url };
}
