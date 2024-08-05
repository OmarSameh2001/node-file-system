const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/file-system', { 
}).then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB', error));

// User routes
app.use('/user', userRoutes);


const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});