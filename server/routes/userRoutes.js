const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const {
  getProfile,
  updateProfile,
  updatePrivacy,
  updateNotifications,
  updateAppearance,
  changePassword,
  updateSecuritySettings,
  uploadAvatar,
  searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect); // All user routes require auth

router.get('/me', getProfile);
router.get('/search', searchUsers);

router.put(
  '/profile',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().trim().isEmail().withMessage('Please enter a valid email'),
  ],
  updateProfile
);

router.put('/privacy', updatePrivacy);
router.put('/notifications', updateNotifications);
router.put('/appearance', updateAppearance);
router.put('/security/password', changePassword);
router.put('/security/settings', updateSecuritySettings);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;
