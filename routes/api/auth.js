const _ = require('lodash');

const User = require('../../models/user');
const auth = require('../../middleware/auth');
const { validateUser } = require('../../utils');

const authRoutes = async (fastify) => {
  fastify.post('/register', async (req, reply) => {
    const { error } = validateUser(req.body);
    if (error) return reply.status(400).send({ id: 'REGISTER_ERROR', msg: error.details[0].message });

    let user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] }).collation({ locale: 'en', strength: 2 });
    if (user) return reply.status(400).send({ type: 'REGISTER_ERROR', msg: 'User already registered.' });

    user = new User(_.pick(req.body, ['username', 'email', 'password']));

    user.password = await user.generateHash(user.password);

    try {
      await user.save();
    } catch (ex) {
      if (ex.code === 11000) ex.message = 'Username already exists.';
      return reply.status(400).send({ id: 'REGISTER_ERROR', msg: ex.message });
    }

    const token = user.generateAuthToken();
    return reply.status(200).send({ token, user: { id: user._id, username: user.username, email: user.email } });
  });

  fastify.post('/login', async (req, reply) => {
    if (!req.body.email || !req.body.password) return reply.status(400).send({ id: 'LOGIN_ERROR', msg: 'Please enter all fields.' });

    let user = await User.findOne({ email: req.body.email });
    if (!user) return reply.status(400).send({ id: 'LOGIN_ERROR', msg: 'Invalid email or password.' });

    const validPassword = await user.validPassword(req.body.password);
    if (!validPassword) return reply.status(400).send({ id: 'LOGIN_ERROR', msg: 'Invalid email or password.' });

    const token = user.generateAuthToken();
    reply.send({ token, user: { id: user._id, username: user.username, email: user.email } });
  });

  fastify.get('/user', { preValidation: auth }, async (req, reply) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) throw Error('User does not exist');
      reply.send(user);
    } catch (err) {
      reply.status(400).send({ id: 'USER_ERROR', msg: err.message });
    }
  });
};

module.exports = authRoutes;
