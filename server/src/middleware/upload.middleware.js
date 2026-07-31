import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/apiError.js";

// ======================================================
// Allowed Image Types
// ======================================================

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ======================================================
// Cloudinary Storage
// ======================================================

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "manikya",

    resource_type: "image",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    use_filename: false,

    unique_filename: true,

    overwrite: false,

    transformation: [
      {
        width: 1200,
        crop: "limit",

        fetch_format: "auto",

        quality: "auto:good",
      },
    ],
  }),
});

// ======================================================
// File Filter
// ======================================================

const fileFilter = (req, file, cb) => {

  if (
    !allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    return cb(
      new ApiError(
        400,
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )
    );
  }

  cb(null, true);
};
// ======================================================
// Multer Configuration
// ======================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    files: 10,

    fileSize: 1024 * 1024, // 1 MB upload limit
  },
});

// ======================================================
// Upload Helpers
// ======================================================

// Single Image Upload
export const singleUpload = (fieldName = "image") =>
  upload.single(fieldName);

// Multiple Images Upload
export const multipleUpload = (
  fieldName = "images",
  maxCount = 10
) =>
  upload.array(
    fieldName,
    maxCount
  );

// Multiple Fields Upload
export const fieldsUpload = (
  fields = []
) =>
  upload.fields(fields);

// ======================================================
// Enterprise Error Handler
// ======================================================

export const uploadErrorHandler = (
  err,
  req,
  res,
  next
) => {

  if (err instanceof multer.MulterError) {

    switch (err.code) {

      case "LIMIT_FILE_SIZE":
        return next(
          new ApiError(
            400,
            "Maximum image size allowed is 1 MB."
          )
        );

      case "LIMIT_FILE_COUNT":
        return next(
          new ApiError(
            400,
            "Too many images uploaded."
          )
        );

      case "LIMIT_UNEXPECTED_FILE":
        return next(
          new ApiError(
            400,
            "Unexpected upload field."
          )
        );

      default:
        return next(
          new ApiError(
            400,
            err.message
          )
        );
    }
  }

  next(err);
};

// ======================================================
// Default Export
// ======================================================

export default upload;