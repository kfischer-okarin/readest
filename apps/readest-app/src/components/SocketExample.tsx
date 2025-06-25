'use client';

import { useState, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';

type Message = {
  text: string;
  timestamp: string;
};

interface ServerMessages {
  message: (message: Message) => void;
}

interface ClientMessages {
  message: (message: Message) => void;
}

export default function SocketExample() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [inputValue, setInputValue] = useState('');

  const handleMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const socket = useSocket<ServerMessages, ClientMessages>({
    message: handleMessage,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      socket.emit('message', {
        text: inputValue,
        timestamp: new Date().toISOString(),
      });
      setInputValue('');
    }
  };

  return (
    <div className='mx-auto max-w-md p-4'>
      <div className='mb-4'>
        <span
          className={`inline-block rounded px-2 py-1 text-sm ${
            socket.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {socket.connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className='mb-4'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Type a message...'
            className='flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={!socket.connected}
          />
          <button
            type='submit'
            disabled={!socket.connected}
            className='rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300'
          >
            Send
          </button>
        </div>
      </form>

      <div className='space-y-2'>
        <h3 className='font-semibold'>Messages:</h3>
        {messages.length === 0 ? (
          <p className='text-gray-500'>No messages yet...</p>
        ) : (
          <div className='max-h-64 space-y-2 overflow-y-auto'>
            {messages.map((msg, index) => (
              <div key={index} className='rounded bg-gray-100 p-2'>
                <p className='text-sm'>{msg.text}</p>
                <p className='text-xs text-gray-500'>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
