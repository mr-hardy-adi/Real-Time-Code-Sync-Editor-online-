const express = require('express')
const httpserver = require('http')
const {Server} = require('socket.io')
const Actions = require('../client/syncCode/src/actions/Actions.js')

const app = express();
const server = httpserver.createServer(app)
const io = new Server(server,{
    cors:{
        origin:'*'
    }
});

const userSocketMap = {};

const getAllClients = (roomId)=>{
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            userName:userSocketMap[socketId]
        }
    })
}

io.on('connection',(socket)=>{
    console.log("socket connected, id is",socket.id);

    socket.on('join',({roomId,userName})=>{
        socket.join(roomId);
        console.log('socket joined',userName)
        userSocketMap[socket.id] = userName;
        // console.log(io.sockets.adapter.rooms.get(roomId))

        const Client = getAllClients(roomId);

        //inform every one that user joined

        Client.forEach(({socketId})=>{
            io.to(socketId).emit('joined',{
                Client,
                userName,
                SocketId : socket.id
            })
        })
    })

//real time code sharing.............
    socket.on('code_Change',({roomid,newCode})=>{

        socket.in(roomid).emit('code_Change',{newCode})

    })

    socket.on('sync_code', ({ code,SocketId }) => {
        // io.to(socketId) -> sirf us particular naye bande ki individual room me emit karo
        let newCode = code;
        console.log(`Sync_code ${newCode}`)
        io.to(SocketId).emit('code_Change', {newCode});
    });


    // Correct syntax using socket.on()
socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
        socket.in(roomId).emit('DISCONNECTED', {
            socketId: socket.id,
            userName: userSocketMap[socket.id],
        });
    });
    delete userSocketMap[socket.id];
});

})

const PORT = 3000;

server.listen(PORT,()=>{
    console.log("server is running on port ",PORT);
})