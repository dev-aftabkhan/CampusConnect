require('dotenv').config();
const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');
const socketHandler = require('./sockets/socketHandler');

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:5173', // 👈 use your real frontend domain here
    methods: ['GET', 'POST'],
    credentials: true               // 👈 this is required when using cookies/auth
  }
});


socketHandler(io);


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
