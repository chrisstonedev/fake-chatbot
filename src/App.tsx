import { useActionState, useEffect, useState } from 'react';
import './App.css';

function generateBotMessage(message: string) {
  return 'hello';
}

export function App() {
  const [chatLog, setChatLog] = useState<
    { sender: 'user' | 'bot'; message: string }[]
  >([]);
  const [, formAction] = useActionState(submitText, '');
  const [typing, setTyping] = useState(false);

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
    const something = chatLog[chatLog.length - 1];
    if (something.sender !== 'user') {
      return;
    }
    const typingOffset = 2000;
    const typingTimeout =
      typingOffset + 1000 + generateBotMessage(something.message).length * 300;
    setTimeout(() => {
      setTyping(true);
    }, typingOffset);
    setTimeout(() => {
      setTyping(false);
    }, typingTimeout);
    setTimeout(() => {
      setChatLog((chatLog) => [
        ...chatLog,
        { sender: 'bot', message: generateBotMessage(something.message) },
      ]);
    }, typingTimeout);
  }, [chatLog]);

  return (
    <>
      <h1>NoI ChatBot</h1>
      {chatLog.map(({ sender, message }, index) => (
        <p key={index}>
          {message} ({sender})
        </p>
      ))}
      {typing && <p>...</p>}
      <form action={formAction}>
        <input type="text" name="name" autoComplete="off" />
        <button type="submit" hidden>
          Submit
        </button>
      </form>
    </>
  );
}
