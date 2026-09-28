
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomCreate from './components/roomCreate';
import "./App.css";
import { Toaster } from "react-hot-toast";
import MainRoom from "./components/mainRoom.jsx";

export default function(){

  return <>

   <Toaster 
        position="top-right"
        reverseOrder={false}
        />

  <BrowserRouter>
    <Routes>
      <Route path='/' element={<RoomCreate />} />
      <Route path='/editor/:roomId' element={<MainRoom />} />
    </Routes>
  </BrowserRouter>
    
  </>
}