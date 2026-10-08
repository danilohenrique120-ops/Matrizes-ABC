import React, { useState } from 'react';
import {
  CausalDeployment,
  ImpactedStage,
  ProcessArea,
  LossCategory,
  WCMPillar,
  FinancialParameters,
} from '../types/wcm';
import {
  GitMerge,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Filter,
  Edit3,
  RotateCcw,
  Sparkles,
  Layers,
  AlertTriangle,
  Search,
  Clock,
  Users,
  Factory,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { CausalDeploymentModal } from './CausalDeploymentModal';
import { formatCurrency, PILLAR_INFO } from '../utils/calculations';

interface MatrixBViewProps {
  processes: ProcessArea[];
  losses: LossCategory[];
  causalDeployments: CausalDeployment[];
  financialParams: FinancialParameters;
  onAddDeployment: (deployment: Omit<CausalDeployment, 'id'>) => void;
  onEditDeployment: (deployment: CausalDeployment) => void;
  onDeleteDeployment: (deploymentId: string) => void;
  onAddStageToDeployment?: (deploymentId: string, stage: Omit<ImpactedStage, 'id'>) => void;
  onDeleteStageFromDeployment?: (deploymentId: string, stageId: string) => void;
  onResetDeployments?: () => void;
}

export const MatrixBView: React.FC<MatrixBViewProps> = ({
  processes,
  losses,
  causalDeployments = [],
  financialParams,
  onAddDeployment,
  onEditDeployment,
  onDeleteDeployment,
  onAddStageToDeployment,
  onDeleteStageFromDeployment,
  onResetDeployments,
}) => {
  const [selectedProcessFilter, setSelectedProcessFilter] = useState<string>('ALL');
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewLayout, setViewLayout] = useState<'cards' | 'table'>('cards');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeployment, setEditingDeployment] = useState<CausalDeployment | null>(null);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Process and Loss maps for rapid lookup
  const processMap = new Map<string, ProcessArea>(processes.map((p) => [p.id, p]));
  const lossMap = new Map<string, LossCategory>(losses.map((l) => [l.id, l]));

  // Filtering
  const filteredDeployments = causalDeployments.filter((dep) => {
    const matchesProcess = selectedProcessFilter === 'ALL' || dep.originProcessId === selectedProcessFilter;
    const matchesPillar = selectedPillarFilter === 'ALL' || dep.pillar === selectedPillarFilter;
    const matchesSearch =
      dep.rootCauseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dep.rootCauseCode && dep.rootCauseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dep.notes && dep.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dep.category && dep.category.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesProcess && matchesPillar && matchesSearch;
  });

  const hourlyLaborRate = financialParams.hourlyLaborRate || 100.0;
  const electricityRate = financialParams.electricityCostPerKWh || 0.70;

  const handleExportCSV = () => {
    const headers = [
      'Equipamento Origem',
      'Código Equipamento',
      'Perda Mapeada',
      'Tempo Padrão (min)',
      'Causa Raiz',
      'Código Causa',
      'Pilar WCM',
      'Categoria',
      'Etapa Impactada',
      'Gera Parada?',
      'Duração (Horas)',
      'Nº Operadores',
      'Custo Mão de Obra (R$)',
      'Custo Energia (R$)',
      'Custo Total Etapa (R$)',
    ];

    const rows: string[][] = [];
    filteredDeployments.forEach((dep) => {
      const proc = processMap.get(dep.originProcessId);
      const loss = lossMap.get(dep.lossId);

      (dep.impactedStages || []).forEach((stg) => {
        const labor = (Number(stg.durationHours) || 0) * (Number(stg.operatorCount) || 1) * hourlyLaborRate;
        const energy = (Number(stg.durationHours) || 0) * electricityRate;
        const total = labor + energy;

        rows.push([
          `"${proc?.name || dep.originProcessName || 'Equipamento'}"`,
          `"${proc?.code || 'EQP'}"`,
          `"${loss?.name || dep.lossName || 'Perda'}"`,
          (dep.standardTimeMin ?? 15).toString(),
          `"${dep.rootCauseName}"`,
          `"${dep.rootCauseCode || 'C01'}"`,
          dep.pillar || 'FI',
          `"${dep.category || ''}"`,
          `"${stg.stageName}"`,
          stg.isStop ? 'Sim' : 'Não',
          (Number(stg.durationHours) || 0).toFixed(4),
          (Number(stg.operatorCount) || 1).toString(),
          labor.toFixed(2),
          energy.toFixed(2),
          total.toFixed(2),
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WCM_Matriz_B_Desdobramentos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 w-full">
      {/* Header Banner */}
      <div className="bg-[#1e1b4b] border border-[#3730a3] rounded-2xl p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-400/30 uppercase tracking-wider">
                Passo 2 do Cost Deployment
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                MATRIZ B - DESDOBRAMENTO CAUSAL & ETAPAS IMPACTADAS
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-4xl">
              Mapeia as causas-raiz a partir dos equipamentos de origem e perdas da Matriz A, identificando as etapas do fluxo produtivo impactadas, tempos e operadores envolvidos.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingDeployment(null);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Desdobramento</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 shadow transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>

            {onResetDeployments && (
              <button
                onClick={onResetDeployments}
                className="p-2.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded-xl text-xs border border-slate-700 transition-colors"
                title="Restaurar Desdobramentos Padrão"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Controls Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Origin Process */}
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Factory className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-semibold">Equipamento:</span>
              <select
                value={selectedProcessFilter}
                onChange={(e) => setSelectedProcessFilter(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">Todos os Equipamentos ({causalDeployments.length})</option>
                {processes.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900">
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Pillar */}
            <div className="flex items-center space-x-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-semibold">Pilar WCM:</span>
              <select
                value={selectedPillarFilter}
                onChange={(e) => setSelectedPillarFilter(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">Todos os Pilares</option>
                {Object.keys(PILLAR_INFO).map((pillar) => (
                  <option key={pillar} value={pillar} className="bg-slate-900">
                    Pilar {pillar}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar causa, método ou notas..."
                className="bg-slate-900/80 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">
              Exibindo <strong className="text-white">{filteredDeployments.length}</strong> desdobramentos
            </span>
          </div>
        </div>
      </div>

      {/* Deployments List */}
      {filteredDeployments.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-10 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum desdobramento causal encontrado</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Não há desdobramentos cadastrados com os filtros atuais. Clique em "+ Novo Desdobramento" para registrar uma causa raiz e suas etapas impactadas.
          </p>
          <button
            onClick={() => {
              setEditingDeployment(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Desdobramento</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeployments.map((dep, index) => {
            const proc = processMap.get(dep.originProcessId);
            const loss = lossMap.get(dep.lossId);
            const pillarInfo = PILLAR_INFO[dep.pillar] || {
              name: dep.pillar,
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/20 text-indigo-300',
              border: 'border-indigo-500/30',
            };

            // Calculate totals for this deployment
            let depLabor = 0;
            let depEnergy = 0;
            let depHours = 0;

            (dep.impactedStages || []).forEach((stg) => {
              const dur = Number(stg.durationHours) || 0;
              const ops = Number(stg.operatorCount) || 1;
              depLabor += dur * ops * hourlyLaborRate;
              depEnergy += dur * electricityRate;
              depHours += dur;
            });

            const depTotal = depLabor + depEnergy;

            return (
              <div
                key={dep.id}
                className="bg-slate-800/90 border border-slate-700/90 rounded-2xl p-5 shadow-xl transition-all hover:border-slate-600"
              >
                {/* Header Row: Equipment, Loss, Cause, Pillar, Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Cause Code Badge */}
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/30">
                      {dep.rootCauseCode || `C0${index + 1}`}
                    </span>

                    {/* Origin Process */}
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                      <Factory className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-slate-400">Origem:</span>
                      <strong className="text-white">{proc?.name || dep.originProcessName || 'Equipamento'}</strong>
                      <span className="text-slate-500 font-mono">({proc?.code || 'EQP'})</span>
                    </div>

                    {/* Loss Badge */}
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs">
                      <span className="text-slate-400">Perda:</span>
                      <strong className="text-amber-300">{loss?.name || dep.lossName || 'Perda Mapeada'}</strong>
                      {dep.standardTimeMin ? (
                        <span className="text-slate-400 font-mono text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">
                          Tempo padrão: {dep.standardTimeMin} min
                        </span>
                      ) : null}
                    </div>

                    {/* Pillar Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${pillarInfo.bg} ${pillarInfo.border}`}>
                      Pilar {dep.pillar}
                    </span>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 self-end lg:self-auto">
                    <button
                      onClick={() => {
                        setEditingDeployment(dep);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: dep.id, name: dep.rootCauseName })}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Excluir Desdobramento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Cause Title & Notes */}
                <div className="py-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Causa Raiz:</span>
                    <h3 className="text-base font-black text-white tracking-tight uppercase">
                      {dep.rootCauseName}
                    </h3>
                  </div>
                  {dep.category && (
                    <div className="text-xs text-slate-400 mt-0.5">
                      <span className="text-slate-500 font-medium">Categoria/Método:</span> {dep.category}
                    </div>
                  )}
                  {dep.notes && (
                    <p className="text-xs text-slate-300/90 mt-1 italic bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                      💡 {dep.notes}
                    </p>
                  )}
                </div>

                {/* Impacted Stages Table (Excel Interpretation) */}
                <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl overflow-hidden mt-2">
                  <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Etapas do Fluxo Impactadas ({dep.impactedStages?.length || 0})</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      Custo Total: <strong className="text-emerald-400 font-mono">{formatCurrency(depTotal)}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[11px]">
                          <th className="py-2 px-4">Etapa do Fluxo</th>
                          <th className="py-2 px-3 text-center">Gera Parada?</th>
                          <th className="py-2 px-3">Tempo / Duração (h)</th>
                          <th className="py-2 px-3">Nº Operadores</th>
                          <th className="py-2 px-3 text-right">Custo Mão de Obra</th>
                          <th className="py-2 px-3 text-right">Custo Energia</th>
                          <th className="py-2 px-4 text-right">Custo Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {(dep.impactedStages || []).map((stage) => {
                          const dur = Number(stage.durationHours) || 0;
                          const ops = Number(stage.operatorCount) || 1;
                          const stageLabor = dur * ops * hourlyLaborRate;
                          const stageEnergy = dur * electricityRate;
                          const stageTotal = stageLabor + stageEnergy;

                          return (
                            <tr key={stage.id} className="hover:bg-slate-800/30">
                              <td className="py-2.5 px-4 font-bold text-slate-200">
                                {stage.stageName}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    stage.isStop
                                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                      : 'bg-slate-800 text-slate-400 border-slate-700'
                                  }`}
                                >
                                  {stage.isStop ? 'Sim' : 'Não'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-amber-300">
                                {dur.toFixed(4)}h{' '}
                                <span className="text-[10px] text-slate-400">({(dur * 60).toFixed(0)} min)</span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-300">
                                {ops} {ops > 1 ? 'operadores' : 'operador'}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-blue-300">
                                {formatCurrency(stageLabor)}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-yellow-300">
                                {formatCurrency(stageEnergy)}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                                {formatCurrency(stageTotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {/* Subtotal Row */}
                      <tfoot>
                        <tr className="bg-slate-900/90 font-bold border-t border-slate-700 text-xs">
                          <td colSpan={2} className="py-2.5 px-4 text-slate-300 uppercase">
                            Subtotal da Causa ({dep.rootCauseCode || 'C01'})
                          </td>
                          <td className="py-2.5 px-3 font-mono text-amber-400">
                            {depHours.toFixed(4)}h
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">-</td>
                          <td className="py-2.5 px-3 text-right font-mono text-blue-400">
                            {formatCurrency(depLabor)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-yellow-400">
                            {formatCurrency(depEnergy)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-emerald-400 text-sm font-black">
                            {formatCurrency(depTotal)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Causal Deployment Modal */}
      <CausalDeploymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDeployment(null);
        }}
        onSave={(data) => {
          if ('id' in data) {
            onEditDeployment(data as CausalDeployment);
          } else {
            onAddDeployment(data);
          }
        }}
        deploymentToEdit={editingDeployment}
        processes={processes}
        losses={losses}
        financialParams={financialParams}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Confirmar Exclusão</h3>
            </div>
            <p className="text-xs text-slate-300">
              Tem certeza de que deseja remover o desdobramento da causa{' '}
              <strong className="text-white uppercase font-mono">"{deleteConfirm.name}"</strong>?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteDeployment(deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
