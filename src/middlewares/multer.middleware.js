import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const videoUpload = multer(
  {
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
      if (!file.mimetype.startsWith("video/") && !file.mimetype.startsWith("image/")) {
        return cb(new Error("File type not allowed!"), false);
      }
      cb(null, true);
    }
  }
);

const upload = multer({ storage: storage });

export {
  upload,
  videoUpload
};