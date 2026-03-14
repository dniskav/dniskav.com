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
  { id: 'dniskav', label: 'dniskav', size: 1.6, type: 'root', color: '#c9a227' },

  // HTML — foundation of the web
  { id: 'HTML', size: 1.1, type: 'primary', parent: 'dniskav', color: '#e34f26', logo: '/tech/html.svg' },

  // JavaScript tree
  { id: 'JavaScript', size: 1.25, type: 'primary', parent: 'dniskav', color: '#f59e0b', logo: '/tech/javascript.svg' },
  { id: 'TypeScript', size: 1.25, type: 'primary', parent: 'JavaScript', color: '#3178c6', logo: '/tech/typescript.svg' },
  { id: 'React', size: 1.2, type: 'primary', parent: 'Backbone.js', color: '#61dafb', logo: '/tech/react.svg' },
  { id: 'Next.js', size: 1.15, type: 'primary', parent: 'React', color: '#ffffff', logo: '/tech/nextjs.svg' },
  { id: 'Three.js', size: 0.8, type: 'secondary', parent: 'JavaScript', color: '#ff6b6b', era: 2, logo: '/tech/threejs.svg' },
  { id: 'jQuery', size: 0.5, parent: 'JavaScript', color: '#78716c', logo: '/tech/jquery.svg' },
  { id: 'Backbone.js', size: 0.48, parent: 'jQuery', color: '#8fa3b1', logo: '/tech/backbonejs.svg' },
  { id: 'AngularJS', size: 0.45, parent: 'JavaScript', color: '#dd1b16', logo: '/tech/angularjs.svg' },
  { id: 'Angular', size: 0.75, type: 'secondary', parent: 'AngularJS', color: '#dd1b16', era: 1, logo: '/tech/angular.svg' },

  // CSS tree
  { id: 'CSS', size: 0.95, type: 'secondary', parent: 'HTML', color: '#38bdf8', logo: '/tech/css.svg' },
  { id: 'Tailwind', size: 1.0, type: 'secondary', parent: 'CSS', color: '#38bdf8', logo: '/tech/tailwind.svg' },
  { id: 'Sass', size: 0.58, parent: 'CSS', color: '#cc6699', logo: '/tech/sass.svg' },

  // Build tools tree (Node.js ecosystem)
  { id: 'Node.js', size: 0.9, type: 'secondary', parent: 'dniskav', color: '#6db33f', logo: '/tech/nodejs.svg' },
  { id: 'Express', size: 0.65, parent: 'Node.js', color: '#aaaaaa', logo: '/tech/express.svg' },
  { id: 'Webpack', size: 0.75, parent: 'Node.js', color: '#8dd6f9', logo: '/tech/webpack.svg' },
  { id: 'Grunt', size: 0.42, parent: 'Node.js', color: '#fab380', era: 1, logo: '/tech/grunt.svg' },
  { id: 'Gulp', size: 0.48, parent: 'Grunt', color: '#cf4647', era: 1, logo: '/tech/gulp.svg' },

  // Version control
  { id: 'Git', size: 1.15, type: 'primary', parent: 'dniskav', color: '#f05032', logo: '/tech/git.svg' },
  { id: 'SVN', size: 0.42, parent: 'Git', color: '#809cc9', era: 1, logo: '/tech/svn.svg' },

  // Methodologies — no logo, render as colored spheres
  { id: 'Scrum', size: 0.7, type: 'secondary', parent: 'dniskav', color: '#6db33f' },
  { id: 'Kanban', size: 0.65, parent: 'Scrum', color: '#0052cc' },

  // AI Era
  { id: 'Python', size: 1.1, type: 'secondary', parent: 'dniskav', color: '#fbbf24', era: 2, logo: '/tech/python.svg' },
  { id: 'FastAPI', size: 0.85, parent: 'Python', color: '#009688', era: 2, logo: '/tech/fastapi.svg' },
]

// Build edges from parent relationships
export const techEdges: TechEdge[] = techNodes
  .filter((n) => n.parent)
  .map((n) => ({ source: n.parent!, target: n.id }))
