'use client'

import { useMemo, useState, useEffect } from 'react'
import { simulateFixedIncome } from '../lib/calculations/fixedIncome'
import { RV_SCENARIOS } from '../lib/calculations/rvScenarios'
import { simulateVariableIncome } from '../lib/calculations/variableIncome'
import { compareRfVsRvs } from '../lib/calculations/compare'
import { SimulationForm } from '../components/SimulationForm'
import { Results } from '../components/Results'
import { History } from '../components/History'

export default function Home() {
  const [fixedResult, setFixedResult] = useState<any>(null)
  const [variableResults, setVariableResults] = useState<any[] | null>(null)
  const [comparisons, setComparisons] = useState<any[] | null>(null)

  const [saving, setSaving] = useState(false)
  const [savedList, setSavedList] = useState<Array<{ id: string; name: string; createdAt: string }>>([])
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)

  async function saveSimulation(name: string, payload: any) {
    const res = await fetch('/api/simulations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        payload,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Failed to save simulation')
    }

    return res.json()
  }

  async function loadSimulations() {
    try {
      setListLoading(true)
      setListError(null)

      const res = await fetch('/api/simulations')
      if (!res.ok) throw new Error('Failed to load simulations')

      const data = (await res.json()) as Array<{ id: string; name: string; createdAt: string }>
      setSavedList(data)
    } catch {
      setListError('Não foi possível carregar o histórico.')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    loadSimulations()
  }, [])

  async function handleFormSubmit(formData: any) {
    // 1. Calculate
    const fixed = simulateFixedIncome({
      initialAmount: Number(formData.initialAmount),
      monthlyContribution: formData.monthlyContribution === '' ? 0 : Number(formData.monthlyContribution),
      months: Number(formData.months),
      annualRate: Number(formData.annualRate) / 100,
    })

    const rvInput = {
      initialAmount: Number(formData.initialAmount),
      monthlyContribution: formData.monthlyContribution === '' ? 0 : Number(formData.monthlyContribution),
      months: Number(formData.months),
    }

    const variable = RV_SCENARIOS.map((scenario) => simulateVariableIncome(rvInput, scenario))

    const comparisonsLocal = compareRfVsRvs({
      rfFinalGross: fixed.finalAmount,
      rfFinalNet: fixed.netFinalAmount,
      rvs: variable.map((rv) => ({
        scenarioId: rv.scenarioId,
        scenarioLabel: rv.scenarioLabel,
        finalGross: rv.finalAmount,
        finalNet: rv.finalAmount,
      })),
    })

    // 2. Set State for View
    setFixedResult(fixed)
    setVariableResults(variable)
    setComparisons(comparisonsLocal)

    // 3. Prepare Payload
    const payload = {
      inputs: {
        name: formData.name,
        initialAmount: Number(formData.initialAmount),
        monthlyContribution: Number(formData.monthlyContribution),
        months: Number(formData.months),
        rfAnnualRate: Number(formData.annualRate) / 100,
        rvScenarios: RV_SCENARIOS,
      },
      outputs: {
        fixed,
        variable,
        comparisons: comparisonsLocal,
      },
      assumptions: {
        daysApproximation: 'months * 30',
        variableIncomeTax: 'not applied (not specified)',
      },
      createdAtClient: new Date().toISOString(),
    }

    // 4. Save
    try {
      setSaving(true)
      await saveSimulation(formData.name, payload)
      await loadSimulations()
    } catch (err) {
      console.error('Save failed:', err)
      // Optional: Toast error
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900/50">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Invest<span className="text-indigo-500">Calc</span>
            </h1>
            <p className="text-sm text-zinc-500 max-w-md">
              Simule cenários de renda fixa e compare com estratégias de renda variável potencializadas por IA.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
              v1.0.0
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & History */}
          <div className="lg:col-span-4 space-y-6">
            <SimulationForm onSubmit={handleFormSubmit} isSaving={saving} />
            <History
              savedList={savedList}
              loadSimulations={loadSimulations}
              listLoading={listLoading}
              listError={listError}
            />
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-8">
            {fixedResult ? (
              <Results
                fixedResult={fixedResult}
                variableResults={variableResults!}
                comparisons={comparisons!}
              />
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 glass rounded-xl border-dashed border-zinc-800">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Pronto para simular?</h3>
                <p className="text-sm text-zinc-500 max-w-xs mt-2">
                  Preencha os parâmetros à esquerda para gerar uma análise comparativa detalhada.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
