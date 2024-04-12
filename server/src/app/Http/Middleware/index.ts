import { NextFunction, Request, Response } from "express";
import multer from "multer";
import fs, { promises as fsPromises } from "fs";

export const allowedRequestMethods = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const allowedMethods = [
    "OPTIONS",
    "HEAD",
    "CONNECT",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
  ];

  if (!allowedMethods.includes(req.method)) {
    res.status(405).send(`${req.method} not allowed.`);
  }

  next();
};

const imageFilter = (req: Request, file: any, cb: any) => {
  if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

export const upload = multer({
  fileFilter: imageFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // limits the file size to 10MB
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const path = "storage/uploads";
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extenstion = file.originalname.split(".")[1];
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + extenstion);
    },
  }),
}).single("file");
