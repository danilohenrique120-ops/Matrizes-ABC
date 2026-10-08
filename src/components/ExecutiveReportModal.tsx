import React from 'react';
import {
  Printer,
  X,
  Factory,
  ShieldCheck,
  Calendar,
  Layers,
  Target,
  FileSpreadsheet,
} from 'lucide-react';
import {
  CalculatedProcessCost,
  CalculatedRootCauseCost,
  CalculatedLossSummary,
  LossCostBreakdown,
  WCMPillar,
} from '../types/wcm';
import {
  formatCurrency,
  formatPercent,
  formatPhysicalValue,
  PILLAR_INFO,
} from '../utils/calculations';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPlantCost: number;
  processCosts: (CalculatedProcessCost & { percentage: number })[];
  rootCausePareto: (CalculatedRootCauseCost & { percentage: number; cumulativePercentage: number })[];
  lossSummaries: CalculatedLossSummary[];
  costBreakdown: LossCostBreakdown;
  pillarSummary: { pillar: WCMPillar; totalCost: number; percentage: number; causesCount: number }[];
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  totalPlantCost,
  processCosts,
  rootCausePareto,
  lossSummaries,
  costBreakdown,
  pillarSummary,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const topProcess = processCosts[0];
  const topLoss = lossSummaries[0];
  const topCause = rootCausePareto[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:m-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Toolbar (hidden during print) */}
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 border-b border-blue-500/40 flex items-center justify-between no-print shadow-sm">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                Relatório Executivo A3 - Cost Deployment WCM
              </h2>
              <p className="text-[11px] text-blue-100 font-medium">
                Desdobramento Estratificado & Matrizes C e B
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-blue-800 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-white print:text-black print:p-0 print:overflow-visible">
          {/* Official A3 Report Header */}
          <div className="border-b-2 border-slate-200 pb-4 print:border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold print:bg-black shadow-md">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 print:text-black">
                  RELATÓRIO EXECUTIVO: COST DEPLOYMENT (CD)
                </h1>
                <p className="text-xs text-slate-500 print:text-gray-600 font-medium">
                  World Class Manufacturing (WCM) • Desdobramento de Custos e Análise Causal Integrada
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 print:text-gray-600 space-y-0.5 font-medium">
              <div><strong className="text-slate-700">Ciclo:</strong> Anual 2026</div>
              <div><strong className="text-slate-700">Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
              <div><strong className="text-slate-700">Status:</strong> Mapeamento Matrizes A, B e C Consolidado</div>
            </div>
          </div>

          {/* Key Executive Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 print:border-gray-300 print:bg-gray-50 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-blue-700 print:text-gray-600 block">
                Perda Total Identificada
              </span>
              <span className="text-lg font-black text-blue-800 print:text-black font-mono">
                {formatCurrency(totalPlantCost)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 print:border-gray-300 print:bg-gray-50 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-gray-600 block">
                Processo Mais Crítico
              </span>
              <span className="text-xs font-bold text-slate-900 print:text-black truncate block">
                {topProcess?.processName || '-'}
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-600 print:text-gray-700">
                {topProcess ? formatCurrency(topProcess.totalLossCost) : '-'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 print:border-gray-300 print:bg-gray-50 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-gray-600 block">
                Maior Categoria de Perda
              </span>
              <span className="text-xs font-bold text-slate-900 print:text-black truncate block">
                {topLoss?.lossName || '-'}
              </span>
              <span className="text-[11px] font-mono font-bold text-rose-600 print:text-gray-700">
                {topLoss ? formatCurrency(topLoss.totalFinancialCost) : '-'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 print:border-gray-300 print:bg-gray-50 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-gray-600 block">
                Causa Raiz Prioritária
              </span>
              <span className="text-xs font-bold text-slate-900 print:text-black truncate block">
                {topCause?.causeName || '-'}
              </span>
              <span className="text-[11px] font-mono font-bold text-indigo-600 print:text-gray-700">
                Pilar {topCause?.pillar || '-'} ({topCause ? formatPercent(topCause.percentage) : '-'})
              </span>
            </div>
          </div>

          {/* Section 1: Process Cost Matrix Summary (Matriz C) */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 print:text-black border-b border-slate-200 print:border-gray-300 pb-1 flex items-center justify-between">
              <span>1. Estratificação Financeira por Processo & Equipamento (Matriz C)</span>
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-200 print:border-black rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-700 print:bg-gray-200 border-b border-slate-200 print:border-black font-bold">
                  <th className="p-2 border-r border-slate-200 print:border-black">Código</th>
                  <th className="p-2 border-r border-slate-200 print:border-black">Processo Produtivo</th>
                  <th className="p-2 border-r border-slate-200 print:border-black">Seção</th>
                  <th className="p-2 text-right border-r border-slate-200 print:border-black">Custo Total (R$)</th>
                  <th className="p-2 text-right">% do Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-black">
                {processCosts.map((proc) => (
                  <tr key={proc.processId} className="hover:bg-slate-50/80 transition-colors print:text-black">
                    <td className="p-2 font-mono font-semibold text-slate-600 border-r border-slate-200 print:border-black">{proc.processCode}</td>
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-200 print:border-black">{proc.processName}</td>
                    <td className="p-2 text-slate-600 border-r border-slate-200 print:border-black">{proc.section}</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900 print:text-black border-r border-slate-200 print:border-black">
                      {formatCurrency(proc.totalLossCost)}
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-blue-700">{formatPercent(proc.percentage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Top Root Causes Ranking (Matriz B/C) */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 print:text-black border-b border-slate-200 print:border-gray-300 pb-1 flex items-center justify-between">
              <span>2. Priorização Causal e Alocação por Pilares WCM (Curva ABC)</span>
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-200 print:border-black rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-700 print:bg-gray-200 border-b border-slate-200 print:border-black font-bold">
                  <th className="p-2 border-r border-slate-200 print:border-black">Rank</th>
                  <th className="p-2 border-r border-slate-200 print:border-black">Fator Causal / Causa Raiz</th>
                  <th className="p-2 text-center border-r border-slate-200 print:border-black">Pilar WCM</th>
                  <th className="p-2 text-right border-r border-slate-200 print:border-black">Custo (R$)</th>
                  <th className="p-2 text-right border-r border-slate-200 print:border-black">% Acumulada</th>
                  <th className="p-2 text-center">Classe ABC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-black">
                {rootCausePareto.map((cause, idx) => (
                  <tr key={cause.causeId} className="hover:bg-slate-50/80 transition-colors print:text-black">
                    <td className="p-2 font-mono font-semibold text-slate-600 border-r border-slate-200 print:border-black">#{idx + 1}</td>
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-200 print:border-black">{cause.causeName}</td>
                    <td className="p-2 text-center font-bold border-r border-slate-200 print:border-black">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[11px] border border-blue-200">
                        Pilar {cause.pillar}
                      </span>
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900 print:text-black border-r border-slate-200 print:border-black">
                      {formatCurrency(cause.totalCost)}
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-blue-700 print:text-black border-r border-slate-200 print:border-black">
                      {formatPercent(cause.cumulativePercentage)}
                    </td>
                    <td className="p-2 text-center font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cause.cumulativePercentage <= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : cause.cumulativePercentage <= 95
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {cause.cumulativePercentage <= 80 ? 'Classe A (80%)' : cause.cumulativePercentage <= 95 ? 'Classe B' : 'Classe C'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Cost Stratification and Pillar Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 print:border-black print:bg-white text-xs space-y-2">
              <span className="font-black uppercase text-slate-800 print:text-black block">
                Composição por Elemento de Custo
              </span>
              <div className="space-y-1.5 font-mono text-slate-700">
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>Mão de Obra:</span>
                  <strong className="text-slate-900">{formatCurrency(costBreakdown.laborCost)}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>Overhead / Parada:</span>
                  <strong className="text-slate-900">{formatCurrency(costBreakdown.machineCost)}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>Matéria-Prima & Refugo:</span>
                  <strong className="text-slate-900">{formatCurrency(costBreakdown.materialCost)}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>Energia & Utilidades:</span>
                  <strong className="text-slate-900">{formatCurrency(costBreakdown.energyCost)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Peças & Manutenção:</span>
                  <strong className="text-slate-900">{formatCurrency(costBreakdown.maintenanceCost)}</strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 print:border-black print:bg-white text-xs space-y-2">
              <span className="font-black uppercase text-slate-800 print:text-black block">
                Responsabilidade por Pilar WCM
              </span>
              <div className="space-y-1.5 font-mono text-slate-700">
                {pillarSummary.map((p) => (
                  <div key={p.pillar} className="flex justify-between border-b border-slate-200/60 pb-1 last:border-0 last:pb-0">
                    <span className="font-sans font-bold">Pilar {p.pillar}:</span>
                    <strong className="text-blue-700">{formatCurrency(p.totalCost)} ({formatPercent(p.percentage)})</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-6 border-t border-slate-200 print:border-black grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 pb-8 print:border-black"></div>
              <span className="mt-1 block text-slate-600 print:text-black font-semibold">Líder do Pilar Cost Deployment</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-8 print:border-black"></div>
              <span className="mt-1 block text-slate-600 print:text-black font-semibold">Gerente de Planta / Manufatura</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-8 print:border-black"></div>
              <span className="mt-1 block text-slate-600 print:text-black font-semibold">Controladoria / Finanças</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
