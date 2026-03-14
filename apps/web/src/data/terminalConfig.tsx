// Use a loose type here to avoid TS resolution issues with the package's
// exports map. The runtime package provides the actual behavior.
type TerminalConfig = any

export const terminalConfig: TerminalConfig = {
  typingSpeed: 36,
  delayBetweenLines: 800,

  introLines: [
    { prompt: 'whoami', output: ['dniskav'] },
    { prompt: 'role', output: ['Senior Frontend Engineer'] },
    { prompt: 'stack', output: ['React • TypeScript • Next.js'] },
    {
      prompt: 'focus',
      output: [
        'Frontend architecture',
        'Creative UI',
        'Interactive web',
        '',
        'type help to get available commands',
      ],
    },
  ],

  commands: {
    help: {
      description: 'Show available commands',
      action: ({ allCommands }: any) => (
        <div className="pl-4">
          <p className="text-accent mb-1">Available commands:</p>
          {Object.entries(allCommands).map(([cmd, info]: any) => (
            <p key={cmd}>
              <span className="text-white">{cmd.padEnd(14)}</span>
              <span className="text-muted-foreground">{info.description}</span>
            </p>
          ))}
        </div>
      ),
    },
    about: {
      description: 'Go to About section',
      action: ({ scroll }: any) => {
        scroll('about')
        return <p className="text-muted-foreground pl-4">Scrolling to About…</p>
      },
    },
    whoami: {
      description: 'Who is Daniel Silva?',
      action: () => (
        <div className="pl-4 space-y-1">
          <p className="text-accent font-semibold">Daniel Silva — Senior Frontend Engineer</p>
          <p className="text-muted-foreground">14+ years building web apps at scale.</p>
          <p className="text-muted-foreground">Originally from Colombia, now based in Tarragona, Spain.</p>
          <p className="text-muted-foreground">
            Core stack:{' '}
            <span className="text-white">React · TypeScript · Next.js · Angular</span>
          </p>
          <p className="text-muted-foreground">
            Also into:{' '}
            <span className="text-white">Python · FastAPI · Three.js · AI tooling</span>
          </p>
          <p className="text-muted-foreground">
            Worked at{' '}
            <span className="text-white">Daimler (T-Systems) · Globant · Endava · Lululemon · Elavon</span>
          </p>
          <p className="text-muted-foreground mt-1">
            Era I: 14 years as a craftsman engineer →{' '}
            <span className="text-white">Era II: AI-augmented engineer (2025→)</span>
          </p>
        </div>
      ),
    },
    site: {
      description: 'How is this site built?',
      action: () => (
        <div className="pl-4 space-y-1">
          <p className="text-accent font-semibold">dniskav.com — Stack & Infrastructure</p>
          <p className="text-muted-foreground">
            Framework: <span className="text-white">Next.js 15 (App Router) · React 19</span>
          </p>
          <p className="text-muted-foreground">
            Styling: <span className="text-white">Tailwind CSS v4 · Framer Motion · Lenis</span>
          </p>
          <p className="text-muted-foreground">
            3D / WebGL: <span className="text-white">Three.js · React Three Fiber · Drei</span>
          </p>
          <p className="text-muted-foreground">
            i18n: <span className="text-white">next-intl (EN + ES)</span>
          </p>
          <p className="text-muted-foreground">
            AI chat: <span className="text-white">Gemini 2.5 Flash</span>
          </p>
          <p className="text-muted-foreground">
            Terminal: <span className="text-white">@dniskav/hero-terminal (custom npm pkg)</span>
          </p>
          <p className="text-muted-foreground">
            Deploy: <span className="text-white">Hetzner VPS · Caddy · Cloudflare · Docker · GitHub Actions</span>
          </p>
        </div>
      ),
    },
    skills: {
      description: 'Go to Skills section',
      action: ({ scroll }: any) => {
        scroll('skills')
        return <p className="text-muted-foreground pl-4">Scrolling to Skills…</p>
      },
    },
    projects: {
      description: 'Go to Projects section',
      action: ({ scroll }: any) => {
        scroll('projects')
        return <p className="text-muted-foreground pl-4">Scrolling to Projects…</p>
      },
    },
    experience: {
      description: 'Go to Experience section',
      action: ({ scroll }: any) => {
        scroll('experience')
        return <p className="text-muted-foreground pl-4">Scrolling to Experience…</p>
      },
    },
    contact: {
      description: 'Go to Contact section',
      action: ({ scroll }: any) => {
        scroll('contact')
        return <p className="text-muted-foreground pl-4">Scrolling to Contact…</p>
      },
    },
    blog: {
      description: 'Open Blog page',
      action: ({ navigate }: any) => {
        navigate('blog')
        return <p className="text-muted-foreground pl-4">Opening Blog…</p>
      },
    },
    playground: {
      description: 'Open Playground page',
      action: ({ navigate }: any) => {
        navigate('playground')
        return <p className="text-muted-foreground pl-4">Opening Playground…</p>
      },
    },
    github: {
      description: 'Open GitHub profile',
      action: () => {
        window.open('https://github.com/dniskav', '_blank')
        return <p className="text-muted-foreground pl-4">Opening GitHub…</p>
      },
    },
    linkedin: {
      description: 'Open LinkedIn profile',
      action: () => {
        window.open('https://linkedin.com/in/dniskav', '_blank')
        return <p className="text-muted-foreground pl-4">Opening LinkedIn…</p>
      },
    },
    email: {
      description: 'Open email client',
      action: () => {
        window.open('mailto:dniskav@gmail.com', '_blank')
        return <p className="text-muted-foreground pl-4">Opening email client…</p>
      },
    },
    theme: {
      description: 'Toggle theme  [dark|light]',
      action: ({ setTheme, currentTheme, rawArgs }: any) => {
        const arg = rawArgs.trim().toLowerCase()
        const next =
          arg === 'dark' || arg === 'light' ? arg : currentTheme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        return (
          <p className="text-muted-foreground pl-4">
            Theme set to <span className="text-white">{next}</span> {next === 'dark' ? '🌙' : '☀️'}
          </p>
        )
      },
    },
    lang: {
      description: 'Switch language   [en|es]',
      action: ({ switchLocale, currentLocale, rawArgs }: any) => {
        const arg = rawArgs.trim().toLowerCase()
        const target = arg === 'en' || arg === 'es' ? arg : null
        if (target && target === currentLocale) {
          return (
            <p className="text-muted-foreground pl-4">
              Already using <span className="text-white">{currentLocale.toUpperCase()}</span>
            </p>
          )
        }
        switchLocale()
        const next = target ?? (currentLocale === 'en' ? 'es' : 'en')
        return (
          <p className="text-muted-foreground pl-4">
            Switching to <span className="text-white">{next.toUpperCase()}</span>…
          </p>
        )
      },
    },
    clear: {
      description: 'Clear terminal history',
      action: ({ clear }: any) => {
        clear()
        return null
      },
    },
  },
}
