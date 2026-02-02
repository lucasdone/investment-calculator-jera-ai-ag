import { describe, it, expect } from 'vitest'
import { irRate, calculateIRAmount } from '../lib/calculations/ir'

describe('irRate', () => {
  it('returns correct rates by day ranges', () => {
    expect(irRate(1)).toBeCloseTo(0.225, 5)
    expect(irRate(180)).toBeCloseTo(0.225, 5)
    expect(irRate(181)).toBeCloseTo(0.20, 5)
    expect(irRate(360)).toBeCloseTo(0.20, 5)
    expect(irRate(361)).toBeCloseTo(0.175, 5)
    expect(irRate(720)).toBeCloseTo(0.175, 5)
    expect(irRate(721)).toBeCloseTo(0.15, 5)
    expect(irRate(1000)).toBeCloseTo(0.15, 5)
  })

  it('throws for invalid days', () => {
    expect(() => irRate(0)).toThrow()
    expect(() => irRate(-1)).toThrow()
  })
})

describe('calculateIRAmount', () => {
  it('calculates IR over profit after IOF', () => {
    // Exemplo simples: lucro após IOF = 15.50, dias = 10 => 22.5%
    const ir = calculateIRAmount(15.5, 10)
    expect(ir).toBeCloseTo(3.4875, 4)
  })

  it('returns zero when profit is non-positive', () => {
    expect(calculateIRAmount(0, 10)).toBe(0)
    expect(calculateIRAmount(-1, 10)).toBe(0)
  })
})
