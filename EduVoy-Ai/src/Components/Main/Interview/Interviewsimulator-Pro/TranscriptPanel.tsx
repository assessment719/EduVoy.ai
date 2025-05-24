import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { User, Bot } from 'lucide-react';
import { imageLinks } from './AudioAssets/textAssets';
import { interviewerAtom } from './atoms';

interface TranscriptPanelProps {
  transcript: Array<{ speaker: 'ai' | 'user'; text: string }>;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript }) => {
  const interviewer = useRecoilValue(interviewerAtom);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript]);

  return (
    <div className="h-full p-4 overflow-y-auto">
      {transcript.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Bot className="h-10 w-10 mb-2" />
          <p className='text-lg'>Your conversation transcript will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transcript.map((item, index) => (
            <div key={index} className={`flex ${item.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex max-w-[80%] ${item.speaker === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-shrink-0 flex items-start pt-1 ${item.speaker === 'ai' ? 'mr-2' : 'ml-2'}`}>
                  {item.speaker === 'ai' ? (
                    <img
                      src={imageLinks[interviewer as keyof typeof imageLinks]}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full object-cover border-2 border-green-200"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center border-2 border-black">
                      <User className="h-6 w-6 text-black" />
                    </div>
                  )}
                </div>
                <div
                  className="p-2 rounded-lg bg-gray-200 text-black"
                >
                  <p className="text-sm">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default TranscriptPanel;