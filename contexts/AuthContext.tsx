'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange } from '@/lib/auth'
import { sincronizarUsuario } from '@/lib/firestore'
import { RoleUsuario } from '@/lib/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  role: RoleUsuario | null
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, role: null, isAdmin: false })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<RoleUsuario | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (u) => {
      setUser(u)
      if (u) {
        try {
          const r = await sincronizarUsuario(u.uid, u.email ?? '')
          setRole(r)
        } catch {
          setRole('user')
        }
      } else {
        setRole(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, role, isAdmin: role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
