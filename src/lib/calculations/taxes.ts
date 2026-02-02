import { iofRate, calculateIOFAmount } from './iof'
import { irRate, calculateIRAmount } from './ir'

export type FixedIncomeTaxes = {
  days: number
  grossProfit: number
  iofRate: number
  iofAmount: number
  profitAfterIOF: number
  irRate: number
  irAmount: number
  netProfit: number
}

export function calculateFixedIncomeTaxes(grossProfit: number, days: number): FixedIncomeTaxes {
  const iofR = iofRate(days)
  const iofA = calculateIOFAmount(grossProfit, days)

  const profitAfterIOF = Math.max(0, grossProfit - iofA)

  const irR = irRate(days)
  const irA = calculateIRAmount(profitAfterIOF, days)

  const netProfit = Math.max(0, profitAfterIOF - irA)

  return {
    days,
    grossProfit,
    iofRate: iofR,
    iofAmount: iofA,
    profitAfterIOF,
    irRate: irR,
    irAmount: irA,
    netProfit,
  }
}
