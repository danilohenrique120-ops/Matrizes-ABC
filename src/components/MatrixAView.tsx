import React, { useState, useMemo } from 'react';
import {
  ProcessArea,
  LossCategory,
  MatrixACell,
  CauseResultType,
} from '../types/wcm';
import {
  Plus,
  Trash2,
  Filter,
  Download,
  Search,
  Edit3,
  RotateCcw,
  Sparkles,
  Layers,
  Factory,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { ProcessModal } from './ProcessModal';
import { LossModal } from './LossModal';
import { PILLAR_INFO } from '../utils/calculations';
import { CausalDeployment } from '../types/wcm';

interface MatrixAViewProps {
  processes: ProcessArea[];
  losses: LossCategory[];
  matrixA: MatrixACell[];
  causalDeployments?: CausalDeployment[];
  onUpdateCellValue: (processId: string, lossId: string, value: number) => void;
  onAddProcess: (process: Omit<ProcessArea, 'id'>) => void;
  onEditProcess?: (process: ProcessArea) => void;
  onDeleteProcess: (processId: string) => void;
  onAddLossCategory: (loss: Omit<LossCategory, 'id'>) => void;
  onEditLossCategory?: (loss: LossCategory) => void;
  onDeleteLossCategory: (lossId: string) => void;
  onClearMatrix?: () => void;
  onOpenIntegratedBC?: (processId?: string, lossId?: string, deploymentId?: string) => void;
}

export const MatrixAView: React.FC<MatrixAViewProps> = ({
  processes,
  losses,
  matrixA,
  causalDeployments = [],
  onUpdateCellValue,
  onAddProcess,
  onEditProcess,
  onDeleteProcess,
  onAddLossCategory,
  onEditLossCategory,
  onDeleteLossCategory,
  onClearMatrix,
  onOpenIntegratedBC,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals state
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<ProcessArea | null>(null);

  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [editingLoss, setEditingLoss] = useState<LossCategory | null>(null);

  // Confirmation modal for deleting items
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'process' | 'loss' | 'clear';
    id?: string;
    name?: string;
  } | null>(null);

  // Group processes by Plant Section
  const plantSections: string[] = Array.from(new Set(processes.map((p) => p.plantSection)));

  // Filtered processes based on selected section and search
  const filteredProcesses = processes.filter((proc) => {
    const matchesSection = selectedSection === 'ALL' || proc.plantSection === selectedSection;
    const matchesSearch =
      proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  // Group filtered processes by Section for multi-level table header
  const sectionGroups = plantSections
    .map((sectionName) => {
      const procs = filteredProcesses.filter((p) => p.plantSection === sectionName);
      return {
        sectionName,
        processes: procs,
      };
    })
    .filter((g) => g.processes.length > 0);

  // Cell lookup helper: (processId_lossId) -> number value
  const matrixAMap = new Map<string, number>();
  matrixA.forEach((cell) => {
    matrixAMap.set(`${cell.processId}_${cell.lossId}`, cell.value);
  });

  // Causal Deployments map for rapid link to Matriz B & C
  const causalDeploymentMap = useMemo(() => {
    const map = new Map<string, CausalDeployment>();
    (causalDeployments || []).forEach((dep) => {
      map.set(`${dep.originProcessId}_${dep.lossId}`, dep);
    });
    return map;
  }, [causalDeployments]);

  // Calculate statistics
  let countCritical = 0; // Level 3
  let countModerate = 0; // Level 2
  let countLow = 0; // Level 1
  matrixA.forEach((cell) => {
    if (cell.value === 3 || cell.value > 10) countCritical++;
    else if (cell.value === 2 || (cell.value > 2 && cell.value <= 10)) countModerate++;
    else if (cell.value === 1 || (cell.value > 0 && cell.value <= 2)) countLow++;
  });

  // Fast cell click toggle: 0 -> 1 -> 2 -> 3 -> 0
  const handleCellClick = (processId: string, lossId: string) => {
    const current = matrixAMap.get(`${processId}_${lossId}`) || 0;
    let nextVal = 1;
    if (current === 1) nextVal = 2;
    else if (current === 2) nextVal = 3;
    else if (current === 3) nextVal = 0;
    else if (current === 0) nextVal = 1;
    else nextVal = 0; // if it was another number, reset to 0

    onUpdateCellValue(processId, lossId, nextVal);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Tipo de Perda', 'Categoria', 'Código', 'Perda', 'C/R', 'Pilar', ...filteredProcesses.map((p) => `"${p.plantSection} - ${p.name}"`)];
    const rows = losses.map((loss) => [
      `"${loss.lossType || '01. EQUIPAMENTOS'}"`,
      `"${loss.category || '1.1 - TEMPO OCIOSO'}"`,
      loss.code,
      `"${loss.name}"`,
      loss.causeResult || 'C/R',
      loss.pillar || 'FI',
      ...filteredProcesses.map((p) => (matrixAMap.get(`${p.id}_${loss.id}`) || 0).toString()),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WCM_Matriz_A_Qualitativa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'process' && deleteConfirm.id) {
      onDeleteProcess(deleteConfirm.id);
    } else if (deleteConfirm.type === 'loss' && deleteConfirm.id) {
      onDeleteLossCategory(deleteConfirm.id);
    } else if (deleteConfirm.type === 'clear' && onClearMatrix) {
      onClearMatrix();
    }
    setDeleteConfirm(null);
  };

  // Color mapper for section headers
  const getSectionHeaderStyle = (section: string) => {
    const s = section.toLowerCase();
    if (s.includes('emb') || s.includes('env')) {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    if (s.includes('bio') || s.includes('reator')) {
      return 'bg-sky-100 text-sky-900 border-sky-300';
    }
    if (s.includes('prep') || s.includes('mist')) {
      return 'bg-indigo-100 text-indigo-900 border-indigo-300';
    }
    return 'bg-blue-100 text-blue-900 border-blue-300';
  };

  return (
    <div className="space-y-4 w-full">
      {/* Excel Title Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 border border-blue-500/40 rounded-2xl p-5 shadow-lg shadow-blue-500/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white font-bold text-xs border border-white/30 uppercase tracking-wider backdrop-blur-xs">
                Passo 1 do Cost Deployment
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                MATRIZ A QUALITATIVA - COST DEPLOYMENT
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 mt-1.5">
              Mapeamento visual das perdas por tipo, categoria, causalidade (C/R), pilar e equipamento fabril.
            </p>
          </div>

          {/* Top Actions & Quick Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Add Process */}
            <button
              onClick={() => {
                setEditingProcess(null);
                setIsProcessModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Equipamento</span>
            </button>

            {/* Add Loss */}
            <button
              onClick={() => {
                setEditingLoss(null);
                setIsLossModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl text-xs font-bold shadow transition-all active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Perda</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl text-xs font-bold shadow transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Exportar CSV</span>
            </button>

            {/* Clear values */}
            {onClearMatrix && (
              <button
                onClick={() => setDeleteConfirm({ type: 'clear', name: 'todas as pontuações da Matriz A' })}
                className="p-2 bg-white/10 hover:bg-rose-600 text-white rounded-xl text-xs border border-white/20 transition-colors cursor-pointer"
                title="Zerar todas as células da Matriz A"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Legend and Filter Bar */}
        <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Visual Legend */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-blue-100 font-bold uppercase text-[11px] tracking-wider">
              Legenda de Gravidade:
            </span>
            <div className="flex items-center space-x-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-lg font-bold shadow-xs text-xs">
              <span>1</span>
              <span className="text-[11px] font-medium opacity-90">= Baixa / Sem Perda Crítica ({countLow})</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-black shadow-xs text-xs">
              <span>2</span>
              <span className="text-[11px] font-bold opacity-90">= Média Perda ({countModerate})</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-rose-600 text-white px-2.5 py-1 rounded-lg font-extrabold shadow-xs text-xs">
              <span>3</span>
              <span className="text-[11px] font-medium opacity-90">= Alta / Perda Crítica ({countCritical})</span>
            </div>
            <span className="text-[11px] text-blue-100 italic hidden sm:inline">
              (💡 Clique na célula para alternar instantaneamente: 1 ➔ 2 ➔ 3 ➔ 0)
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-white/30 shadow-xs">
              <Filter className="w-3.5 h-3.5 text-blue-300" />
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer font-semibold"
              >
                <option value="ALL" className="bg-slate-900 text-white">Todos os Setores ({plantSections.length})</option>
                {plantSections.map((sec) => (
                  <option key={sec} value={sec} className="bg-slate-900 text-white">
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-white/30 shadow-xs">
              <Search className="w-3.5 h-3.5 text-blue-300" />
              <input
                type="text"
                placeholder="Buscar perda/equipamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none w-36 sm:w-48 placeholder-slate-400 font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Matrix Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[750px] relative custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse font-sans">
            {/* Top Multi-Level Header */}
            <thead className="sticky top-0 z-30 shadow-xs">
              {/* Row 1: Left Categories + Section Headers */}
              <tr className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white border-b border-blue-950">
                <th
                  colSpan={5}
                  className="py-3 px-4 font-black uppercase text-xs tracking-wider sticky left-0 z-40 bg-blue-900 border-r-2 border-blue-700 shadow-md"
                >
                  ESTRUTURAÇÃO DAS PERDAS WCM
                </th>
                {sectionGroups.map((group) => (
                  <th
                    key={group.sectionName}
                    colSpan={group.processes.length}
                    className={`py-2.5 px-3 text-center font-black uppercase text-xs border-r-2 border-blue-700 ${getSectionHeaderStyle(
                      group.sectionName
                    )}`}
                  >
                    {group.sectionName}
                  </th>
                ))}
                <th className="py-3 px-3 text-center bg-blue-950 text-blue-200 font-bold border-l border-blue-800">
                  Ações
                </th>
              </tr>

              {/* Row 2: Sub-headers (Tipo, Categoria, Perda, C/R, Pilar + Equipamentos) */}
              <tr className="bg-slate-100 text-slate-800 border-b-2 border-slate-300 text-[11px] font-extrabold">
                {/* 1. Tipo de Perda */}
                <th className="py-3 px-3 w-[150px] min-w-[150px] sticky left-0 z-40 bg-slate-100 border-r border-slate-300">
                  TIPO DE PERDA
                </th>

                {/* 2. Categoria */}
                <th className="py-3 px-3 w-[270px] min-w-[270px] max-w-[270px] sticky left-[150px] z-40 bg-slate-100 border-r border-slate-300">
                  CATEGORIA
                </th>

                {/* 3. Perda */}
                <th className="py-3 px-3 w-[220px] min-w-[220px] sticky left-[420px] z-40 bg-slate-100 border-r border-slate-300">
                  PERDA
                </th>

                {/* 4. C/R */}
                <th className="py-3 px-2 w-[65px] min-w-[65px] text-center sticky left-[640px] z-40 bg-slate-100 border-r border-slate-300">
                  C/R
                </th>

                {/* 5. Pilar */}
                <th className="py-3 px-2 w-[85px] min-w-[85px] text-center sticky left-[705px] z-40 bg-slate-100 border-r-2 border-slate-300 shadow-md">
                  PILAR
                </th>

                {/* Process / Equipment Columns */}
                {filteredProcesses.map((proc) => (
                  <th
                    key={proc.id}
                    className="py-3 px-2.5 min-w-[130px] max-w-[160px] text-center border-r border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group relative"
                  >
                    <div className="font-extrabold text-slate-900 text-[11px] leading-tight break-words uppercase" title={proc.name}>
                      {proc.name}
                    </div>
                    <div className="font-mono text-[10px] text-blue-700 font-bold mt-0.5">
                      {proc.code}
                    </div>
                    {onEditProcess && (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-1 mt-1">
                        <button
                          onClick={() => {
                            setEditingProcess(proc);
                            setIsProcessModalOpen(true);
                          }}
                          className="p-0.5 text-slate-400 hover:text-blue-600 cursor-pointer"
                          title="Editar Equipamento"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        {onDeleteProcess && (
                          <button
                            onClick={() => setDeleteConfirm({ type: 'process', id: proc.id, name: proc.name })}
                            className="p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Excluir Equipamento"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </th>
                ))}

                {/* Action Col */}
                <th className="py-3 px-2 text-center bg-slate-100 text-slate-600 font-bold min-w-[60px]">
                  Editar
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 bg-white">
              {losses.map((loss, idx) => {
                const lossTypeVal = loss.lossType || '01. EQUIPAMENTOS';
                const categoryVal = loss.category || '1.1 - TEMPO OCIOSO DO EQUIPAMENTO';
                const pillarInfo = PILLAR_INFO[loss.pillar || 'FI'];

                return (
                  <tr key={loss.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* 1. Tipo de Perda */}
                    <td className="py-2.5 px-3 font-bold text-slate-900 sticky left-0 z-20 bg-slate-50 group-hover:bg-blue-50/50 border-r border-slate-200 text-xs w-[150px] min-w-[150px] max-w-[150px] whitespace-normal break-words leading-tight">
                      {lossTypeVal}
                    </td>

                    {/* 2. Categoria */}
                    <td
                      className="py-2.5 px-3 font-semibold text-slate-700 sticky left-[150px] z-20 bg-slate-50/70 group-hover:bg-blue-50/50 border-r border-slate-200 text-xs w-[270px] min-w-[270px] max-w-[270px] whitespace-normal break-words leading-tight"
                      title={categoryVal}
                    >
                      {categoryVal}
                    </td>

                    {/* 3. Perda */}
                    <td className="py-2.5 px-3 font-bold text-slate-900 sticky left-[420px] z-20 bg-white group-hover:bg-blue-50/50 border-r border-slate-200 text-xs w-[220px] min-w-[220px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-blue-700 text-[11px] shrink-0 font-extrabold">
                          {loss.code}
                        </span>
                        <span className="whitespace-normal break-words leading-tight text-slate-900" title={loss.name}>
                          {loss.name}
                        </span>
                      </div>
                    </td>

                    {/* 4. C/R */}
                    <td className="py-2.5 px-1.5 text-center sticky left-[640px] z-20 bg-white group-hover:bg-blue-50/50 border-r border-slate-200 w-[65px] min-w-[65px]">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${
                          loss.causeResult === 'C'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : loss.causeResult === 'R'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                        title={
                          loss.causeResult === 'C'
                            ? 'Causal (Causa)'
                            : loss.causeResult === 'R'
                            ? 'Resultante (Efeito)'
                            : 'Causal & Resultante'
                        }
                      >
                        {loss.causeResult || 'C/R'}
                      </span>
                    </td>

                    {/* 5. Pilar */}
                    <td className="py-2.5 px-1.5 text-center sticky left-[705px] z-20 bg-white group-hover:bg-blue-50/50 border-r-2 border-slate-300 shadow-xs w-[85px] min-w-[85px]">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          pillarInfo?.bg || 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {loss.pillar || 'FI'}
                      </span>
                    </td>

                    {/* Process Cells */}
                    {filteredProcesses.map((proc) => {
                      const val = matrixAMap.get(`${proc.id}_${loss.id}`) || 0;
                      const dep = causalDeploymentMap.get(`${proc.id}_${loss.id}`);

                      // Visual styling based on value (1 = Green, 2 = Yellow, 3 = Red)
                      let cellColorClass = 'bg-white text-slate-300 hover:bg-blue-50/40 border-r border-slate-100';
                      if (val === 1) {
                        cellColorClass = 'bg-emerald-50 text-emerald-800 font-black hover:bg-emerald-100 border-r border-emerald-200/60 shadow-xs';
                      } else if (val === 2) {
                        cellColorClass = 'bg-amber-100 text-amber-900 font-black hover:bg-amber-200 border-r border-amber-300/80 shadow-xs';
                      } else if (val === 3 || val > 10) {
                        cellColorClass = 'bg-rose-100 text-rose-900 font-black hover:bg-rose-200 border-r border-rose-300/80 shadow-xs';
                      } else if (val > 0) {
                        cellColorClass = 'bg-emerald-100 text-emerald-900 font-black border-r border-emerald-200';
                      }

                      return (
                        <td
                          key={proc.id}
                          onClick={() => handleCellClick(proc.id, loss.id)}
                          className={`py-2 px-1.5 text-center cursor-pointer transition-colors select-none ${cellColorClass} relative`}
                          title={`Clique para alternar (Atual: ${val}). Equipamento: ${proc.name} | Perda: ${loss.name}`}
                        >
                          <span className="text-sm font-extrabold">
                            {val > 0 ? (val > 3 ? 3 : val) : '-'}
                          </span>

                          {/* Link indicator with Matriz B+C */}
                          {dep && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onOpenIntegratedBC) onOpenIntegratedBC(proc.id, loss.id, dep.id);
                              }}
                              className="block mx-auto mt-0.5 px-1.5 py-0.5 rounded-md bg-blue-600 hover:bg-blue-700 text-[9px] font-sans font-bold text-white shadow-xs cursor-pointer transition"
                              title={`Abrir Desdobramento B - C: ${dep.rootCauseName}`}
                            >
                              B - C &rarr;
                            </button>
                          )}
                        </td>
                      );
                    })}

                    {/* Row Actions */}
                    <td className="py-2 px-2 text-center bg-white border-l border-slate-200">
                      <div className="flex items-center justify-center space-x-1">
                        {onEditLossCategory && (
                          <button
                            onClick={() => {
                              setEditingLoss(loss);
                              setIsLossModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar Perda"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteLossCategory && (
                          <button
                            onClick={() => setDeleteConfirm({ type: 'loss', id: loss.id, name: loss.name })}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir Perda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer Summary */}
            <tfoot className="sticky bottom-0 z-30 bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-300 shadow-md">
              <tr>
                <td
                  colSpan={5}
                  className="py-3 px-4 uppercase tracking-wider text-slate-900 font-black sticky left-0 z-40 bg-slate-100 border-r-2 border-slate-300 shadow-md text-xs"
                >
                  TOTAL DE PERDAS CRÍTICAS (NÍVEL 3)
                </td>
                {filteredProcesses.map((proc) => {
                  let procCriticalCount = 0;
                  losses.forEach((l) => {
                    const v = matrixAMap.get(`${proc.id}_${l.id}`) || 0;
                    if (v === 3 || v > 10) procCriticalCount++;
                  });

                  return (
                    <td
                      key={proc.id}
                      className="py-3 px-2 text-center border-r border-slate-200 font-mono font-extrabold text-sm text-slate-900"
                    >
                      {procCriticalCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white font-bold shadow-xs">
                          {procCriticalCount}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="py-3 px-2 text-center text-slate-400 text-[10px]">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ProcessModal
        isOpen={isProcessModalOpen}
        onClose={() => {
          setIsProcessModalOpen(false);
          setEditingProcess(null);
        }}
        onSave={(procData) => {
          if ('id' in procData && onEditProcess) {
            onEditProcess(procData as ProcessArea);
          } else {
            onAddProcess(procData);
          }
        }}
        initialData={editingProcess}
        existingSections={plantSections}
      />

      <LossModal
        isOpen={isLossModalOpen}
        onClose={() => {
          setIsLossModalOpen(false);
          setEditingLoss(null);
        }}
        onSave={(lossData) => {
          if ('id' in lossData && onEditLossCategory) {
            onEditLossCategory(lossData as LossCategory);
          } else {
            onAddLossCategory(lossData);
          }
        }}
        initialData={editingLoss}
        existingLossTypes={Array.from(new Set(losses.map((l) => l.lossType || '01. EQUIPAMENTOS')))}
        existingCategories={Array.from(new Set(losses.map((l) => l.category || '1.1 - TEMPO OCIOSO DO EQUIPAMENTO')))}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirmar Exclusão</h3>
                <p className="text-xs text-slate-400">Esta ação atualizará as Matrizes A, B e C</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Deseja realmente excluir{' '}
              {deleteConfirm.type === 'process' && 'o equipamento/processo '}
              {deleteConfirm.type === 'loss' && 'a perda '}
              {deleteConfirm.type === 'clear' && 'zerar '}
              <strong className="text-white">"{deleteConfirm.name}"</strong>?
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmar Exclusão</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
