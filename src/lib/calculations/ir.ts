export function irRate(days: number): number {
  if (!Number.isFinite(days) || days <= 0) {
    throw new Error('days must be a positive number')
  }

  const d = Math.floor(days)

  if (d <= 180) return 0.225
  if (d <= 360) return 0.20
  if (d <= 720) return 0.175
  return 0.15
}

export function calculateIRAmount(profitAfterIOF: number, days: number): number {
  if (!Number.isFinite(profitAfterIOF)) throw new Error('profitAfterIOF must be a number')
  if (profitAfterIOF <= 0) return 0

  return profitAfterIOF * irRate(days)
}
