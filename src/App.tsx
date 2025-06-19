import { useActionState, useEffect, useRef, useState } from 'react';
import './App.css';
import { generateBotMessage } from './bot.ts';

export function App() {
  const lastMessageRef = useRef<HTMLParagraphElement>(null);
  const [chatLog, setChatLog] = useState<
    { sender: 'user' | 'bot'; message: string }[]
  >([]);
  const [, formAction] = useActionState(submitText, '');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, typing]);

  async function submitText(_previousValue: string, formData: FormData) {
    const newName = formData.get('name');
    setChatLog((chatLog) => [
      ...chatLog,
      { sender: 'user', message: `${newName}` },
    ]);
    return `${newName}`;
  }

  useEffect(() => {
    if (chatLog.length === 0) {
      return;
    }
    const lastMessage = chatLog[chatLog.length - 1];
    if (lastMessage.sender !== 'user') {
      return;
    }
    const newMessage = generateBotMessage(lastMessage.message);
    const typingOffset = 2000;
    const typingTimeout = typingOffset + 2000;
    setTimeout(() => setTyping(true), typingOffset);
    setTimeout(() => setTyping(false), typingTimeout);
    setTimeout(
      () =>
        setChatLog((chatLog) => [
          ...chatLog,
          { sender: 'bot', message: newMessage },
        ]),
      typingTimeout,
    );
  }, [chatLog]);

  return (
    <>
      <h1>NoI ChatBot</h1>
      <div
        style={{
          background: '#ffeeee',
          display: 'flex',
          flexDirection: 'column',
          height: 400,
          overflowY: 'scroll',
          width: 800,
        }}
      >
        {chatLog.map(({ sender, message }, index) => (
          <p
            key={index}
            ref={
              !typing && index === chatLog.length - 1
                ? lastMessageRef
                : undefined
            }
            className={
              'chatMessage ' + (sender === 'bot' ? 'botMessage' : 'userMessage')
            }
          >
            {message}
          </p>
        ))}
        {typing && (
          <p
            ref={lastMessageRef}
            style={{
              fontWeight: 700,
              margin: '4px 20px',
              padding: 6,
              textAlign: 'left',
            }}
          >
            ...
          </p>
        )}
      </div>
      <form action={formAction}>
        <input
          type="text"
          name="name"
          autoComplete="off"
          style={{ width: 800, fontSize: 16 }}
        />
        <button type="submit" hidden>
          Submit
        </button>
      </form>
    </>
  );
}
