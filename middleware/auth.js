const jwt = require('jsonwebtoken');

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

module.exports = function (req, reply, done) {
  const token = req.headers['x-auth-token'];
  if (!token) return reply.status(401).send('Access denied. Not authorised.');

  try {
    const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
    req.user = decoded;
    done();
  } catch (err) {
    reply.status(400).send('Invalid token.');
    done();
  }
};
