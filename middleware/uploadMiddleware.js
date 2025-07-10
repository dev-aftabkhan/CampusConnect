const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

// Prepare Multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    let folder = 'uploads/unknown';

    if (file.fieldname === 'profilePicture') {
      folder = 'uploads/profile';
    } else if (file.fieldname === 'media') {
      folder = file.mimetype.startsWith('video') ? 'uploads/posts/videos' : 'uploads/posts/images';
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'profilePicture' ? 'profile' : 'post';
    cb(null, `${prefix}_${String(req.user)}_${Date.now()}${ext}`);
  }
});

// File filter (including video duration check)
const fileFilter = async (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
  console.log('MIME:', file.mimetype); 
  if (
  !allowed.includes(file.mimetype) &&
  !file.originalname.toLowerCase().endsWith('.mp4')
) {
  console.log('REJECTED:', file.mimetype, file.originalname);
  return cb(new Error('Only JPEG, PNG, JPG, or MP4 files are allowed'), false);
}

  if (file.mimetype.startsWith('video')) {
    const tempPath = `temp-${Date.now()}-${file.originalname}`;
    const outStream = fs.createWriteStream(tempPath);

    file.stream.pipe(outStream);

    outStream.on('finish', () => {
      ffmpeg.ffprobe(tempPath, (err, metadata) => {
        fs.unlinkSync(tempPath); // delete temp file
        if (err) {
          return cb(new Error('Failed to check video duration'), false);
        }

        const duration = metadata.format.duration;
        console.log('Video duration:', duration);
        if (duration > 30) {
          return cb(new Error('Video exceeds 30 seconds'), false);
        }

        cb(null, true);
      });
    });

    outStream.on('error', (err) => {
      cb(new Error('Failed to write video for duration check'), false);
    });
  } else {
    cb(null, true); // allow images
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
