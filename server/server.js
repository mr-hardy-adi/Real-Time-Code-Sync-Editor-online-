const express = require('express')
const httpserver = require('http')
const {Server} = require('socket.io')

const app = express();
const server = httpserver.createServer(app)
const io = new Server(server);

io.on('connection',(socket)=>{
    console.log("socket connected id is",socket.id);
})

const PORT = 3000;

server.listen(PORT,()=>{
    console.log("server is running on port ",PORT);
})