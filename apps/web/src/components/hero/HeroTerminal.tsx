'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'

// ─── Public types ─────────────────────────────────────────────────────────────

export interface TerminalLine {
  prompt: string
  output: string[]
}

export interface CommandContext {
  scroll: (id: string) => void
  navigate: (path: string) => void
  clear: () => void
  setTheme: (t: string) => void
  currentTheme: string | undefined
  switchLocale: () => void
  currentLocale: string
  rawArgs: string
  /** All resolved commands (defaults + extras), useful for custom help actions */
  allCommands: Record<string, CommandDef>
}

export interface CommandDef {
  description: string
  action: (ctx: CommandContext) => React.ReactNode
}

export interface TerminalConfig {
  /** Intro lines played on mount. Defaults to the dniskav intro. */
  introLines?: TerminalLine[]
  /** Milliseconds per character during typing animation. Default: 36 */
  typingSpeed?: number
  /** Milliseconds between lines during intro. Default: 800 */
  delayBetweenLines?: number
  /**
   * Fully replace the default command set.
   * Note: `help` will still list whatever commands you provide here.
   */
  commands?: Record<string, CommandDef>
  /**
   * Merge extra commands on top of the defaults.
   * Use this to add or override specific commands without replacing the whole set.
   */
  extraCommands?: Record<string, CommandDef>
}

// ─── Minimal defaults ─────────────────────────────────────────────────────────

const DEFAULT_INTRO_LINES: TerminalLine[] = [
  { prompt: 'ready', output: ['interactive terminal', 'type help to get available commands'] },
]

const DEFAULT_TYPING_SPEED = 36
const DEFAULT_DELAY_BETWEEN_LINES = 800

function buildDefaultCommands(): Record<string, CommandDef> {
  return {
    help: {
      description: 'Show available commands',
      action: ({ allCommands }) => (
        <div className="pl-4">
          <p className="text-accent mb-1">Available commands:</p>
          {Object.entries(allCommands).map(([cmd, { description }]) => (
            <p key={cmd}>
              <span className="text-white">{cmd.padEnd(14)}</span>
              <span className="text-muted-foreground">{description}</span>
            </p>
          ))}
        </div>
      ),
    },
    clear: {
      description: 'Clear terminal history',
      action: ({ clear }) => {
        clear()
        return null
      },
    },
  }
}

// ─── Intro typing hook ────────────────────────────────────────────────────────

function useTyping(text: string, active: boolean, typingSpeed: number): string {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!active) {
      setDisplayed('')
      return
    }
    let i = 0
    setDisplayed('')
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, typingSpeed)
    return () => clearInterval(id)
  }, [text, active, typingSpeed])

  return displayed
}

function IntroLine({
  line,
  active,
  done,
  typingSpeed,
}: {
  line: TerminalLine
  active: boolean
  done: boolean
  typingSpeed: number
}) {
  const typed = useTyping(line.prompt, active || done, typingSpeed)
  const showOutput = done || (active && typed === line.prompt)

  return (
    <div className="mb-2">
      <div className="flex items-center gap-1">
        <span className="text-accent">❯</span>
        <span className="text-white">{typed}</span>
        {active && typed !== line.prompt && (
          <span className="bg-accent ml-0.5 inline-block h-3.5 w-1.5 animate-pulse" />
        )}
      </div>
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-0.5 pl-4"
          >
            {line.output.map((out, i) => (
              <p key={i} className="text-muted-foreground leading-snug">
                {out}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── History entry ────────────────────────────────────────────────────────────

interface HistoryEntry {
  command: string
  output: React.ReactNode
}

// ─── Terminal shell ───────────────────────────────────────────────────────────

interface TerminalShellProps {
  pinned: boolean
  onPin: () => void
  config: Required<TerminalConfig>
  resolvedCommands: Record<string, CommandDef>
}

function TerminalShell({ pinned, onPin, config, resolvedCommands }: TerminalShellProps) {
  const { introLines, typingSpeed, delayBetweenLines } = config

  const [introStep, setIntroStep] = useState(0)
  const introComplete = introStep >= introLines.length

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const cmdKeys = Object.keys(resolvedCommands)
  const suggestion =
    input.length > 0
      ? (cmdKeys.find((k) => k.startsWith(input.toLowerCase()) && k !== input.toLowerCase()) ?? '')
      : ''
  const ghostText = suggestion ? suggestion.slice(input.length) : ''

  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const { theme, setTheme } = useTheme()

  // Advance intro
  useEffect(() => {
    if (introComplete) return
    const duration = introLines[introStep].prompt.length * typingSpeed + delayBetweenLines
    const id = setTimeout(() => setIntroStep((s) => s + 1), duration)
    return () => clearTimeout(id)
  }, [introStep, introComplete, introLines, typingSpeed, delayBetweenLines])

  // Scroll terminal content on new history entry
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [history])

  // Focus input when interactive mode activates
  useEffect(() => {
    if (introComplete) inputRef.current?.focus({ preventScroll: true })
  }, [introComplete])

  function focusInput() {
    inputRef.current?.focus({ preventScroll: true })
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  function navigateTo(path: string) {
    router.push(`/${locale}/${path}`)
  }

  function clearHistory() {
    setHistory([])
  }

  function switchLocale() {
    const next = locale === 'en' ? 'es' : 'en'
    router.push(pathname.replace(`/${locale}`, `/${next}`))
  }

  function runCommand(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed) return

    const [cmd, ...argParts] = trimmed.toLowerCase().split(/\s+/)
    const rawArgs = argParts.join(' ')

    const def = resolvedCommands[cmd]
    const ctx: CommandContext = {
      scroll: scrollToSection,
      navigate: navigateTo,
      clear: clearHistory,
      setTheme,
      currentTheme: theme,
      switchLocale,
      currentLocale: locale,
      rawArgs,
      allCommands: resolvedCommands,
    }

    const output = def ? (
      def.action(ctx)
    ) : (
      <p className="pl-4 text-red-400">Sorry, my super powers are limited at the moment 😔</p>
    )

    if (cmd === 'clear') return

    setHistory((h) => [...h, { command: trimmed, output }])
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghostText) {
      e.preventDefault()
      setInput(suggestion)
    }
  }

  return (
    <div
      onClick={focusInput}
      className="w-full cursor-text overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur-md"
    >
      {/* Title bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex cursor-default items-center gap-1.5 border-b border-white/10 px-4 py-2.5"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="text-muted-foreground ml-2 flex-1 font-mono text-[10px]">terminal</span>

        {/* Pin button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPin()
          }}
          title={pinned ? 'Unpin terminal' : 'Pin terminal (drag anywhere)'}
          className={`cursor-pointer rounded px-1.5 py-0.5 font-mono text-[10px] transition-all hover:bg-white/10 ${
            pinned ? 'bg-accent/20 text-accent ring-accent/40 ring-1' : 'text-muted-foreground'
          }`}
        >
          {pinned ? '📌 pinned' : '📌'}
        </button>
      </div>

      {/* Content */}
      <div className="max-h-72 overflow-y-auto px-4 py-4 font-mono text-xs">
        {introLines.map((line, i) => (
          <IntroLine
            key={line.prompt}
            line={line}
            active={i === introStep}
            done={i < introStep}
            typingSpeed={typingSpeed}
          />
        ))}

        {introComplete &&
          history.map((entry, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-center gap-1">
                <span className="text-accent">❯</span>
                <span className="text-white">{entry.command}</span>
              </div>
              {entry.output && <div className="mt-0.5">{entry.output}</div>}
            </div>
          ))}

        {introComplete && (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-accent">❯</span>
            <div className="relative flex-1">
              {/* Ghost text layer */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 whitespace-pre text-white/25 select-none"
              >
                {input}
                <span>{ghostText}</span>
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                className="caret-accent relative w-full bg-transparent text-white outline-none placeholder:text-white/30"
                placeholder={input ? '' : 'type a command…'}
              />
            </div>
          </div>
        )}

        {!introComplete && introStep === introLines.length - 1 && (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-accent">❯</span>
            <span className="bg-accent inline-block h-3.5 w-1.5 animate-pulse" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export interface HeroTerminalProps {
  config?: TerminalConfig
}

export function HeroTerminal({ config = {} }: HeroTerminalProps) {
  const [pinned, setPinned] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pinnedPos, setPinnedPos] = useState<{ x: number; y: number } | null>(null)
  const inlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  // Resolve config with defaults (stable reference via useMemo)
  const resolvedConfig = useMemo<Required<TerminalConfig>>(
    () => ({
      introLines: config.introLines ?? DEFAULT_INTRO_LINES,
      typingSpeed: config.typingSpeed ?? DEFAULT_TYPING_SPEED,
      delayBetweenLines: config.delayBetweenLines ?? DEFAULT_DELAY_BETWEEN_LINES,
      commands: config.commands ?? {},
      extraCommands: config.extraCommands ?? {},
    }),
    [config]
  )

  // Resolve final command map: explicit `commands` replaces defaults; `extraCommands` merges on top
  const resolvedCommands = useMemo<Record<string, CommandDef>>(() => {
    const base =
      Object.keys(resolvedConfig.commands).length > 0
        ? resolvedConfig.commands
        : buildDefaultCommands()
    return { ...base, ...resolvedConfig.extraCommands }
  }, [resolvedConfig])

  function handlePin() {
    if (!pinned && inlineRef.current) {
      const rect = inlineRef.current.getBoundingClientRect()
      setPinnedPos({ x: rect.left, y: rect.top })
    }
    setPinned((p) => !p)
  }

  const shell = (
    <TerminalShell
      pinned={pinned}
      onPin={handlePin}
      config={resolvedConfig}
      resolvedCommands={resolvedCommands}
    />
  )

  const floatingTerminal =
    mounted && pinned && pinnedPos
      ? createPortal(
          <motion.div
            drag
            data-no-drag
            dragMomentum={false}
            dragElastic={0}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: pinnedPos.x,
              top: pinnedPos.y,
              zIndex: 9999,
              width: 320,
            }}
            className="cursor-grab drop-shadow-2xl active:cursor-grabbing"
          >
            {shell}
          </motion.div>,
          document.body
        )
      : null

  return (
    <>
      <motion.div
        ref={inlineRef}
        data-no-drag
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className={`mt-8 w-full max-w-xs transition-opacity duration-300 ${pinned ? 'invisible' : ''}`}
      >
        {!pinned && shell}
      </motion.div>

      {floatingTerminal}
    </>
  )
}
