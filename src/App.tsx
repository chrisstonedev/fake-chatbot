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
    <article>
      <h1>No-I Chatbot</h1>
      {chatLog.length > 0 && (
        <div className="chatLog">
          {chatLog.map(({ sender, message }, index) => (
            <p
              key={index}
              ref={
                !typing && index === chatLog.length - 1
                  ? lastMessageRef
                  : undefined
              }
              className={
                'chatMessage ' +
                (sender === 'bot' ? 'botMessage' : 'userMessage')
              }
            >
              {message}
            </p>
          ))}
          {typing && (
            <p ref={lastMessageRef} className="ellipses">
              ...
            </p>
          )}
        </div>
      )}
      <form action={formAction}>
        <input type="text" name="name" autoComplete="off" />
        <button type="submit">Send</button>
      </form>
    </article>
  );
}
