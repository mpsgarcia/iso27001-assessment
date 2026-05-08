import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
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

export async function criarUsuarioComoAdmin(email: string): Promise<string> {
  if (!isDomainAllowed(email)) {
    throw new Error(`Cadastro restrito. Apenas e-mails @${ALLOWED_DOMAIN} são permitidos.`)
  }
  // Senha temporária aleatória — o usuário a troca pelo link enviado por e-mail
  const senhaTemp = `Tmp_${Math.random().toString(36).slice(-10)}${Date.now()}`
  const appSecundario = initializeApp(firebaseConfig, `criar-usuario-${Date.now()}`)
  const authSecundario = getAuth(appSecundario)
  try {
    const result = await createUserWithEmailAndPassword(authSecundario, email, senhaTemp)
    // Envia e-mail de redefinição de senha para forçar troca no primeiro acesso
    await sendPasswordResetEmail(auth, email)
    return result.user.uid
  } finally {
    await deleteApp(appSecundario)
  }
}
