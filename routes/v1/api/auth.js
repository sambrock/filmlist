const express = require('express');
const _ = require('lodash');

const router = express.Router();

const User = require('../../../models/user');
const auth = require('../../../middleware/auth');
const { validateUser } = require('../../../utils');

// @route   POST api/users
// @desc    Register users
// @access  Public
router.post('/register', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send({ id: 'REGISTER_ERROR', msg: error.details[0].message });

  let user = await User.findOne({$or: [{ email: req.body.email }, { username: req.body.username }]}).collation({ locale: 'en', strength: 2 });
  if (user) return res.status(400).send({ type: 'REGISTER_ERROR', msg: 'User already registered.' });

  user = new User(_.pick(req.body, ['username', 'email', 'password']));

  user.password = await user.generateHash(user.password);

  try {
    await user.save();
  } catch (ex) {
    if (ex.code === 11000) ex.message = 'Username already exists.';
    return res.status(400).send({ id: 'REGISTER_ERROR', msg: ex.message });
  }

  const token = user.generateAuthToken();
  return res.status(200).send({ token, user: { id: user._id, username: user.username, email: user.email } })
})

// @route   POST api/auth
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) return res.status(400).send({ id: 'LOGIN_ERROR', msg: 'Please enter all fields.' });

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ id: 'LOGIN_ERROR', msg: 'Invalid email or password.' });

  const validPassword = await user.validPassword(req.body.password);
  if (!validPassword) return res.status(400).send({ id: 'LOGIN_ERROR', msg: 'Invalid email or password.' });

  const token = user.generateAuthToken();
  res.send({ token, user: { id: user._id, username: user.username, email: user.email } });
})

// @route   POST api/auth
// @desc    Get user info
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').select('-watchlist');
    if (!user) throw Error('User Does not exist');
    res.send(user);
  } catch (err) {
    res.status(400).send({ id: 'USER_ERROR', msg: err.message });
  }
})

module.exports = router;

