import React from 'react';
import {
  DollarSign,
  AlertTriangle,
  Flame,
  Wrench,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  formatCurrency,
  formatPercent,
  formatPhysicalValue,
  PILLAR_INFO,
} from '../utils/calculations';
import {
  CalculatedLossSummary,
  CalculatedProcessCost,
  CalculatedRootCauseCost,
  LossCostBreakdown,
} from '../types/wcm';

interface KPICardsProps {
  totalPlantCost: number;
  processPareto: (CalculatedProcessCost & { percentage: number })[];
  lossSummaries: CalculatedLossSummary[];
  rootCausePareto: (CalculatedRootCauseCost & { percentage: number })[];
  costBreakdown: LossCostBreakdown;
  onNavigateTab: (tab: 'matrixA' | 'matrixB' | 'matrixC') => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalPlantCost,
  processPareto,
  lossSummaries,
  rootCausePareto,
  costBreakdown,
  onNavigateTab,
}) => {
  const topProcess = processPareto[0] || null;
  const topLoss = lossSummaries[0] || null;
  const topRootCause = rootCausePareto[0] || null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. Custo Total de Perdas Mapeadas (SaaS Blue Hero Card - Matching Screenshot 1 Score Card) */}
      <div className="bg-gradient-to-br from-[#0B1528] via-[#0E2042] to-[#122E5C] text-white rounded-2xl p-5 shadow-sm border border-blue-900/40 relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/50 transition-all">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all pointer-events-none"></div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Perda Total Mapeada (CD)
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-cyan-300 flex items-center justify-center border border-blue-400/30">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums tracking-tight">
              {formatCurrency(totalPlantCost)}
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-300">
              <span className="text-emerald-400 font-bold flex items-center font-mono">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                100%
              </span>
              <span>desdobrado nas Matrizes</span>
            </div>
          </div>

          {/* Progress bar matching Screenshot */}
          <div className="w-full bg-blue-950/80 rounded-full h-2 mt-3.5 overflow-hidden border border-blue-800/40">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full w-full"></div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-blue-800/50 flex items-center justify-between text-xs">
          <span className="text-blue-200/80 font-mono text-[11px]">
            MO: {formatCurrency(costBreakdown.laborCost, true)}
          </span>
          <button
            onClick={() => onNavigateTab('matrixC')}
            className="text-cyan-300 hover:text-white font-bold cursor-pointer text-xs flex items-center space-x-1 group-hover:translate-x-0.5 transition"
          >
            <span>Ver Matriz C</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Processo Mais Crítico (Clean White Card - Matching Screenshot) */}
      <div className="bg-white border border-slate-200/90 hover:border-amber-400/80 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Processo Mais Crítico
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/70">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>

          {topProcess ? (
            <div className="space-y-1">
              <div
                className="text-base sm:text-lg font-bold text-slate-900 truncate"
                title={topProcess.processName}
              >
                {topProcess.processName}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono tabular-nums text-amber-600 font-extrabold text-base">
                  {formatCurrency(topProcess.totalLossCost)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-200">
                  {formatPercent(topProcess.percentage)} do total
                </span>
              </div>

              {/* Progress bar matching Screenshot */}
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden border border-slate-200/70">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(8, topProcess.percentage))}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm py-2">Sem processos cadastrados</div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px] truncate max-w-[130px]">
            Seção: {topProcess?.section || 'Geral'}
          </span>
          <button
            onClick={() => onNavigateTab('matrixA')}
            className="text-amber-600 hover:text-amber-700 font-bold cursor-pointer text-xs flex items-center space-x-1"
          >
            <span>Ver Matriz A</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Maior Tipo de Perda (Clean White Card) */}
      <div className="bg-white border border-slate-200/90 hover:border-rose-400/80 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Maior Tipo de Perda
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/70">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>

          {topLoss ? (
            <div className="space-y-1">
              <div
                className="text-base sm:text-lg font-bold text-slate-900 truncate"
                title={topLoss.lossName}
              >
                {topLoss.lossName}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono tabular-nums text-rose-600 font-extrabold text-base">
                  {formatCurrency(topLoss.totalFinancialCost)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-mono text-[10px] font-bold border border-rose-200">
                  {formatPhysicalValue(topLoss.totalPhysicalValue, topLoss.unit)}
                </span>
              </div>

              {/* Progress bar matching Screenshot */}
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden border border-slate-200/70">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(8, topLoss.percentage))}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm py-2">Sem perdas cadastradas</div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            {topLoss ? `${formatPercent(topLoss.percentage)} do total` : '-'}
          </span>
          <button
            onClick={() => onNavigateTab('matrixB')}
            className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer text-xs flex items-center space-x-1"
          >
            <span>Ver Causas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Causa Raiz Prioritária & Pilar WCM (Clean White Card) */}
      <div className="bg-white border border-slate-200/90 hover:border-indigo-400/80 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Causa Raiz Prioritária
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/70">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          </div>

          {topRootCause ? (
            <div className="space-y-1">
              <div
                className="text-base sm:text-lg font-bold text-slate-900 truncate"
                title={topRootCause.causeName}
              >
                {topRootCause.causeName}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono tabular-nums text-indigo-600 font-extrabold text-base">
                  {formatCurrency(topRootCause.totalCost)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] font-mono border ${PILLAR_INFO[topRootCause.pillar]?.bg} ${PILLAR_INFO[topRootCause.pillar]?.border} ${PILLAR_INFO[topRootCause.pillar]?.color}`}
                >
                  Pilar {topRootCause.pillar}
                </span>
              </div>

              {/* Progress bar matching Screenshot */}
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden border border-slate-200/70">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(8, topRootCause.percentage))}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm py-2">Sem causas cadastradas</div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px] truncate max-w-[130px]">
            {topRootCause ? `${formatPercent(topRootCause.percentage)} do total` : '-'}
          </span>
          <button
            onClick={() => onNavigateTab('matrixB')}
            className="text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer text-xs flex items-center space-x-1"
          >
            <span>Ver Matriz B</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
