import {io} from 'socket.io-client';

export const  initSocket= async () =>{

  const options = {
        'force new connection': true,
        reconnectionAttempts: Infinity, // lowercase 'reconnectionAttempts'
        timeout: 10000,
        transports: ['websocket'],
    };

    return io('http://localhost:3000',options); //it will returns an instance...
    
}