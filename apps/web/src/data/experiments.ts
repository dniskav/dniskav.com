export interface Experiment {
  slug: string
  title: string
  titleEs: string
  description: string
  descriptionEs: string
  tags: string[]
  year: number
}

export const experiments: Experiment[] = [
  {
    slug: 'tech-constellation',
    title: 'Tech Constellation',
    titleEs: 'Constelación de Tecnologías',
    description: 'Interactive 3D graph of my tech evolution from 2011 to today. Every node is a technology I\'ve used — drag to explore, scroll to zoom.',
    descriptionEs: 'Grafo 3D interactivo de mi evolución tecnológica desde 2011 hasta hoy. Cada nodo es una tecnología que he usado — arrastra para explorar, scroll para hacer zoom.',
    tags: ['Three.js', 'R3F', 'WebGL', '3D'],
    year: 2025,
  },
  {
    slug: 'noise-field',
    title: 'Noise Field',
    titleEs: 'Campo de Ruido',
    description: 'A 3D particle field animated with sine-wave noise. 8 000 points drift organically through space.',
    descriptionEs: 'Un campo de partículas 3D animado con ruido de onda sinusoidal. 8 000 puntos se mueven orgánicamente por el espacio.',
    tags: ['Three.js', 'R3F', 'GLSL', 'Particles'],
    year: 2025,
  },
]
