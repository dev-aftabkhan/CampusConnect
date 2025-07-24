require('dotenv').config();
const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');
const socketHandler = require('./sockets/socketHandler');
 

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*'
  }
});

socketHandler(io);
 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
