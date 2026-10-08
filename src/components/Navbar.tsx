import React from 'react';
import {
  LayoutDashboard,
  Grid3X3,
  GitMerge,
  CircleDollarSign,
  Settings,
  BookOpen,
  FileText,
  Factory,
  Building2,
  Plus,
  Pencil,
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { SyncStatus } from '../services/wcmFirestore';
import { PlantArea } from '../types/wcm';

export type TabType = 'dashboard' | 'matrixA' | 'matrixBC' | 'matrixB' | 'matrixC';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  totalPlantCost: number;
  onOpenGuide: () => void;
  onOpenReport: () => void;
  onResetData?: () => void;
  syncStatus?: SyncStatus;
  lastSyncedAt?: Date | null;
  onForceSync?: () => void;
  plantAreas: PlantArea[];
  currentPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onOpenNewAreaModal: (plantIdToEdit?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  totalPlantCost,
  onOpenGuide,
  onOpenReport,
  onResetData,
  syncStatus = 'synced',
  lastSyncedAt,
  onForceSync,
  plantAreas,
  currentPlantId,
  onSelectPlant,
  onOpenNewAreaModal,
}) => {
  const isBCOrLegacy = currentTab === 'matrixBC' || currentTab === 'matrixB' || currentTab === 'matrixC';

  const tabs = [
    {
      id: 'dashboard' as TabType,
      name: 'Dashboard & Pareto',
      icon: LayoutDashboard,
      badge: 'Visão Geral',
    },
    {
      id: 'matrixA' as TabType,
      name: 'Matriz A (Processos x Perdas)',
      icon: Grid3X3,
      badge: 'Físico',
    },
    {
      id: 'matrixBC' as TabType,
      name: 'Matriz B & C (Painel Integrado)',
      icon: GitMerge,
      badge: 'Causal & R$',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Banner */}
      <div className="w-full px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo, Brand and Area/Factory Selector */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg tracking-wider border border-blue-400/30 shrink-0">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">BMS Cost Deployment</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 hidden lg:inline-block">
                  CD Pillar
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden xl:block">
                Desdobramento de Custos • Matrizes A, B & C Interligadas
              </p>
            </div>

            {/* Divisor vertical */}
            <div className="hidden sm:block h-7 w-px bg-slate-700/80" />

            {/* Lista Suspensa de Área / Fábrica + Botão de Nova Área */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-sm transition">
                <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Área / Fábrica Ativa
                  </span>
                  <select
                    id="plant-area-selector"
                    aria-label="Selecionar Área ou Fábrica Ativa"
                    value={currentPlantId}
                    onChange={(e) => onSelectPlant(e.target.value)}
                    className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer pr-1 max-w-[130px] sm:max-w-[180px] md:max-w-[220px] truncate"
                    title="Selecione a área/fábrica para alternar suas matrizes independentes"
                  >
                    {plantAreas.map((plant) => (
                      <option key={plant.id} value={plant.id} className="bg-slate-900 text-white font-semibold py-1">
                        {plant.name} {plant.code ? `(${plant.code})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botão de Editar Área Atual */}
              <button
                onClick={() => onOpenNewAreaModal(currentPlantId)}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-slate-600 transition active:scale-95 shrink-0 shadow-sm cursor-pointer"
                title="Editar dados da área ativa ou gerenciar áreas"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>

              {/* Botão de Cadastro de Nova Área */}
              <button
                onClick={() => onOpenNewAreaModal()}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition active:scale-95 shrink-0 cursor-pointer"
                title="Cadastrar ou gerenciar áreas e fábricas"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nova Área</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Real-time Total Cost Pill */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center space-x-2.5 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-semibold block uppercase tracking-wider">Perda Total (CD)</span>
                <span className="text-sm sm:text-base font-black text-amber-400 font-mono tabular-nums leading-none">
                  {formatCurrency(totalPlantCost)}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <button
              onClick={onOpenReport}
              title="Relatório Executivo A3 / Impressão"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:bg-slate-700 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Relatório A3</span>
            </button>

            <button
              onClick={onOpenGuide}
              title="Guia do Método WCM Cost Deployment"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:bg-slate-700 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Guia WCM</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center space-x-1.5 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentTab === tab.id || (tab.id === 'matrixBC' && isBCOrLegacy);
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/90 text-white shadow-sm shadow-blue-600/30 border border-blue-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-blue-800/70 text-blue-200' : 'bg-slate-800/90 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
