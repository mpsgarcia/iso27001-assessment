
### 1. Contexto

Tenho uma aplicação web de assessment ISO 27001 chamada atualmente de **GRC Shield / ISO 27001 Assessment**.

Quero redesenhar a interface para que ela fique mais **minimalista, elegante, premium, corporativa, tecnológica e alinhada à identidade visual da Spread**.

A interface atual usa dark mode pesado, muitos blocos saturados, bordas fortes, roxo neon em excesso e cards de status muito chamativos.

O objetivo é manter a estrutura funcional existente, mas refinar profundamente a experiência visual.

A nova interface deve parecer uma ferramenta profissional de assessment, adequada para avaliação ISO 27001, com clareza, precisão e sofisticação.

---

## 2. Objetivo Principal

Redesenhar a interface com base na identidade visual da **Spread**, criando uma experiência:

- minimalista;
    
- elegante;
    
- corporativa;
    
- tecnológica;
    
- clara;
    
- premium;
    
- leve;
    
- altamente legível;
    
- fiel às cores e tipografias institucionais da marca.
    

A interface não deve parecer um dashboard gamer, cyberpunk ou excessivamente decorativo.

A interface deve parecer confiável, madura, limpa e precisa.

---

## 3. Conceito Criativo

**Uma interface precisa e silenciosa, onde o laranja conduz a ação e o roxo expressa tecnologia e transformação.**

---

## 4. Essência da Marca Spread

A identidade visual da Spread comunica:

- movimento;
    
- performance;
    
- precisão;
    
- espontaneidade;
    
- transformação constante;
    
- versatilidade;
    
- simplicidade;
    
- adaptabilidade;
    
- tecnologia;
    
- resolução de problemas;
    
- agilidade mental;
    
- sucesso;
    
- criatividade;
    
- entusiasmo.
    

Na aplicação, esses atributos devem ser traduzidos de forma sutil, funcional e elegante.

Não copiar literalmente o visual promocional do manual da marca.

A aplicação é um sistema operacional de trabalho. Portanto, a marca deve aparecer com sobriedade, clareza e intenção.

---

## 5. Princípios de Design

Aplicar os seguintes princípios em todas as telas:

1. Remover qualquer elemento visual sem função clara.
    
2. Usar cor apenas quando ela orientar ação, estado ou hierarquia.
    
3. Priorizar legibilidade e leitura rápida.
    
4. Evitar excesso de brilho, neon, sombras e gradientes.
    
5. Garantir que a interface funcione bem em telas grandes e pequenas.
    
6. Criar uma sensação de produto premium e corporativo.
    
7. Usar espaço em branco como parte ativa do design.
    
8. Manter a marca Spread presente sem excesso.
    
9. Evitar tendências visuais passageiras.
    
10. Fazer a interface parecer simples, inevitável e confiável.
    

---

## 6. Paleta Oficial da Spread

Usar exclusivamente as cores institucionais abaixo:

```css
:root {
  --spread-yellow: #FF9A0A;
  --spread-orange: #FF7400;
  --spread-purple: #4B1196;
  --spread-dark: #2D2D2D;
  --spread-gray: #7F7F7F;
  --spread-white: #FFFFFF;
}
```

### Uso recomendado

- `#FF7400` — cor principal. Usar para ações, progresso, item ativo, CTA e elementos que conduzem o usuário.
    
- `#4B1196` — cor tecnológica. Usar para seções, indicadores secundários, foco, detalhes high-tech e estrutura visual.
    
- `#FF9A0A` — usar para estados parciais, alertas leves e detalhes de apoio.
    
- `#2D2D2D` — usar para textos principais, fundos escuros suaves e elementos de alta confiança.
    
- `#7F7F7F` — usar para textos secundários, bordas, metadados e divisórias.
    
- `#FFFFFF` — usar como base principal para clareza, respiro e contraste.
    

---

## 7. Direção Visual Geral

A direção principal deve ser um **tema claro premium**.

A interface deve usar branco e cinzas como base, com laranja e roxo apenas como acentos intencionais.

### Evitar

- preto puro;
    
- excesso de neon;
    
- cards totalmente saturados;
    
- bordas muito fortes;
    
- sombras pesadas;
    
- excesso de gradientes;
    
- excesso de ícones;
    
- elementos decorativos sem função;
    
- aparência cyberpunk;
    
- aparência gamer;
    
- vermelho dominante;
    
- botões muito agressivos;
    
- telas visualmente carregadas.
    

### Usar

- muito espaço em branco;
    
- cantos arredondados;
    
- sombras suaves;
    
- hierarquia clara;
    
- componentes limpos;
    
- microinterações discretas;
    
- cor apenas quando houver função;
    
- tipografia como elemento principal de organização;
    
- gradientes sutis apenas quando representarem movimento ou progresso.
    

---

## 8. Variáveis de Tema Sugeridas

### Tema claro principal

```css
:root {
  --bg: #FFFFFF;
  --bg-soft: #F7F5FA;
  --surface: #FFFFFF;
  --surface-muted: #FAFAFA;

  --text: #2D2D2D;
  --text-muted: #7F7F7F;

  --primary: #FF7400;
  --primary-soft: rgba(255, 116, 0, 0.10);

  --tech: #4B1196;
  --tech-soft: rgba(75, 17, 150, 0.08);

  --warning: #FF9A0A;
  --warning-soft: rgba(255, 154, 10, 0.12);

  --border: rgba(45, 45, 45, 0.10);

  --shadow-soft: 0 20px 60px rgba(45, 45, 45, 0.06);
  --shadow-hover: 0 16px 40px rgba(255, 116, 0, 0.08);

  --radius-lg: 24px;
  --radius-md: 18px;
  --radius-sm: 12px;
}
```

### Tema escuro opcional

Caso o sistema mantenha dark mode, ele deve ser mais grafite do que preto.

```css
[data-theme="dark"] {
  --bg: #1D1D1D;
  --bg-soft: #242424;
  --surface: #2D2D2D;
  --surface-muted: #252525;

  --text: #FFFFFF;
  --text-muted: #B8B8B8;

  --primary: #FF7400;
  --primary-soft: rgba(255, 116, 0, 0.12);

  --tech: #4B1196;
  --tech-soft: rgba(75, 17, 150, 0.16);

  --warning: #FF9A0A;
  --warning-soft: rgba(255, 154, 10, 0.14);

  --border: rgba(255, 255, 255, 0.08);
}
```

---

## 9. Tipografia

Usar as tipografias institucionais da Spread:

- **Montserrat** para títulos, navegação, labels importantes e elementos de hierarquia.
    
- **Ubuntu** para textos corridos, campos, formulários e conteúdo operacional.
    

Fallback:

```css
:root {
  --font-title: "Montserrat", system-ui, sans-serif;
  --font-body: "Ubuntu", system-ui, sans-serif;
}
```

Aplicação:

```css
h1,
h2,
h3,
.nav-title,
.section-title {
  font-family: var(--font-title);
  font-weight: 600;
  letter-spacing: -0.03em;
}

body,
input,
textarea,
button,
p {
  font-family: var(--font-body);
}
```

### Direção tipográfica

- Evitar pesos excessivamente bold.
    
- Usar títulos com peso 600.
    
- Usar textos corridos com peso 400 ou 500.
    
- Usar labels com uppercase discreto e letter-spacing controlado.
    
- Garantir excelente legibilidade.
    
- Não usar fontes decorativas.
    

---

## 10. Layout Principal

A tela deve manter a estrutura funcional existente:

- sidebar lateral;
    
- topbar;
    
- área central de conteúdo;
    
- cards de métricas;
    
- barra de progresso;
    
- lista de requisitos;
    
- cards expansíveis dos requisitos;
    
- formulário de avaliação.
    

A mudança deve ser visual, hierárquica e experiencial.

---

## 11. Sidebar

A sidebar deve ser clara, elegante e institucional.

### Estilo base

```css
.sidebar {
  background: #FFFFFF;
  border-right: 1px solid rgba(45, 45, 45, 0.08);
}
```

### Logo

No topo, usar a marca Spread respeitando proporções e área de respiro.

Exemplo:

```text
[Logo Spread]
ISO 27001 Assessment
```

Não recriar o logo.  
Não alterar cores da marca.  
Não distorcer.  
Não usar símbolo isolado sem necessidade.

### Menu

Itens de menu devem ser simples, com ícones lineares e pouco ruído visual.

```css
.sidebar-item {
  color: #7F7F7F;
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 500;
  transition: background .2s ease, color .2s ease;
}

.sidebar-item.active {
  background: rgba(255, 116, 0, 0.10);
  color: #FF7400;
}

.sidebar-item:hover {
  background: rgba(255, 116, 0, 0.06);
  color: #FF7400;
}
```

Ícones:

- lineares;
    
- stroke fino;
    
- cantos arredondados;
    
- preferencialmente 1.5px ou 2px;
    
- sem preenchimento pesado.
    

---

## 12. Topbar

A topbar deve ser leve, clara e precisa.

```css
.topbar {
  height: 72px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(45, 45, 45, 0.08);
}
```

A navegação ativa deve usar laranja.

```css
.topbar-tab {
  color: #7F7F7F;
  font-weight: 600;
  padding: 0 12px;
}

.topbar-tab.active {
  color: #FF7400;
  border-bottom: 2px solid #FF7400;
}
```

Tabs sugeridas:

- Capa
    
- Requisitos
    
- Controles
    
- Dashboard
    
- Estimativas
    
- Exportar
    

Evitar excesso de ícones preenchidos.

---

## 13. Header da Página

Atualizar o título para ficar mais editorial e limpo.

Exemplo:

```text
Requisitos
Cláusulas 4 a 10 da ISO/IEC 27001:2022
```

Subtexto:

```text
Avalie cada requisito obrigatório do SGSI conforme a ISO/IEC 27001:2022
```

Estilo:

```css
.page-title {
  font-family: var(--font-title);
  font-size: 32px;
  line-height: 1.15;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: #2D2D2D;
}

.page-subtitle {
  font-size: 15px;
  color: #7F7F7F;
  line-height: 1.6;
}
```

---

## 14. Barra de Progresso

Usar gradiente discreto da marca, pois o gradiente representa movimento e transformação constante.

```css
.progress-track {
  height: 8px;
  background: rgba(45, 45, 45, 0.10);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF7400 0%, #FF9A0A 45%, #4B1196 100%);
  border-radius: 999px;
}
```

O percentual deve aparecer à direita, em roxo ou laranja, mas sem exagero.

```css
.progress-percent {
  color: #4B1196;
  font-weight: 700;
}
```

---

## 15. Cards de Métricas

Os cards atuais são muito saturados. Trocar por cards claros, elegantes, com apenas uma linha ou detalhe colorido.

### Cards necessários

- Conformes
    
- Não atende
    
- Parciais
    
- Pendentes
    

### Estilo

```css
.metric-card {
  background: #FFFFFF;
  border: 1px solid rgba(45, 45, 45, 0.08);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(45, 45, 45, 0.05);
  position: relative;
}

.metric-card::before {
  content: "";
  display: block;
  width: 32px;
  height: 3px;
  border-radius: 999px;
  margin-bottom: 20px;
  background: var(--accent);
}

.metric-value {
  font-family: var(--font-title);
  font-size: 36px;
  font-weight: 650;
  letter-spacing: -0.04em;
  color: #2D2D2D;
}

.metric-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7F7F7F;
}
```

### Cores por métrica

```css
.metric-conformes {
  --accent: #FF7400;
}

.metric-nao-atende {
  --accent: #2D2D2D;
}

.metric-parciais {
  --accent: #FF9A0A;
}

.metric-pendentes {
  --accent: #4B1196;
}
```

Evitar fundo vermelho forte.  
Se for necessário indicar erro, usar vermelho semântico apenas em detalhes pequenos, sem competir com a paleta Spread.

---

## 16. Separadores de Cláusula

Os títulos de seção devem ser elegantes e técnicos.

Exemplo:

```text
CLÁUSULA 4 — CONTEXTO DA ORGANIZAÇÃO    1/4
```

Estilo:

```css
.clause-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 40px 0 20px;
}

.clause-divider::before,
.clause-divider::after {
  content: "";
  height: 1px;
  flex: 1;
  background: rgba(45, 45, 45, 0.08);
}

.clause-title {
  font-family: var(--font-title);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4B1196;
}

.clause-count {
  background: rgba(45, 45, 45, 0.08);
  color: #7F7F7F;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}
```

---

## 17. Lista de Requisitos

A lista deve ser a protagonista da tela.

Cada requisito deve parecer fácil de revisar, com excelente legibilidade.

```css
.requirement-row {
  min-height: 72px;
  background: #FFFFFF;
  border: 1px solid rgba(45, 45, 45, 0.08);
  border-radius: 18px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: auto auto 1fr auto auto;
  gap: 16px;
  align-items: center;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.requirement-row:hover {
  border-color: rgba(255, 116, 0, 0.28);
  box-shadow: 0 16px 40px rgba(255, 116, 0, 0.08);
  transform: translateY(-1px);
}
```

### Número da cláusula

```css
.requirement-number {
  background: rgba(75, 17, 150, 0.08);
  color: #4B1196;
  border-radius: 10px;
  padding: 5px 10px;
  font-weight: 700;
  font-size: 13px;
}
```

### Título do requisito

```css
.requirement-title {
  color: #2D2D2D;
  font-weight: 600;
  font-size: 15px;
}
```

---

## 18. Card Expandido do Requisito

O card aberto deve parecer uma área premium de auditoria.

Evitar borda roxa muito forte, fundo preto pesado ou excesso de contraste.

```css
.requirement-panel {
  background: #FFFFFF;
  border: 1px solid rgba(45, 45, 45, 0.08);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 24px 80px rgba(45, 45, 45, 0.06);
}
```

### Caixa “Requisito da Norma”

Usar gradiente sutil Spread.

```css
.norm-box {
  background: linear-gradient(
    135deg,
    rgba(75, 17, 150, 0.07),
    rgba(255, 116, 0, 0.05)
  );
  border: 1px solid rgba(75, 17, 150, 0.12);
  border-radius: 22px;
  padding: 28px;
}
```

### Label

```css
.field-label {
  font-family: var(--font-title);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4B1196;
}
```

### Texto

```css
.norm-text {
  color: #2D2D2D;
  line-height: 1.7;
  font-size: 15px;
}
```

---

## 19. Campos de Formulário

Campos devem ser limpos, claros e confortáveis.

```css
.input,
.textarea {
  background: #FFFFFF;
  border: 1px solid rgba(45, 45, 45, 0.10);
  border-radius: 16px;
  padding: 18px 20px;
  color: #2D2D2D;
  font-family: var(--font-body);
  font-size: 15px;
}

.input::placeholder,
.textarea::placeholder {
  color: rgba(127, 127, 127, 0.78);
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #FF7400;
  box-shadow: 0 0 0 4px rgba(255, 116, 0, 0.12);
}
```

---

## 20. Botões de Status

Os status devem ser claros, mas não agressivos.

Estados:

- Não preenchido
    
- Atende totalmente
    
- Atende parcialmente
    
- Não atende
    
- Não aplicável
    

### Base

```css
.status-option {
  background: #FFFFFF;
  border: 1px solid rgba(45, 45, 45, 0.14);
  color: #2D2D2D;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  transition: all .2s ease;
}

.status-option:hover {
  border-color: rgba(255, 116, 0, 0.38);
  box-shadow: 0 8px 24px rgba(255, 116, 0, 0.08);
}
```

### Ativo genérico

```css
.status-option.active {
  background: #2D2D2D;
  color: #FFFFFF;
  border-color: #2D2D2D;
}
```

### Atende totalmente

```css
.status-conforme.active {
  background: rgba(255, 116, 0, 0.12);
  color: #FF7400;
  border-color: #FF7400;
}
```

### Atende parcialmente

```css
.status-parcial.active {
  background: rgba(255, 154, 10, 0.14);
  color: #B85A00;
  border-color: #FF9A0A;
}
```

### Não aplicável

```css
.status-na.active {
  background: rgba(75, 17, 150, 0.10);
  color: #4B1196;
  border-color: #4B1196;
}
```

### Não preenchido

```css
.status-pendente {
  background: rgba(127, 127, 127, 0.10);
  color: #7F7F7F;
}
```

### Não atende

Usar com moderação.  
Pode manter vermelho semântico se já existir no sistema, mas visualmente deve ser discreto.  
Se possível, usar uma variação escura/neutra para não quebrar a paleta Spread.

---

## 21. Chips de Status na Lista

```css
.status-chip {
  border-radius: 999px;
  padding: 6px 12px;
  font-family: var(--font-title);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.status-chip.pending {
  background: rgba(127, 127, 127, 0.12);
  color: #7F7F7F;
}

.status-chip.na {
  background: rgba(75, 17, 150, 0.10);
  color: #4B1196;
}

.status-chip.partial {
  background: rgba(255, 154, 10, 0.14);
  color: #B85A00;
}

.status-chip.conforme {
  background: rgba(255, 116, 0, 0.12);
  color: #FF7400;
}
```

---

## 22. Elementos Visuais da Marca

A Spread usa formas orgânicas, movimento e transformação.

Na interface, aplicar isso de forma muito sutil.

### Pode usar

- gradiente suave no fundo;
    
- detalhe orgânico abstrato em empty states;
    
- pequenos acentos em cards;
    
- linha de progresso com gradiente;
    
- microinterações de movimento;
    
- formas arredondadas inspiradas no símbolo da marca;
    
- ícones lineares com círculos discretos quando fizer sentido.
    

### Evitar

- grafismos grandes dentro da área de avaliação;
    
- padrões decorativos competindo com texto;
    
- formas orgânicas atrás de campos;
    
- excesso de blur;
    
- excesso de glow;
    
- fundos com muita textura;
    
- elementos promocionais dentro da interface operacional.
    

Exemplo sutil:

```css
.page-background {
  background:
    radial-gradient(circle at top right, rgba(75,17,150,.08), transparent 32%),
    radial-gradient(circle at bottom left, rgba(255,116,0,.06), transparent 28%),
    #FFFFFF;
}
```

---

## 23. Microinterações

Usar microinterações suaves e funcionais.

```css
.interactive {
  transition:
    transform .2s ease,
    box-shadow .2s ease,
    border-color .2s ease,
    background .2s ease;
}

.interactive:hover {
  transform: translateY(-1px);
}
```

Evitar animações longas, efeitos chamativos ou movimentos desnecessários.

---

## 24. Responsividade

A interface deve funcionar bem em:

- desktop grande;
    
- notebook;
    
- tablet;
    
- mobile.
    

### Desktop

Sidebar fixa, conteúdo central com largura máxima.

```css
.content {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px;
}
```

### Mobile

- sidebar vira drawer;
    
- cards de métricas empilham;
    
- lista de requisitos ocupa 100%;
    
- botões de status quebram em múltiplas linhas;
    
- campos ficam em coluna única;
    
- topbar deve simplificar a navegação;
    
- evitar tabelas largas ou componentes que exijam scroll horizontal.
    

---

## 25. Acessibilidade

Garantir:

- contraste adequado;
    
- foco visível;
    
- navegação por teclado;
    
- labels claros;
    
- estados não dependerem apenas de cor;
    
- botões com área clicável confortável;
    
- textos com no mínimo 14px;
    
- feedback claro após interação;
    
- leitura fácil em telas pequenas;
    
- estados com texto claro além da cor.
    

Exemplo de foco:

```css
:focus-visible {
  outline: 3px solid rgba(255, 116, 0, 0.35);
  outline-offset: 3px;
}
```

---

## 26. O Que Deve Ser Removido do Design Atual

Remover ou reduzir:

- fundo preto absoluto;
    
- roxo neon excessivo;
    
- cards de status totalmente preenchidos com cores fortes;
    
- vermelho dominante;
    
- bordas muito visíveis;
    
- excesso de chips;
    
- excesso de sombras escuras;
    
- excesso de elementos competindo com o conteúdo;
    
- aparência pesada de dashboard técnico;
    
- poluição visual em formulários;
    
- botões com contraste agressivo demais;
    
- uso decorativo de cor sem função.
    

---

## 27. O Que Deve Ser Mantido

Manter:

- estrutura geral da tela;
    
- fluxo por cláusulas;
    
- barra de progresso;
    
- cards de resumo;
    
- lista expansível;
    
- formulário de avaliação;
    
- navegação lateral;
    
- navegação superior;
    
- estados de avaliação;
    
- organização por requisitos da ISO 27001.
    

A mudança é essencialmente visual, hierárquica e experiencial.

---

## 28. Resultado Esperado

A nova interface deve parecer:

```text
Mais branca.
Mais leve.
Mais precisa.
Mais institucional.
Mais Spread.
Mais premium.
Menos ruidosa.
Menos escura.
Menos saturada.
Mais fácil de usar.
```

A cor deve orientar.  
A tipografia deve organizar.  
O espaço deve dar confiança.  
A marca deve estar presente sem gritar.

---

## 29. Critério Final de Qualidade

Antes de finalizar, revisar cada tela perguntando:

1. Este elemento tem função clara?
    
2. Esta cor ajuda a entender ou apenas decora?
    
3. A interface continua legível em poucos segundos?
    
4. A marca Spread está presente sem excesso?
    
5. O produto parece confiável para uma avaliação ISO 27001?
    
6. Há algum ruído visual que possa ser removido?
    
7. A hierarquia visual favorece a tarefa principal?
    
8. O usuário consegue entender estado, progresso e próxima ação rapidamente?
    

Se algo não ajuda a clareza, remover.

---

## 30. Instrução Final para Implementação

Implementar o redesign mantendo a lógica funcional existente, mas substituindo a camada visual por uma linguagem mais limpa, clara e alinhada à Spread.

Priorizar:

- tema claro;
    
- branco como base;
    
- cinza escuro para texto;
    
- laranja para ação;
    
- roxo para tecnologia e estrutura;
    
- amarelo/laranja claro para estados parciais;
    
- cards claros;
    
- botões discretos;
    
- menos saturação;
    
- mais respiro;
    
- melhor legibilidade;
    
- tipografia Montserrat e Ubuntu;
    
- microinterações sutis;
    
- acessibilidade.
    

O resultado deve ser uma plataforma de assessment ISO 27001 com aparência premium, moderna, institucional e fiel à identidade visual da Spread.