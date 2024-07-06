const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const recievedfileSize = parseInt(req.headers['content-length'], 10);
  const textFileSizeLimitation = 102400;
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else if (
    file.mimetype === 'text/plain' &&
    textFileSizeLimitation >= recievedfileSize
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 102400,
  },
});

const resizeImage = async (filePath) => {
  const outputPath = filePath.replace(/(\.[\w\d_-]+)$/i, '-resized$1');
  await sharp(filePath)
    .resize(320, 240, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFile(outputPath);
  return outputPath;
};

module.exports = { upload, resizeImage };
