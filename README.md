# Investment Calculator — Vibe Coding Edition 🌟

Este repositório explora uma abordagem de desenvolvimento orientada a IA com foco em **vibe coding**, co-criação e iteração rápida.

A IA é utilizada como parceira criativa para:
- Explorar alternativas de UX
- Propor melhorias incrementais
- Ajustar regras de negócio de forma interativa
- Refinar o produto de maneira emergente

### Ferramentas utilizadas
- **Antigravity**: Agente de codificação avançado.
- **Gemini**: Modelo de inteligência artificial.

---

## 🧪 Sobre o Projeto

Uma calculadora de investimentos com persistência de dados que permite:
- Simular e comparar investimentos em **Renda Fixa** e **Renda Variável**.
- Salvar simulações para consulta posterior.
- Visualizar histórico de simulações com gráficos e métricas claras.

### Stack Tecnológica
- **Frontend**: Next.js, TypeScript, Tailwind CSS (Design Premium).
- **Backend**: Next.js API Routes (Serverless functions).
- **Banco de Dados**: SQLite (via Prisma).

### Funcionalidades
1. **Simulação Completa**:
   - Cálculo de Juros Compostos.
   - Conversão de taxas anuais para mensais.
   - Aplicação de **IOF** (Regressivo) e **IR** (Tabela Regressiva) para Renda Fixa.
2. **Comparação Visual**:
   - Renda Fixa vs 3 Cenários de Renda Variável (Conservador, Balanceado, Agressivo).
3. **Persistência**:
   - Histórico salvo localmente via SQLite.

## 🚀 Como Rodar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Execute as migrações do banco**:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. Acesse `http://localhost:3000`.

## 🤖 Créditos
Desenvolvido em parceria com IA focada em entregar não apenas código, mas uma **experiência**.
