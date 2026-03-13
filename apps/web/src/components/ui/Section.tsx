interface SectionProps {
  children: React.ReactNode
  id?: string
  className?: string
  fullHeight?: boolean
}

export function Section({ children, id, className = '', fullHeight }: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full px-6 py-24 md:px-12 lg:px-24 ${fullHeight ? 'min-h-screen' : ''} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}
