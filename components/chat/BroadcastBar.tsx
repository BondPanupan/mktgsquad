'use client';

import { useState } from 'react';
import type { AgentId } from '@/types';
import { AGENT_COLORS, AGENT_NAMES } from '@/lib/utils';
import { useBroadcast } from '@/hooks/useBroadcast';
import Spinner from '@/components/ui/Spinner';
import styles from './BroadcastBar.module.css';

const ALL_AGENTS: AgentId[] = ['apex', 'bolt', 'pixel', 'rank', 'pulse', 'forge'];

export default function BroadcastBar() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selected, setSelected] = useState<AgentId[]>([...ALL_AGENTS]);
  const { broadcast, streaming, responses } = useBroadcast();

  const toggleAgent = (id: AgentId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleBroadcast = () => {
    if (!prompt.trim() || !selected.length) return;
    broadcast(prompt.trim(), selected);
    setPrompt('');
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.toggle} ${open ? styles.open : ''}`}
        onClick={() => setOpen((p) => !p)}
      >
        <span className={styles.icon}>📡</span>
        Broadcast
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.agentPicker}>
            {ALL_AGENTS.map((id) => (
              <button
                key={id}
                onClick={() => toggleAgent(id)}
                className={`${styles.agentChip} ${selected.includes(id) ? styles.chipSelected : ''}`}
                style={selected.includes(id) ? { borderColor: AGENT_COLORS[id], color: AGENT_COLORS[id] } : undefined}
              >
                {AGENT_NAMES[id]}
              </button>
            ))}
          </div>

          <div className={styles.inputRow}>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Broadcast to selected agents..."
              className={styles.input}
              onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
              disabled={streaming}
            />
            <button
              className={styles.send}
              onClick={handleBroadcast}
              disabled={!prompt.trim() || !selected.length || streaming}
            >
              {streaming ? <Spinner size="sm" /> : 'Send'}
            </button>
          </div>

          {responses.length > 0 && (
            <div className={styles.responses}>
              {responses.map((r) => (
                <div key={r.agentId} className={styles.response}>
                  <div
                    className={styles.responseAgent}
                    style={{ color: AGENT_COLORS[r.agentId] }}
                  >
                    {AGENT_NAMES[r.agentId]}
                    {r.streaming && <Spinner size="sm" color={AGENT_COLORS[r.agentId]} />}
                  </div>
                  <p className={styles.responseText}>{r.content || '...'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
