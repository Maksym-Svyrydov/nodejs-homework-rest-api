const { Contact } = require('../models/contact');

const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const contactAdd = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};
module.exports = {
  getAll: ctrlWrapper(getAll),
  contactAdd: ctrlWrapper(contactAdd),
  getById: ctrlWrapper(getById),
};
