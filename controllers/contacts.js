const { Contact } = require('../models/contact');

const { HttpError, ctrlWrapper } = require('../helpers');

const getConcontacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (favorite) {
    const favoriteContacts = await Contact.find(
      { owner },
      '-createdAt -updatedAt'
    )
      .where('favorite')
      .equals(favorite)
      .populate('owner', 'name email', { skip, limit });
    res.json(favoriteContacts);
  } else {
    const result = await Contact.find(
      { owner },
      '-createdAt -updatedAt'
    ).populate('owner', 'name email', { skip, limit });
    res.json(result);
  }
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

// const getFilterContactByFavorite = async (req, res) => {
//   const { s } = req.params;
// };

const contactAdd = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
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
  getConcontacts: ctrlWrapper(getConcontacts),
  contactAdd: ctrlWrapper(contactAdd),
  getContactById: ctrlWrapper(getContactById),
  updateContactById: ctrlWrapper(updateContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteContactById: ctrlWrapper(deleteContactById),
  // getFilterContactByFavorite: ctrlWrapper(getFilterContactByFavorite),
};
