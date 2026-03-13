'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp } from '@/animations/variants'
import type { Variants } from 'framer-motion'

interface AnimateInProps {
  children: React.ReactNode
  variants?: Variants
  delay?: number
  className?: string
  once?: boolean
}

export function AnimateIn({
  children,
  variants = fadeInUp,
  delay = 0,
  className = '',
  once = true,
}: AnimateInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
