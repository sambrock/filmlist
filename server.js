require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const build = require('./app');

const start = async () => {
  if (!process.env.JWT_PRIVATE_KEY) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
  }

  // Connect to MongoDB
  mongoose
    .connect(process.env.DB_CONFIG, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error', err));

  const server = await build({ logger: true });

  server.listen(process.env.PORT, (err, address) => {
    if (err) {
      console.err;
    }

    console.log(`Listening on port ${process.env.PORT}`);
  });
};

start();
