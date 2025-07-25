const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const followRoutes = require('./routes/followRoutes');
const postRoutes = require('./routes/postRoutes');
const searchRoutes = require('./routes/searchRoutes');
const messageRoutes = require('./routes/message'); 
const notifyRoutes = require('./routes/notificationRoutes');
  

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // 👈 use your real frontend domain
    credentials: true               // 👈 this is required when using cookies/auth
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/posts', postRoutes);
app.use ('/api/search', searchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notifyRoutes);

 

module.exports = app;
