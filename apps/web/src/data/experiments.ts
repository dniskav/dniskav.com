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
    slug: 'noise-field',
    title: 'Noise Field',
    titleEs: 'Campo de Ruido',
    description: 'A 3D particle field animated with sine-wave noise. 8 000 points drift organically through space.',
    descriptionEs: 'Un campo de partículas 3D animado con ruido de onda sinusoidal. 8 000 puntos se mueven orgánicamente por el espacio.',
    tags: ['Three.js', 'R3F', 'GLSL', 'Particles'],
    year: 2025,
  },
]
