const express = require('express');
const ctrl = require('../../controllers/auth');
const { validateBody, authenticate } = require('../../midelwares');
// isValidId;
const { schemas } = require('../../models/user');
const router = express.Router();

router.post(
  '/register',
  validateBody(schemas.registerSchema),
  ctrl.registerUser
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
module.exports = router;
