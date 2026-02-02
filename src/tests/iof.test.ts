import { describe, it, expect } from 'vitest'
import { iofRate, calculateIOFAmount } from '../lib/calculations/iof'

describe('iofRate', () => {
  it('matches known reference points', () => {
    expect(iofRate(1)).toBeCloseTo(0.96, 5)
    expect(iofRate(2)).toBeCloseTo(0.93, 5)
    expect(iofRate(10)).toBeCloseTo(0.69, 5)
    expect(iofRate(29)).toBeCloseTo(0.12, 5)
    expect(iofRate(30)).toBeCloseTo(0, 5)
    expect(iofRate(45)).toBeCloseTo(0, 5)
  })

  it('throws for invalid days', () => {
    expect(() => iofRate(0)).toThrow()
    expect(() => iofRate(-1)).toThrow()
  })
})

describe('calculateIOFAmount', () => {
  it('applies rate to gross profit', () => {
    // exemplo do enunciado: dia 10 => 69%, rendimento bruto 50
    const iof = calculateIOFAmount(50, 10)
    expect(iof).toBeCloseTo(34.5, 2)
  })

  it('returns zero when profit is non-positive', () => {
    expect(calculateIOFAmount(0, 10)).toBe(0)
    expect(calculateIOFAmount(-10, 10)).toBe(0)
  })
})
