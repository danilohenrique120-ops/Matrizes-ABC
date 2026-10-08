import React, { useState } from 'react';
import {
  ProcessArea,
  LossCategory,
  CausalDeployment,
  FinancialParameters,
  CalculatedDeploymentCost,
  WCMPillar,
} from '../types/wcm';
import {
  CircleDollarSign,
  Sliders,
  Download,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Layers,
  Zap,
  Users,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Factory,
  BarChart3,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';
import { CausalDeploymentModal } from './CausalDeploymentModal';
import {
  formatCurrency,
  formatPercent,
  calculateCausalDeployments,
  PILLAR_INFO,
} from '../utils/calculations';

interface MatrixCViewProps {
  processes: ProcessArea[];
  losses: LossCategory[];
  causalDeployments: CausalDeployment[];
  financialParams: FinancialParameters;
  onUpdateFinancialParams: (params: FinancialParameters) => void;
  onAddDeployment?: (deployment: Omit<CausalDeployment, 'id'>) => void;
  onEditDeployment?: (deployment: CausalDeployment) => void;
  onDeleteDeployment?: (deploymentId: string) => void;
}

export const MatrixCView: React.FC<MatrixCViewProps> = ({
  processes,
  losses,
  causalDeployments = [],
  financialParams,
  onUpdateFinancialParams,
  onAddDeployment,
  onEditDeployment,
  onDeleteDeployment,
}) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'equipment' | 'causes'>('excel');
  const [selectedProcessFilter, setSelectedProcessFilter] = useState<string>('ALL');
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeployment, setEditingDeployment] = useState<CausalDeployment | null>(null);

  // Calculate Deployment Costs
  const deploymentCalculations = calculateCausalDeployments(
    causalDeployments,
    processes,
    losses,
    financialParams
  );

  const {
    calculatedDeployments,
    totalPlantCost,
    totalLaborCost,
    totalEnergyCost,
    totalDurationHours,
    processPareto,
    rootCausePareto,
    pillarSummary,
  } = deploymentCalculations;

  // Filter deployments
  const filteredCalculations = calculatedDeployments.filter((calc) => {
    const matchesProcess =
      selectedProcessFilter === 'ALL' || calc.deployment.originProcessId === selectedProcessFilter;
    const matchesPillar =
      selectedPillarFilter === 'ALL' || calc.pillar === selectedPillarFilter;
    return matchesProcess && matchesPillar;
  });

  const handleParamChange = (field: keyof FinancialParameters, value: string) => {
    const parsed = parseFloat(value.replace(',', '.'));
    onUpdateFinancialParams({
      ...financialParams,
      [field]: isNaN(parsed) ? 0 : Math.max(0, parsed),
    });
  };

  // Export Integrated Excel CSV
  const handleExportCSV = () => {
    const headers = [
      'Equipamento Origem',
      'Código Equipamento',
      'Perda Mapeada',
      'Tempo Padrão (min)',
      'Causa Raiz',
      'Pilar WCM',
      'Etapa Impactada',
      'Gera Parada?',
      'Duração (Horas)',
      'Nº Operadores',
      'Custo Mão de Obra (R$)',
      'Custo Energia (R$)',
      'Custo Total Etapa (R$)',
    ];

    const rows: string[][] = [];
    filteredCalculations.forEach((calc) => {
      calc.stages.forEach((stg) => {
        rows.push([
          `"${calc.originProcessName}"`,
          `"${calc.originProcessCode}"`,
          `"${calc.lossName}"`,
          calc.standardTimeMin.toString(),
          `"${calc.rootCauseName}"`,
          calc.pillar,
          `"${stg.stageName}"`,
          stg.isStop ? 'Sim' : 'Não',
          stg.durationHours.toFixed(4),
          stg.operatorCount.toString(),
          stg.laborCost.toFixed(2),
          stg.energyCost.toFixed(2),
          stg.totalCost.toFixed(2),
        ]);
      });
    });

    // Total Row
    rows.push([
      'TOTAL GERAL PLANTA',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      '-',
      totalDurationHours.toFixed(4),
      '-',
      totalLaborCost.toFixed(2),
      totalEnergyCost.toFixed(2),
      totalPlantCost.toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WCM_Matriz_C_Financeira_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 uppercase tracking-wider">
                Passo 3 do Cost Deployment
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                MATRIZ C: VALORAÇÃO FINANCEIRA E ELEMENTOS DE CUSTO
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl">
              Transformação dos tempos e operadores da Matriz B em valores monetários reais (R$), aplicando as taxas de mão de obra e energia elétrica.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 shadow transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel (CSV)</span>
            </button>
          </div>
        </div>

        {/* Global KPI Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700">
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Custo Total Geral
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              {formatCurrency(totalPlantCost)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Soma de todas as causas</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
              Custo Mão de Obra
            </div>
            <div className="text-xl font-black text-blue-300 font-mono mt-1">
              {formatCurrency(totalLaborCost)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              Taxa: R$ {(financialParams.hourlyLaborRate || 100).toFixed(2)}/h
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-[11px] font-semibold text-yellow-400 uppercase tracking-wider">
              Custo de Energia
            </div>
            <div className="text-xl font-black text-yellow-300 font-mono mt-1">
              {formatCurrency(totalEnergyCost)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              Taxa: R$ {(financialParams.electricityCostPerKWh || 0.70).toFixed(2)}/h
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Horas de Impacto
            </div>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">
              {totalDurationHours.toFixed(2)} h
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              ({(totalDurationHours * 60).toFixed(0)} minutos de parada/atraso)
            </div>
          </div>
        </div>
      </div>

      {/* ELEMENTOS DE CUSTO (Parâmetros da Fábrica) */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/70 border border-indigo-900/60 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Elementos de Custo (Parâmetros Financeiros da Fábrica)
              </h3>
              <p className="text-[11px] text-slate-400">
                Altere os valores abaixo para recalcular instantaneamente toda a valoração da Matriz C:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Salário do Operador */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <label className="block text-[11px] font-bold text-blue-400 uppercase mb-1">
              Salário do Operador (R$/h)
            </label>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500 font-mono font-bold">R$</span>
              <input
                type="number"
                step="1"
                min="0"
                value={financialParams.hourlyLaborRate || 100}
                onChange={(e) => handleParamChange('hourlyLaborRate', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Custo hora operador com encargos</span>
          </div>

          {/* Energia Elétrica */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <label className="block text-[11px] font-bold text-yellow-400 uppercase mb-1">
              Energia Elétrica (R$/h ou kWh)
            </label>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500 font-mono font-bold">R$</span>
              <input
                type="number"
                step="0.05"
                min="0"
                value={financialParams.electricityCostPerKWh || 0.70}
                onChange={(e) => handleParamChange('electricityCostPerKWh', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-yellow-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Custo médio elétrico por hora de máquina</span>
          </div>

          {/* Custo de Manutenção / Hora */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <label className="block text-[11px] font-bold text-amber-400 uppercase mb-1">
              Custo de Manutenção (R$/h)
            </label>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500 font-mono font-bold">R$</span>
              <input
                type="number"
                step="5"
                min="0"
                value={financialParams.averageMaintenanceCostPerHour || 140}
                onChange={(e) => handleParamChange('averageMaintenanceCostPerHour', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Técnico especializado / peças</span>
          </div>

          {/* Água e Vapor Puro */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <label className="block text-[11px] font-bold text-sky-400 uppercase mb-1">
              Água / Vapor (R$/m³)
            </label>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500 font-mono font-bold">R$</span>
              <input
                type="number"
                step="5"
                min="0"
                value={financialParams.waterSteamCostPerM3 || 65}
                onChange={(e) => handleParamChange('waterSteamCostPerM3', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-sky-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Utilidades térmicas e puras</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'excel'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Planilha Integrada (Matriz B + Matriz C)</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'equipment'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>Consolidação por Equipamento</span>
          </button>

          <button
            onClick={() => setActiveTab('causes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'causes'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Pareto de Causas & Pilares WCM</span>
          </button>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Filtrar:</span>
          <select
            value={selectedProcessFilter}
            onChange={(e) => setSelectedProcessFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">Todos os Equipamentos</option>
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: INTEGRATED EXCEL VIEW (Blue Matriz B + Yellow Matriz C) */}
      {activeTab === 'excel' && (
        <div className="space-y-6">
          {filteredCalculations.map((calc, index) => {
            const pillarInfo = PILLAR_INFO[calc.pillar] || {
              name: calc.pillar,
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/20 text-indigo-300',
              border: 'border-indigo-500/30',
            };

            return (
              <div
                key={calc.deployment.id}
                className="bg-slate-900 border border-slate-700/90 rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Unified Excel Header Dual Band (Blue for Matriz B / Yellow for Matriz C) */}
                <div className="grid grid-cols-12 text-xs font-black uppercase tracking-wider text-center">
                  <div className="col-span-12 sm:col-span-7 bg-[#1e40af] text-white py-2 px-4 border-b sm:border-b-0 sm:border-r border-blue-400/30 flex items-center justify-between">
                    <span>MATRIZ B (DESDOBRAMENTO FÍSICO)</span>
                    <span className="text-[10px] font-normal text-blue-200">
                      Causa & Fluxo Operacional
                    </span>
                  </div>
                  <div className="col-span-12 sm:col-span-5 bg-[#b45309] text-amber-100 py-2 px-4 flex items-center justify-between">
                    <span>MATRIZ C (VALORAÇÃO FINANCEIRA)</span>
                    <span className="text-[10px] font-normal text-amber-200">
                      Conversão em Reais (R$)
                    </span>
                  </div>
                </div>

                {/* Subheader: Equipment, Loss, Standard Time, Cause, Pillar */}
                <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-mono font-bold border border-blue-500/30">
                      {calc.deployment.rootCauseCode || `C0${index + 1}`}
                    </span>
                    <div className="px-3 py-1 rounded bg-slate-900 border border-slate-700">
                      <span className="text-slate-400">Origem: </span>
                      <strong className="text-white">{calc.originProcessName}</strong>
                      <span className="text-slate-500 font-mono"> ({calc.originProcessCode})</span>
                    </div>
                    <div className="px-3 py-1 rounded bg-slate-900 border border-slate-700">
                      <span className="text-slate-400">Perda: </span>
                      <strong className="text-amber-300">{calc.lossName}</strong>
                      {calc.standardTimeMin ? (
                        <span className="text-slate-400 ml-1.5 font-mono text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                          temp padrão {calc.standardTimeMin} min
                        </span>
                      ) : null}
                    </div>
                    <div className="px-3 py-1 rounded bg-slate-900 border border-slate-700">
                      <span className="text-slate-400">Causa: </span>
                      <strong className="text-white uppercase">{calc.rootCauseName}</strong>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${pillarInfo.bg} ${pillarInfo.border}`}>
                      Pilar {calc.pillar}
                    </span>
                  </div>

                  {onEditDeployment && (
                    <button
                      onClick={() => {
                        setEditingDeployment(calc.deployment);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                {/* The Integrated Excel Table (Matching user's spreadsheet!) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
                        {/* Matriz B columns */}
                        <th className="py-2.5 px-4 text-blue-300 border-r border-slate-800">Etapa Afetada</th>
                        <th className="py-2.5 px-3 text-center text-blue-300 border-r border-slate-800">Parada?</th>
                        <th className="py-2.5 px-3 text-blue-300 border-r border-slate-800">Tempo (h)</th>
                        <th className="py-2.5 px-3 text-blue-300 border-r border-blue-900/60">Nº Operadores</th>

                        {/* Matriz C columns */}
                        <th className="py-2.5 px-4 text-right text-amber-300 border-r border-slate-800">
                          Total Custo Mão de Obra
                        </th>
                        <th className="py-2.5 px-4 text-right text-amber-300 border-r border-slate-800">
                          Total Custo Energia
                        </th>
                        <th className="py-2.5 px-4 text-right text-amber-300 bg-amber-500/10">
                          Custo Total da Etapa
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-medium">
                      {calc.stages.map((stg) => (
                        <tr key={stg.stageId} className="hover:bg-slate-800/30 transition-colors">
                          {/* Matriz B columns */}
                          <td className="py-3 px-4 font-bold text-white border-r border-slate-800">
                            {stg.stageName}
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-800">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                stg.isStop
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {stg.isStop ? 'sim' : 'não'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-amber-300 border-r border-slate-800">
                            {stg.durationHours.toFixed(5)}
                            <span className="text-[10px] text-slate-500 ml-1">
                              ({(stg.durationHours * 60).toFixed(0)} min)
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300 border-r border-blue-900/60">
                            {stg.operatorCount}
                          </td>

                          {/* Matriz C columns */}
                          <td className="py-3 px-4 text-right font-mono text-blue-300 border-r border-slate-800">
                            {stg.laborCost.toFixed(5)}
                            <span className="text-slate-500 text-[10px] ml-1.5 block">
                              ({formatCurrency(stg.laborCost)})
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-yellow-300 border-r border-slate-800">
                            {stg.energyCost.toFixed(5)}
                            <span className="text-slate-500 text-[10px] ml-1.5 block">
                              ({formatCurrency(stg.energyCost)})
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 bg-amber-500/5 text-sm">
                            {formatCurrency(stg.totalCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    {/* Subtotal Row (Matching Excel total line) */}
                    <tfoot>
                      <tr className="bg-slate-950 font-black text-xs border-t-2 border-slate-700">
                        <td className="py-3 px-4 text-slate-300 uppercase border-r border-slate-800">
                          Soma da Causa
                        </td>
                        <td className="py-3 px-3 text-center text-slate-400 border-r border-slate-800">-</td>
                        <td className="py-3 px-3 font-mono text-amber-400 border-r border-slate-800">
                          {calc.totalDurationHours.toFixed(5)} h
                        </td>
                        <td className="py-3 px-3 text-slate-400 border-r border-blue-900/60">-</td>

                        {/* Matriz C Subtotals */}
                        <td className="py-3 px-4 text-right font-mono text-blue-400 text-sm border-r border-slate-800">
                          {calc.totalLaborCost.toFixed(5)}
                          <span className="text-blue-300 text-[11px] block font-bold">
                            {formatCurrency(calc.totalLaborCost)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-yellow-400 text-sm border-r border-slate-800">
                          {calc.totalEnergyCost.toFixed(5)}
                          <span className="text-yellow-300 text-[11px] block font-bold">
                            {formatCurrency(calc.totalEnergyCost)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-400 bg-emerald-500/10 text-base">
                          {formatCurrency(calc.totalCost)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: EQUIPMENT CONSOLIDATION */}
      {activeTab === 'equipment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Factory className="w-4 h-4 text-sky-400" />
              <span>Consolidação e Ranking de Custos por Equipamento (R$)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total Geral: <strong className="text-emerald-400 font-mono">{formatCurrency(totalPlantCost)}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-4">Código</th>
                  <th className="py-2.5 px-4">Equipamento / Processo</th>
                  <th className="py-2.5 px-4">Seção da Planta</th>
                  <th className="py-2.5 px-3 text-right">Horas Paradas</th>
                  <th className="py-2.5 px-4 text-right">Custo Mão de Obra</th>
                  <th className="py-2.5 px-4 text-right">Custo Energia</th>
                  <th className="py-2.5 px-4 text-right">Custo Total (R$)</th>
                  <th className="py-2.5 px-4 text-right">% do Total</th>
                  <th className="py-2.5 px-4 text-right">% Acumulado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {processPareto.map((proc, index) => (
                  <tr key={proc.processId} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-sky-400">{proc.processCode}</td>
                    <td className="py-3 px-4 font-bold text-white">{proc.processName}</td>
                    <td className="py-3 px-4 text-slate-400">{proc.section}</td>
                    <td className="py-3 px-3 text-right font-mono text-amber-300">
                      {proc.hours.toFixed(2)}h
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-300">
                      {formatCurrency(proc.laborCost)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-yellow-300">
                      {formatCurrency(proc.energyCost)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(proc.totalLossCost)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">
                      {formatPercent(proc.percentage)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {formatPercent(proc.cumulativePercentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROOT CAUSE PARETO & PILLARS */}
      {activeTab === 'causes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pareto Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Curva de Pareto das Causas-Raiz (R$)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="py-2.5 px-3">Cód</th>
                    <th className="py-2.5 px-4">Causa Raiz</th>
                    <th className="py-2.5 px-3">Pilar</th>
                    <th className="py-2.5 px-4 text-right">Custo Atribuído (R$)</th>
                    <th className="py-2.5 px-3 text-right">% Total</th>
                    <th className="py-2.5 px-3 text-right">% Acum.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {rootCausePareto.map((cause) => {
                    const pillarInfo = PILLAR_INFO[cause.pillar] || {
                      name: cause.pillar,
                      color: 'text-indigo-400',
                      bg: 'bg-indigo-500/20 text-indigo-300',
                      border: 'border-indigo-500/30',
                    };

                    return (
                      <tr key={cause.causeId} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono text-blue-400 font-bold">{cause.causeCode}</td>
                        <td className="py-2.5 px-4 font-bold text-white uppercase">{cause.causeName}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pillarInfo.bg} ${pillarInfo.border}`}>
                            {cause.pillar}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400">
                          {formatCurrency(cause.totalCost)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                          {formatPercent(cause.percentage)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                          {formatPercent(cause.cumulativePercentage)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pillars Distribution Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Distribuição por Pilar WCM</span>
            </h3>

            <div className="space-y-3">
              {pillarSummary.map((item) => {
                const info = PILLAR_INFO[item.pillar] || {
                  name: item.pillar,
                  color: 'text-indigo-400',
                  bg: 'bg-indigo-500/20 text-indigo-300',
                  border: 'border-indigo-500/30',
                };

                return (
                  <div key={item.pillar} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${info.bg} ${info.border}`}>
                        Pilar {item.pillar}
                      </span>
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        {formatCurrency(item.totalCost)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, item.percentage))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.causesCount} causa(s) associada(s)</span>
                      <span className="font-mono font-bold text-slate-300">{formatPercent(item.percentage)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Deployment Modal */}
      {isModalOpen && (
        <CausalDeploymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDeployment(null);
          }}
          onSave={(data) => {
            if ('id' in data && onEditDeployment) {
              onEditDeployment(data as CausalDeployment);
            } else if (onAddDeployment) {
              onAddDeployment(data);
            }
          }}
          deploymentToEdit={editingDeployment}
          processes={processes}
          losses={losses}
          financialParams={financialParams}
        />
      )}
    </div>
  );
};
