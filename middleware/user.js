const jwt = require('jsonwebtoken');

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

module.exports = function (req, reply, done) {
  const token = req.headers['x-auth-token'];
    if (!token) done();

  try {
    const decoded = jwt.verify(token, jwtPrivateKey);
    req.user = decoded;
    done();
  } catch (ex) {
    done();
  }
}