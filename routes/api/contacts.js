const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contacts');
const { validateBody, isValidId } = require('../../midelwares');
const { schemas } = require('../../models/contact');

router.get('/', ctrl.getAll);
router.get('/:id', isValidId, ctrl.getById);
router.post('/', validateBody(schemas.addSchema), ctrl.contactAdd);
router.put('/:id', isValidId, validateBody(schemas.addSchema), ctrl.updateById);
router.patch(
  '/:id/favorite',
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);
router.delete('/:id', isValidId, ctrl.deleteById);

module.exports = router;
