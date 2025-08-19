
import { PdfUpload } from "@prisma/client/edge";
import { Viewer, Worker } from '@react-pdf-viewer/core';

import * as pdfjsLib from "pdfjs-dist";

import { toolbarPlugin, ToolbarSlot } from "@react-pdf-viewer/toolbar";
import { RenderCurrentScaleProps, RenderZoomInProps, RenderZoomOutProps } from "@react-pdf-viewer/zoom";
import { RenderGoToPageProps } from "@react-pdf-viewer/page-navigation";
import { searchPlugin } from '@react-pdf-viewer/search';

import { highlightPlugin, HighlightArea } from '@react-pdf-viewer/highlight';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useEffect, useRef, useState } from "react";
import { AnnotationDelta } from "openai/resources/beta/threads/messages.mjs";


interface PdfViewerProps {
  selectedFile: PdfUpload | null;
  setSelectedFile: (file: PdfUpload | null) => void;
  annotations: AnnotationDelta[];
}
interface PdfPage {
  page: number;
  content: string;
  pageContent: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}


export default function PdfViewer({ selectedFile, setSelectedFile, annotations }: PdfViewerProps) {


  const toolbarInstance = toolbarPlugin();
  const { Toolbar } = toolbarInstance;
  const searchPluginInstance = searchPlugin();
  const { highlight, jumpToNextMatch, jumpToPreviousMatch } = searchPluginInstance;
  const [loading, setLoading] = useState<boolean>(false);

  const [pages, setPages] = useState<PdfPage[]>([])

  const highlightPluginInstance = highlightPlugin();
  const { jumpToHighlightArea } = highlightPluginInstance;
  const [pdfText, setPdfText] = useState<string>('');
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  function substringWholeWords(text: string, start: number, end: number): string {
      // Ensure indices are in range
      start = Math.max(0, start);
      end = Math.min(text.length, end);

      // Move start backward until we hit a word boundary or space
      while (start > 0 && /\w/.test(text[start - 1])) {
          start--;
      }

      // Move end forward until we hit a word boundary or space
      while (end < text.length && /\S/.test(text[end])) {
          end++;
      }

      return text.substring(start, end);
  }
  useEffect(() => {
   
    if(annotations.length > 0) {
      hightlightNotes();
    }
  }, [annotations]);
  useEffect(() => {
    if(synthRef.current === null) {
      synthRef.current = window.speechSynthesis;
    }
    if(selectedFile !== null) {
      extractText();
    }
  }, [selectedFile]);

  const hightlightNotes = () => {
 

    annotations.forEach((item: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const startIndex = item.start_index;
      const endIndex = item.end_index;
      
       
      const pageText = pages.map((it: any) => it.content).join(' '); // eslint-disable-line @typescript-eslint/no-explicit-any

      const sub = substringWholeWords(pageText, startIndex, endIndex).replace(/\s{2,}/g, " ").split(' ');
     

      const matchConfigs: any = sub.reduce((arr: any, desc: string) => { // eslint-disable-line @typescript-eslint/no-explicit-any

       
        const x = {
          keyword: desc,
          wholeWords: false,
          matchCase: true
        }
        return arr.concat([x]);
    
        
      }, [])
   
      highlight(matchConfigs);
    });
  }
  const extractText = async () => {
    if (!selectedFile?.fullUrl) {
      throw new Error("No PDF file URL provided.");
    }
    const loadingTask = pdfjsLib.getDocument(selectedFile.fullUrl);
    const pdf = await loadingTask.promise;

    const newPages: PdfPage[] = [] as PdfPage[];
    let text = "";
    for(let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
    

      
      
      const pageText = content.items.map((item: any) => item.str).join(" "); // eslint-disable-line @typescript-eslint/no-explicit-any
      text += pageText + "\n";
      newPages.push({
        page: i,
        content: pageText,
        pageContent: content
      });
    }
    setPages(newPages);
    setPdfText(text);
   
  };


  const startReading = () => {

    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support Speech Synthesis");
      return;
    }
    setLoading(true);

    if (synthRef.current) {
      if (synthRef.current.paused && utteranceRef.current) {
        synthRef.current.resume(); // Resume if paused
      } else {
       
        utteranceRef.current = new SpeechSynthesisUtterance(pdfText);
        utteranceRef.current.onboundary = (event) => {
          setLoading(false);
          if(event.name === 'word' && utteranceRef.current) {
            
            const spokenWord = utteranceRef.current.text.substring(event.charIndex, event.charIndex + event.charLength);

            highlight(spokenWord);

          }
        }
        synthRef.current.speak(utteranceRef.current);
    }
    }
  };

  const pauseBtnClick = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.pause();
    }
  }
  const stopBtnClick = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      utteranceRef.current = null;
    }
  }

  if(selectedFile === null) {
    return (
      <div className="flex items-center justify-center h-full border border-white rounded">
        <p className="text-center">Upload or select a Pdf on the left.</p>
      </div>
    );
   
  }

  return (
    <div className="border border-white rounded flex flex-col h-full">

      {/* <PdfViewerToolBar selectedFile={selectedFile} setSelectedFile={setSelectedFile}/> */}
      <div className="flex m-1">
        <Toolbar>
            {(props: ToolbarSlot) => {
                const {
                    CurrentPageInput,
                    CurrentScale,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    ZoomIn,
                    ZoomOut,
                } = props;
                return (
                    <>
                      <div style={{ padding: '0px 2px' }}>
                          <ZoomOut>
                              {(props: RenderZoomOutProps) => (
                                  <button className="px-1 w-full py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    
                                      onClick={props.onClick}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                      aria-hidden="true">
                                      <path d="M5 12h14"/>
                                    </svg>
                                  </button>
                              )}
                          </ZoomOut>
                      </div>
                      <div className="py-1 mx-2">
                          <CurrentScale>
                              {(props: RenderCurrentScaleProps) => (
                                  <span>{`${Math.round(props.scale * 100)}%`}</span>
                              )}
                          </CurrentScale>
                      </div>
                      <div style={{ padding: '0px 2px' }}>
                          <ZoomIn>
                              {(props: RenderZoomInProps) => (
                                  <button className="px-1 w-full py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    
                                      onClick={props.onClick}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                      aria-hidden="true">
                                      <path d="M12 5v14M5 12h14"/>
                                    </svg>
                                  </button>
                              )}
                          </ZoomIn>
                      </div>
                      <div className="space-x-2 mx-auto my-auto">
                        {/* Play Button */}
                        <button
                          onClick={startReading}
                          disabled={loading}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M4 2v20l18-10L4 2z" />
                          </svg>
                        </button>

                        {/* Pause Button */}
                        <button
                          onClick={pauseBtnClick}
                          className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 2h4v20H6V2zm8 0h4v20h-4V2z" />
                          </svg>
                        </button>

                        {/* Stop Button */}
                        <button
                          onClick={stopBtnClick}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 6h12v12H6V6z" />
                          </svg>
                        </button>
                      </div>
                      <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                          <GoToPreviousPage>
                              {(props: RenderGoToPageProps) => (
                                  <button
                                    className={`px-1 w-full py-1 text-white rounded shadow ${props.isDisabled ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'} focus:outline-none focus:ring-2 `}
                                      disabled={props.isDisabled}
                                      onClick={props.onClick}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                      aria-hidden="true">
                                      <path d="M15 6l-6 6 6 6"/>
                                    </svg>
                                  </button>
                              )}
                          </GoToPreviousPage>
                      </div>
                      <div style={{ padding: '0px 1px', width: '4rem' }}>
                          <CurrentPageInput />
                      </div>
                      <div className="py-1 mx-2">
                        / <NumberOfPages />
                      </div>
                      <div style={{ padding: '0px 2px' }}>
                          <GoToNextPage>
                              {(props: RenderGoToPageProps) => (
                                  <button
                                    className={`px-1 w-full py-1 text-white rounded shadow ${props.isDisabled ? 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'} focus:outline-none focus:ring-2 `}           
                                      disabled={props.isDisabled}
                                      onClick={props.onClick}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                      aria-hidden="true">
                                      <path d="M9 6l6 6-6 6"/>
                                    </svg>
                                  </button>
                              )}
                          </GoToNextPage>
                      </div>
                      <div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="p-2 rounded-full transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>

                        </button>
                      </div>
                  </>
                );
            }}
        </Toolbar>
      </div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        
        <div className="overflow-auto">
          
          <Viewer fileUrl={selectedFile.fullUrl} plugins={[toolbarInstance, searchPluginInstance]} theme='dark' />
        </div>
      </Worker> 

    </div>
  )
}