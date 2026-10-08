import React from 'react';
import {
  LayoutDashboard,
  Grid3X3,
  GitMerge,
  FileText,
  BookOpen,
  Building2,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Settings,
  X,
} from 'lucide-react';
import { TabType } from './Navbar';
import { PlantArea } from '../types/wcm';
import { SyncStatus } from '../services/wcmFirestore';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  plantAreas: PlantArea[];
  currentPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onOpenNewAreaModal: (plantIdToEdit?: string) => void;
  onOpenReport: () => void;
  onOpenGuide: () => void;
  totalPlantCost: number;
  syncStatus?: SyncStatus;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  plantAreas,
  currentPlantId,
  onSelectPlant,
  onOpenNewAreaModal,
  onOpenReport,
  onOpenGuide,
  totalPlantCost,
  syncStatus = 'synced',
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const currentPlant = plantAreas.find((p) => p.id === currentPlantId) || plantAreas[0];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0B132B] border-r border-slate-800/90 flex flex-col z-50 transition-transform duration-200 ease-in-out shrink-0 select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo & Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-base tracking-wider">
              CD
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-white tracking-wide leading-tight">
                BMS Pilar CD
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                Cost Deployment Industrial
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Plant Status Card (Matching Screenshot style) */}
        <div className="p-3.5 border-b border-slate-800/80">
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-left hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-blue-400" />
                Unidade Fabril
              </span>
              <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>APTA</span>
              </span>
            </div>

            {plantAreas.length > 1 ? (
              <select
                value={currentPlantId}
                onChange={(e) => onSelectPlant(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer truncate"
                title="Alternar entre fábricas e áreas ativas"
              >
                {plantAreas.map((plant) => (
                  <option key={plant.id} value={plant.id} className="text-slate-900 bg-white">
                    {plant.name}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className="font-bold text-xs text-white truncate cursor-pointer hover:text-blue-300 transition"
                title={currentPlant?.name}
                onClick={() => onOpenNewAreaModal(currentPlantId)}
              >
                {currentPlant?.name || 'Fábrica Principal'}
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-semibold border border-blue-800/50">
                BMS Ativo
              </span>
              <span className="text-slate-400 font-medium">
                {plantAreas.length} {plantAreas.length === 1 ? 'área ativa' : 'áreas ativas'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-5">
          {/* Section: Governança da Planta */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
              Governança da Planta
            </div>
            <div className="space-y-1">
              {/* Dashboard */}
              <button
                onClick={() => {
                  onTabChange('dashboard');
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span>Visão Geral & Pareto</span>
                </div>
                {currentTab === 'dashboard' && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
              </button>

              {/* Relatório A3 */}
              <button
                onClick={() => {
                  onOpenReport();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Relatório Executivo A3</span>
                </div>
              </button>

              {/* Guia WCM */}
              <button
                onClick={() => {
                  onOpenGuide();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Guia 7 Passos WCM</span>
                </div>
              </button>

              {/* Áreas & Setores Fabris */}
              <button
                onClick={() => {
                  onOpenNewAreaModal();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Áreas & Setores Fabris</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-bold">
                  Central
                </span>
              </button>
            </div>
          </div>

          {/* Section: Suíte Cost Deployment (Ativos) */}
          <div>
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Suíte Cost Deployment
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">
                (Matrizes WCM)
              </span>
            </div>
            <div className="space-y-1">
              {/* Matriz B & C Integrada */}
              <button
                onClick={() => {
                  onTabChange('matrixBC');
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'matrixBC' || currentTab === 'matrixB' || currentTab === 'matrixC'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <GitMerge className="w-4 h-4 text-cyan-400" />
                  <span>Matriz B & C Integrada</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Reativo
                </span>
              </button>

              {/* Matriz A */}
              <button
                onClick={() => {
                  onTabChange('matrixA');
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentTab === 'matrixA'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Grid3X3 className="w-4 h-4 text-emerald-400" />
                  <span>Matriz A (Perdas × Proc.)</span>
                </div>
                {currentTab === 'matrixA' && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
