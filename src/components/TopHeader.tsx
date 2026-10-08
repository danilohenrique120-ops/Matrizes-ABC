import React from 'react';
import {
  Menu,
  Building2,
} from 'lucide-react';
import { PlantArea } from '../types/wcm';
import { SyncStatus } from '../services/wcmFirestore';

interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
  plantAreas: PlantArea[];
  currentPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onOpenNewAreaModal?: (plantIdToEdit?: string) => void;
  totalPlantCost?: number;
  onOpenReport?: () => void;
  onOpenGuide?: () => void;
  onResetData?: () => void;
  syncStatus?: SyncStatus;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileSidebar,
  plantAreas,
  currentPlantId,
  onSelectPlant,
}) => {
  const currentPlant = plantAreas.find((p) => p.id === currentPlantId) || plantAreas[0];

  return (
    <header className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-30 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu + Unit Fabril Breadcrumb Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          {/* Hamburger button for mobile */}
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Unidade Fabril Badge */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-2xs">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">UNIDADE FABRIL:</span>
              <span className="truncate max-w-[200px] md:max-w-[260px]" title={currentPlant?.name}>
                {currentPlant?.name || 'Fábrica'}
              </span>
            </div>
          </div>

          {/* Status Chip: Planta 100% Operacional */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Planta 100% Operacional</span>
          </div>

          {/* CNPJ / Registro */}
          <span className="hidden xl:inline text-[11px] font-mono text-slate-400">
            CNPJ: 12.345.678/0001-90
          </span>
        </div>

        {/* Right Side: Plant Selector */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Plant Selector Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200/90 hover:border-slate-300 rounded-xl px-2.5 py-1 transition shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                Área Ativa
              </span>
              <select
                value={currentPlantId}
                onChange={(e) => onSelectPlant(e.target.value)}
                className="bg-transparent text-slate-800 font-bold text-[11px] sm:text-xs focus:outline-none cursor-pointer pr-1 max-w-[120px] sm:max-w-[180px] truncate"
                title="Alternar entre fábricas e áreas ativas"
              >
                {plantAreas.map((plant) => (
                  <option key={plant.id} value={plant.id} className="text-slate-900 bg-white">
                    {plant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
