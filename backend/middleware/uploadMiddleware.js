const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'unknown';
    if (file.fieldname === 'profilePicture') folder = 'profile';
    else if (file.fieldname === 'media') {
      folder = file.mimetype.startsWith('video') ? 'posts/videos' : 'posts/images';
    }

    return {
      folder: folder,
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
      public_id: `${file.fieldname}_${req.user}_${Date.now()}`
    };
  }
});

// Optional: keep fileFilter for validation
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];
  if (!allowed.includes(file.mimetype)) return cb(new Error('Invalid file type'), false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
