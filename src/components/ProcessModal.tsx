import React, { useState, useEffect } from 'react';
import { ProcessArea } from '../types/wcm';
import { X, Factory, Check, AlertCircle } from 'lucide-react';

interface ProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (process: Omit<ProcessArea, 'id'> | ProcessArea) => void;
  initialData?: ProcessArea | null;
  existingSections?: string[];
}

export const ProcessModal: React.FC<ProcessModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingSections = ['Processamento', 'Envase', 'Embalagem', 'Utilidades', 'Logística'],
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [plantSection, setPlantSection] = useState('Processamento');
  const [customSection, setCustomSection] = useState('');
  const [isCustomSection, setIsCustomSection] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setDescription(initialData.description || '');
      if (existingSections.includes(initialData.plantSection)) {
        setPlantSection(initialData.plantSection);
        setIsCustomSection(false);
        setCustomSection('');
      } else {
        setPlantSection('CUSTOM');
        setIsCustomSection(true);
        setCustomSection(initialData.plantSection || '');
      }
    } else {
      setName('');
      setCode('');
      setPlantSection(existingSections[0] || 'Processamento');
      setIsCustomSection(false);
      setCustomSection('');
      setDescription('');
    }
    setError('');
  }, [initialData, isOpen, existingSections]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do processo / equipamento é obrigatório.');
      return;
    }

    const finalSection = isCustomSection ? customSection.trim() || 'Geral' : plantSection;

    if (initialData) {
      onSave({
        ...initialData,
        name: name.trim(),
        code: code.trim() || initialData.code,
        plantSection: finalSection,
        description: description.trim(),
      });
    } else {
      onSave({
        name: name.trim(),
        code: code.trim() || `P_${Date.now().toString().slice(-4)}`,
        plantSection: finalSection,
        description: description.trim(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Editar Processo / Equipamento' : 'Novo Processo / Equipamento'}
              </h2>
              <p className="text-xs text-slate-400">
                {initialData
                  ? 'Atualize os dados e a seção fabril do equipamento'
                  : 'Cadastre uma nova área fabril ou linha para mapeamento de perdas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-center space-x-2 text-rose-300 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1 space-y-1">
              <label className="text-slate-300 font-semibold block">
                Código <span className="text-slate-500">(ex: P01)</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="P01"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-300 font-semibold block">
                Nome do Processo / Máquina <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Misturador Principal 01"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">
              Seção / Setor da Fábrica
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={isCustomSection ? 'CUSTOM' : plantSection}
                onChange={(e) => {
                  if (e.target.value === 'CUSTOM') {
                    setIsCustomSection(true);
                  } else {
                    setIsCustomSection(false);
                    setPlantSection(e.target.value);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                {existingSections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
                <option value="CUSTOM">+ Outra Seção Personalizada</option>
              </select>

              {isCustomSection && (
                <input
                  type="text"
                  value={customSection}
                  onChange={(e) => setCustomSection(e.target.value)}
                  placeholder="Nome da nova seção..."
                  className="w-full bg-slate-950 border border-blue-500 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
                />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">
              Descrição / Observações Técnicas
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Equipamento responsável pelo lote inicial, trabalha em 3 turnos..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Footer actions */}
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Salvar Alterações' : 'Cadastrar Processo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
