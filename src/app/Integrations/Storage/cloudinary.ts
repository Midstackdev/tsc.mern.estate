import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../../config";
import { File } from "../../libs/files/File";
import { FileStorageInterface } from "./FIleStorageInterface";
import { v2 as cloud } from "cloudinary";

cloud.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export class CloudinaryStore implements FileStorageInterface {
  private config;
  private cloudinary;

  constructor() {
    this.config = {
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    };

    this.cloudinary = cloud;
  }

  async upload(path: string, folder?: string): Promise<any> {
    try {
      const result = await this.cloudinary.uploader.upload(path, {
        ...(folder && { folder }),
        // use_filename: true,
      });
      //remove image from local disk
      await File.delete(path);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async destroy(publicId: string): Promise<any> {
    return await this.cloudinary.uploader.destroy(publicId);
  }

  async getResource(publicId: string): Promise<any> {
    try {
      return await this.cloudinary.api.resource(publicId);
    } catch (error) {
      console.log(error);
    }
  }
}

export const cloudinary = new CloudinaryStore();
