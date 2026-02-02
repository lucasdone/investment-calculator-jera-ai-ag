'use client'

import { useMemo, useState } from 'react'
import { simulateFixedIncome } from '../lib/calculations/fixedIncome'

type FormState = {
  name: string
  initialAmount: string
  monthlyContribution: string
  months: string
  annualRate: string // percent input, ex: "12" -> 0.12
}

export default function Home() {
  const [form, setForm] = useState<FormState>({
    name: 'Simulação 1',
    initialAmount: '1000',
    monthlyContribution: '100',
    months: '12',
    annualRate: '12',
  })

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

  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(() => {
    if (!submitted) return null
    if (parsed.errors.length) return null

    return simulateFixedIncome({
      initialAmount: parsed.initialAmount,
      monthlyContribution: parsed.monthlyContribution,
      months: parsed.months,
      annualRate: parsed.annualRate,
    })
  }, [submitted, parsed])

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const percentDiff = useMemo(() => {
    // nessa etapa só RF existe; deixamos 0 e depois substituímos ao implementar RV
    return 0
  }, [])

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Calculadora de Investimentos</h1>
          <p className="text-sm text-muted-foreground">
            UI mínima (Renda Fixa) — impostos IOF → IR aplicados conforme regras.
          </p>
        </header>

        <section className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-medium">Nova simulação</h2>

          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm">Nome</span>
              <input
                className="w-full rounded-md border px-3 py-2"
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Ex: Reserva de emergência"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm">Valor inicial (R$)</span>
              <input
                className="w-full rounded-md border px-3 py-2"
                inputMode="decimal"
                value={form.initialAmount}
                onChange={(e) => onChange('initialAmount', e.target.value)}
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm">Aporte mensal (R$)</span>
              <input
                className="w-full rounded-md border px-3 py-2"
                inputMode="decimal"
                value={form.monthlyContribution}
                onChange={(e) => onChange('monthlyContribution', e.target.value)}
                placeholder="0"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm">Período (meses)</span>
              <input
                className="w-full rounded-md border px-3 py-2"
                inputMode="numeric"
                value={form.months}
                onChange={(e) => onChange('months', e.target.value)}
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm">Taxa anual (RF) % a.a</span>
              <input
                className="w-full rounded-md border px-3 py-2"
                inputMode="decimal"
                value={form.annualRate}
                onChange={(e) => onChange('annualRate', e.target.value)}
              />
            </label>

            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
              >
                Simular
              </button>

              {submitted && parsed.errors.length > 0 && (
                <div className="text-sm text-red-600">
                  {parsed.errors.map((err) => (
                    <div key={err}>• {err}</div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </section>

        {result && (
          <section className="rounded-lg border p-4 space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">Resultado — {form.name}</h2>
              <p className="text-sm text-muted-foreground">
                Prazo: {result.days} dias (premissa: meses × 30)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Metric label="Total aportado" value={brl(result.totalContributed)} />
              <Metric label="Valor final bruto" value={brl(result.finalAmount)} />
              <Metric label="Lucro bruto" value={brl(result.grossProfit)} />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <Metric label={`IOF (${pct(result.taxes.iofRate)})`} value={brl(result.taxes.iofAmount)} />
              <Metric label={`IR (${pct(result.taxes.irRate)})`} value={brl(result.taxes.irAmount)} />
              <Metric label="Lucro líquido" value={brl(result.taxes.netProfit)} />
              <Metric label="Valor final líquido" value={brl(result.netFinalAmount)} />
            </div>

            <div className="text-sm text-muted-foreground">
              Diferença percentual entre cenários (RF vs RV): <strong>{percentDiff}%</strong>{' '}
              <span>(RV será implementada no próximo passo)</span>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{props.label}</div>
      <div className="mt-1 text-lg font-semibold">{props.value}</div>
    </div>
  )
}

function brl(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function pct(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}
