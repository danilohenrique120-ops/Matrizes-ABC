import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CalculatedLossSummary,
  CalculatedProcessCost,
  CalculatedRootCauseCost,
  LossCostBreakdown,
  WCMPillar,
} from '../types/wcm';
import {
  formatCurrency,
  formatPercent,
  PILLAR_INFO,
} from '../utils/calculations';
import {
  Target,
  PieChart as PieIcon,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  totalPlantCost: number;
  processPareto: (CalculatedProcessCost & { percentage: number; cumulativePercentage: number })[];
  lossSummaries: CalculatedLossSummary[];
  rootCausePareto: (CalculatedRootCauseCost & { percentage: number; cumulativePercentage: number })[];
  pillarSummary: { pillar: WCMPillar; totalCost: number; percentage: number; causesCount: number }[];
  costBreakdown: LossCostBreakdown;
  onNavigateTab: (tab: 'matrixA' | 'matrixB' | 'matrixC') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  totalPlantCost,
  processPareto,
  lossSummaries,
  rootCausePareto,
  pillarSummary,
  costBreakdown,
  onNavigateTab,
}) => {
  const [activeParetoTab, setActiveParetoTab] = useState<'processes' | 'losses' | 'causes'>('processes');
  const [simulationReduction, setSimulationReduction] = useState<number>(20);

  // Prepare Pareto Chart Data
  const processChartData = processPareto.map((p) => ({
    name: p.processName.length > 18 ? p.processCode + ' ' + p.processName.slice(0, 15) + '...' : p.processName,
    fullName: p.processName,
    code: p.processCode,
    cost: Math.round(p.totalLossCost),
    cumPercent: Math.round(p.cumulativePercentage * 10) / 10,
    section: p.section,
  }));

  const lossChartData = lossSummaries.map((l) => ({
    name: l.lossName.length > 18 ? l.lossCode + ' ' + l.lossName.slice(0, 15) + '...' : l.lossName,
    fullName: l.lossName,
    code: l.lossCode,
    cost: Math.round(l.totalFinancialCost),
    cumPercent: Math.round(l.cumulativePercentage * 10) / 10,
  }));

  const causeChartData = rootCausePareto.map((c) => ({
    name: c.causeName.length > 18 ? c.causeCode + ' ' + c.causeName.slice(0, 15) + '...' : c.causeName,
    fullName: c.causeName,
    code: c.causeCode,
    cost: Math.round(c.totalCost),
    cumPercent: Math.round(c.cumulativePercentage * 10) / 10,
    pillar: c.pillar,
  }));

  // Pie chart data for cost breakdown
  const pieData = [
    { name: 'Mão de Obra', value: Math.round(costBreakdown.laborCost), color: '#2563EB' },
    { name: 'Hora Máquina / Parada', value: Math.round(costBreakdown.machineCost), color: '#4F46E5' },
    { name: 'Matéria-Prima & Refugo', value: Math.round(costBreakdown.materialCost), color: '#E11D48' },
    { name: 'Energia & Utilidades', value: Math.round(costBreakdown.energyCost), color: '#D97706' },
    { name: 'Peças & Reparos Manut.', value: Math.round(costBreakdown.maintenanceCost), color: '#059669' },
  ].filter((item) => item.value > 0);

  // Custom Tooltip for Pareto
  const CustomParetoTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xl text-xs space-y-1 z-50">
          <p className="font-extrabold text-slate-900">{data.fullName || label}</p>
          {data.code && <p className="text-slate-500 font-mono">Código: {data.code}</p>}
          {data.pillar && (
            <p className="text-indigo-600 font-bold">Pilar Responsável: {data.pillar}</p>
          )}
          <p className="text-blue-700 font-bold font-mono">
            Custo: {formatCurrency(data.cost)}
          </p>
          <p className="text-cyan-700 font-bold font-mono">
            % Acumulado: {data.cumPercent}%
          </p>
          <p className="text-[11px] pt-1 border-t border-slate-100">
            {data.cumPercent <= 80 ? (
              <span className="text-emerald-600 font-bold">★ Zona A (Prioridade 80/20)</span>
            ) : data.cumPercent <= 95 ? (
              <span className="text-amber-600 font-bold">● Zona B (Médio Impacto)</span>
            ) : (
              <span className="text-slate-400">○ Zona C (Baixo Impacto)</span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  const simulatedSavings = totalPlantCost * (simulationReduction / 100);

  return (
    <div className="space-y-6">
      {/* Pareto Master Card (Clean White with Royal Blue & Degrades) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Análise de Pareto (Desdobramento WCM 80/20)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Identificação visual dos 20% de fatores que concentram 80% do impacto financeiro da fábrica
            </p>
          </div>

          {/* Pareto Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto shadow-2xs">
            <button
              onClick={() => setActiveParetoTab('processes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeParetoTab === 'processes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Por Processo / Área
            </button>
            <button
              onClick={() => setActiveParetoTab('losses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeParetoTab === 'losses'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Por Categoria de Perda
            </button>
            <button
              onClick={() => setActiveParetoTab('causes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeParetoTab === 'causes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Por Causa Raiz (Pilares)
            </button>
          </div>
        </div>

        {/* Dynamic Pareto Chart */}
        <div className="h-80 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={
                activeParetoTab === 'processes'
                  ? processChartData
                  : activeParetoTab === 'losses'
                  ? lossChartData
                  : causeChartData
              }
              margin={{ top: 20, right: 30, bottom: 40, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                angle={-25}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis
                yAxisId="left"
                stroke="#64748B"
                fontSize={11}
                tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#2563EB"
                fontSize={11}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
              />
              <Tooltip content={<CustomParetoTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {/* Bars for Financial Cost */}
              <Bar
                yAxisId="left"
                dataKey="cost"
                name="Custo da Perda (R$)"
                fill={
                  activeParetoTab === 'processes'
                    ? '#2563EB'
                    : activeParetoTab === 'losses'
                    ? '#E11D48'
                    : '#7C3AED'
                }
                radius={[6, 6, 0, 0]}
              />

              {/* Cumulative Pareto Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumPercent"
                name="% Acumulado (Curva ABC)"
                stroke="#0284C7"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0284C7', strokeWidth: 2, stroke: '#FFFFFF' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 80/20 Insight Notice */}
        <div className="mt-4 p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-extrabold text-blue-950">Recomendação WCM:</span>
            <span>
              {activeParetoTab === 'processes' &&
                `Foque os esforços de Manutenção e Kaizens nos 3 primeiros equipamentos da Curva A.`}
              {activeParetoTab === 'losses' &&
                `Priorize a erradicação dos 2 maiores tipos de perdas para capturar a maior economia.`}
              {activeParetoTab === 'causes' &&
                `Direcione os pilares WCM (PM, AM, FI) nas causas-raiz com percentual acumulado até 80%.`}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab(activeParetoTab === 'processes' ? 'matrixA' : activeParetoTab === 'losses' ? 'matrixB' : 'matrixC')}
            className="text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1 whitespace-nowrap cursor-pointer"
          >
            <span>Explorar Matriz Detalhada</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Kaizen ROI Simulator Banner (Matching Screenshot 2 Command Center Style) */}
      <div className="bg-gradient-to-r from-[#0C1628] via-[#0E2246] to-[#1D4ED8] rounded-2xl p-5 sm:p-6 text-white shadow-sm border border-blue-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-400/30">
                Simulador Estratégico WCM
              </span>
              <span className="text-xs text-blue-200">Metas Kaizen</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              Potencial de Economia com Projetos Kaizen
            </h3>
            <p className="text-xs text-blue-100/80">
              Ajuste a meta de redução das perdas identificadas para prever o ganho financeiro e o ROI na fábrica.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider text-blue-200 block font-semibold">
                Meta de Redução: {simulationReduction}%
              </span>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={simulationReduction}
                onChange={(e) => setSimulationReduction(Number(e.target.value))}
                className="w-48 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-white/20 pt-2 sm:pt-0 sm:pl-4 text-center sm:text-right">
              <span className="text-[10px] text-blue-200 block uppercase font-bold">
                Economia Anual Projetada
              </span>
              <span className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
                {formatCurrency(simulatedSavings)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Cost Composition & Pillar Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Composição Estratificada de Custos (Clean White Card) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/70">
                  <PieIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Composição Financeira das Perdas
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono font-bold">
                Total: {formatCurrency(totalPlantCost, true)}
              </span>
            </div>

            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val), 'Custo']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#0F172A',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Pills List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
            {pieData.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-semibold truncate">{item.name}</span>
                </div>
                <div className="text-slate-900 font-black font-mono mt-1 text-sm">
                  {formatCurrency(item.value, true)}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {totalPlantCost > 0 ? formatPercent((item.value / totalPlantCost) * 100) : '0%'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Distribuição por Pilar WCM (Clean White Card with Progress Bars) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/70">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Desdobramento por Pilar WCM
                </h3>
              </div>
              <span className="text-xs text-slate-500">Distribuição de Responsabilidade</span>
            </div>

            <div className="space-y-3">
              {pillarSummary.map((item) => {
                const info = PILLAR_INFO[item.pillar] || {
                  name: item.pillar,
                  color: 'text-slate-800',
                  bg: 'bg-slate-100',
                  border: 'border-slate-300',
                };
                return (
                  <div key={item.pillar} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded font-black text-[10px] ${info.bg} border ${info.border}`}>
                          {item.pillar}
                        </span>
                        <span className="font-bold text-slate-800">{info.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-blue-700 mr-2">
                          {formatCurrency(item.totalCost)}
                        </span>
                        <span className="text-slate-500 font-semibold">
                          ({formatPercent(item.percentage)})
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                        style={{ width: `${Math.min(100, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Prioridades Estratégicas e Causas-Raiz Ofensoras (White SaaS Table) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/70">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Top 5 Causas-Raiz Ofensoras (Prioridades de Ataque)
              </h3>
              <p className="text-xs text-slate-500">
                Calculado automaticamente pelo desdobramento dos custos da Matriz C cruzados com os pesos causais da Matriz B
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('matrixB')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver na Matriz B</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider font-bold">
                <th className="py-2.5 px-3">Prioridade</th>
                <th className="py-2.5 px-3">Causa Raiz Geradora</th>
                <th className="py-2.5 px-3">Pilar WCM</th>
                <th className="py-2.5 px-3">Custo Atribuído (R$)</th>
                <th className="py-2.5 px-3">% do Impacto Total</th>
                <th className="py-2.5 px-3">Direcionamento Metodológico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rootCausePareto.slice(0, 5).map((cause, idx) => {
                const getMethodologicalGuidance = (pillar: string) => {
                  switch (pillar) {
                    case 'PM':
                      return 'Análise RCM, plano preventivo, lubrificação e inspeção preditiva';
                    case 'AM':
                      return 'Etiquetas 5S, padrões de limpeza/inspeção e restauração de condições básicas';
                    case 'FI':
                      return 'Cronoanálise SMED, estudo de perdas de processo e balanceamento de linha';
                    case 'QC':
                      return 'Matriz QA, calibração de malhas/sensores e homologação de insumos';
                    case 'LOG':
                      return 'Fluxo contínuo de materiais, roteirização e nivelamento Kanban';
                    case 'ENV':
                      return 'Eliminação de vazamentos pneumáticos, isolamento térmico e eficiência energética';
                    default:
                      return 'Tratamento de causa-raiz e padronização operacional';
                  }
                };

                return (
                  <tr key={cause.causeId} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs font-mono">
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{cause.causeName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{cause.causeCode} • {cause.category}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${PILLAR_INFO[cause.pillar]?.bg || 'bg-slate-100 text-slate-700'} ${PILLAR_INFO[cause.pillar]?.border || 'border-slate-300'}`}>
                        Pilar {cause.pillar}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-slate-900 text-sm">
                      {formatCurrency(cause.totalCost)}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-700">
                      {formatPercent(cause.percentage)}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {getMethodologicalGuidance(cause.pillar)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
