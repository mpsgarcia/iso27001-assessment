import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  getAuth,
} from 'firebase/auth'
import { initializeApp, deleteApp } from 'firebase/app'
import { auth, firebaseConfig } from './firebase'

const ALLOWED_DOMAIN = 'spread.com.br'

export function isDomainAllowed(email: string): boolean {
  return email.endsWith(`@${ALLOWED_DOMAIN}`)
}

export async function signIn(email: string, password: string): Promise<User> {
  if (!isDomainAllowed(email)) {
    throw new Error(`Acesso restrito. Apenas e-mails @${ALLOWED_DOMAIN} são permitidos.`)
  }
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signUp(email: string, password: string): Promise<User> {
  if (!isDomainAllowed(email)) {
    throw new Error(`Cadastro restrito. Apenas e-mails @${ALLOWED_DOMAIN} são permitidos.`)
  }
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function criarUsuarioComoAdmin(email: string, password: string): Promise<string> {
  if (!isDomainAllowed(email)) {
    throw new Error(`Cadastro restrito. Apenas e-mails @${ALLOWED_DOMAIN} são permitidos.`)
  }
  // Usa instância secundária para não deslogar o admin atual
  const appSecundario = initializeApp(firebaseConfig, `criar-usuario-${Date.now()}`)
  const authSecundario = getAuth(appSecundario)
  try {
    const result = await createUserWithEmailAndPassword(authSecundario, email, password)
    return result.user.uid
  } finally {
    await deleteApp(appSecundario)
  }
}
