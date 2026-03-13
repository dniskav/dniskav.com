'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Smooth spring follow
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40 })

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)

      const target = e.target as HTMLElement
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
          target.tagName === 'A' ||
          target.tagName === 'BUTTON'
      )
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [mouseX, mouseY, visible])

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] h-2 w-2 rounded-full bg-[var(--accent)]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full border border-[var(--accent)]/40"
        animate={{
          width: isPointer ? 48 : 32,
          height: isPointer ? 48 : 32,
        }}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}
