const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contacts');
const { validateBody, isValidId } = require('../../midelwares');
const { schemas } = require('../../schemas/contact');

router.get('/', ctrl.getAllConcontacts);
router.get('/:id', isValidId, ctrl.getContactById);
router.post('/', validateBody(schemas.addSchema), ctrl.contactAdd);
router.put(
  '/:id',
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContactById
);
router.patch(
  '/:id/favorite',
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);
router.delete('/:id', isValidId, ctrl.deleteContactById);

module.exports = router;
