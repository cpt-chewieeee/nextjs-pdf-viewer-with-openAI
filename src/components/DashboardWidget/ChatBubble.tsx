import { Metadata } from "@/app/types/metadata";
import { ChatMessage } from "@prisma/client"
import { AnnotationDelta } from "openai/resources/beta/threads/messages.mjs";
import { useEffect, useRef, useState } from "react";

import reactStringReplace from 'react-string-replace';


interface ChatBubbleProps {
  chatMessage: ChatMessage;
  setAnnotations: (items: AnnotationDelta[]) => void;
}
export default function ChatBubble({ chatMessage, setAnnotations }: ChatBubbleProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if(synthRef.current === null) {
      synthRef.current = window.speechSynthesis;
    }
  });

  const controlContent = () => {
    if(isPlaying) {
      if(synthRef.current) {
        synthRef.current.cancel();

        utteranceRef.current = null;
        setIsPlaying(false);
      }
    }
    else {
      utteranceRef.current = new SpeechSynthesisUtterance(chatMessage.content);

      utteranceRef.current.onboundary = (event) => {
        setIsPlaying(true);
      };
      utteranceRef.current.onend = (event) => {
        setIsPlaying(false);
      };


      synthRef.current.speak(utteranceRef.current);
    }
  }
  const renderContentBasedOnAnnotation = () => {


    let message = chatMessage.content;
    if(typeof chatMessage.metadata === 'object' && chatMessage.metadata !== null && 'annotation' in chatMessage.metadata) {
    
      const contxt = chatMessage.metadata as unknown as Metadata;
      message = contxt.annotation.reduce((text: string, chat: AnnotationDelta) => {
        const source = chat.text;

        if(source !== null && source !== undefined && text.indexOf(source) > -1) {
          

          return reactStringReplace(text, source, (match, i) => {
            return (
              <strong key={i} className="underline cursor-pointer" onClick={() => setAnnotations([chat])}>{match}</strong>
            )
          })
        }
        return text;
      }, message) as string;
    }
   
    return (<span>{message}</span>);
  }
  return (
    <div className={`flex ${
      chatMessage.isReply ?  'justify-start' : 'justify-end'
    }`}>
      <div className={`max-w-xs px-4 py-2 rounded break-words ${
        chatMessage.isReply ? 'bg-blue-600 text-white' : 'bg-green-200 text-gray-800'
      }`}>
        <div>{renderContentBasedOnAnnotation()}</div>

        <div className="flex justify-between flex-row">
          <div>
            <button className="" onClick={() => {
              controlContent();
            }}>
              {
                !isPlaying ? (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12"></path>
                  <path d="M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>)
              }
            </button>
          </div>
          {
            chatMessage.createdAt !== null ?
            (
              <div className="text-xs text-gray-400 block text-right mt-1">{chatMessage.createdAt as unknown as string}</div>
            ) : null
          }
        </div>
       
      </div>


    </div>
  );
}