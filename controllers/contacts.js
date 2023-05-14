const { Contact } = require('../models/contact');
// >???
const { HttpError, ctrlWrapper } = require('../helpers');

const getAllConcontacts = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

const getContactById = async (req, res) => {
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
const updateContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};
const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const deleteContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json({
    message: 'Delete success',
  });
};
module.exports = {
  getAllConcontacts: ctrlWrapper(getAllConcontacts),
  contactAdd: ctrlWrapper(contactAdd),
  getContactById: ctrlWrapper(getContactById),
  updateContactById: ctrlWrapper(updateContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteContactById: ctrlWrapper(deleteContactById),
};
