# Investment Calculator — Teste Técnico (Jera)

Aplicação fullstack para simulação e comparação de cenários de investimento
(Renda Fixa e Renda Variável), com persistência dos resultados e regras financeiras.

## O que foi entregue

### 1) Simulação de Renda Fixa (RF)
- Conversão de taxa anual → mensal equivalente
- Simulação mês a mês com aportes
- Cálculo de impostos conforme regra do enunciado:
  - IOF regressivo (até 30 dias) aplicado sobre o rendimento bruto
  - IR por faixa aplicado sobre o rendimento após IOF
  - Ordem correta: **IOF → IR**
- Retorno bruto e líquido (valor final e lucro)

### 2) Cenários de Renda Variável (RV)
- 3 cenários fixos: **RV1 (Conservador), RV2 (Balanceado), RV3 (Agressivo)**
- Série mensal com retorno médio + componente de volatilidade
- Comparativo vs RF com diferença percentual:
  - **Bruto**
  - **Líquido**
- Observação: o enunciado não especifica tributação para RV; portanto, RV líquido = RV bruto.

### 3) Persistência e histórico
- SQLite local com Prisma + migrations
- API CRUD:
  - `GET /api/simulations` (lista)
  - `POST /api/simulations` (cria)
  - `GET /api/simulations/[id]` (detalhe)
  - `DELETE /api/simulations/[id]` (excluir)
- UI salva simulações e exibe histórico (lista atualiza após salvar)

---

## Arquitetura (visão geral)
- **Next.js App Router (monorepo simples)**
- **Domínio (cálculos) isolado em funções puras** em `src/lib/calculations`
- **Persistência** via Prisma/SQLite
- **API Layer** via Route Handlers (`src/app/api/...`)
- **UI** em `src/app/page.tsx`

Estrutura relevante:
- `src/lib/calculations/*` → core financeiro (puro/testável)
- `src/lib/db/prisma.ts` → Prisma client singleton
- `src/app/api/simulations/*` → rotas CRUD
- `prisma/schema.prisma` + `prisma/migrations` → schema e migrations
- `src/tests/*` → testes unitários com Vitest

---

## Decisões e premissas importantes

### Taxas e simulação mensal
- Taxa anual → mensal equivalente:
  - `monthly = (1 + annual)^(1/12) - 1`
- Convenção de simulação mensal:
  - aplica retorno do mês
  - depois adiciona aporte mensal

### Prazo em dias
- Como a simulação é mensal, e impostos são em dias:
  - **premissa:** `days = months * 30`

### Impostos (RF)
- IOF regressivo (até 30 dias), sobre lucro bruto
- IR por faixa (dias), sobre lucro após IOF
- Ordem aplicada: **IOF → IR** (testado)

### RV
- Cenários fixos (RV1–RV3) para reduzir complexidade de inputs e refletir decisão real
- Volatilidade modelada de forma determinística para manter previsibilidade e testes estáveis
- Sem regra de imposto para RV no escopo (não especificado no enunciado)

---

## Como rodar localmente

### Requisitos
- Node.js 18+ (recomendado: 20+)
- npm

### Instalar e rodar
```bash
npm install
npm run dev
