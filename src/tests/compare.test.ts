import { describe, it, expect } from 'vitest'
import { compareRfVsRvs } from '../lib/calculations/compare'

describe('compareRfVsRvs', () => {
  it('computes percentage diffs for gross and net', () => {
    const res = compareRfVsRvs({
      rfFinalGross: 100,
      rfFinalNet: 80,
      rvs: [
        { scenarioId: 'RV1', scenarioLabel: 'Conservador', finalGross: 110, finalNet: 110 },
      ],
    })

    expect(res).toHaveLength(1)
    expect(res[0].diffGrossPct).toBeCloseTo(0.10, 6)
    expect(res[0].diffNetPct).toBeCloseTo((110 - 80) / 80, 6)
  })

  it('returns null diff when base is zero', () => {
    const res = compareRfVsRvs({
      rfFinalGross: 0,
      rfFinalNet: 0,
      rvs: [{ scenarioId: 'RV1', scenarioLabel: 'Conservador', finalGross: 110, finalNet: 110 }],
    })

    expect(res[0].diffGrossPct).toBeNull()
    expect(res[0].diffNetPct).toBeNull()
  })
})
