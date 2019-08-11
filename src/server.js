const express = require( 'express' );
const mongoose = require ( 'mongoose' );
const cors = require( 'cors' );
const port = require('../src/config/config').port;
const MONGO_URL = require('../src/config/config').MONGO_URL;
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection' , socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});


mongoose.connect(MONGO_URL, {
    useNewUrlParser: true});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    next();
});

app.use(cors())

const routes = require('./routes/routes');

app.use(express.json());
app.use('/api', routes);


server.listen(port);