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
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
        width: '100%',
      }}
    >
      <h1 style={{ margin: 0 }}>No-I Chatbot</h1>
      <div
        style={{
          background: '#ffeeee',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'scroll',
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
      <form action={formAction} style={{ display: 'flex' }}>
        <input
          type="text"
          name="name"
          autoComplete="off"
          style={{ fontSize: 16, width: '100%' }}
        />
        <button type="submit">Send</button>
      </form>
    </article>
  );
}
