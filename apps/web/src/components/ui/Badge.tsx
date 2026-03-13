interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'era1' | 'era2'
  className?: string
}

const variants = {
  default: 'bg-[var(--border)] text-[var(--muted-foreground)]',
  accent: 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20',
  era1: 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/50',
  era2: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
