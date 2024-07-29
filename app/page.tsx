"use client"

import React, { ReactNode, useEffect } from "react";
import { ReactElement } from "react";
import avatar from '../assets/img/avatar.png';
import Image from "next/image";
import { setLazyProp } from "next/dist/server/api-utils";
import DOMPurify from 'dompurify';
const baseUrl : string = 'https://geographical-carlota-udinify-f6ff8f77.koyeb.app';
// const baseUrl : string = "http://127.0.0.1:5000";

interface chatObject {
  id: string | number,
  msg: string |undefined,
  isCopy: boolean,
  isUser: boolean
}

interface chatObjectResponse {
  _id: {
    $oid: string
  };
  id: object
  msg: string | undefined,
  isCopy: boolean,
  isUser: boolean
}

export default function Home() {
  const [data, setData] = React.useState<Array<chatObject>>([]);
  const [textbox, setTextBox ] = React.useState<string>();
  const [input, setInput] = React.useState<string>();
  const [isSend, setIsSend] = React.useState<Boolean>(false);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [isAlert, setIsAlert] = React.useState(true);
  const [topicList, setTopicList] = React.useState<Array<String>>([
      "Profil Desa Melati 2",
      "KTP (Kartu Tanda Penduduk)",
      "Surat Pindah",
      "Surat Kedatangan",
      "Surat Keterangan Lahir",
      "Kartu Keluarga (KK)",
      "Surat Keterangan Domisili",
      "Surat Tanah",
      "Surat Keterangan Catatan Kepolisian (SKCK)",
      "Surat Keterangan Tidak Mampu (SKTM)",
      "Surat Keterangan Usaha (SKU)",
      "Kartu Identitas Anak (KIA)"
  ]);

  useEffect(()=> { 
    
    if(!sessionStorage.getItem('roomId')) {
      sessionStorage.setItem('roomId', makeid(5))
    }

    if (input && isSend) {
      submitChat(input);
    } 

    if(!data.length) {
      getChat();
    }

    if (isUpdate) {
      setIsUpdate(!isUpdate);
    }
    
  }, [isSend, isUpdate])

  function makeid(length: number) : string {
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


function chatBoxUser(e : chatObject): ReactElement {
  
  return (
    <div key={e.id} className="ms-auto h-fit max-w-[80vw] md:max-w-[35vw]  bg-secondary p-2 me-3 rounded-md">
        <p className="w-full bg-blue md:text-xl">{e.msg}</p>
    </div>
  )
}

function handleCopy(e : chatObject, index : number, isCopy : boolean) {
  const newData = [...data];
    newData[index] = {
      id: e.id,
      msg: e.msg,
      isCopy: isCopy,
      isUser: e.isUser
    };
    setData(newData);
}

function chatboxTarget( e : chatObject, index: number ) {

  function copyToClipboard(text: string | undefined) {
    handleCopy(e, index, true);
    navigator.clipboard.writeText(text ? text : "");

    setTimeout(() => {
      handleCopy(e, index, false);
    }, 5000);
  }

  const sanitizedMsg = DOMPurify.sanitize(e.msg);

  const tickElement = (
    <div className="h-fit bg-bubble-main p-2 rounded-md cursor-pointer">
      <i className="text-md fa fa-square-check text-green-600"></i>
    </div>
  );
  const copyElement = (
    <div onClick={() => copyToClipboard(e.msg)} className="h-fit bg-bubble-main p-2 rounded-md cursor-pointer">
      <i className="text-md fa fa-clipboard text-slate-500"></i>
    </div>
  );

  return (
    <div key={e.id} className="relative flex gap-2 ms-4 max-w-[80vw] md:max-w-[35vw]">
      <div className="h-fit w-fit bg-bubble-main p-2 rounded-md">
        <p className="w-full bg-blue md:text-xl" dangerouslySetInnerHTML={{ __html: sanitizedMsg }} />
      </div>
      {e.isCopy ? tickElement : copyElement}
      {/* {isCopy ? copiedAlert() : false} */}
    </div>
  );
}

  async function getChat() {

    const response = await fetch(`${baseUrl}/get-chat`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({'roomId': sessionStorage.getItem('roomId')})
    })
    
    if (response.ok) {
      const responseData = await response.json()
      setData([]);
      if (responseData.length > 0) {
          responseData.map((e: chatObjectResponse) => { 
          setData( prevData => [...prevData, {
            id: e._id.$oid,
            msg: e.msg,
            isCopy: false,
            isUser: e.isUser
          }])
        });
      } else {
        if(!isSend) {
          setInput('Mulai Chatbot Melati');
          setIsSend(true);
        }
        
      }
      
      
    }

  }

  async function submitChat(text: String | undefined) {
    console.log("Saya ke submit!")

    const response = await fetch(`${baseUrl}/ask`, {
      'method': 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      'body': JSON.stringify({'msg': text, 'roomId': sessionStorage.getItem('roomId')})
    });
    setInput("");
    
    if (response.ok) {
      getChat();
      setIsSend(false);
    }
  }
  
  function textInput(): ReactElement {  
    return (   
      <form onSubmit={(e) => {
        e.preventDefault();
        setInput(textbox);
                setTextBox("");
                setData((prevData) => [
                  { 
                    id: 1,
                    msg: textbox,
                    isCopy: false,
                    isUser: true
                  },
                  ...prevData, 
                ]);

              setIsUpdate(!isUpdate);

              setTimeout(() => {
                setIsSend(true);
              }, 500)
              
              }
       } className="w-full h-[12vh] md:h-[8vh] fixed bottom-0 textInput flex items-center justify-evenly bg-textInputMain md:w-4/6 lg:mb-5 lg:rounded-b-lg">
            <input onChange={(e)=>setTextBox(e.target.value)} value={textbox} placeholder="Masukkan Pesan" className="h-[65%] w-5/6 bg-bubble-main rounded-xl p-2"/>
            <div className="W-1/6 cursor-pointer" onClick={() => {
                setInput(textbox);
                setTextBox("");
                setData((prevData) => [
                  { 
                    id: 1,
                    msg: textbox,
                    isCopy: false,
                    isUser: true
                  },
                  ...prevData, 
                ]);

              setIsUpdate(!isUpdate);

              setTimeout(() => {
                setIsSend(true);
              }, 500)
              
              }}>
              <i className="text-xl md:text-2xl fa fa-paper-plane text-secondary text-bubble-main"></i>
            </div>
      </form>
    )
  }

  function Alert() {

    const list : Array<ReactNode>  = topicList.map((e : String, index : number) => {
      return (
        <li key={index}>{e}</li>
      )
    })

    return (
      <div className="absolute w-full h-full z-50 flex flex-col justify-center items-center backdrop-blur-sm">
        <div className="w-5/6 md:w-3/6 h-fit bg-white rounded-lg p-3 flex flex-col gap-2">
          <p className="text-2xl font-semibold">Selamat datang di Chatbot Desa Melati 2</p>
          <p className="block">Anda bisa menanyakan terkait informasi yang ingin diketahui melalui layanan ini. Pertanyaan yang bisa diajukan berkaitan dengan:</p>
          <div className="">
            {list}
          </div>
          <div onClick={(e)=> {
            setIsAlert(!isAlert);
          }} className="w-3/5 h-fit bg-secondary p-2 font-semibold mx-auto rounded-md mt-3 cursor-pointer">
            <p className="w-fit mx-auto caret-transparent">Ok</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex w-screen h-screen flex-col items-center">

      {isAlert && <Alert />}
      <div className="z-10 w-full min-h-1/5 flex fixed top-0 items-center justify-between font-mono text-sm bg-main md:bg-bubble-main gap-5 p-5 md:w-4/6 lg:mt-5 lg:rounded-t-lg">
        <div className="profile-photo w-12 h-12 md:w-18 md:h-18 overflow-hidden rounded-full relative" >
          <Image className="object-contain" fill src={avatar.src} alt="profile-picture" />
        </div>
        <p className="text-lg md:text-2xl me-auto font-semibold">Chatbot Melati</p>
        <i className="triple-icon text-2xl md:text-3xl fa fa-ellipsis-vertical px-3"></i>
      </div>
      <div className="chatbody w-full flex flex-col-reverse overflow-y-scroll gap-3 h-[100vh] py-32 lg:py-28 md:w-4/6 md:bg-body-secondary lg:my-5">
          {/* {isCopy ? copiedAlert() : false} */}
          {data.map((e , index) => e.isUser ? chatBoxUser(e) : chatboxTarget(e, index))}
      </div> 
      {textInput()}

      
    </main>
  );
}
