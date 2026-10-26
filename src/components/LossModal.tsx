import React, { useState, useEffect } from 'react';
import { LossCategory, LossUnit, CauseResultType } from '../types/wcm';
import { X, Layers, Check, AlertCircle, Sparkles } from 'lucide-react';

interface LossModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (loss: Omit<LossCategory, 'id'> | LossCategory) => void;
  initialData?: LossCategory | null;
  existingLossTypes?: string[];
  existingCategories?: string[];
}

export const LossModal: React.FC<LossModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingLossTypes = [
    '01. EQUIPAMENTOS',
    '02. MÃO DE OBRA',
    '03. MATERIAL',
    '04. MEIO AMBIENTE',
    '05. ENERGIA',
    '06. LOGÍSTICA',
  ],
  existingCategories = [
    '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    '1.2 - DESEMPENHO DO EQUIPAMENTO',
    '1.3 - DEFEITO DO EQUIPAMENTO',
    '2.1 - TEMPO PERDIDO DE PRODUÇÃO',
    '2.2 - ORGANIZAÇÃO DA LINHA',
    '2.3 - QUALIDADE',
    '2.4 - EFICIÊNCIA DA ÁREA',
    '2.5 - DEFEITO LABORAL',
    '2.6 - OPORTUNIDADE DE TRABALHO',
    '2.7 - PERDA DE MANUTENÇÃO',
    '2.8 - GESTÃO E PERDA ADMINISTRATIVA',
    '3.1 - MATERIAL DIRETO',
    '3.2 - MATERIAL INDIRETO',
    '4.1 - RESÍDUOS AMBIENTAIS',
    '4.2 - QUÍMICOS AMBIENTAIS',
    '4.3 - ÁGUA AMBIENTAL',
    '4.4 - EMISSÃO DE AR AMBIENTAL',
    '4.5 - EFLUENTES LÍQUIDOS AMBIENTAIS',
    '4.6 - PREVENÇÃO AMBIENTAL',
    '4.7 - GESTÃO DE EMERGÊNCIAS AMBIENTAIS',
    '5.1 - ENERGIA ELÉTRICA',
    '6.1 - PERDA DE MANUSEIO DE MATERIAIS',
    '6.2 - PERDA DE INVENTÁRIO',
    '6.3 - PERDA DE ESPAÇO',
  ],
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [lossType, setLossType] = useState('01. EQUIPAMENTOS');
  const [category, setCategory] = useState('1.1 - TEMPO OCIOSO DO EQUIPAMENTO');
  const [causeResult, setCauseResult] = useState<CauseResultType>('C/R');
  const [pillar, setPillar] = useState('FI');
  const [unit, setUnit] = useState<LossUnit>('horas');
  const [wcmType, setWcmType] = useState<LossCategory['wcmType']>('Disponibilidade');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setLossType(initialData.lossType || '01. EQUIPAMENTOS');
      setCategory(initialData.category || '1.1 - TEMPO OCIOSO DO EQUIPAMENTO');
      setCauseResult(initialData.causeResult || 'C/R');
      setPillar(initialData.pillar || 'FI');
      setUnit(initialData.unit || 'horas');
      setWcmType(initialData.wcmType || 'Disponibilidade');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setCode('');
      setLossType('01. EQUIPAMENTOS');
      setCategory('1.1 - TEMPO OCIOSO DO EQUIPAMENTO');
      setCauseResult('C/R');
      setPillar('FI');
      setUnit('horas');
      setWcmType('Disponibilidade');
      setDescription('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome da perda é obrigatório.');
      return;
    }

    const payload = {
      code: code.trim() || '1.1.X',
      name: name.trim().toUpperCase(),
      lossType: lossType.trim() || '01. EQUIPAMENTOS',
      category: category.trim() || '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
      causeResult,
      pillar: pillar.trim() || 'FI',
      unit,
      wcmType,
      description: description.trim(),
      costDrivers: initialData?.costDrivers || {
        useLabor: true,
        useMachineOverhead: true,
        useMaterial: true,
        useElectricity: true,
        useWaterSteam: true,
        useMaintenance: true,
        customMultiplier: 1.0,
      },
    };

    if (initialData?.id) {
      onSave({
        ...payload,
        id: initialData.id,
      });
    } else {
      onSave(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialData ? 'Editar Perda WCM' : 'Nova Perda WCM (Matriz A / B)'}
              </h3>
              <p className="text-xs text-slate-400">
                Defina a hierarquia, classificação Causal/Resultante e pilar responsável
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Loss Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Tipo de Perda</label>
              <input
                type="text"
                list="loss-types-list"
                value={lossType}
                onChange={(e) => setLossType(e.target.value)}
                placeholder="Ex: 01. EQUIPAMENTOS"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <datalist id="loss-types-list">
                {existingLossTypes.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Categoria da Perda</label>
              <input
                type="text"
                list="categories-list"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: 1.1 - TEMPO OCIOSO DO EQUIPAMENTO"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <datalist id="categories-list">
                {existingCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Code, Name, C/R, Pillar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Código</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: 1.1.1"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-slate-300 font-semibold mb-1 block">Nome da Perda *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: QUEBRA, AJUSTES, MICROPARADA, SUCATA"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-indigo-500 uppercase"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Classificação C/R</label>
              <select
                value={causeResult}
                onChange={(e) => setCauseResult(e.target.value as CauseResultType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="C">C - Causal (Causa Geradora)</option>
                <option value="R">R - Resultante (Efeito/Sintoma)</option>
                <option value="C/R">C/R - Causal e Resultante</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Pilar WCM Responsável</label>
              <input
                type="text"
                value={pillar}
                onChange={(e) => setPillar(e.target.value.toUpperCase())}
                placeholder="Ex: AM/PM, FI, FI/QC, PD, LOG, ENV"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Unidade Física</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as LossUnit)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="horas">Horas (Tempo de Parada / Ociosidade)</option>
                <option value="kg">Kg (Matéria-Prima / Refugo)</option>
                <option value="kWh">kWh (Energia Elétrica)</option>
                <option value="m³">m³ (Vapor / Água / Ar)</option>
                <option value="peças">Peças (Unidades Defeituosas)</option>
                <option value="pts">Pontos Qualitativos (1 a 3)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Descrição / Escopo da Perda</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as condições que caracterizam esta perda na fábrica..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Salvar Alterações' : 'Cadastrar Perda'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
