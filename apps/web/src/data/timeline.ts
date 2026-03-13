export type Category = 'frontend' | 'backend' | 'tools' | 'ai'

export interface TechTag {
  name: string
  category: Category
}

export interface TimelineEntry {
  period: string
  year: number // for sorting / positioning
  era: 1 | 2
  tags: TechTag[]
}

export const categoryColors: Record<Category, string> = {
  frontend: '#61dafb',  // React blue
  backend:  '#6db33f',  // Node green
  tools:    '#f59e0b',  // amber
  ai:       '#a78bfa',  // purple
}

export const categoryLabels: Record<Category, { en: string; es: string }> = {
  frontend: { en: 'Frontend', es: 'Frontend' },
  backend:  { en: 'Backend',  es: 'Backend'  },
  tools:    { en: 'Tools',    es: 'Herramientas' },
  ai:       { en: 'AI / Agents', es: 'IA / Agentes' },
}

export const timeline: TimelineEntry[] = [
  {
    period: '2011 – 2013',
    year: 2011,
    era: 1,
    tags: [
      { name: 'Vanilla JS',   category: 'frontend' },
      { name: 'AngularJS',    category: 'frontend' },
      { name: 'Backbone.js',  category: 'frontend' },
      { name: 'Node.js',      category: 'backend'  },
      { name: 'HTML5 Canvas', category: 'frontend' },
    ],
  },
  {
    period: '2014 – 2015',
    year: 2014,
    era: 1,
    tags: [
      { name: 'Express',    category: 'backend'  },
      { name: 'Socket.io',  category: 'backend'  },
      { name: 'Grunt',      category: 'tools'    },
      { name: 'npm scripts',category: 'tools'    },
      { name: 'CSS / Sass', category: 'frontend' },
    ],
  },
  {
    period: '2016 – 2017',
    year: 2016,
    era: 1,
    tags: [
      { name: 'React',      category: 'frontend' },
      { name: 'Webpack',    category: 'tools'    },
      { name: 'jQuery',     category: 'frontend' },
    ],
  },
  {
    period: '2018 – 2019',
    year: 2018,
    era: 1,
    tags: [
      { name: 'React Hooks', category: 'frontend' },
      { name: 'Redux',       category: 'frontend' },
      { name: 'MongoDB',     category: 'backend'  },
      { name: 'TypeScript',  category: 'frontend' },
      { name: 'Next.js',     category: 'frontend' },
    ],
  },
  {
    period: '2020 – 2021',
    year: 2020,
    era: 1,
    tags: [
      { name: 'Angular',           category: 'frontend' },
      { name: 'Styled-components', category: 'frontend' },
      { name: 'React Testing Lib', category: 'tools'    },
      { name: 'Docker',            category: 'tools'    },
    ],
  },
  {
    period: '2022 – 2024',
    year: 2022,
    era: 1,
    tags: [
      { name: 'Angular 18',  category: 'frontend' },
      { name: 'RxJS',        category: 'frontend' },
      { name: 'Bun',         category: 'tools'    },
      { name: 'Tailwind CSS',category: 'frontend' },
      { name: 'Vitest',      category: 'tools'    },
    ],
  },
  {
    period: '2025 →',
    year: 2025,
    era: 2,
    tags: [
      { name: 'React + Vite',      category: 'frontend' },
      { name: 'Microfrontends',    category: 'frontend' },
      { name: 'fTree (custom JSX)',category: 'frontend' },
      { name: 'Python',            category: 'backend'  },
      { name: 'FastAPI',           category: 'backend'  },
      { name: 'Claude / MCP',      category: 'ai'       },
      { name: 'AI Agents',         category: 'ai'       },
    ],
  },
]
