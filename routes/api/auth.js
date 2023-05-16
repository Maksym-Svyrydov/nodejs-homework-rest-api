const express = require('express');
const ctrl = require('../../controllers/auth');
const { validateBody } = require('../../midelwares');
// isValidId;
const { schemas } = require('../../models/user');
const router = express.Router();

router.post(
  '/register',
  validateBody(schemas.registerSchema),
  ctrl.registerUser
);
router.post('/login', validateBody(schemas.loginSchema), ctrl.loginUser);
module.exports = router;
