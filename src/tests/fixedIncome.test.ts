import { describe, it, expect } from 'vitest'
import { simulateFixedIncome } from '../lib/calculations/fixedIncome'

describe('simulateFixedIncome', () => {
  it('generates series with month 0..months', () => {
    const res = simulateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      months: 3,
      annualRate: 0.12,
    })

    expect(res.series.length).toBe(4)
    expect(res.series[0].month).toBe(0)
    expect(res.series[3].month).toBe(3)
    expect(res.finalAmount).toBeGreaterThan(res.totalContributed)
  })

  it('works with zero interest (annualRate=0) as linear contributions', () => {
    const res = simulateFixedIncome({
      initialAmount: 1000,
      monthlyContribution: 100,
      months: 3,
      annualRate: 0,
    })

    // juros = 0, então: 1000 + 100*3 = 1300
    expect(res.finalAmount).toBe(1300)
    expect(res.grossProfit).toBe(0)
  })

  it('throws on invalid inputs', () => {
    expect(() =>
      simulateFixedIncome({ initialAmount: -1, months: 12, annualRate: 0.1 })
    ).toThrow()

    expect(() =>
      simulateFixedIncome({ initialAmount: 1000, months: 0, annualRate: 0.1 })
    ).toThrow()
  })
})
