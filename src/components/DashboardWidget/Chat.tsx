import { ChatMessage, ChatSession, PdfUpload } from "@prisma/client/edge";
import { useEffect, useRef, useState } from "react";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, tool } from 'ai';
import { AssistantStream } from "openai/lib/AssistantStream";
import { AssistantStreamEvent } from "openai/resources/beta/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

import Stt from "./Stt";
import { TextDelta } from "openai/resources/beta/threads.mjs";
import { AnnotationDelta } from "openai/resources/beta/threads.js";
import ChatBubble from "./ChatBubble";

interface ChatMessageType {
  type: "file";
  filename: string;
  mediaType: string;
  url: string;

}
interface ChatProps {
  selectedFile: PdfUpload | null;
  currentChatSession: ChatSession | null;
  setCurrentChatSession: (chat: ChatSession | null) => void;
  setAnnotations: (items: AnnotationDelta[]) => void
}
async function getFileAsDataUrl(fileUrl: string, filename: string) {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();


    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if(reader.result) {
        
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


export default function Chat({ currentChatSession, setCurrentChatSession, selectedFile, setAnnotations }: ChatProps) {
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [fileData, setFileData] = useState<ChatMessageType | null>(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);


  useEffect(() => {

    setChatMessages([]);
    if(currentChatSession !== null) {

      getSessionMessages();
      setSessionId(currentChatSession.id);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
  
  useEffect(() => {

    if(shouldUpdate) {
      saveOpenAiResponse();
    }
  }, [shouldUpdate]);
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
     

  };
  const createNewSession = async (cb: (result: ChatSession) => void) => {
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

    
    const result = await uploadRequest.json();

    cb(result);
  
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

        // const result = await functionCallHandler(toolCall);
        return { output: '', tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };
  const submitActionResult = async (runId: any, toolCallOutputs: any) => {
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

  const saveOpenAiResponse = async () => {
    const last = chatMessages[chatMessages.length - 1];
    const userMsg: ChatMessage = chatMessages[chatMessages.length - 2];


    if(last.metadata !== null && last.metadata !== undefined && last.metadata.annotation !== undefined) {
      setAnnotations(last.metadata.annotation);
    }
    if(userMsg !== undefined && userMsg !== null) {
      await fetch(`/api/chatMessage`, {
        method: 'POST',
        body: JSON.stringify({
          ...last,
          sessionId: userMsg.sessionId
        })
      });
    }

    setShouldUpdate(false);
    
  };

  const appendResponseMessage = (text: string) => {

    setChatMessages((prev: ChatMessage[]) => {

      const lastMessage = prev[prev.length - 1];
      const updated = {
        ...lastMessage,
        content: lastMessage.content + text
      };

      return [
        ...prev.slice(0, -1), updated
      ];
    })
  };
  const appendAnnotationMessage = (annotations: AnnotationDelta[]) => {


    if(annotations.length === 0) {
      return;
    }
    setChatMessages((prev: ChatMessage[]) => {
      const last = prev[prev.length - 1];
      const update = {
        ...last
      };
  
      annotations.forEach((annotation: AnnotationDelta) => {

        update?.metadata?.annotation?.push(annotation);
   
      });

      return [...prev.slice(0, -1), update]
    })
  }
  const handleReadableStream = (stream: AssistantStream) => {
    // messages

    stream.on("textCreated", () => {

      setChatMessages((prev: ChatMessage) => [
        ...prev,
        {
          isReply: true,
          // sessionId: currentChatSession.id,
          content: '',
          metadata: {
            annotation: []
          }
        }
      ])
    });
    stream.on("textDelta", (delta) => {
     
      if(delta.value !== null && delta.value !== undefined) {
        appendResponseMessage(delta.value);
      }

      if(delta.annotations !== null && delta.annotations !== undefined) {
   
        appendAnnotationMessage(delta.annotations);
      }
    });

    // image
    stream.on("imageFileDone", (image) => {
      appendResponseMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
    });

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
    setShouldUpdate(true);
    
  };
  const sendNewMessage = async (session: ChatSession) => {
    if(fileData === null) {
      return;
    }

    try {
      const response: any = await fetch(
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
      setChatMessages((prev: ChatMessage) => [
        ...prev,
        {
          isReply: false,
          sessionId: session.id,
          content: input.trim()
        }
      ])
      
     
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream, session);
      
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

      await createNewSession((result: ChatSession) => {

        setInputDisabled(true);
        setCurrentChatSession(result);
        setSessionId(result.id);
        sendNewMessage(result);
      });
      
      
    } 
    else {
      setInputDisabled(true);
      setSessionId(currentChatSession.id)
      sendNewMessage(currentChatSession);
    }
    
    
  };

  return (
    <div className="border border-white flex flex-col h-full mx-auto border rounded shadow"> 
      <div className="flex-1 overflow-auto p-1 space-y-2">
        {
          chatMessages.map((item: ChatMessage, index: number) => {
            return (
              <ChatBubble chatMessage={item} key={index} setAnnotations={setAnnotations}/>
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
        <Stt input={input} setInput={setInput} handleKeyDown={handleKeyDown} inputDisabled={inputDisabled}/>
        <button
          onClick={handleSend}
          disabled={inputDisabled}
          className="px-1 py-1 bg-blue-600 text-white rounded-r hover:bg-blue-700"
        >
          {
          inputDisabled ? <div className="flex justify-center items-center">
            <div className="animate-spin h-4 w-4 border-4 border-blue-500 border-solid rounded-full border-t-transparent">
            </div>
          </div> : <span>Send</span>
        }
        </button>
      </div>
    </div>
  )
}