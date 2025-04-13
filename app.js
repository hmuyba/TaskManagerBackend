var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var authRoutes = require('./routes/auth.routes');
var taskRoutes = require('./routes/task.routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const cors = require("cors");
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  credentials: true 
}));


app.use('/api/auth', authRoutes);
app.use('/api/tasks',taskRoutes);

// Add this in app.js before module.exports
app.get('/api/testtasks', (req, res) => {
  res.json({ message: 'Task test route works' });
});

module.exports = app;
