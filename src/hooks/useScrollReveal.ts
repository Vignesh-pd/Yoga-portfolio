import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  y?: number
  x?: number
  duration?: number
  delay?: number
  stagger?: number
  start?: string
  childSelector?: string
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      y = 40,
      x = 0,
      duration = 0.8,
      delay = 0,
      stagger = 0.1,
      start = 'top 85%',
      childSelector,
    } = options

    const targets = childSelector ? el.querySelectorAll(childSelector) : el

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        x,
        duration,
        delay,
        stagger,
        ease: 'cubic-bezier(0.76, 0, 0.24, 1)',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}
