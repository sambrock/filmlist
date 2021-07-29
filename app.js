const fastify = require('fastify');
const jwt = require('jsonwebtoken');

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const app = async (opts) => {
  const app = fastify(opts);

  // Middleware
  app.register(require('fastify-cors'));


  // Routes
  app.register(require('./routes/api/auth'), { prefix: '/api/auth' });
  app.register(require('./routes/api/movies'), { prefix: '/api/movies' });
  app.register(require('./routes/api/search'), { prefix: '/api/search' });
  app.register(require('./routes/api/user'), { prefix: '/api' });

  return app;
};

module.exports = app;
