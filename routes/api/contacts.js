const express = require('express');
const ctrl = require('../../controllers/contacts');
const { authenticate, isValidId } = require('../../middlewares');
const router = express.Router();

router.get('/', authenticate, ctrl.listContacts);

router.get('/:id', authenticate, isValidId, ctrl.getContactById);

router.post('/', authenticate, ctrl.addContact);

router.put('/:id', authenticate, isValidId, ctrl.updateContact);

router.patch('/:id/favorite', authenticate, isValidId, ctrl.updateFavorite);

router.delete('/:id', authenticate, isValidId, ctrl.removeContact);

module.exports = router;
