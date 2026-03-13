declare module '@dniskav/hero-terminal' {
  // Re-export the package's type definitions (workaround for packages that
  // expose `types` but not via the `exports` map).
  export * from '@dniskav/hero-terminal/dist/types'

  // Export a loose `HeroTerminal` value so runtime import compiles.
  const HeroTerminal: any
  export { HeroTerminal }
}
