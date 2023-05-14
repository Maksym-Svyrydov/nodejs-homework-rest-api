const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require('../helpers');

const registerUser = async (req, res) => {
  const { email } = req.body;
  const checkUserEmail = await User.findOne({ email });
  if (checkUserEmail) {
    throw HttpError(409, `That email: ${email} is not unique`);
  }
  const newUser = await User.create(req.body);
  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};
module.exports = {
  registerUser: ctrlWrapper(registerUser),
};
