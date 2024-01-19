const path = require('path');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Jimp = require('jimp');
const gravatar = require('gravatar');
const User = require('../models/user');
require('dotenv').config();

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const { ctrlWrapper, HttpError } = require('../helpers/index');
const { registerSchema, loginSchema } = require('../schemas/auth-schema');

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message);
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await User.findOneAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, 'Not found photo');
  }
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  const newOriginalname = `${_id}_${originalname}`;
  const resultDirUpload = path.join(avatarsDir, newOriginalname);

  Jimp.read(tmpUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).write(resultDirUpload);
    })
    .catch((err) => {
      console.error(err);
    });

  await fs.rename(tmpUpload, resultDirUpload);

  const avatarUrl = path.join('avatars', newOriginalname);

  await User.findByIdAndUpdate(_id, { avatarUrl });

  res.json({ avatarUrl });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
