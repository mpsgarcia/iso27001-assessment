export interface EntregavelEstimativa {
  id: string
  fase: string
  entregavel: string
  atividades: string
  horasBaixa: number
  horasMedia: number
  horasAlta: number
}

export const ESTIMATIVAS: EntregavelEstimativa[] = [
  // FASE 1
  { id: 'f1_1', fase: 'FASE 1 — DIAGNÓSTICO E GAP ANALYSIS', entregavel: 'Reuniões de kick-off e entrevistas', atividades: 'Reuniões com direção, TI, RH, jurídico; entrevistas de contexto', horasBaixa: 16, horasMedia: 12, horasAlta: 8 },
  { id: 'f1_2', fase: 'FASE 1 — DIAGNÓSTICO E GAP ANALYSIS', entregavel: 'Análise documental', atividades: 'Revisão de documentos existentes (políticas, contratos, logs)', horasBaixa: 12, horasMedia: 8, horasAlta: 4 },
  { id: 'f1_3', fase: 'FASE 1 — DIAGNÓSTICO E GAP ANALYSIS', entregavel: 'Walk-through técnico', atividades: 'Inspeção de infraestrutura, configurações e sistemas existentes', horasBaixa: 8, horasMedia: 8, horasAlta: 8 },
  { id: 'f1_4', fase: 'FASE 1 — DIAGNÓSTICO E GAP ANALYSIS', entregavel: 'Preenchimento do Gap Analysis', atividades: 'Avaliação de 26 requisitos + 93 controles com constatações', horasBaixa: 24, horasMedia: 16, horasAlta: 10 },
  { id: 'f1_5', fase: 'FASE 1 — DIAGNÓSTICO E GAP ANALYSIS', entregavel: 'Relatório de Gap Analysis + Roadmap', atividades: 'Relatório executivo e roadmap macro de implementação', horasBaixa: 16, horasMedia: 12, horasAlta: 10 },
  // FASE 2
  { id: 'f2_1', fase: 'FASE 2 — PLANEJAMENTO DO SGSI', entregavel: 'Definição de escopo e contexto (cl. 4.3, 4.1, 4.2)', atividades: 'Documento de escopo, análise de contexto e partes interessadas', horasBaixa: 16, horasMedia: 12, horasAlta: 8 },
  { id: 'f2_2', fase: 'FASE 2 — PLANEJAMENTO DO SGSI', entregavel: 'Política de SI e papéis/responsabilidades (cl. 5.2, 5.3)', atividades: 'Redigir, validar e aprovar Política de SI; definir papéis documentados', horasBaixa: 12, horasMedia: 8, horasAlta: 6 },
  { id: 'f2_3', fase: 'FASE 2 — PLANEJAMENTO DO SGSI', entregavel: 'Metodologia de avaliação e tratamento de riscos (cl. 6.1.2, 6.1.3)', atividades: 'Critérios de risco, metodologia de avaliação e processo de tratamento', horasBaixa: 20, horasMedia: 16, horasAlta: 10 },
  { id: 'f2_4', fase: 'FASE 2 — PLANEJAMENTO DO SGSI', entregavel: 'Objetivos de SI e plano de alcance (cl. 6.2)', atividades: 'Objetivos mensuráveis com responsáveis, prazos e métricas', horasBaixa: 8, horasMedia: 6, horasAlta: 4 },
  { id: 'f2_5', fase: 'FASE 2 — PLANEJAMENTO DO SGSI', entregavel: 'Plano de comunicações (cl. 7.4)', atividades: 'Plano de comunicação interna e externa relacionada ao SGSI', horasBaixa: 6, horasMedia: 4, horasAlta: 3 },
  // FASE 3
  { id: 'f3_1', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Escopo do SGSI — documento formal (cl. 4.3)', atividades: 'Documento de escopo aprovado pela direção, com limites e justificativas', horasBaixa: 6, horasMedia: 4, horasAlta: 3 },
  { id: 'f3_2', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Análise de contexto e partes interessadas (cl. 4.1, 4.2)', atividades: 'Documento com questões internas/externas e requisitos das partes interessadas', horasBaixa: 8, horasMedia: 6, horasAlta: 4 },
  { id: 'f3_3', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Política de Segurança da Informação (cl. 5.2)', atividades: 'Política aprovada, publicada e comunicada a todos os colaboradores', horasBaixa: 8, horasMedia: 6, horasAlta: 4 },
  { id: 'f3_4', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Papéis e responsabilidades de SI (cl. 5.3)', atividades: 'Manual do SGSI ou documento de papéis, responsabilidades e autoridades', horasBaixa: 6, horasMedia: 4, horasAlta: 3 },
  { id: 'f3_5', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Metodologia de avaliação de riscos — processo (cl. 6.1.2)', atividades: 'Processo documentado: critérios de aceitação, metodologia e escala de risco', horasBaixa: 12, horasMedia: 10, horasAlta: 6 },
  { id: 'f3_6', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Avaliação de riscos — resultado completo (cl. 6.1.2, 8.2)', atividades: 'Planilha com ativos, ameaças, vulnerabilidades, probabilidade, impacto e risco', horasBaixa: 20, horasMedia: 16, horasAlta: 10 },
  { id: 'f3_7', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Declaração de Aplicabilidade — SoA completo (cl. 6.1.3d)', atividades: 'SoA com todos os 93 controles, justificativas de inclusão/exclusão e status', horasBaixa: 16, horasMedia: 14, horasAlta: 10 },
  { id: 'f3_8', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Plano de Tratamento de Riscos — PTR (cl. 6.1.3e)', atividades: 'PTR com controles selecionados, responsáveis, prazos e monitoramento', horasBaixa: 12, horasMedia: 10, horasAlta: 6 },
  { id: 'f3_9', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Objetivos de SI documentados (cl. 6.2)', atividades: 'Planilha ou documento com objetivos, métricas, metas, responsáveis e prazos', horasBaixa: 6, horasMedia: 4, horasAlta: 3 },
  { id: 'f3_10', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Planejamento de mudanças no SGSI (cl. 6.3)', atividades: 'Procedimento de controle de mudanças planejadas no SGSI', horasBaixa: 4, horasMedia: 3, horasAlta: 2 },
  { id: 'f3_11', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Procedimento de controle da informação documentada (cl. 7.5)', atividades: 'Processo para criação, atualização, identificação e controle de documentos', horasBaixa: 8, horasMedia: 6, horasAlta: 4 },
  { id: 'f3_12', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Evidências de competência e treinamento (cl. 7.2)', atividades: 'Matriz de competências, registros de treinamentos, certificados e avaliações', horasBaixa: 8, horasMedia: 6, horasAlta: 4 },
  { id: 'f3_13', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Procedimentos operacionais documentados (cl. 8.1, A.5.37)', atividades: 'Procedimentos de TI documentados e disponíveis para o pessoal', horasBaixa: 10, horasMedia: 8, horasAlta: 5 },
  { id: 'f3_14', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Políticas temáticas de SI — mínimo 10 (A.5.1)', atividades: 'Controle de acesso, classificação, incidentes, criptografia, fornecedores, backup, desenvolvimento seguro, trabalho remoto, mesa limpa, uso aceitável', horasBaixa: 50, horasMedia: 36, horasAlta: 22 },
  { id: 'f3_15', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Programa de auditoria interna (cl. 9.2)', atividades: 'Programa anual com frequência, escopo, critérios e responsáveis', horasBaixa: 8, horasMedia: 6, horasAlta: 4 },
  { id: 'f3_16', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Métricas e indicadores de desempenho de SI (cl. 9.1)', atividades: 'Painel ou planilha com indicadores, método de coleta e periodicidade', horasBaixa: 8, horasMedia: 6, horasAlta: 4 },
  { id: 'f3_17', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Procedimento de NC e ação corretiva (cl. 10.2)', atividades: 'Processo para registro, análise de causa-raiz, ação corretiva e verificação', horasBaixa: 6, horasMedia: 5, horasAlta: 3 },
  { id: 'f3_18', fase: 'FASE 3 — DOCUMENTAÇÃO DO SGSI', entregavel: 'Inventário de ativos e informações (A.5.9)', atividades: 'Inventário completo com proprietário, classificação, localização e criticidade', horasBaixa: 20, horasMedia: 14, horasAlta: 8 },
  // FASE 4
  { id: 'f4_1', fase: 'FASE 4 — IMPLEMENTAÇÃO DE CONTROLES', entregavel: 'Controles tecnológicos (seção A.8)', atividades: 'IAM, MFA, logs, backup, SIEM, DLP, patch management, vuln. scanning', horasBaixa: 40, horasMedia: 32, horasAlta: 20 },
  { id: 'f4_2', fase: 'FASE 4 — IMPLEMENTAÇÃO DE CONTROLES', entregavel: 'Controles organizacionais (seção A.5)', atividades: 'Fornecedores, nuvem, incidentes, continuidade, compliance, DPI', horasBaixa: 24, horasMedia: 18, horasAlta: 12 },
  { id: 'f4_3', fase: 'FASE 4 — IMPLEMENTAÇÃO DE CONTROLES', entregavel: 'Controles de pessoas (seção A.6)', atividades: 'Triagem, termos de contratação, treinamentos formais, trabalho remoto', horasBaixa: 16, horasMedia: 12, horasAlta: 8 },
  { id: 'f4_4', fase: 'FASE 4 — IMPLEMENTAÇÃO DE CONTROLES', entregavel: 'Controles físicos (seção A.7)', atividades: 'Mesa limpa, controle de entrada, descarte seguro, monitoramento físico', horasBaixa: 12, horasMedia: 10, horasAlta: 6 },
  // FASE 5
  { id: 'f5_1', fase: 'FASE 5 — CONSCIENTIZAÇÃO E TREINAMENTO', entregavel: 'Programa de conscientização em SI', atividades: 'Desenvolver e executar programa de conscientização para todos os colaboradores', horasBaixa: 20, horasMedia: 16, horasAlta: 10 },
  { id: 'f5_2', fase: 'FASE 5 — CONSCIENTIZAÇÃO E TREINAMENTO', entregavel: 'Treinamento para equipe de SI e auditores', atividades: 'Treinamento específico para responsáveis pelo SGSI e auditores internos', horasBaixa: 16, horasMedia: 12, horasAlta: 8 },
  { id: 'f5_3', fase: 'FASE 5 — CONSCIENTIZAÇÃO E TREINAMENTO', entregavel: 'Simulações e exercícios', atividades: 'Phishing simulado, exercício de resposta a incidentes', horasBaixa: 12, horasMedia: 10, horasAlta: 6 },
  // FASE 6
  { id: 'f6_1', fase: 'FASE 6 — AUDITORIA INTERNA E ANÁLISE CRÍTICA', entregavel: 'Plano de auditoria interna', atividades: 'Critérios, escopo, checklist e plano (cl. 9.2)', horasBaixa: 12, horasMedia: 10, horasAlta: 8 },
  { id: 'f6_2', fase: 'FASE 6 — AUDITORIA INTERNA E ANÁLISE CRÍTICA', entregavel: 'Condução da auditoria interna', atividades: 'Executar auditoria, entrevistar áreas, coletar evidências', horasBaixa: 24, horasMedia: 20, horasAlta: 16 },
  { id: 'f6_3', fase: 'FASE 6 — AUDITORIA INTERNA E ANÁLISE CRÍTICA', entregavel: 'Relatório e plano de ação de NCs', atividades: 'Relatório, registro de NCs e plano de ação corretiva', horasBaixa: 12, horasMedia: 10, horasAlta: 8 },
  { id: 'f6_4', fase: 'FASE 6 — AUDITORIA INTERNA E ANÁLISE CRÍTICA', entregavel: 'Análise crítica pela direção (cl. 9.3)', atividades: 'Preparar insumos, conduzir reunião, redigir ata com decisões e ações', horasBaixa: 8, horasMedia: 6, horasAlta: 4 },
  // FASE 7
  { id: 'f7_1', fase: 'FASE 7 — SUPORTE À AUDITORIA DE CERTIFICAÇÃO (CB)', entregavel: 'Preparação para Fase 1 do CB', atividades: 'Revisão final da documentação, simulação de entrevistas, checklist de prontidão', horasBaixa: 12, horasMedia: 10, horasAlta: 8 },
  { id: 'f7_2', fase: 'FASE 7 — SUPORTE À AUDITORIA DE CERTIFICAÇÃO (CB)', entregavel: 'Acompanhamento Fase 1 (CB)', atividades: 'Presença durante auditoria Fase 1, suporte ao cliente em tempo real', horasBaixa: 8, horasMedia: 8, horasAlta: 8 },
  { id: 'f7_3', fase: 'FASE 7 — SUPORTE À AUDITORIA DE CERTIFICAÇÃO (CB)', entregavel: 'Plano de ação pós-Fase 1', atividades: 'Tratar NCs ou observações apontadas pelo CB antes da Fase 2', horasBaixa: 16, horasMedia: 12, horasAlta: 8 },
  { id: 'f7_4', fase: 'FASE 7 — SUPORTE À AUDITORIA DE CERTIFICAÇÃO (CB)', entregavel: 'Acompanhamento Fase 2 (CB)', atividades: 'Presença durante auditoria Fase 2, suporte ao cliente', horasBaixa: 16, horasMedia: 16, horasAlta: 16 },
]

export const FASES = [
  'FASE 1 — DIAGNÓSTICO E GAP ANALYSIS',
  'FASE 2 — PLANEJAMENTO DO SGSI',
  'FASE 3 — DOCUMENTAÇÃO DO SGSI',
  'FASE 4 — IMPLEMENTAÇÃO DE CONTROLES',
  'FASE 5 — CONSCIENTIZAÇÃO E TREINAMENTO',
  'FASE 6 — AUDITORIA INTERNA E ANÁLISE CRÍTICA',
  'FASE 7 — SUPORTE À AUDITORIA DE CERTIFICAÇÃO (CB)',
]
