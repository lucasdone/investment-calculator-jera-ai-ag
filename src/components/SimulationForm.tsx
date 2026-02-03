"use client";

import { useState, useMemo } from 'react';

type FormState = {
  name: string
  initialAmount: string
  monthlyContribution: string
  months: string
  annualRate: string
}

type ParsedData = {
  initialAmount: number
  monthlyContribution: number
  months: number
  annualRate: number
  errors: string[]
}

interface SimulationFormProps {
  onSubmit: (data: FormState) => void;
  isSaving: boolean;
}

export function SimulationForm({ onSubmit, isSaving }: SimulationFormProps) {
  const [form, setForm] = useState<FormState>({
    name: 'Minha Simulação',
    initialAmount: '5000',
    monthlyContribution: '500',
    months: '24',
    annualRate: '12',
  })

  // Basic validation just for visual feedback, actual block happens on submit if desired
  const parsed = useMemo(() => {
    const initialAmount = Number(form.initialAmount)
    const monthlyContribution = form.monthlyContribution === '' ? 0 : Number(form.monthlyContribution)
    const months = Number(form.months)
    const annualRate = Number(form.annualRate) / 100

    const errors: string[] = []
    if (!form.name.trim()) errors.push('Nome da simulação é obrigatório.')
    if (!Number.isFinite(initialAmount) || initialAmount < 0) errors.push('Valor inicial inválido.')
    if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) errors.push('Aporte mensal inválido.')
    if (!Number.isFinite(months) || months <= 0) errors.push('Período (meses) inválido.')
    if (!Number.isFinite(annualRate) || annualRate < 0) errors.push('Taxa anual inválida.')

    return { initialAmount, monthlyContribution, months, annualRate, errors }
  }, [form])

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsed.errors.length === 0) {
      onSubmit(form);
    }
  };

  return (
    <div className="glass rounded-xl p-6 shadow-xl shadow-purple-900/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-8 rounded-full bg-indigo-500 block"></span>
          Parâmetros
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-zinc-400">Nome da Simulação</label>
          <input
            className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Ex: Aposentadoria, Casa Própria..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Valor Inicial (R$)</label>
          <input
            className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            inputMode="decimal"
            value={form.initialAmount}
            onChange={(e) => onChange('initialAmount', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Aporte Mensal (R$)</label>
          <input
            className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            inputMode="decimal"
            value={form.monthlyContribution}
            onChange={(e) => onChange('monthlyContribution', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Período (meses)</label>
          <input
            className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            inputMode="numeric"
            value={form.months}
            onChange={(e) => onChange('months', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Taxa Selic/CDI (% a.a)</label>
          <input
            className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            inputMode="decimal"
            value={form.annualRate}
            onChange={(e) => onChange('annualRate', e.target.value)}
          />
        </div>

        <div className="md:col-span-2 pt-2">
           {parsed.errors.length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {parsed.errors.map(err => <p key={err} className="flex items-center gap-2">⚠️ {err}</p>)}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving || parsed.errors.length > 0}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : 'Simular Cenários 🚀'}
          </button>
        </div>
      </form>
    </div>
  )
}
