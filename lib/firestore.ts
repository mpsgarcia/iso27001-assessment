import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { Projeto, AvaliacaoItem, StatusAvaliacao, Usuario, RoleUsuario } from './types'

const ADMIN_EMAIL = 'marcos.garcia@spread.com.br'

// ── PROJETOS ──────────────────────────────────────────────
export async function criarProjeto(uid: string, dados: Omit<Projeto, 'id' | 'criadoEm' | 'atualizadoEm' | 'uid'>) {
  const ref = await addDoc(collection(db, 'projetos'), {
    ...dados,
    uid,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  })
  return ref.id
}

export async function listarProjetos(uid: string): Promise<Projeto[]> {
  const q = query(collection(db, 'projetos'), where('uid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Projeto))
}

export async function buscarProjeto(id: string): Promise<Projeto | null> {
  const snap = await getDoc(doc(db, 'projetos', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Projeto
}

export async function atualizarProjeto(id: string, dados: Partial<Projeto>) {
  await updateDoc(doc(db, 'projetos', id), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  })
}

export async function excluirProjeto(id: string) {
  await deleteDoc(doc(db, 'projetos', id))
}

// ── AVALIAÇÕES ────────────────────────────────────────────
export async function salvarAvaliacao(
  projetoId: string,
  tipo: 'requisitos' | 'controles',
  itemId: string,
  dados: Partial<AvaliacaoItem>
) {
  const ref = doc(db, 'projetos', projetoId, tipo, itemId)
  await setDoc(ref, { ...dados, atualizadoEm: serverTimestamp() }, { merge: true })
}

export async function carregarAvaliacoes(
  projetoId: string,
  tipo: 'requisitos' | 'controles'
): Promise<Record<string, AvaliacaoItem>> {
  const snap = await getDocs(collection(db, 'projetos', projetoId, tipo))
  const result: Record<string, AvaliacaoItem> = {}
  snap.docs.forEach((d) => { result[d.id] = d.data() as AvaliacaoItem })
  return result
}

// ── ESTIMATIVAS ───────────────────────────────────────────
export async function salvarEstimativa(
  projetoId: string,
  itemId: string,
  dados: Record<string, unknown>
) {
  const ref = doc(db, 'projetos', projetoId, 'estimativas', itemId)
  await setDoc(ref, { ...dados, atualizadoEm: serverTimestamp() }, { merge: true })
}

export async function carregarEstimativas(
  projetoId: string
): Promise<Record<string, Record<string, unknown>>> {
  const snap = await getDocs(collection(db, 'projetos', projetoId, 'estimativas'))
  const result: Record<string, Record<string, unknown>> = {}
  snap.docs.forEach((d) => { result[d.id] = d.data() })
  return result
}

// ── USUÁRIOS ──────────────────────────────────────────────
export async function sincronizarUsuario(uid: string, email: string): Promise<RoleUsuario> {
  const ref = doc(db, 'usuarios', uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data().role as RoleUsuario
  }
  const role: RoleUsuario = email === ADMIN_EMAIL ? 'admin' : 'user'
  await setDoc(ref, { uid, email, role, criadoEm: serverTimestamp() })
  return role
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const snap = await getDocs(collection(db, 'usuarios'))
  return snap.docs.map((d) => ({ ...d.data() } as Usuario))
}

export async function atualizarRoleUsuario(uid: string, role: RoleUsuario): Promise<void> {
  await updateDoc(doc(db, 'usuarios', uid), { role })
}

export async function registrarNovoUsuario(uid: string, email: string, nome: string): Promise<void> {
  await setDoc(doc(db, 'usuarios', uid), { uid, email, nome, role: 'user', criadoEm: serverTimestamp() })
}

// ── HELPERS DASHBOARD ─────────────────────────────────────
export function calcularResumo(avaliacoes: Record<string, AvaliacaoItem>) {
  const contagem: Record<StatusAvaliacao, number> = {
    nao_atende: 0,
    atende_parcialmente: 0,
    atende_totalmente: 0,
    nao_aplicavel: 0,
    nao_preenchido: 0,
  }
  Object.values(avaliacoes).forEach((a) => {
    const s = (a.status || 'nao_preenchido') as StatusAvaliacao
    contagem[s] = (contagem[s] || 0) + 1
  })
  return contagem
}
