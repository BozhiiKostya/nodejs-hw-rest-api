const Contact = require('../models/contact');
const {
  postSchema,
  putSchema,
  patchSchema,
} = require('../schemas/contact-schema');
const { ctrlWrapper, HttpError } = require('../helpers/index');

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (favorite) {
    const result = await Contact.find(
      { owner, favorite },
      '-createdAt -updatedAt',
      {
        skip,
        limit,
      }
    ).populate('owner', 'email');
    res.json(result);
  }
  const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'email');
  res.json(result);
};

const getContactById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findOne(
    { _id: id, owner },
    '-createdAt -updatedAt'
  );
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { error } = postSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { error } = putSchema.validate(req.body);
  const { id } = req.params;

  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { _id: owner } = req.user;
  const { error } = patchSchema.validate(req.body);
  const { id } = req.params;

  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const removeContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json({ message: 'contact deleted' });
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
  removeContact: ctrlWrapper(removeContact),
};
