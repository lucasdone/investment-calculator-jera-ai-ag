import { annualToMonthlyRate } from './rates'
import type { FixedIncomeInput, FixedIncomeResult } from './types'
import { calculateFixedIncomeTaxes } from './taxes'

function assertNonNegative(name: string, value: number) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a non-negative number`)
}

export function simulateFixedIncome(input: FixedIncomeInput): FixedIncomeResult {
  const monthlyContribution = input.monthlyContribution ?? 0

  assertNonNegative('initialAmount', input.initialAmount)
  assertNonNegative('monthlyContribution', monthlyContribution)
  if (!Number.isInteger(input.months) || input.months <= 0) throw new Error('months must be a positive integer')
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0) throw new Error('annualRate must be non-negative')

  const monthlyRate = annualToMonthlyRate(input.annualRate)

  let balance = input.initialAmount
  const series = [{ month: 0, value: balance }]

  // Convenção: a cada mês -> aplica juros, depois adiciona aporte
  for (let m = 1; m <= input.months; m++) {
    balance = balance * (1 + monthlyRate)
    balance = balance + monthlyContribution
    series.push({ month: m, value: balance })
  }

  const totalContributed = input.initialAmount + monthlyContribution * input.months
  const grossProfit = balance - totalContributed

  const days = input.months * 30 // premissa do teste (meses -> dias)
  const taxes = calculateFixedIncomeTaxes(grossProfit, days)

  const netFinalAmount = totalContributed + taxes.netProfit

  return {
    monthlyRate,
    series,
    finalAmount: balance,
    totalContributed,
    grossProfit,

    days,
    taxes: {
      iofRate: taxes.iofRate,
      iofAmount: taxes.iofAmount,
      irRate: taxes.irRate,
      irAmount: taxes.irAmount,
      netProfit: taxes.netProfit,
    },
    netFinalAmount,
  }
}
