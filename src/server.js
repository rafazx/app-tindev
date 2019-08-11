const express = require( 'express' );
const mongoose = require ( 'mongoose' );
const cors = require( 'cors' );

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection' , socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});



const dbUrl = 'mongodb+srv://tinderApp:1rSWE951PPFZXOvL@cluster0-verop.mongodb.net/Dev?retryWrites=true&w=majority';
mongoose.connect(dbUrl, {
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


server.listen(3333);