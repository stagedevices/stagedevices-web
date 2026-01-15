import { useReducedMotion } from 'framer-motion'

export const useReducedMotionSafe = () => {
  const prefersReducedMotion = useReducedMotion()
  return prefersReducedMotion
}
