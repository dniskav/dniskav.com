export interface TechNode {
  id: string
  label?: string
  parent?: string
  size?: number
  type?: 'root' | 'primary' | 'secondary'
  color?: string
  era?: 1 | 2
  logo?: string
}

export interface TechEdge {
  source: string
  target: string
}

export const techNodes: TechNode[] = [
  // Root
  { id: 'dniskav', label: 'dniskav', size: 1.6, type: 'root', color: '#3b82f6', logo: '/tech/dniskav.svg' },

  // JavaScript tree
  { id: 'JavaScript', size: 1.2, type: 'primary', parent: 'dniskav', color: '#f59e0b', logo: '/tech/javascript.svg' },
  { id: 'jQuery', parent: 'JavaScript', color: '#78716c', logo: '/tech/jquery.svg' },
  { id: 'Backbone.js', parent: 'jQuery', color: '#8fa3b1', logo: '/tech/backbonejs.svg' },
  { id: 'React', size: 1.1, type: 'primary', parent: 'Backbone.js', color: '#61dafb', logo: '/tech/react.svg' },
  { id: 'Next.js', size: 1.1, type: 'primary', parent: 'React', color: '#ffffff', logo: '/tech/nextjs.svg' },
  { id: 'TypeScript', size: 1.0, type: 'primary', parent: 'JavaScript', color: '#3178c6', logo: '/tech/typescript.svg' },

  // Angular tree
  { id: 'AngularJS', parent: 'JavaScript', color: '#dd1b16', logo: '/tech/angularjs.svg' },
  { id: 'Angular', size: 0.9, type: 'secondary', parent: 'AngularJS', color: '#dd1b16', era: 1, logo: '/tech/angular.svg' },

  // CSS tree
  { id: 'CSS', size: 0.9, type: 'secondary', parent: 'dniskav', color: '#38bdf8', logo: '/tech/css.svg' },
  { id: 'Sass', parent: 'CSS', color: '#cc6699', logo: '/tech/sass.svg' },
  { id: 'Tailwind', size: 0.9, type: 'secondary', parent: 'CSS', color: '#38bdf8', logo: '/tech/tailwind.svg' },

  // Node tree
  { id: 'Node.js', size: 0.9, type: 'secondary', parent: 'dniskav', color: '#6db33f', logo: '/tech/nodejs.svg' },
  { id: 'Express', parent: 'Node.js', color: '#aaaaaa', logo: '/tech/express.svg' },

  // 3D / Creative
  { id: 'Three.js', size: 0.85, type: 'secondary', parent: 'JavaScript', color: '#ff6b6b', era: 2, logo: '/tech/threejs.svg' },

  // AI Era
  { id: 'Python', size: 0.9, type: 'secondary', parent: 'dniskav', color: '#fbbf24', era: 2, logo: '/tech/python.svg' },
  { id: 'FastAPI', parent: 'Python', color: '#009688', era: 2, logo: '/tech/fastapi.svg' },
]

// Build edges from parent relationships
export const techEdges: TechEdge[] = techNodes
  .filter((n) => n.parent)
  .map((n) => ({ source: n.parent!, target: n.id }))
