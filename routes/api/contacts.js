const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contacts');
const { validateBody, isValidId, authenticate } = require('../../midelwares');
const { schemas } = require('../../schemas/contact');

router.get('/', authenticate, ctrl.getConcontacts);
router.get('/:id', authenticate, isValidId, ctrl.getContactById);
// router.get(
//   '/:favotite',
//   authenticate,
//   isValidId,
//   ctrl.getFilterContactByFavorite
// );
router.post(
  '/',
  authenticate,
  validateBody(schemas.addSchema),
  ctrl.contactAdd
);
router.put(
  '/:id',
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContactById
);
router.patch(
  '/:id/favorite',
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);
router.delete('/:id', authenticate, isValidId, ctrl.deleteContactById);

module.exports = router;
