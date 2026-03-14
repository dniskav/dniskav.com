'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'model'
  text: string
}

export function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm Daniel's AI assistant. Ask me anything about his experience, projects or skills." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', text }
    const history = messages.slice(1) // skip initial greeting
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'model', text: data.reply ?? 'Sorry, something went wrong.' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'model', text: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI chat"
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full bg-[var(--accent)] text-white shadow-lg flex items-center justify-center"
        style={{ width: 52, height: 52 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl flex flex-col overflow-hidden"
            style={{ height: 420 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">AI</div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Ask about Daniel</p>
                <p className="text-xs text-[var(--muted-foreground)]">Powered by Gemini</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 text-sm">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--accent)] text-white rounded-br-sm'
                        : 'bg-[var(--muted)] text-[var(--foreground)] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--muted)] rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-[var(--border)] flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask something..."
                disabled={loading}
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
              />
              <motion.button
                onClick={send}
                disabled={loading || !input.trim()}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-[var(--accent)] text-white px-3 py-2 disabled:opacity-40 transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
