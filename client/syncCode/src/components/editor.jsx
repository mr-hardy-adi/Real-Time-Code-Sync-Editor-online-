import React,{useEffect, useState,useRef} from "react";
import Codemirror from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript';
import { oneDark } from "@uiw/react-codemirror";
import { closeBrackets, autocompletion } from '@codemirror/autocomplete';
import Actions from "../actions/Actions";

export default function({socketRef,roomid,onChangeCode}){

    const [code,setCode] = useState('//start coding here.....');
    const remoteChange = useRef(false);

    useEffect(()=>{
        if(!socketRef.current){
            return;
        }

        //recieving the code...
        socketRef.current.on(Actions.CODE_CHANGE,({newCode})=>{
            if(newCode !== null){
                remoteChange.current = true;
                setCode(newCode);
            }
        })


        return ()=>{
            if(socketRef.current){
                socketRef.current.off(Actions.CODE_CHANGE);
            }
        }
    },[socketRef.current])


    const handleCodeChange = (value) =>{
        onChangeCode(value);
        setCode(value);

        
        if(!remoteChange.current){
            socketRef.current?.emit(Actions.CODE_CHANGE,{
                roomid,
                newCode:value
            })
        }

        remoteChange.current = false;
    }



    return<>
        <Codemirror 
            value={code}
            height="100%"
            theme={oneDark}
            extensions={
                [
                    javascript({ jsx: true }),
                    closeBrackets(),
                    autocompletion()
                ]
            }
            onChange={handleCodeChange}
            className="cm-wrapper"
        />
    </>
}