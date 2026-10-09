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
    folder: "madan-gold/products",

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
  const extension =
    file.originalname
      ?.split(".")
      .pop()
      ?.toLowerCase();

  const allowedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "webp",
  ];

  if (
    !allowedMimeTypes.includes(
      file.mimetype
    ) ||
    !allowedExtensions.includes(
      extension
    )
  )  {
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
  fileSize: 5 * 1024 * 1024,
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
  maxCount = 5
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
            "Maximum image size allowed is 5 MB."
          )
        );

      case "LIMIT_FILE_COUNT":
        return next(
          new ApiError(
            400,
            "A maximum of 5 product images can be uploaded at once."
          )
        );

      case "LIMIT_UNEXPECTED_FILE":
        return next(
          new ApiError(
            400,
            "Maximum 5 product images are allowed per product. Use the images upload field and select JPG, JPEG, PNG or WEBP files up to 5 MB each."
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