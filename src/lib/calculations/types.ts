export type MonthlySeriesPoint = {
  month: number // 0..months
  value: number
}

export type FixedIncomeInput = {
  initialAmount: number
  monthlyContribution?: number
  months: number
  annualRate: number // decimal (ex: 0.12)
}

export type FixedIncomeResult = {
  monthlyRate: number
  series: MonthlySeriesPoint[]
  finalAmount: number
  totalContributed: number
  grossProfit: number
}
