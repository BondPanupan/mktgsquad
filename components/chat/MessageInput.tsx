'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  agentColor?: string;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  disabled,
  agentColor,
  placeholder = 'Message...',
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={styles.textarea}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={styles.send}
          style={agentColor ? { background: agentColor } : undefined}
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor" />
          </svg>
        </button>
      </div>
      <p className={styles.hint}>Enter to send · Shift+Enter for newline</p>
    </div>
  );
}
