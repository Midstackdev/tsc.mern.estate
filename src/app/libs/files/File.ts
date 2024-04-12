import fs, { promises as fsPromises } from "fs";
import path from "path";

export class File {
  public static async read(pathToFIle: string) {
    try {
      const content = await fsPromises.readFile(pathToFIle);
      console.log(content.toString());
    } catch (error) {
      console.log(error);
    }
  }

  public static async append(pathToFIle: string, content: any) {
    try {
      await fsPromises.appendFile(pathToFIle, content);
      console.log(`Appended data to: ${pathToFIle}`);
    } catch (error) {
      console.log(error);
    }
  }

  public static async delete(pathToFIle: string) {
    try {
      await fsPromises.unlink(pathToFIle);
      console.log(`Deleted file: ${pathToFIle}`);
    } catch (error) {
      console.log(error);
    }
  }

  public static async rename(oldPathToFIle: string, newPathToFIle: string) {
    try {
      await fsPromises.rename(oldPathToFIle, newPathToFIle);
      console.log(`Rename file from: ${oldPathToFIle} to: ${newPathToFIle}`);
    } catch (error) {
      console.log(error);
    }
  }

  public static exists(pathToFIle: string) {
    return fs.existsSync(pathToFIle);
  }

  public static async makeDir(pathToFIle: string) {
    try {
      await fsPromises.mkdir(pathToFIle);
    } catch (error) {
      console.log(error);
    }
  }

  public static async removeDir(pathToFIle: string) {
    try {
      await fsPromises.rmdir(pathToFIle);
    } catch (error) {
      console.log(error);
    }
  }

  public static async readDir(pathToFIle: string) {
    try {
      const files = await fsPromises.readdir(pathToFIle);
      return files;
    } catch (error) {
      console.log(error);
    }
  }
}
