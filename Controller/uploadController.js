const asyncWrapper = require("../Middleware/asyncWrapper");
const multer = require("multer");
const stream = require("stream");
const { google } = require("googleapis");
const path = require("path");

const upload = multer({ storage: multer.memoryStorage() });
const uploadFields = asyncWrapper((req, res, next) => {
  upload.fields([
    { name: "productCover", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ])(req, res, (err) => {
    if (err) {
      return next(err);
    }

    req.productCover = req.files["productCover"]
      ? req.files["productCover"][0]
      : undefined;
    req.productImagesUrls = req.files["images"] || [];
    next();
  });
});

const KEYFILEPATH = path.join(__dirname, "../api.json");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPE,
});
const drive = google.drive({ version: "v3", auth });

const uploadFileToDrive = async (file, parentId) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);

  const fileMetaData = {
    name: file.originalname,
    parents: [parentId],
  };

  const media = {
    mimeType: file.mimetype,
    body: bufferStream,
  };

  const uploadedFile = await drive.files.create({
    requestBody: fileMetaData,
    media,
  });

  return `https://drive.google.com/uc?export=view&id=${uploadedFile.data.id}`;
};

module.exports = {
  uploadFileToDrive,
  uploadFields,
};
