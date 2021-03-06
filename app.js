const fastify = require('fastify');

const app = async (opts) => {
  const app = fastify(opts);

  // Middleware
  app.register(require('fastify-cors'));

  // Routes
  app.register(require('./routes/api/auth'), { prefix: '/api/auth' });
  app.register(require('./routes/api/movies'), { prefix: '/api/movies' });
  app.register(require('./routes/api/search'), { prefix: '/api/search' });
  app.register(require('./routes/api/user'), { prefix: '/api' });

  // Static files
  app.register(require('fastify-static'), { root: __dirname, prefix: '/client/build/' });

  if (process.env.NODE_ENV === 'production') {
    app.get('/', (req, reply) => {
      return reply.sendFile('index.html');
    });
  }

  return app;
};

module.exports = app;
