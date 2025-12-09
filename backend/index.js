const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// db
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// route
const formRoutes = require('./routes/form.routes');
app.use('/api', formRoutes);

app.get('/', (req, res) => {
  res.send('Form Builder API is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});