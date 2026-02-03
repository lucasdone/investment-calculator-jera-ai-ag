"use client";

function brl(value: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function pct(value: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

interface ResultsProps {
    fixedResult: any;
    variableResults: any[];
    comparisons: any[];
}

export function Results({ fixedResult, variableResults, comparisons }: ResultsProps) {
    if (!fixedResult) {
        return null; // Or some empty state
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Renda Fixa Highlight */}
            <section className="glass rounded-xl p-6 border-l-4 border-indigo-500">
                <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-xl font-semibold text-white">Renda Fixa (Referência)</h2>
                    <p className="text-sm text-zinc-400">
                        Prazo: {fixedResult.days} dias <span className="text-zinc-600">•</span> IOF: {pct(fixedResult.taxes.iofRate)} <span className="text-zinc-600">•</span> IR: {pct(fixedResult.taxes.irRate)}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard label="Total Investido" value={brl(fixedResult.totalContributed)} delay={0} />
                    <MetricCard label="Valor Bruto" value={brl(fixedResult.finalAmount)} delay={1} />
                    <MetricCard label="Impostos Totais" value={brl(fixedResult.taxes.iofAmount + fixedResult.taxes.irAmount)} delay={2} isNegative />
                    <MetricCard label="Valor Líquido" value={brl(fixedResult.netFinalAmount)} delay={3} isHighlight />
                </div>
            </section>

            {/* Renda Variável Scenarios */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variableResults?.map((rv, idx) => (
                    <div key={rv.scenarioId} className="glass rounded-xl p-5 hover:bg-white/5 transition-colors relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-full h-1 
              ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        />

                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{rv.scenarioLabel}</span>
                            <span className="text-xs text-zinc-600 font-mono">{rv.scenarioId}</span>
                        </div>

                        <div className="text-2xl font-bold text-white mb-1">{brl(rv.finalAmount)}</div>
                        <div className="text-xs text-zinc-500">Retorno Bruto</div>

                        {/* Find comparison for this scenario */}
                        <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-4">
                            {(() => {
                                const comp = comparisons?.find(c => c.scenarioId === rv.scenarioId);
                                if (!comp) return null;
                                return (
                                    <>
                                        <div>
                                            <div className="text-[10px] text-zinc-500 uppercase">vs RF Bruto</div>
                                            <div className={`text-sm font-bold ${comp.diffGrossPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {comp.diffGrossPct >= 0 ? '+' : ''}{pct(comp.diffGrossPct)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-zinc-500 uppercase">vs RF Líquido</div>
                                            <div className={`text-sm font-bold ${comp.diffNetPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {comp.diffNetPct >= 0 ? '+' : ''}{pct(comp.diffNetPct)}
                                            </div>
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                ))}
            </section>

        </div>
    )
}

function MetricCard({ label, value, delay, isHighlight, isNegative }: { label: string, value: string, delay: number, isHighlight?: boolean, isNegative?: boolean }) {
    return (
        <div
            className={`p-4 rounded-lg border ${isHighlight ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-zinc-900/40 border-zinc-800'} backdrop-blur-sm`}
            style={{ animationDelay: `${delay * 100}ms` }}
        >
            <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">{label}</div>
            <div className={`text-xl font-bold ${isNegative ? 'text-rose-400' : 'text-white'}`}>{value}</div>
        </div>
    )
}
