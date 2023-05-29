const express = require('express');
const ctrl = require('../../controllers/auth');
const { validateBody, authenticate, upload } = require('../../midelwares');
// isValidId;
const { schemas } = require('../../schemas/user');
const router = express.Router();

router.post(
  '/register',
  validateBody(schemas.registerSchema),
  ctrl.registerUser
);
router.get('/verify/:verificationCode', ctrl.verifyEmail);
router.post(
  '/verify',
  validateBody(schemas.emailShema),
  ctrl.resendVerifyEmail
);

router.post('/login', validateBody(schemas.loginSchema), ctrl.loginUser);

router.get('/current', authenticate, ctrl.getCurrentUser);

router.post(
  '/logout',
  authenticate,
  validateBody(schemas.loginSchema),
  ctrl.logoutCurrenUser
);
router.patch(
  '/',
  authenticate,
  validateBody(schemas.updateSubscription),
  ctrl.updeteStatusUser
);
router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  ctrl.updateUserAvatar
);
module.exports = router;
