import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Check,
  X,
  AlertCircle,
  FolderPlus,
  Pencil,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { PlantArea } from '../types/wcm';

interface NewAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantAreas: PlantArea[];
  currentPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onCreatePlant: (newArea: { name: string; code?: string; description?: string; useTemplate: boolean }) => void;
  onUpdatePlant: (plantId: string, updatedData: { name: string; code?: string; description?: string }) => void;
  onDeletePlant: (plantId: string) => void;
  initialEditingPlantId?: string | null;
}

export const NewAreaModal: React.FC<NewAreaModalProps> = ({
  isOpen,
  onClose,
  plantAreas,
  currentPlantId,
  onSelectPlant,
  onCreatePlant,
  onUpdatePlant,
  onDeletePlant,
  initialEditingPlantId,
}) => {
  // New Area Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);
  const [newAreaError, setNewAreaError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Edit Area State
  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Sync initial editing ID when modal opens
  useEffect(() => {
    if (isOpen && initialEditingPlantId) {
      const target = plantAreas.find((p) => p.id === initialEditingPlantId);
      if (target) {
        startEditing(target);
      }
    } else if (!isOpen) {
      // Reset temporary states
      setEditingPlantId(null);
      setConfirmDeleteId(null);
      setNewAreaError(null);
      setEditError(null);
    }
  }, [isOpen, initialEditingPlantId]);

  if (!isOpen) return null;

  const startEditing = (plant: PlantArea) => {
    setEditingPlantId(plant.id);
    setEditName(plant.name);
    setEditCode(plant.code || '');
    setEditDescription(plant.description || '');
    setEditError(null);
    setConfirmDeleteId(null);
  };

  const cancelEditing = () => {
    setEditingPlantId(null);
    setEditName('');
    setEditCode('');
    setEditDescription('');
    setEditError(null);
  };

  const handleSaveEdit = (plantId: string) => {
    if (!editName.trim()) {
      setEditError('O nome da área ou fábrica não pode ficar em branco.');
      return;
    }

    onUpdatePlant(plantId, {
      name: editName.trim(),
      code: editCode.trim() || undefined,
      description: editDescription.trim() || undefined,
    });

    cancelEditing();
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNewAreaError('Por favor, informe o nome da área ou fábrica.');
      return;
    }

    onCreatePlant({
      name: name.trim(),
      code: code.trim() || undefined,
      description: description.trim() || undefined,
      useTemplate,
    });

    // Reset
    setName('');
    setCode('');
    setDescription('');
    setNewAreaError(null);
    setShowCreateForm(false);
  };

  const handleConfirmDelete = (plantId: string) => {
    onDeletePlant(plantId);
    setConfirmDeleteId(null);
    if (editingPlantId === plantId) {
      cancelEditing();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 border-b border-blue-500/40 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Gerenciamento de Áreas e Fábricas
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Alterne, edite nomes, cadastre ou exclua áreas com matrizes independentes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {/* Top Control: Button to toggle Create Form if hidden */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Áreas Cadastradas ({plantAreas.length})
            </span>
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                if (!showCreateForm) {
                  cancelEditing();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              {showCreateForm ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Ocultar Cadastro</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Nova Área</span>
                </>
              )}
            </button>
          </div>

          {/* Form: Cadastrar Nova Área (Expandable) */}
          {showCreateForm && (
            <form onSubmit={handleCreateSubmit} className="bg-white border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                  <FolderPlus className="w-4 h-4" />
                  <span>Cadastrar Nova Área / Fábrica</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              {newAreaError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-semibold">{newAreaError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Nome da Área / Fábrica <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Fábrica 02 - Usinagem"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (newAreaError) setNewAreaError(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition font-medium"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Código / Sigla
                  </label>
                  <input
                    type="text"
                    placeholder="ex: FAB-02"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Descrição ou Linha Produtiva
                </label>
                <input
                  type="text"
                  placeholder="ex: Linha de montagem e células robóticas"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition font-medium"
                />
              </div>

              {/* Template Initialization Option */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Estrutura Inicial de Dados:
                </span>
                <div className="flex flex-col sm:flex-row gap-3 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="radio"
                      name="templateOption"
                      checked={useTemplate}
                      onChange={() => setUseTemplate(true)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Iniciar com equipamentos e estrutura padrão</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="radio"
                      name="templateOption"
                      checked={!useTemplate}
                      onChange={() => setUseTemplate(false)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Iniciar área em branco (vazia)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar e Ativar Área</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Registered Areas */}
          <div className="space-y-3">
            {plantAreas.map((plant) => {
              const isActive = plant.id === currentPlantId;
              const isEditing = editingPlantId === plant.id;
              const isConfirmingDelete = confirmDeleteId === plant.id;

              return (
                <div
                  key={plant.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-blue-50/60 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* INLINE EDIT MODE */}
                  {isEditing ? (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs">
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar Dados da Área</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {plant.id}</span>
                      </div>

                      {editError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="font-semibold">{editError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">
                            Nome da Área / Fábrica <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => {
                              setEditName(e.target.value);
                              if (editError) setEditError(null);
                            }}
                            className="w-full bg-slate-50 border border-blue-400 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                            placeholder="Nome da área"
                            autoFocus
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">
                            Código / Sigla
                          </label>
                          <input
                            type="text"
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none font-medium"
                            placeholder="ex: FAB-01"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Descrição / Detalhes
                        </label>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none font-medium"
                          placeholder="Descrição opcional"
                        />
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(plant.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Salvar Alterações</span>
                        </button>
                      </div>
                    </div>
                  ) : isConfirmingDelete ? (
                    /* INLINE DELETE CONFIRMATION */
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-start space-x-2.5 text-rose-800">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-rose-900">
                            Excluir permanentemente a área "{plant.name}"?
                          </p>
                          <p className="text-[11px] text-rose-700 mt-0.5 font-medium">
                            Todas as matrizes (A, B, C), perdas e desdobramentos desta área serão excluídos permanentemente.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(plant.id)}
                          className="px-3.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Sim, Excluir Área</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL VIEW CARD */
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {plant.name}
                            </span>
                            {plant.code && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold border border-slate-200">
                                {plant.code}
                              </span>
                            )}
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Ativa
                              </span>
                            )}
                          </div>
                          {plant.description && (
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {plant.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons on card */}
                      <div className="flex items-center space-x-1.5 sm:space-x-2 self-end sm:self-center shrink-0">
                        {/* Ativar botão */}
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectPlant(plant.id);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                            title="Tornar esta área ativa no sistema"
                          >
                            Ativar
                          </button>
                        )}

                        {/* Botão de Editar Nome / Dados */}
                        <button
                          type="button"
                          onClick={() => startEditing(plant)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-semibold transition cursor-pointer shadow-2xs"
                          title="Editar nome e informações da área"
                        >
                          <Pencil className="w-3.5 h-3.5 text-blue-600" />
                          <span className="hidden sm:inline">Editar</span>
                        </button>

                        {/* Botão de Excluir */}
                        <button
                          type="button"
                          onClick={() => {
                            if (plantAreas.length <= 1) {
                              alert('Não é possível excluir a única área existente.');
                              return;
                            }
                            setConfirmDeleteId(plant.id);
                          }}
                          disabled={plantAreas.length <= 1}
                          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer shadow-2xs ${
                            plantAreas.length <= 1
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                              : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-200 hover:border-rose-200'
                          }`}
                          title={
                            plantAreas.length <= 1
                              ? 'Não é possível excluir a única área existente'
                              : 'Excluir esta área e suas matrizes'
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span className="hidden sm:inline">Excluir</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
