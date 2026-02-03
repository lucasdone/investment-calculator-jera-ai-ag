"use client";

interface HistoryProps {
    savedList: Array<{ id: string; name: string; createdAt: string }>;
    loadSimulations: () => void;
    listLoading: boolean;
    listError: string | null;
}

export function History({ savedList, loadSimulations, listLoading, listError }: HistoryProps) {
    return (
        <section className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Histórico</h2>

                <button
                    type="button"
                    onClick={loadSimulations}
                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                    disabled={listLoading}
                    title="Atualizar lista"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${listLoading ? 'animate-spin' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>

            {listError && <p className="mb-3 text-sm text-red-400 bg-red-900/20 p-2 rounded">{listError}</p>}

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {savedList.length === 0 && !listLoading && (
                    <div className="text-center py-8 text-zinc-500">
                        <p>Nenhuma simulação salva.</p>
                    </div>
                )}

                {savedList.map((s) => (
                    <div key={s.id} className="group flex items-center justify-between p-3 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 transition-all cursor-default">
                        <div>
                            <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{s.name}</div>
                            <div className="text-xs text-zinc-500">
                                {new Date(s.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <div className="text-[10px] font-mono text-zinc-600 bg-zinc-900 px-2 py-1 rounded">
                            #{s.id.slice(-4)}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
