import React from 'react';
import { SentIcon } from 'hugeicons-react';

interface MessageInputProps {
  content: string;
  handleSendMessage: (e: React.SubmitEvent) => void;
  handleTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  content,
  handleSendMessage,
  handleTyping,
}) => {
  return (
    <div style={{ padding: '1.5rem', background: '#1e293b', borderTop: '1px solid #334155' }}>
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
        <div className="input-wrapper" style={{ flex: 1, background: '#0f172a' }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={content}
            onChange={handleTyping}
            style={{ padding: '0.75rem 1rem' }}
          />
        </div>
        <button title='submit' type="submit" className="primary-btn" style={{ width: 'auto', padding: '0 1.5rem' }}>
          <SentIcon size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
