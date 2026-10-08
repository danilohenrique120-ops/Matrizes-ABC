import React from 'react';
import { Layers, ChevronDown, CheckCircle2 } from 'lucide-react';
import { ProcessArea } from '../types/wcm';

interface OperationalCellSelectorProps {
  processes: ProcessArea[];
  selectedProcessId?: string;
  onSelectProcess?: (processId: string) => void;
  totalPlantCost?: number;
}

export const OperationalCellSelector: React.FC<OperationalCellSelectorProps> = ({
  processes,
  selectedProcessId,
  onSelectProcess,
}) => {
  const currentProcess = processes.find((p) => p.id === selectedProcessId) || processes[0];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Label with icon */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <label
              htmlFor="cell-selector"
              className="uppercase tracking-wider text-[11px] font-black text-slate-700 block leading-tight cursor-pointer"
            >
              Selecione a Célula / Setor Operacional:
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Filtre as perdas e matrizes pelo setor produtivo
            </span>
          </div>
        </div>

        {/* Dropdown Select & Selected Tag */}
        <div className="flex items-center space-x-2.5 flex-1 sm:max-w-md md:max-w-lg lg:max-w-xl justify-end">
          <div className="relative w-full">
            <select
              id="cell-selector"
              value={selectedProcessId || currentProcess?.id || ''}
              onChange={(e) => onSelectProcess && onSelectProcess(e.target.value)}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-10 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
            >
              {processes.map((proc, idx) => {
                const code = proc.code || `P0${idx + 1}`;
                const section = proc.plantSection ? ` (${proc.plantSection})` : '';
                return (
                  <option key={proc.id} value={proc.id} className="text-slate-900 bg-white py-1">
                    [{code}] {proc.name}{section}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Quick badge showing active cell code */}
          {currentProcess && (
            <span className="hidden md:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold shrink-0 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentProcess.code || 'Ativo'}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

