'use client';

import { useEffect, useState } from 'react';
import {
  initSocket,
  connectSocket,
  disconnectSocket,
  sendMessage,
  onMessage,
  offMessage,
} from '@/utils/socket';

export default function SocketExample() {
  const [messages, setMessages] = useState<Array<{ text: string; timestamp: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const socket = initSocket();

    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    const handleMessage = (data: { text: string; timestamp: string }) => {
      setMessages((prev) => [...prev, data]);
    };

    onMessage(handleMessage);
    connectSocket();

    return () => {
      offMessage(handleMessage);
      disconnectSocket();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className='mx-auto max-w-md p-4'>
      <div className='mb-4'>
        <span
          className={`inline-block rounded px-2 py-1 text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
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
            disabled={!isConnected}
          />
          <button
            type='submit'
            disabled={!isConnected}
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
