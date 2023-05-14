const express = require('express');
const { validateBody, isValidId } = require('../../midelwares');
const { schemas } = require('../../models/user');
const router = express.Router();
const ctrt = require('../../controllers/auth');

router.post(
  '/register',
  validateBody(schemas.registerSchema),
  ctrt.registerUser
);

module.exports = router;
