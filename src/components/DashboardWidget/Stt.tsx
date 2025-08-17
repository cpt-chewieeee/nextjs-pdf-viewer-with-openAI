import { useCallback, useEffect, useState } from "react";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  readonly length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}


// Declare the SpeechRecognition API globally
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SttProps {
  input: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  setInput: (text: string) => void;
}

const Stt: React.FC<SttProps> = ({ input, handleKeyDown, setInput }: SttProps) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize SpeechRecognition
  const initializeRecognition = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError('Speech Recognition API is not supported in this browser.');
      return null;
    }

    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US'; // Set language (customizable)

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
        
          // finalTranscript += transcriptText + ' ';
          setInput(transcriptText);
        } else {
          
          // interimTranscript += transcriptText;
        }
      }
    
      
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Speech recognition error: ${event.error} - ${event.message}`);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    return recognitionInstance;
  }, []);

  // Initialize recognition on component mount
  useEffect(() => {
    const recognitionInstance = initializeRecognition();
    setRecognition(recognitionInstance);

    // Cleanup on unmount
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [initializeRecognition]);

  // Toggle microphone on/off
  const toggleListening = () => {
    if (!recognition) {
      setError('Speech recognition is not available.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setError('');
      setTranscript(''); // Optionally clear transcript on new recording
      setInput('');
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="relative w-full">

      <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening...' : 'Click the microphone or type message to start'}
            className="flex-1 px-4 py-2 w-full border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="absolute top-2 right-4" onClick={toggleListening}>
            {
              isListening ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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


      {error && <span className="text-red-500">{error}</span>}
      {/* {transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg w-full max-w-md">
          <p className="text-gray-800">{transcript}</p>
        </div>
      )} */}
    </div>
  );
};

export default Stt;