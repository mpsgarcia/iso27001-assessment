'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  tabKey: string
  children: React.ReactNode
  className?: string
}

/**
 * Wraps tab content so switching tabs plays a smooth
 * fade-out → swap → fade-in transition.
 */
export default function AnimatedTab({ tabKey, children, className = '' }: Props) {
  const [displayed, setDisplayed] = useState(children)
  const [phase, setPhase] = useState<'visible' | 'exit' | 'enter'>('visible')
  const prevKey = useRef(tabKey)
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (tabKey === prevKey.current) return

    // 1. Start fade-out
    setPhase('exit')

    // 2. After fade-out, swap content and start fade-in
    t1.current = setTimeout(() => {
      setDisplayed(children)
      prevKey.current = tabKey
      setPhase('enter')
    }, 180)

    // 3. Reset to fully visible
    t2.current = setTimeout(() => setPhase('visible'), 420)

    return () => {
      if (t1.current) clearTimeout(t1.current)
      if (t2.current) clearTimeout(t2.current)
    }
  }, [tabKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const style: React.CSSProperties = {
    transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: phase === 'exit' ? 0 : 1,
    transform:
      phase === 'exit'   ? 'translateY(-8px)' :
      phase === 'enter'  ? 'translateY(12px)'  :
      'translateY(0)',
  }

  return (
    <div style={style} className={className}>
      {displayed}
    </div>
  )
}
