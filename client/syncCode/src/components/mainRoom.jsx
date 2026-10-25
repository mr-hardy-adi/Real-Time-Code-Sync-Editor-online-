import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import Client from './client.jsx';
import Editor from './editor.jsx';
import { initSocket } from '../socket.js';
import Actions from '../actions/Actions.js';
import './mainRoom.css';

export default function MainRoom() {
    const socketRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const codeRef = useRef()

    const roomId = location.state?.roomId;
    const userName = location.state?.userName;
    
    const [clientList, setClientList] = useState([]);


 useEffect(() => {
        if (!roomId || !userName) {
            toast.error('Room ID and Username are required');
            navigate('/');
            return;
        }

        let isMounted = true;

        const init = async () => {
            // Socket instance create hua
            const socket = await initSocket();
            
            // Agar Component unmount ho chuka hai (React Strict Mode re-render),
            // toh yeh socket useless hai, ise TURANT disconnect karo!
            if (!isMounted) {
                socket.disconnect();
                return;
            }

            socketRef.current = socket;

            const handleError = (e) => {
                console.log("error:", e);
                toast.error('Socket connecting issue');
                handleLeave();
            };

             socketRef.current.on('connect_error', handleError);
             socketRef.current.on('connect_failed', handleError);

             socketRef.current.on(Actions.JOINED,({Client,userName,SocketId})=>{
                if(socketRef.current.id !== SocketId){
                toast.success(`${userName} joined Room`);
                }

                socketRef.current.emit(Actions.SYNC_CODE, {
                        code: codeRef.current,
                        SocketId, // Dedicated single user ko bhej rahe hain
                    });

                  

                setClientList(Client);
            })

            socketRef.current.on('DISCONNECTED',({socketId,userName})=>{
                toast.success(`${userName} left the room.`);
                setClientList((prev)=>{return prev.filter((client)=>client.socketId !== socketId)})
            });

            socketRef.current.emit(Actions.JOIN, {
                roomId,
                userName
            });

        
        };

        init();

        // CLEANUP
        return () => {
            isMounted = false; // Guard flag set karo
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(Actions.JOINED);
                socketRef.current.off(Actions.JOIN);
                socketRef.current.off(Actions.CODE_CHANGE);
                socketRef.current.off(Actions.SYNC_CODE)
                socketRef.current.off('DISCONNECTED');
                socketRef.current.off('connect_error');
                socketRef.current.off('connect_failed');
                socketRef.current = null;
            }
        };
    }, [roomId, userName, navigate]);



    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(location.state?.roomId || '');
            toast.success("Room ID copied!");
        } catch (err) {
            toast.error("Could not copy Room ID");
        }
    };

    const handleLeave = () => {
        navigate('/');
    };

    return (
        <div className="editorContainer">
            <div className="userCount">
                <div className="inner">
                    <div className="logo">
                        <h2>C@lpha <span>Sync</span></h2>
                    </div>
                    <h3>Connected</h3>
                    <div className="clientList">
                        {clientList.map((client) => (
                            <Client key={client.socketId} userName={client.userName} />
                        ))}
                    </div>
                </div>

                <div className="actionBtn">
                    <div className="copyRoomId" onClick={handleCopy}>Copy RoomId</div>
                    <div className="leave" onClick={handleLeave}>Leave</div>
                </div>
            </div>
            <div className="editorSide">
                <Editor 
                    socketRef = {socketRef}
                    roomid = {roomId}
                    onChangeCode = {(code)=>codeRef.current = code}
                />
            </div>
        </div>
    );
}