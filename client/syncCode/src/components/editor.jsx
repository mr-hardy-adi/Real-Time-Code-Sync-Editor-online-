import React,{useState} from "react";
import Codemirror from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript';
import { oneDark } from "@uiw/react-codemirror";
import { closeBrackets, autocompletion } from '@codemirror/autocomplete';

export default function(){

    const [code,setCode] = useState('//start coding here.....');

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
            onChange={(value) => setCode(value)}
            className="cm-wrapper"
        />
    </>
}