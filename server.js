require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

if (!process.env.JWT_PRIVATE_KEY) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.DB_CONFIG, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error', err));

//test
// Use routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/movies', require('./routes/api/movies'));
app.use('/api/search', require('./routes/api/search'));
app.use('/api', require('./routes/api/user'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));
