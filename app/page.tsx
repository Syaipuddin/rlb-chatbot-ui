"use client"

import Image from "next/image";
import React, { useEffect } from "react";
import { ReactElement } from "react";


export default function Home() {
  const [textList, setTextList] = React.useState<Array<ReactElement>>([]);
  const [input, setInput ] = React.useState<string>();
  const [isSend, setIsSend] = React.useState<Boolean>(false);
  const [isGet, setIsGet] = React.useState<Boolean>(false);
  const [isCopy, setIsCopy] = React.useState<Boolean>(false);
  const [chatLength, setChatLength] = React.useState<number>(0);

  useEffect(()=> {    

    if (input && isSend) {
      submitChat(input);
    } 

    if(!isGet && !textList.length) {
      getChat();
    }
    
  }, [isSend, isGet])

  useEffect(() => {

  }, [isCopy])

  function copyToClipboard(text: string) {
    setIsCopy(prevIsCopy =>{ 
      return !prevIsCopy;
    });
    navigator.clipboard.writeText(text);
    
  }

  function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

  async function getChat() {
    console.log("Saya ke run!")

    const roomId = localStorage.getItem('roomId');
    const response = await fetch('http://127.0.0.1:5000/get-chat', {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({'roomId': roomId})
    })
    
    if (response.ok) {
      const responseData = await response.json()
      let i = 0;
      responseData.forEach(e => {
        i+=1; 
        setTextList(prevTextList => [
          e.isUser ? chatBoxUser(e.msg, i) : chatboxTarget(e.msg, i),
          ...prevTextList
        ]);

      });

      setChatLength(i);
      i = 0;

      setIsGet(!isGet);
      
    }

  }

  async function submitChat(text: String | undefined) {
    console.log("Saya ke submit!")

    const roomId = localStorage.getItem('roomId');

    setTextList(prevTextList => [chatBoxUser(input, chatLength+1), ...prevTextList])

    if (!roomId) {
      const roomId = makeid(5);
      localStorage.setItem('roomId', roomId);
    }

    console.log(roomId)

    const response = await fetch('http://127.0.0.1:5000/ask', {
      'method': 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({'msg': text, 'roomId': roomId})
    })
    
    if (response.ok) {
      const responseData = await response.json()
      setTextList(prevTextList => [chatboxTarget(responseData.msg, chatLength+1), ...prevTextList]);
      setInput("");

      setIsSend(!isSend);
    }
  }
  
  function chatboxTarget(text: string, key: number): ReactElement {
    const tickElement = <div className="h-fit bg-bubble-main p-2 rounded-md cursor-pointer opacity-0 group-hover:opacity-100" >
                    <i className="text-md fa fa-square-check"></i>
                  </div>
    const copyElement = <div onClick={()=>copyToClipboard(text)} className="h-fit bg-bubble-main p-2 rounded-md cursor-pointer opacity-0 group-hover:opacity-100" >
                    <i className="text-md fa fa-clipboard"></i>
                  </div>
  
    return (
      <div key={key} className="group flex gap-2 ms-4 max-w-72 md:max-w-80">
        <div className="h-fit bg-bubble-main p-2 rounded-md">
          <p className="w-full bg-blue md:text-xl">{text}</p>
        </div>
        {isCopy ? tickElement : copyElement}
        
      </div>
      
    )
  }
  
  function chatBoxUser(text: String | undefined, key: number): ReactElement {
  
    return (
      <div className="ms-auto h-fit max-w-72 md:max-w-80 bg-secondary p-2 me-3 rounded-md">
          <p className="w-full bg-blue md:text-xl">{text}</p>
      </div>
    )
  }
  
  function textInput(): ReactElement {  
    return (
      
      <div className="w-full h-[12vh] md:h-[8vh] fixed bottom-0 textInput flex items-center justify-evenly bg-textInputMain md:w-4/6 lg:mb-5 lg:rounded-b-lg">
        <input onChange={(e)=>setInput(e.target.value)} value={input} className="h-[65%] w-5/6 bg-bubble-main rounded-xl"/>
        <div className="W-1/6" onClick={() => setIsSend(!isSend)}>
          <i className="text-xl md:text-2xl fa fa-paper-plane text-secondary text-bubble-main"></i>
        </div>
      </div>
    )
  }

  return (
    <main className="flex w-screen h-screen flex-col items-center">
      <div className="z-10 w-full min-h-1/5 flex fixed top-0 items-center justify-between font-mono text-sm bg-main md:bg-bubble-main gap-5 p-5 md:w-4/6 lg:mt-5 lg:rounded-t-lg">
        <div className="profile-photo w-12 h-12 md:w-18 md:h-18 overflow-hidden rounded-full" >
          <img className="object-contain" src="https://picsum.photos/200/300"/>
        </div>
        <p className="text-lg md:text-2xl me-auto font-semibold">Chatbot Melati</p>
        <i className="triple-icon text-2xl md:text-3xl fa fa-ellipsis-vertical px-3"></i>
      </div>
      <div className="chatbody w-full flex flex-col-reverse overflow-y-scroll align-items-start gap-3 h-100v py-32 lg:py-28 md:w-4/6 md:bg-body-secondary lg:my-5">
          {textList}
      </div> 
      {textInput()}

      
    </main>
  );
}
