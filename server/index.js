const express = require('express');
const mongoose = require('mongoose');
const { ExpressPeerServer } = require('peer');
const authRoutes = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/messaging', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use('/api/auth', authRoutes);

const server = app.listen(3001, () => {
    console.log('Signaling server running on port 3001');
});

const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use('/peerjs', peerServer);