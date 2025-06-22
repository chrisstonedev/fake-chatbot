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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'auto' | 'both'>('auto');
  const [perspective, setPerspective] = useState<'bot' | 'user'>('user');

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, typing]);

  async function submitText(_previousValue: string, formData: FormData) {
    const newName = formData.get('name');
    setChatLog((chatLog) => [
      ...chatLog,
      { sender: perspective, message: `${newName}` },
    ]);
    return `${newName}`;
  }

  useEffect(() => {
    if (chatLog.length === 0) {
      return;
    }
    const lastMessage = chatLog[chatLog.length - 1];
    if (chatMode === 'auto') {
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
      return;
    }
    if (chatMode === 'both') {
      setTimeout(
        () => setPerspective(lastMessage.sender === 'bot' ? 'user' : 'bot'),
        1000,
      );
    }
  }, [chatLog, chatMode]);

  return (
    <article>
      <div>
        <div className="topMenu">
          <h1>Fake Chatbot</h1>
          <p>
            {perspective === 'user'
              ? 'Type below to talk to the chatbot.'
              : 'Type below to respond to yourself as the chatbot.'}
          </p>
          <button
            className="settingsButton"
            onClick={() => setIsSettingsOpen((prevState) => !prevState)}
          >
            Settings
          </button>
        </div>
        {isSettingsOpen && (
          <div>
            <h2>Settings</h2>
            <fieldset>
              <legend>Select a chat style:</legend>
              <label>
                <input
                  type="radio"
                  id="auto"
                  name="chatStyle"
                  value="auto"
                  checked={chatMode === 'auto'}
                  onChange={() => {
                    if (perspective === 'bot') {
                      setPerspective('user');
                    }
                    setChatMode('auto');
                  }}
                />
                Automatically receive random response
              </label>
              <label>
                <input
                  type="radio"
                  id="both"
                  name="chatStyle"
                  value="both"
                  checked={chatMode === 'both'}
                  onChange={() => setChatMode('both')}
                />
                Type for both users, back-and-forth
              </label>
            </fieldset>
          </div>
        )}
      </div>
      {chatLog.length > 0 && (
        <div className={'chatLog' + (perspective === 'bot' ? ' asBot' : '')}>
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
                (perspective === 'bot' ? 'asBot ' : '') +
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
