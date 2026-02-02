import { describe, it, expect } from 'vitest'
import { calculateFixedIncomeTaxes } from '../lib/calculations/taxes'

describe('calculateFixedIncomeTaxes', () => {
  it('applies IOF first, then IR on remaining profit', () => {
    // exemplo do enunciado:
    // grossProfit = 50, day 10 => IOF 69% => 34.50
    // profitAfterIOF = 15.50
    // IR 22.5% => 3.4875
    // netProfit = 12.0125
    const taxes = calculateFixedIncomeTaxes(50, 10)

    expect(taxes.iofAmount).toBeCloseTo(34.5, 2)
    expect(taxes.profitAfterIOF).toBeCloseTo(15.5, 2)
    expect(taxes.irAmount).toBeCloseTo(3.4875, 4)
    expect(taxes.netProfit).toBeCloseTo(12.0125, 4)
  })
})
