export function iofRate(days: number): number {
  if (!Number.isFinite(days) || days <= 0) {
    throw new Error('days must be a positive number')
  }
  if (days >= 30) return 0
  const ratePercent = 96 - ((Math.floor(days) - 1) * 3)
  const clamped = Math.max(0, Math.min(96, ratePercent))

  return clamped / 100
}

export function calculateIOFAmount(grossProfit: number, days: number): number {
  if (!Number.isFinite(grossProfit)) throw new Error('grossProfit must be a number')
  if (grossProfit <= 0) return 0

  return grossProfit * iofRate(days)
}
