const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { env } = require('../config/env');
const { ApiError } = require('../utils/ApiError');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../uploads/avatars'),
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp']);
    if (!allowed.has(ext)) return cb(new ApiError(400, 'Invalid file extension.'));
    cb(null, `${crypto.randomBytes(16).toString('hex')}${ext}`);
  },
});

const avatarUpload = multer({
  storage,
  limits: { fileSize: env.maxAvatarBytes },
  fileFilter(_req, file, cb) {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowed.has(file.mimetype)) return cb(new ApiError(400, 'Only JPG, PNG, or WebP images are allowed.'));
    cb(null, true);
  },
}).single('avatar');

module.exports = { avatarUpload };
