const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const { SECRET_KEY, BASE_URL } = process.env;

const { User } = require('../models/user');
const { HttpError, ctrlWrapper, sendEmail } = require('../helpers');
const avatarDir = path.join(__dirname, '../', 'public', 'avatars');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const checkUserEmail = await User.findOne({ email });
  if (checkUserEmail) {
    throw HttpError(400);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target='_blank' href='${BASE_URL}/users/verify/${verificationCode}'>verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: '',
  });
  res.status(200).json({
    status: 'OK',
    code: 200,
    message: 'Verification successful',
  });
};
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(401, 'Email already verify');
  }
  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target='_blank' href='${BASE_URL}/users/verify/${user.verificationCode}'>verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    message: 'Verify email send success',
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400);
  }
  if (!user.verify) {
    throw HttpError(404, 'Email not verified');
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
  await Jimp.read(`${tempUpload}`)
    .then((image) => {
      return image.resize(250, 250).writeAsync(`${tempUpload}`); // save
    })
    .catch((err) => {
      console.error(err);
    });
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
  verifyEmail: ctrlWrapper(verifyEmail),
  loginUser: ctrlWrapper(loginUser),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logoutCurrenUser: ctrlWrapper(logoutCurrenUser),
  updeteStatusUser: ctrlWrapper(updeteStatusUser),
  updateUserAvatar: ctrlWrapper(updateUserAvatar),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
