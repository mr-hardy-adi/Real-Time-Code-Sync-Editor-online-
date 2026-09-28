
import {useState,useRef, useEffect} from 'react';
import Client from './client.jsx'
import './mainRoom.css'
import toast from "react-hot-toast"
import Editor from './editor.jsx';
import { initSocket } from '../socket.js';
import Actions from '../actions/Actions.js';
import {useLocation} from 'react-router-dom'



export default function () {

    const socketRef = useRef(null);
    const Location = useLocation();

    useEffect(()=>{

        const init = () =>{
            socketRef.current = initSocket();
        

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                navigate('/');
            }

            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

          
        socketRef.current.emit(Actions.JOIN,{
            roomId:Location.state?.roomId,
            userName : Location.state?.userName
        })

    }

       init();

    
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(Actions.JOIN);
            }
        };

 
        

    },[])

    const [clientList,setClientList] = useState([
        {
            socketId:1,
            userName:"Aditya Maurya"
        },
        {
            socketId:2,
            userName:"rakesk j"
        }
    ])

    const handleCopy = ()=>{
        toast.success("Roomid copied!!")
    }

    return<>
        <div className="editorContainer">
            <div className="userCount">
                <div className="inner">
                    <div className="logo">
                    <h2>C@lpha <span>Sync</span></h2>
                    </div>
                    <h3>Connected</h3>
                    <div className="clientList">

                        {clientList.map((client)=>(
                            <Client key={client.socketId} userName={client.userName}/>
                        ))}

                    </div>
                </div>

                <div className="actionBtn">
                    <div className="copyRoomId" onClick={handleCopy}>Copy RoomId</div>
                    <div className="leave">Leave</div>
                </div>
            </div>
            <div className="editorSide">

                        <Editor />

            </div>
        </div>
    </>
}