import multer from "multer";

//diskStorage in multer give full controal on storing files on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); //Where the file will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //what will be the name of the file
  },
});

export const upload = multer({ storage });
