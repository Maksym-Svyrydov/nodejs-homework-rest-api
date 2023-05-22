const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { User } = require('../models/user');
const { HttpError, ctrlWrapper } = require('../helpers');
const { SECRET_KEY } = process.env;
const path = require('path');
const avatarDir = path.join(__dirname, '../', 'public', 'avatars');
const fs = require('fs/promises');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const checkUserEmail = await User.findOne({ email });
  if (checkUserEmail) {
    throw HttpError(400);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400);
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    status: 'OK',
    code: 200,
    data: {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
};
const getCurrentUser = async (req, res) => {
  const { id, email, subscription } = req.user;
  if (!email) {
    throw HttpError(401);
  }
  res.json({ status: 'OK', code: 200, id, email, subscription });
};

const logoutCurrenUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.json({ status: 'No Content', code: 204, message: 'Logout success' });
};

const updeteStatusUser = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription: subscription });
  res.json({ email, subscription });
};

const updateUserAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

module.exports = {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logoutCurrenUser: ctrlWrapper(logoutCurrenUser),
  updeteStatusUser: ctrlWrapper(updeteStatusUser),
  updateUserAvatar: ctrlWrapper(updateUserAvatar),
};
