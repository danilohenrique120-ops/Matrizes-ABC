import React, { useState, useEffect } from 'react';
import {
  CausalDeployment,
  ImpactedStage,
  ProcessArea,
  LossCategory,
  WCMPillar,
  FinancialParameters,
} from '../types/wcm';
import {
  X,
  Plus,
  Trash2,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { formatCurrency, PILLAR_INFO } from '../utils/calculations';
import {
  WCM_ROOT_CAUSES_CATEGORIZED,
  ALL_WCM_ROOT_CAUSES,
} from '../data/wcmRootCauses';

interface CausalDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deployment: Omit<CausalDeployment, 'id'> | CausalDeployment) => void;
  deploymentToEdit?: CausalDeployment | null;
  processes: ProcessArea[];
  losses: LossCategory[];
  financialParams: FinancialParameters;
}

export const CausalDeploymentModal: React.FC<CausalDeploymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  deploymentToEdit,
  processes,
  losses,
  financialParams,
}) => {
  const [originProcessId, setOriginProcessId] = useState<string>('');
  const [lossId, setLossId] = useState<string>('');
  const [standardTimeValue, setStandardTimeValue] = useState<string>('15');
  const [standardTimeUnit, setStandardTimeUnit] = useState<'min' | 'h' | 's'>('min');
  const [standardTimeMin, setStandardTimeMin] = useState<number>(15);
  const [rootCauseName, setRootCauseName] = useState<string>('');
  const [rootCauseCode, setRootCauseCode] = useState<string>('C01');
  const [pillar, setPillar] = useState<WCMPillar>('FI');
  const [category, setCategory] = useState<string>('Movimentação Desnecessária & Método');
  const [notes, setNotes] = useState<string>('');

  const [stages, setStages] = useState<ImpactedStage[]>([
    { id: 'stg_1', stageName: 'Setup', isStop: true, durationHours: 0.33333, operatorCount: 1 },
    { id: 'stg_2', stageName: 'Formulação', isStop: true, durationHours: 0.33333, operatorCount: 1 },
    { id: 'stg_3', stageName: 'Inoculação', isStop: true, durationHours: 0.33333, operatorCount: 1 },
    { id: 'stg_4', stageName: 'Cultivo', isStop: true, durationHours: 0.33333, operatorCount: 1 },
  ]);

  const [error, setError] = useState<string | null>(null);

  // Recalculates normalized standardTimeMin whenever value or unit changes
  const handleStandardTimeChange = (valStr: string, unit: 'min' | 'h' | 's' = standardTimeUnit) => {
    setStandardTimeValue(valStr);
    setStandardTimeUnit(unit);

    const num = parseFloat(valStr.replace(',', '.')) || 0;
    let min = num;
    if (unit === 'h') min = num * 60;
    if (unit === 's') min = num / 60;
    setStandardTimeMin(min);
  };

  useEffect(() => {
    if (deploymentToEdit) {
      setOriginProcessId(deploymentToEdit.originProcessId);
      setLossId(deploymentToEdit.lossId);
      setStandardTimeValue(
        deploymentToEdit.standardTimeValue !== undefined
          ? String(deploymentToEdit.standardTimeValue)
          : deploymentToEdit.standardTimeMin !== undefined
          ? String(deploymentToEdit.standardTimeMin)
          : '15'
      );
      setStandardTimeUnit(deploymentToEdit.standardTimeUnit || 'min');
      setStandardTimeMin(deploymentToEdit.standardTimeMin ?? 15);
      setRootCauseName(deploymentToEdit.rootCauseName);
      setRootCauseCode(deploymentToEdit.rootCauseCode || 'C01');
      setPillar(deploymentToEdit.pillar || 'FI');
      setCategory(deploymentToEdit.category || '');
      setNotes(deploymentToEdit.notes || '');
      setStages(
        deploymentToEdit.impactedStages && deploymentToEdit.impactedStages.length > 0
          ? [...deploymentToEdit.impactedStages]
          : [{ id: `stg_${Date.now()}`, stageName: 'Etapa Principal', isStop: true, durationHours: 0.5, operatorCount: 1 }]
      );
    } else {
      setOriginProcessId(processes[0]?.id || '');
      setLossId(losses[0]?.id || '');
      setStandardTimeValue('15');
      setStandardTimeUnit('min');
      setStandardTimeMin(15);
      setRootCauseName('');
      setRootCauseCode(`C0${Math.floor(Math.random() * 8) + 1}`);
      setPillar('FI');
      setCategory('Movimentação & Método');
      setNotes('');
      setStages([
        { id: `stg_${Date.now()}_1`, stageName: 'Setup', isStop: true, durationHours: 0.33333, operatorCount: 1 },
        { id: `stg_${Date.now()}_2`, stageName: 'Formulação', isStop: true, durationHours: 0.33333, operatorCount: 1 },
        { id: `stg_${Date.now()}_3`, stageName: 'Inoculação', isStop: true, durationHours: 0.33333, operatorCount: 1 },
        { id: `stg_${Date.now()}_4`, stageName: 'Cultivo', isStop: true, durationHours: 0.33333, operatorCount: 1 },
      ]);
    }
    setError(null);
  }, [deploymentToEdit, isOpen, processes, losses]);

  if (!isOpen) return null;

  const handleAddStage = () => {
    setStages([
      ...stages,
      {
        id: `stg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        stageName: '',
        isStop: true,
        durationHours: 0.25,
        operatorCount: 1,
      },
    ]);
  };

  const handleRemoveStage = (id: string) => {
    if (stages.length <= 1) {
      setError('O desdobramento precisa de pelo menos 1 etapa impactada.');
      return;
    }
    setStages(stages.filter((s) => s.id !== id));
  };

  const handleStageChange = (id: string, field: keyof ImpactedStage, value: any) => {
    setStages(
      stages.map((s) => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  // Calculate live preview
  const hourlyLaborRate = financialParams.hourlyLaborRate || 100.0;
  const electricityRate = financialParams.electricityCostPerKWh || 0.70;

  let previewLaborCost = 0;
  let previewEnergyCost = 0;
  let previewTotalHours = 0;

  stages.forEach((stg) => {
    const dur = Number(stg.durationHours) || 0;
    const ops = Number(stg.operatorCount) || 0;
    previewLaborCost += dur * ops * hourlyLaborRate;
    previewEnergyCost += dur * electricityRate;
    previewTotalHours += dur;
  });

  const previewTotalCost = previewLaborCost + previewEnergyCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!originProcessId) {
      setError('Selecione o Equipamento / Processo de Origem.');
      return;
    }
    if (!lossId) {
      setError('Selecione a Perda associada.');
      return;
    }
    if (!rootCauseName.trim()) {
      setError('Informe a descrição da Causa Raiz.');
      return;
    }
    if (stages.length === 0) {
      setError('Adicione pelo menos uma etapa do fluxo impactada.');
      return;
    }

    const hasEmptyStage = stages.some((s) => !s.stageName.trim());
    if (hasEmptyStage) {
      setError('Preencha o nome de todas as etapas impactadas.');
      return;
    }

    const payload = {
      ...(deploymentToEdit ? { id: deploymentToEdit.id } : {}),
      originProcessId,
      lossId,
      standardTimeMin: Number(standardTimeMin) || 0,
      standardTimeValue: standardTimeValue.trim(),
      standardTimeUnit,
      standardTimeText: standardTimeValue.trim()
        ? `${standardTimeValue.trim()} ${standardTimeUnit}`
        : `${standardTimeMin} min`,
      rootCauseName: rootCauseName.trim().toUpperCase(),
      rootCauseCode: rootCauseCode.trim().toUpperCase(),
      pillar,
      category: category.trim(),
      notes: notes.trim(),
      impactedStages: stages.map((s) => ({
        ...s,
        stageName: s.stageName.trim(),
        durationHours: Number(s.durationHours) || 0,
        operatorCount: Number(s.operatorCount) || 1,
      })),
    };

    onSave(payload as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900/50 to-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {deploymentToEdit ? 'Editar Desdobramento Causa-Efeito' : 'Novo Desdobramento Causal (Matriz B/C)'}
              </h3>
              <p className="text-xs text-slate-400">
                Mapeamento do Equipamento de Origem, Perda, Causa-Raiz e Etapas Impactadas com cálculo em R$
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Origem e Perda */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Equipamento / Processo de Origem *
              </label>
              <select
                value={originProcessId}
                onChange={(e) => setOriginProcessId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              >
                {processes.map((proc) => (
                  <option key={proc.id} value={proc.id}>
                    {proc.code} - {proc.name} ({proc.plantSection})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Perda Mapeada *
              </label>
              <select
                value={lossId}
                onChange={(e) => setLossId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                required
              >
                {losses.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.code} - {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Tempo Padrão / Esperado
                </label>
                <span className="text-[10px] text-blue-400 font-semibold">
                  Padrão: min
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <input
                  type="text"
                  inputMode="decimal"
                  value={standardTimeValue}
                  onChange={(e) => handleStandardTimeChange(e.target.value)}
                  placeholder="Ex: 15 ou 0.25"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
                />
                <select
                  value={standardTimeUnit}
                  onChange={(e) => handleStandardTimeChange(standardTimeValue, e.target.value as 'min' | 'h' | 's')}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-blue-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  title="Unidade de medida padrão para cálculos"
                >
                  <option value="min">min (Minutos)</option>
                  <option value="h">h (Horas)</option>
                  <option value="s">s (Segundos)</option>
                </select>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Cálculos: <strong className="text-blue-300">{standardTimeMin.toFixed(2)} min</strong> ({(standardTimeMin / 60).toFixed(4)} h)
              </p>
            </div>
          </div>

          {/* Causa Raiz e Pilar WCM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Causa Raiz Geradora (Taxonomia WCM) *
              </label>
              <select
                value={rootCauseName}
                onChange={(e) => {
                  const val = e.target.value;
                  setRootCauseName(val);
                  if (val.startsWith('4.')) setPillar('ENV');
                  else if (val.startsWith('5.')) setPillar('EEM');
                  else if (val.startsWith('6.')) setPillar('LOG');
                  else if (val.includes('QUALIDADE') || val.includes('SUCATA') || val.includes('RETRABALHO')) setPillar('QC');
                  else if (val.startsWith('1.1.1 ') || val.includes('MANUTENÇÃO') || val.includes('PEÇA DE MANUTENÇÃO')) setPillar('PM');
                  else if (val.includes('LIMPEZA') || val.includes('ATIVIDADES AUTÔNOMAS')) setPillar('AM');
                  else if (val.startsWith('2.') || val.includes('SETUP') || val.includes('AJUSTES') || val.includes('MICROPARADA')) setPillar('FI');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                required
              >
                {!ALL_WCM_ROOT_CAUSES.includes(rootCauseName) && rootCauseName && (
                  <option value={rootCauseName}>{rootCauseName} (Atual)</option>
                )}
                <option value="" disabled>-- Selecione da Lista WCM ({ALL_WCM_ROOT_CAUSES.length} opções) --</option>
                {WCM_ROOT_CAUSES_CATEGORIZED.map((cat) => (
                  <optgroup key={cat.category} label={cat.category} className="bg-slate-900 text-slate-300 font-bold">
                    {cat.items.map((item) => (
                      <option key={item} value={item} className="bg-slate-800 text-white font-normal py-1">
                        {item}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pilar WCM Responsável *
              </label>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as WCMPillar)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="FI">FI - Melhoria Focada</option>
                <option value="PM">PM - Manutenção Planejada</option>
                <option value="AM">AM - Manutenção Autônoma</option>
                <option value="QC">QC - Controle de Qualidade</option>
                <option value="ENV">ENV - Energia & Meio Ambiente</option>
                <option value="LOG">LOG - Logística & Fluxo</option>
                <option value="E&T">E&T - Educação & Treinamento</option>
                <option value="PD">PD - Desenvolvimento de Pessoas</option>
                <option value="SE">SE - Segurança & Saúde</option>
              </select>
            </div>
          </div>

          {/* Categoria e Notas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoria / Método
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Movimentação Desnecessária, Falha de Componente"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Código da Causa (Identificador)
              </label>
              <input
                type="text"
                value={rootCauseCode}
                onChange={(e) => setRootCauseCode(e.target.value)}
                placeholder="Ex: C01, C02"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* ETAPAS IMPACTADAS (Interpretação Excel Matriz B) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Etapas / Processos Impactados no Fluxo</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {stages.length} etapas
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Descreva as etapas do processo que sofrem atraso, parada ou consumo de recursos devido a esta causa
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddStage}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adicionar Etapa</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2 px-3">Etapa Impactada</th>
                    <th className="py-2 px-3 text-center">Gera Parada?</th>
                    <th className="py-2 px-3">Tempo / Duração (Horas)</th>
                    <th className="py-2 px-3">Nº Operadores</th>
                    <th className="py-2 px-3 text-right">Custo Estimado</th>
                    <th className="py-2 px-2 text-center w-10">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {stages.map((stg, index) => {
                    const stageLabor = (Number(stg.durationHours) || 0) * (Number(stg.operatorCount) || 0) * hourlyLaborRate;
                    const stageEnergy = (Number(stg.durationHours) || 0) * electricityRate;
                    const stageTotal = stageLabor + stageEnergy;

                    return (
                      <tr key={stg.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            value={stg.stageName}
                            onChange={(e) => handleStageChange(stg.id, 'stageName', e.target.value)}
                            placeholder="Ex: Setup, Formulação, Cultivo..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                            required
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleStageChange(stg.id, 'isStop', !stg.isStop)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border ${
                              stg.isStop
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {stg.isStop ? 'Sim' : 'Não'}
                          </button>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="number"
                              step="0.00001"
                              min="0"
                              value={stg.durationHours}
                              onChange={(e) => handleStageChange(stg.id, 'durationHours', parseFloat(e.target.value) || 0)}
                              className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-blue-500"
                              required
                            />
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({(Number(stg.durationHours) * 60).toFixed(0)} min)
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            min="1"
                            max="20"
                            step="1"
                            value={stg.operatorCount}
                            onChange={(e) => handleStageChange(stg.id, 'operatorCount', parseInt(e.target.value, 10) || 1)}
                            className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                            required
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                          {formatCurrency(stageTotal)}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveStage(stg.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Remover Etapa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Subtotal Preview Card */}
            <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-4 text-xs">
                <div>
                  <span className="text-slate-400">Tempo Total: </span>
                  <span className="font-bold text-amber-400 font-mono">{previewTotalHours.toFixed(2)}h</span>
                  <span className="text-slate-500 font-mono text-[11px]"> ({(previewTotalHours * 60).toFixed(0)} min)</span>
                </div>
                <div>
                  <span className="text-slate-400">Mão de Obra (R$ 100/h): </span>
                  <span className="font-bold text-blue-400 font-mono">{formatCurrency(previewLaborCost)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Energia (R$ 0,70/h): </span>
                  <span className="font-bold text-yellow-400 font-mono">{formatCurrency(previewEnergyCost)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300 font-semibold">Custo Total Deste Desdobramento:</span>
                <span className="text-base font-black text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                  {formatCurrency(previewTotalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              {deploymentToEdit ? 'Salvar Alterações' : 'Criar Desdobramento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
