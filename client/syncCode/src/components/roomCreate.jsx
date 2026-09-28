import {v4 as uuidV4} from 'uuid';
import { useEffect,useState } from 'react';
import "./roomCre.css";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RoomCreate() {

    const [roomId,setRoomId] = useState('');
    const [userName,setUserName] = useState('');
    const navigate = useNavigate();

    const handleCRoom = ()=>{
        const roomHash = uuidV4();
        setRoomId(roomHash);
        toast.success("RoomId generated!!",{})
    }

    const handleJoinEvent = ()=>{

        if(!roomId || !userName){
            toast.error("Empty Input!!");
            return;
        }

        //Regitrect
        navigate(`/editor/${roomId}`,{
            state:{
                roomId,
                userName
            }
        })

    }

    const handleEnter = (e)=>{
      if(e.code === "Enter"){
        handleJoinEvent();
      }
    }
  return (
    
    <div className="roomCreContainer">
       
      <div className="mainBox">
        <div className="header">
          <h1>Code@lpha sync</h1>
        </div>
        <div className="actions">
          <label htmlFor="room_id">Room ID:</label>
          <input
            id="room_id"
            type="text"
            placeholder="Type Room ID..."
            value={roomId}
            onChange={(e)=>setRoomId(e.target.value)}
             onKeyUp={handleEnter}
          />
          <label htmlFor="UserName">Username:</label>
          <input
            id="userNAme"
            type="text"
            placeholder="Username....."
             value={userName}
            onChange={(e)=>setUserName(e.target.value)}
            onKeyUp={handleEnter}
          />
          <button id="joinBtn" onClick={handleJoinEvent}>Join</button>
        </div>
        <div className="generate">
            <p>Click here for create new room<span onClick={handleCRoom} >Create Room</span></p>
        </div>
      </div>
    </div>
  );
}