import React, { useState, useEffect } from 'react';
import { RootCause, WCMPillar } from '../types/wcm';
import { X, GitMerge, Check, AlertCircle } from 'lucide-react';
import { PILLAR_INFO } from '../utils/calculations';

interface RootCauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cause: Omit<RootCause, 'id'> | RootCause) => void;
  initialData?: RootCause | null;
}

export const RootCauseModal: React.FC<RootCauseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Equipamento');
  const [wcmPillar, setWcmPillar] = useState<WCMPillar>('PM');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setCategory(initialData.category || 'Equipamento');
      setWcmPillar(initialData.wcmPillar || 'PM');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setCode('');
      setCategory('Equipamento');
      setWcmPillar('PM');
      setDescription('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome da causa raiz é obrigatório.');
      return;
    }

    if (initialData) {
      onSave({
        ...initialData,
        name: name.trim(),
        code: code.trim() || initialData.code,
        category: category.trim(),
        wcmPillar,
        description: description.trim(),
      });
    } else {
      onSave({
        name: name.trim(),
        code: code.trim() || `C_${Date.now().toString().slice(-4)}`,
        category: category.trim(),
        wcmPillar,
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
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialData ? 'Editar Causa Raiz' : 'Nova Causa Raiz (Matriz B)'}
              </h2>
              <p className="text-xs text-slate-400">
                Vincule o fator gerador ao pilar WCM responsável pela tratativa Kaizen
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
                Código <span className="text-slate-500">(ex: C01)</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="C01"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono font-bold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-300 font-semibold block">
                Nome da Causa Raiz <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Desgaste mecânico / Fadiga de rolamento"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-purple-500"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">
                Pilar WCM Responsável
              </label>
              <select
                value={wcmPillar}
                onChange={(e) => setWcmPillar(e.target.value as WCMPillar)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-purple-500"
              >
                {Object.entries(PILLAR_INFO).map(([pillarKey, info]) => (
                  <option key={pillarKey} value={pillarKey}>
                    {pillarKey} - {info.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">
                Categoria / Origem (4M/6M)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-purple-500"
              >
                <option value="Equipamento">Máquina / Equipamento</option>
                <option value="Método / Operação">Método / Operação</option>
                <option value="Condição Básica (5S)">Meio Ambiente / 5S</option>
                <option value="Mão de Obra / Treinamento">Mão de Obra / Competência</option>
                <option value="Material / Fornecedor">Matéria-Prima / Insumo</option>
                <option value="Medição / Ajuste">Medição / Calibração</option>
                <option value="Projeto / Engenharia">Projeto / Instalação</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">
              Descrição Detalhada / Mecanismo da Falha
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Ausência de lubrificação no intervalo especificado ou desgaste prematuro por sobrecarga..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500 resize-none"
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Salvar Alterações' : 'Cadastrar Causa Raiz'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
