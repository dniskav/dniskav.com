import type { TerminalConfig } from '@dniskav/hero-terminal/dist/types'

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
    about: {
      description: 'Go to About section',
      action: ({ scroll }) => {
        scroll('about')
        return <p className="text-muted-foreground pl-4">Scrolling to About…</p>
      },
    },
    skills: {
      description: 'Go to Skills section',
      action: ({ scroll }) => {
        scroll('skills')
        return <p className="text-muted-foreground pl-4">Scrolling to Skills…</p>
      },
    },
    projects: {
      description: 'Go to Projects section',
      action: ({ scroll }) => {
        scroll('projects')
        return <p className="text-muted-foreground pl-4">Scrolling to Projects…</p>
      },
    },
    experience: {
      description: 'Go to Experience section',
      action: ({ scroll }) => {
        scroll('experience')
        return <p className="text-muted-foreground pl-4">Scrolling to Experience…</p>
      },
    },
    contact: {
      description: 'Go to Contact section',
      action: ({ scroll }) => {
        scroll('contact')
        return <p className="text-muted-foreground pl-4">Scrolling to Contact…</p>
      },
    },
    blog: {
      description: 'Open Blog page',
      action: ({ navigate }) => {
        navigate('blog')
        return <p className="text-muted-foreground pl-4">Opening Blog…</p>
      },
    },
    playground: {
      description: 'Open Playground page',
      action: ({ navigate }) => {
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
      action: ({ setTheme, currentTheme, rawArgs }) => {
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
      action: ({ switchLocale, currentLocale, rawArgs }) => {
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
      action: ({ clear }) => {
        clear()
        return null
      },
    },
  },
}
