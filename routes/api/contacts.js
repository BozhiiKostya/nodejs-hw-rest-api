const express = require('express');
const Joi = require('joi');
const contacts = require('../../models/contacts');

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(6).required(),
  phone: Joi.number().min(6).required(),
});

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      const err = new Error('Not faund');
      err.status = 404;
      throw err;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    console.log(error);
    if (error) {
      error.status = 400;
      error.message = 'missing required name field';
      throw error;
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    if (!result) {
      const err = new Error('Not faund');
      err.status = 404;
      throw err;
    }
    res.json('contact deleted');
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    console.log(error);
    if (error) {
      error.status = 400;
      error.message = 'missing required name field';
      throw error;
    }
    const { id } = req.params;
    const result = await contacts.updateContact(id, req.body);
    if (!result) {
      const err = new Error('missing fields');
      err.status = 400;
      throw err;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
