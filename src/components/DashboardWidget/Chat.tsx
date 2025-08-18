import { ChatMessage, ChatSession, PdfUpload } from "@prisma/client/edge";
import { useEffect, useRef, useState } from "react";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, tool } from 'ai';
import { AssistantStream } from "openai/lib/AssistantStream";
import { AssistantStreamEvent } from "openai/resources/beta/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

import Stt from "./Stt";

interface ChatMessageType {
  type: "file";
  filename: string;
  mediaType: string;
  url: string
}
async function getFileAsDataUrl(fileUrl: string, filename: string) {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();


    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if(reader.result) {
          console.log(reader);
          const file: ChatMessageType = {
            type: "file",
            filename: filename,
            mediaType: 'application/pdf',
            url: reader.result as string
          }
          resolve(file);
        } else {
          reject(new Error("failed to fetch PDF as Data URL"));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    alert("Error fetching PDF");
    return null;
  }
}

interface ChatProps {
  selectedFile: PdfUpload | null;
  currentChatSession: ChatSession | null;
  setCurrentChatSession: (chat: ChatSession | null) => void;
}
export default function Chat({ currentChatSession, setCurrentChatSession, selectedFile }: ChatProps) {
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [fileData, setFileData] = useState<ChatMessageType | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);


  useEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // console.log('here->', selectedFile, currentChatSession);
    setChatMessages([]);
    if(currentChatSession !== null) {
      
      // getSessionMessages();
    }

    if(selectedFile !== null) {
     
      getFileAsDataUrl(selectedFile.fullUrl, selectedFile.filename).then((dataUrl) => {
       
        setFileData(dataUrl as ChatMessageType);
      }).catch(error => {
        console.error('error', error);
        alert('Unabled to fetch dataURL');
      })
    } else {
      setFileData(null);
      
    }
  }, [currentChatSession, selectedFile]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  };
  const getSessionMessages = async () => {
    if (!currentChatSession) {
      return;
    }
    
      const resp = await fetch(`/api/chatMessage/${currentChatSession.id}`);
      

      if(!resp.ok) {
        alert('Unable to create new chat');
  
        return;
      }
      const data = await resp.json();
 
      setChatMessages(data);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  };
  const createNewSession = async () => {
    if(selectedFile === null) {
      return null;
    }

    const uploadRequest = await fetch('/api/chatSession', {
      method: 'POST',
      body: JSON.stringify({
        title: input.trim(),
        pdfUploadId: String(selectedFile.id)
      }),
    });
    return await uploadRequest.json();
  };
  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        console.log('toolCall', toolCall);
        // const result = await functionCallHandler(toolCall);
        return { output: '', tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };
  const submitActionResult = async (runId, toolCallOutputs) => {
    const response = await fetch(
      `/api/ai/${selectedFile.threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };
  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", () => {
      console.log('textcreated');
    });
    stream.on("textDelta", (delta) => {
      console.log('textDelta', delta);
    });

    // image
    // stream.on("imageFileDone", handleImageFileDone);

    // code interpreter
    // stream.on("toolCallCreated", toolCallCreated);
    // stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };
  const handleRunCompleted = () => {
    setInputDisabled(false);
  };
  const sendNewMessage = async (session: ChatSession) => {
    if(fileData === null) {
      return;
    }
    try {
       const response = await fetch(
        `/api/ai/${session.threadId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            sessionId: session.id,
            content: input.trim(),
            assistantId: selectedFile.assistantId
          }),
        }
      );
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);

      setInput('');
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch(err) {
      alert('unable to create new message')
      console.error(err);
    }
  };
  const handleSend = async () => {
    if (!input.trim()) return;
    
    if(currentChatSession === null) {
      const newSession = await createNewSession();
      setInputDisabled(true);
      setCurrentChatSession(newSession);
      sendNewMessage(newSession);
      
    } 
    else {
      setInputDisabled(true);
      sendNewMessage(currentChatSession);
    }
    
    
  };

  
  return (
    <div className="border border-white flex flex-col h-full mx-auto border rounded shadow"> 
      <div className="flex-1 overflow-auto p-1 space-y-2">
        {
          chatMessages.map((item: ChatMessage, index: number) => {
            return (
              <div key={index} className={`flex ${
              item.isReply ?  'justify-start' : 'justify-end'
            }`}>
              <div className={`max-w-xs px-4 py-2 rounded break-words ${
                item.isReply ? 'bg-blue-600 text-white' : 'bg-green-200 text-gray-800'
              }`}>
                <p>{item.content}</p>
                {/* <span className="text-xs text-gray-400 block text-right mt-1">10/10/2025</span> */}
              </div>
            </div>
            )
          })
        }
        <div ref={messagesEndRef} />
      </div>

       <div className="flex border-t p-1">
        {/* <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 w-full border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="absolute top-2 right-4" onClick={handleRecord}>
            {
              1 ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12"></path>
                <path d="M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>)
            }
          </button>
        </div> */}
        <Stt input={input} setInput={setInput} handleKeyDown={handleKeyDown}/>
        <button
          onClick={handleSend}
          className="px-1 py-1 bg-blue-600 text-white rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}