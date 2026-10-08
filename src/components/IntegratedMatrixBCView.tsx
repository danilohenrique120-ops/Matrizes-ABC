import React, { useState, useMemo } from 'react';
import {
  CausalDeployment,
  ImpactedStage,
  ProcessArea,
  LossCategory,
  WCMPillar,
  FinancialParameters,
  CustomCostElement,
  DeploymentCostElement,
  CostUnitType,
} from '../types/wcm';
import {
  Layers,
  CircleDollarSign,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  DollarSign,
  Factory,
  Sliders,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  ArrowRight,
  Sparkles,
  Search,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { formatCurrency, PILLAR_INFO } from '../utils/calculations';
import {
  WCM_ROOT_CAUSES_CATEGORIZED,
  ALL_WCM_ROOT_CAUSES,
} from '../data/wcmRootCauses';

interface IntegratedMatrixBCViewProps {
  processes: ProcessArea[];
  losses: LossCategory[];
  causalDeployments: CausalDeployment[];
  financialParams: FinancialParameters;
  onUpdateFinancialParams: (params: FinancialParameters) => void;
  onAddDeployment: (deployment: Omit<CausalDeployment, 'id'>) => void;
  onEditDeployment: (deployment: CausalDeployment) => void;
  onDeleteDeployment: (deploymentId: string) => void;
  selectedDeploymentId?: string;
  onSelectDeployment?: (id: string) => void;
  onNavigateToMatrixA?: () => void;
}

export const IntegratedMatrixBCView: React.FC<IntegratedMatrixBCViewProps> = ({
  processes,
  losses,
  causalDeployments = [],
  financialParams,
  onUpdateFinancialParams,
  onAddDeployment,
  onEditDeployment,
  onDeleteDeployment,
  selectedDeploymentId,
  onSelectDeployment,
  onNavigateToMatrixA,
}) => {
  // Navigation / View state
  const [activeDeploymentId, setActiveDeploymentId] = useState<string>(() => {
    if (selectedDeploymentId) return selectedDeploymentId;
    return causalDeployments.length > 0 ? causalDeployments[0].id : '';
  });

  const [searchEventTerm, setSearchEventTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'event' | 'consolidated'>('event');

  // Custom cost element addition modal/form toggle
  const [showAddCostElement, setShowAddCostElement] = useState(false);
  const [newCostName, setNewCostName] = useState('');
  const [newCostRate, setNewCostRate] = useState('10.00');
  const [newCostUnit, setNewCostUnit] = useState('R$/h');

  // Quick stage input
  const [newStageName, setNewStageName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCustomRootCauseInput, setIsCustomRootCauseInput] = useState(false);

  // Sync state if selectedDeploymentId prop changes externally
  React.useEffect(() => {
    if (selectedDeploymentId && selectedDeploymentId !== activeDeploymentId) {
      setActiveDeploymentId(selectedDeploymentId);
      setActiveTab('event');
      setShowDeleteConfirm(false);
      setIsCustomRootCauseInput(false);
    }
  }, [selectedDeploymentId]);

  // If no deployment is selected and we have items, select the first
  React.useEffect(() => {
    if ((!activeDeploymentId || !causalDeployments.find((d) => d.id === activeDeploymentId)) && causalDeployments.length > 0) {
      setActiveDeploymentId(causalDeployments[0].id);
    }
  }, [causalDeployments, activeDeploymentId]);

  // Current active deployment
  const currentDeployment = useMemo(() => {
    return causalDeployments.find((d) => d.id === activeDeploymentId) || causalDeployments[0] || null;
  }, [causalDeployments, activeDeploymentId]);

  // Lookup maps
  const processMap = useMemo(() => new Map(processes.map((p) => [p.id, p])), [processes]);
  const lossMap = useMemo(() => new Map(losses.map((l) => [l.id, l])), [losses]);

  // Base financial parameters defaults
  const hourlyLaborRate = financialParams.hourlyLaborRate ?? 100.0;
  const electricityRate = financialParams.electricityCostPerKWh ?? 0.7;
  const customCostElements = financialParams.customCostElements || [];

  // Specific cost elements for current loss event (fallback to default structure if legacy)
  const currentCostElements: DeploymentCostElement[] = useMemo(() => {
    if (!currentDeployment) return [];
    if (Array.isArray(currentDeployment.costElements)) {
      return currentDeployment.costElements;
    }
    // Default fallback elements: For demo dep_1, keep 85 and 0.95 so it matches screenshot; if other/new, starts at 0
    return [
      {
        id: 'elem_mo',
        name: 'Custo Mão de Obra',
        rate: currentDeployment.id === 'dep_1' ? 85 : 0,
        unit: 'reais_hora',
        unitDetail: 'R$/hora por operador',
        isActive: true,
      },
      {
        id: 'elem_ee',
        name: 'Custo Energia Elétrica',
        rate: currentDeployment.id === 'dep_1' ? 0.95 : 0,
        unit: 'reais_hora',
        unitDetail: 'R$/hora processo',
        isActive: true,
      },
    ];
  }, [currentDeployment]);

  // Helper to compute cost for a single element in a single stage
  const getStageElementCost = (
    stage: { durationHours: number; operatorCount: number; isStop: boolean; customEnergyRatePerHour?: number },
    costElem: DeploymentCostElement,
    totalDuration: number,
    activeStagesCount: number
  ) => {
    if (!stage.isStop) return 0;
    const dur = Number(stage.durationHours || 0);
    const ops = Number(stage.operatorCount || 1);

    if (costElem.unit === 'reais_hora') {
      if (
        costElem.name.toLowerCase().includes('mão de obra') ||
        (costElem.unitDetail && costElem.unitDetail.includes('operador'))
      ) {
        return dur * ops * costElem.rate;
      }
      const energyRate =
        costElem.name.toLowerCase().includes('energia') && stage.customEnergyRatePerHour !== undefined
          ? stage.customEnergyRatePerHour
          : costElem.rate;
      return dur * energyRate;
    }

    // Fixed cost element (reais_fixo): distribute across active stoppage stages
    if (totalDuration > 0) {
      return (dur / totalDuration) * costElem.rate;
    }
    return activeStagesCount > 0 ? costElem.rate / activeStagesCount : costElem.rate;
  };

  // Helper to compute total cost for a cost element across all stages
  const getElementTotalCost = (
    stages: Array<{ durationHours: number; operatorCount: number; isStop: boolean; customEnergyRatePerHour?: number }>,
    costElem: DeploymentCostElement,
    totalDuration: number
  ) => {
    if (costElem.unit === 'reais_fixo') {
      return Number(costElem.rate) || 0;
    }
    const activeCount = stages.filter((s) => s.isStop).length;
    return stages.reduce((acc, stg) => {
      return acc + getStageElementCost(stg, costElem, totalDuration, activeCount);
    }, 0);
  };

  // --- Calculations for Current Deployment ---
  const currentCalculation = useMemo(() => {
    if (!currentDeployment) {
      return {
        stages: [],
        totalDurationHours: 0,
        totalFixedCost: 0,
        totalCost: 0,
      };
    }

    const activeStages = (currentDeployment.impactedStages || []).filter((s) => s.isStop !== false);
    const totalDurationHours = activeStages.reduce((sum, s) => sum + Number(s.durationHours || 0), 0);
    const activeStagesCount = activeStages.length;

    const stages = (currentDeployment.impactedStages || []).map((stage) => {
      const isStop = stage.isStop !== false;
      const durationHours = isStop ? Number(stage.durationHours || 0) : 0;
      const operatorCount = isStop ? Number(stage.operatorCount || 1) : 0;

      let subtotalCost = 0;
      currentCostElements.forEach((el) => {
        if (el.isActive !== false) {
          subtotalCost += getStageElementCost(
            { durationHours, operatorCount, isStop, customEnergyRatePerHour: stage.customEnergyRatePerHour },
            el,
            totalDurationHours,
            activeStagesCount
          );
        }
      });

      return {
        ...stage,
        isStop,
        effectiveDuration: durationHours,
        effectiveOperators: operatorCount,
        subtotalCost,
      };
    });

    const totalCost = currentCostElements.reduce((sum, el) => {
      if (el.isActive === false) return sum;
      return sum + getElementTotalCost(stages, el, totalDurationHours);
    }, 0);

    const totalFixedCost = currentCostElements
      .filter((e) => e.isActive !== false && e.unit === 'reais_fixo')
      .reduce((sum, el) => sum + (Number(el.rate) || 0), 0);

    return {
      stages,
      totalDurationHours,
      totalFixedCost,
      totalCost,
    };
  }, [currentDeployment, currentCostElements]);

  // --- Handlers for Current Deployment Context ---
  const handleUpdateCurrentField = (field: keyof CausalDeployment, value: any) => {
    if (!currentDeployment) return;
    const updated: CausalDeployment = {
      ...currentDeployment,
      [field]: value,
    };

    // If changing originProcessId, auto-suggest the sector
    if (field === 'originProcessId') {
      const proc = processMap.get(value);
      if (proc) {
        updated.originProcessName = proc.name;
        if (!updated.originSector || updated.originSector === 'Upstream' || updated.originSector === 'Biorreatores' || updated.originSector === 'Env/Embalagem') {
          updated.originSector = proc.plantSection || 'Upstream';
        }
      }
    }

    if (field === 'lossId') {
      const loss = lossMap.get(value);
      if (loss) {
        updated.lossName = loss.name;
      }
    }

    onEditDeployment(updated);
  };

  const handleSelectRootCause = (value: string) => {
    if (value === '__custom__') {
      setIsCustomRootCauseInput(true);
      return;
    }
    if (!currentDeployment) return;

    const codeMatch = value.match(/^([0-9]+\.[0-9]+(?:\.[0-9]+)?)/);
    const code = codeMatch ? codeMatch[1] : undefined;

    let suggestedPillar = currentDeployment.pillar;
    if (value.startsWith('4.')) suggestedPillar = 'ENV';
    else if (value.startsWith('5.')) suggestedPillar = 'EEM';
    else if (value.startsWith('6.')) suggestedPillar = 'LOG';
    else if (
      value.includes('QUALIDADE') ||
      value.includes('SUCATA') ||
      value.includes('RETRABALHO')
    )
      suggestedPillar = 'QC';
    else if (
      value.startsWith('1.1.1 ') ||
      value.includes('MANUTENÇÃO') ||
      value.includes('PEÇA DE MANUTENÇÃO')
    )
      suggestedPillar = 'PM';
    else if (
      value.includes('LIMPEZA') ||
      value.includes('ATIVIDADES AUTÔNOMAS')
    )
      suggestedPillar = 'AM';
    else if (
      value.startsWith('2.') ||
      value.includes('SETUP') ||
      value.includes('AJUSTES') ||
      value.includes('MICROPARADA')
    )
      suggestedPillar = 'FI';

    const updated: CausalDeployment = {
      ...currentDeployment,
      rootCauseName: value,
      rootCauseCode: code || currentDeployment.rootCauseCode,
      pillar: suggestedPillar || currentDeployment.pillar,
    };
    onEditDeployment(updated);
  };

  // --- Handler for Standard Time (Tempo Padrão / Esperado) ---
  const handleUpdateStandardTime = (
    rawValue: string,
    explicitUnit?: 'min' | 'h' | 's'
  ) => {
    if (!currentDeployment) return;

    let unit: 'min' | 'h' | 's' = explicitUnit || currentDeployment.standardTimeUnit || 'min';
    let cleanVal = rawValue;

    // Detect unit if user typed words like "min", "h", "seg", "s" directly into the text box
    const lower = rawValue.toLowerCase();
    if (!explicitUnit) {
      if (lower.includes('h') || lower.includes('hora')) {
        unit = 'h';
        cleanVal = rawValue.replace(/[^\d.,]/g, '').trim();
      } else if (lower.includes('seg') || lower.endsWith('s')) {
        unit = 's';
        cleanVal = rawValue.replace(/[^\d.,]/g, '').trim();
      } else if (lower.includes('min') || lower.includes('m')) {
        unit = 'min';
        cleanVal = rawValue.replace(/[^\d.,]/g, '').trim();
      }
    }

    // Parse the number (allowing comma or dot as decimal separator)
    const num = parseFloat(cleanVal.replace(',', '.')) || 0;

    // Standard base calculation is ALWAYS in minutes:
    let minutes = num;
    if (unit === 'h') {
      minutes = num * 60;
    } else if (unit === 's') {
      minutes = num / 60;
    }

    const updated: CausalDeployment = {
      ...currentDeployment,
      standardTimeValue: cleanVal,
      standardTimeUnit: unit,
      standardTimeMin: minutes,
      standardTimeText: cleanVal ? `${cleanVal} ${unit}` : '',
    };

    onEditDeployment(updated);
  };

  // --- Handlers for Stages in Current Deployment ---
  const handleUpdateStage = (stageId: string, patch: Partial<ImpactedStage>) => {
    if (!currentDeployment) return;
    const updatedStages = (currentDeployment.impactedStages || []).map((stage) => {
      if (stage.id !== stageId) return stage;
      const merged = { ...stage, ...patch };

      // Se Houve Parada for alterado para Não, o tempo de parada da linha zera
      if (patch.isStop === false) {
        merged.durationHours = 0;
      } else if (patch.isStop === true && merged.durationHours === 0) {
        merged.durationHours = 0.3333; // restaura default razoável se zerado
      }

      return merged;
    });

    onEditDeployment({
      ...currentDeployment,
      impactedStages: updatedStages,
    });
  };

  const handleAddStage = (name?: string) => {
    if (!currentDeployment) return;
    const stageTitle = (name || newStageName || 'Nova Etapa').trim();
    const newStage: ImpactedStage = {
      id: `stg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      stageName: stageTitle,
      isStop: true,
      durationHours: 0.3333,
      operatorCount: 1,
    };

    onEditDeployment({
      ...currentDeployment,
      impactedStages: [...(currentDeployment.impactedStages || []), newStage],
    });

    setNewStageName('');
  };

  const handleRemoveStage = (stageId: string) => {
    if (!currentDeployment) return;
    onEditDeployment({
      ...currentDeployment,
      impactedStages: (currentDeployment.impactedStages || []).filter((s) => s.id !== stageId),
    });
  };

  const handleApplyProcessTemplate = (type: 'bio' | 'packaging') => {
    if (!currentDeployment) return;
    let templateStages: ImpactedStage[] = [];

    if (type === 'bio') {
      templateStages = [
        { id: `stg_bio_1_${Date.now()}`, stageName: 'Setup', isStop: true, durationHours: 0.3333, operatorCount: 1 },
        { id: `stg_bio_2_${Date.now()}`, stageName: 'Formulação', isStop: true, durationHours: 0.3333, operatorCount: 1 },
        { id: `stg_bio_3_${Date.now()}`, stageName: 'Inoculação', isStop: true, durationHours: 0.3333, operatorCount: 1 },
        { id: `stg_bio_4_${Date.now()}`, stageName: 'Cultivo', isStop: true, durationHours: 0.3333, operatorCount: 1 },
      ];
    } else {
      templateStages = [
        { id: `stg_emb_1_${Date.now()}`, stageName: 'Setup Envase', isStop: true, durationHours: 0.5, operatorCount: 2 },
        { id: `stg_emb_2_${Date.now()}`, stageName: 'Esterilização Linha', isStop: true, durationHours: 0.25, operatorCount: 1 },
        { id: `stg_emb_3_${Date.now()}`, stageName: 'Rotulagem & Fechamento', isStop: true, durationHours: 0.33, operatorCount: 1 },
        { id: `stg_emb_4_${Date.now()}`, stageName: 'Encaixotamento', isStop: false, durationHours: 0, operatorCount: 1 },
      ];
    }

    onEditDeployment({
      ...currentDeployment,
      impactedStages: [...(currentDeployment.impactedStages || []), ...templateStages],
    });
  };

  // --- Handlers for New Deployment Creation ---
  const handleCreateNewDeployment = () => {
    const defaultProc = processes[0] || { id: 'proc_1', name: 'Biorreator 100L', plantSection: 'Upstream' };
    const defaultLoss = losses[0] || { id: 'loss_1_1_2', name: 'SETUP / AJUSTES' };

    const newDep: Omit<CausalDeployment, 'id'> = {
      originProcessId: defaultProc.id,
      originProcessName: defaultProc.name,
      lossId: defaultLoss.id,
      lossName: defaultLoss.name,
      standardTimeMin: 15,
      standardTimeValue: '15',
      standardTimeUnit: 'min',
      standardTimeText: '15 min',
      rootCauseName: 'NOVA CAUSA RAIZ',
      rootCauseCode: `C${(causalDeployments.length + 1).toString().padStart(2, '0')}`,
      originSector: defaultProc.plantSection || 'Upstream',
      pillar: 'FI',
      category: 'Método / Movimentação',
      impactedStages: [
        { id: `stg_init_1`, stageName: 'Setup', isStop: true, durationHours: 0.3333, operatorCount: 1 },
        { id: `stg_init_2`, stageName: 'Formulação', isStop: true, durationHours: 0.3333, operatorCount: 1 },
      ],
      // Every new loss event starts with zeroed cost elements ready to customize
      costElements: [
        {
          id: `elem_${Date.now()}_mo`,
          name: 'Custo Mão de Obra',
          rate: 0,
          unit: 'reais_hora',
          unitDetail: 'R$/hora por operador',
          isActive: true,
        },
        {
          id: `elem_${Date.now()}_ee`,
          name: 'Custo Energia Elétrica',
          rate: 0,
          unit: 'reais_hora',
          unitDetail: 'R$/hora processo',
          isActive: true,
        },
      ],
      notes: 'Mapeamento interativo de impacto',
    };

    onAddDeployment(newDep);
  };

  const handleDuplicateCurrent = () => {
    if (!currentDeployment) return;
    const duplicated: Omit<CausalDeployment, 'id'> = {
      ...currentDeployment,
      rootCauseName: `${currentDeployment.rootCauseName} (Cópia)`,
      rootCauseCode: `${currentDeployment.rootCauseCode || 'C'}-B`,
      impactedStages: (currentDeployment.impactedStages || []).map((s) => ({
        ...s,
        id: `stg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      })),
      costElements: currentCostElements.map((el) => ({
        ...el,
        id: `elem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      })),
    };
    onAddDeployment(duplicated);
  };

  const handleDeleteDeploymentConfirmed = () => {
    if (!currentDeployment) return;
    const currentIdx = causalDeployments.findIndex((d) => d.id === currentDeployment.id);
    const remaining = causalDeployments.filter((d) => d.id !== currentDeployment.id);
    if (remaining.length > 0) {
      const nextIdx = Math.min(currentIdx, remaining.length - 1);
      setActiveDeploymentId(remaining[nextIdx].id);
    } else {
      setActiveDeploymentId('');
    }
    onDeleteDeployment(currentDeployment.id);
    setShowDeleteConfirm(false);
  };

  // --- Handlers for Cost Elements of the Current Deployment ---
  const handleUpdateCostElements = (newElements: DeploymentCostElement[]) => {
    if (!currentDeployment) return;
    onEditDeployment({
      ...currentDeployment,
      costElements: newElements,
    });
  };

  const handleUpdateCostElementRate = (id: string, newRateStr: string) => {
    const parsed = parseFloat(newRateStr.replace(',', '.'));
    const rateVal = isNaN(parsed) ? 0 : Math.max(0, parsed);
    const updated = currentCostElements.map((el) =>
      el.id === id ? { ...el, rate: rateVal } : el
    );
    handleUpdateCostElements(updated);
  };

  const handleUpdateCostElementUnit = (id: string, unit: CostUnitType) => {
    const updated = currentCostElements.map((el) => {
      if (el.id !== id) return el;
      return {
        ...el,
        unit,
        unitDetail: unit === 'reais_hora' ? 'R$/hora' : 'R$ fixo',
      };
    });
    handleUpdateCostElements(updated);
  };

  const handleDeleteCostElement = (id: string) => {
    const updated = currentCostElements.filter((el) => el.id !== id);
    handleUpdateCostElements(updated);
  };

  const handleAddCostElement = () => {
    if (!newCostName.trim()) return;
    const parsedRate = parseFloat(newCostRate.replace(',', '.')) || 0;
    const newElement: DeploymentCostElement = {
      id: `elem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newCostName.trim(),
      rate: Math.max(0, parsedRate),
      unit: (newCostUnit as CostUnitType) || 'reais_hora',
      unitDetail: newCostUnit === 'reais_fixo' ? 'R$ fixo' : 'R$/hora',
      isActive: true,
    };
    handleUpdateCostElements([...currentCostElements, newElement]);
    setNewCostName('');
    setNewCostRate('');
    setNewCostUnit('reais_hora');
    setShowAddCostElement(false);
  };

  // Filter deployments for selector bar
  const filteredEventsList = useMemo(() => {
    if (!searchEventTerm.trim()) return causalDeployments;
    const term = searchEventTerm.toLowerCase();
    return causalDeployments.filter((dep) => {
      const proc = processMap.get(dep.originProcessId)?.name || '';
      const loss = lossMap.get(dep.lossId)?.name || '';
      return (
        proc.toLowerCase().includes(term) ||
        loss.toLowerCase().includes(term) ||
        dep.rootCauseName.toLowerCase().includes(term) ||
        (dep.originSector && dep.originSector.toLowerCase().includes(term))
      );
    });
  }, [causalDeployments, searchEventTerm, processMap, lossMap]);

  // Group causal deployments by equipment/process for the dropdown selector
  const groupedDeployments = useMemo(() => {
    const groupsMap = new Map<string, { groupId: string; processName: string; deployments: CausalDeployment[] }>();
    causalDeployments.forEach((dep) => {
      const proc = processMap.get(dep.originProcessId);
      const groupKey = dep.originProcessId || 'other';
      const procName = proc ? `${proc.code} - ${proc.name}` : (dep.originProcessName || 'Outro Equipamento / Processo');
      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, {
          groupId: groupKey,
          processName: procName,
          deployments: [],
        });
      }
      groupsMap.get(groupKey)!.deployments.push(dep);
    });
    return Array.from(groupsMap.values());
  }, [causalDeployments, processMap]);

  // Current deployment index for quick sequential navigation
  const currentDeploymentIndex = useMemo(() => {
    return causalDeployments.findIndex((d) => d.id === currentDeployment?.id);
  }, [causalDeployments, currentDeployment?.id]);

  const handlePrevDeployment = () => {
    if (currentDeploymentIndex > 0) {
      const prevId = causalDeployments[currentDeploymentIndex - 1].id;
      setActiveDeploymentId(prevId);
      if (onSelectDeployment) onSelectDeployment(prevId);
      setActiveTab('event');
    }
  };

  const handleNextDeployment = () => {
    if (currentDeploymentIndex >= 0 && currentDeploymentIndex < causalDeployments.length - 1) {
      const nextId = causalDeployments[currentDeploymentIndex + 1].id;
      setActiveDeploymentId(nextId);
      if (onSelectDeployment) onSelectDeployment(nextId);
      setActiveTab('event');
    }
  };

  // Export CSV of the integrated analysis
  const handleExportSpreadsheet = () => {
    const headers = [
      'Equipamento / Sistema',
      'Setor Origem',
      'Tipo de Perda',
      'Tempo Padrão',
      'Causa Raiz',
      'Pilar WCM',
      'Etapa Impactada (Downstream)',
      'Houve Parada?',
      'Tempo de Parada (h)',
      'Operadores Envolvidos',
      'Custo Mão de Obra Unitário (R$/h)',
      'Custo Energia Unitário (R$/h)',
      'Custo Mão de Obra (R$)',
      'Custo Energia (R$)',
      'Subtotal da Etapa (R$)',
    ];

    const rows: string[][] = [];

    causalDeployments.forEach((dep) => {
      const procName = processMap.get(dep.originProcessId)?.name || dep.originProcessName || '';
      const lossName = lossMap.get(dep.lossId)?.name || dep.lossName || '';
      const sector = dep.originSector || processMap.get(dep.originProcessId)?.plantSection || '';

      (dep.impactedStages || []).forEach((stg) => {
        const isStop = stg.isStop !== false;
        const dur = isStop ? stg.durationHours : 0;
        const ops = isStop ? stg.operatorCount : 0;
        const labor = dur * ops * hourlyLaborRate;
        const energyRate = stg.customEnergyRatePerHour ?? electricityRate;
        const energy = dur * energyRate;
        const total = labor + energy;

        rows.push([
          `"${procName}"`,
          `"${sector}"`,
          `"${lossName}"`,
          `"${dep.standardTimeText || `${dep.standardTimeMin || 15} min`}"`,
          `"${dep.rootCauseName}"`,
          dep.pillar || 'FI',
          `"${stg.stageName}"`,
          isStop ? 'Sim' : 'Não',
          dur.toFixed(4),
          ops.toString(),
          hourlyLaborRate.toFixed(2),
          energyRate.toFixed(2),
          labor.toFixed(2),
          energy.toFixed(2),
          total.toFixed(2),
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WCM_Matriz_B_C_Integrada_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Standard Time metrics for current deployment (Unidade de medida padrão para cálculos: Minutos)
  const standardTimeDisplayValue =
    currentDeployment?.standardTimeValue !== undefined
      ? String(currentDeployment.standardTimeValue)
      : currentDeployment?.standardTimeMin !== undefined
      ? String(currentDeployment.standardTimeMin)
      : '15';

  const standardTimeUnit: 'min' | 'h' | 's' = currentDeployment?.standardTimeUnit || 'min';
  const standardTimeMinCalculated =
    currentDeployment?.standardTimeMin !== undefined
      ? currentDeployment.standardTimeMin
      : (parseFloat(standardTimeDisplayValue.replace(',', '.')) || 0);
  const standardTimeHoursCalculated = standardTimeMinCalculated / 60;
  const actualStoppageMin = (currentCalculation.totalDurationHours || 0) * 60;
  const varianceMin = actualStoppageMin - standardTimeMinCalculated;

  return (
    <div className="space-y-6 w-full">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 border border-blue-500/40 rounded-2xl p-5 shadow-lg shadow-blue-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white font-bold text-xs border border-white/30 uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-xs">
                <Layers className="w-3.5 h-3.5" />
                Matriz B & C Integradas
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-400/25 text-emerald-100 font-semibold text-xs border border-emerald-300/40 backdrop-blur-xs">
                100% Reativo & Dinâmico
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              PAINEL INTEGRADO: DESDOBRAMENTO CAUSAL (B) + VALORAÇÃO FINANCEIRA (C)
            </h2>
            <p className="text-xs sm:text-sm text-blue-100">
              Mapeie o efeito downstream físico na Matriz B e obtenha o impacto financeiro calculado instantaneamente na Matriz C.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab(activeTab === 'event' ? 'consolidated' : 'event')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition cursor-pointer shadow-xs ${
                activeTab === 'consolidated'
                  ? 'bg-white text-blue-900 border-white shadow-md font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/25'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{activeTab === 'consolidated' ? 'Voltar ao Editor do Evento' : 'Visão Consolidada de Todas as Perdas'}</span>
            </button>

            <button
              onClick={handleExportSpreadsheet}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/25 flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              title="Exportar dados completos em CSV compatível com Excel"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Exportar Excel</span>
            </button>

            {onNavigateToMatrixA && (
              <button
                onClick={onNavigateToMatrixA}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/30 flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              >
                <span>Ir para Matriz A</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Event Quick Selector Bar - Formato Lista Suspensa (Dropdown) */}
        <div className="mt-5 pt-4 border-t border-white/20 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 max-w-full">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-bold text-blue-100 uppercase tracking-wider flex items-center gap-1.5">
                <ListFilter className="w-4 h-4 text-cyan-200" />
                <span>Eventos Mapeados:</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/30">
                {causalDeployments.length}
              </span>
            </div>

            {/* Dropdown Lista Suspensa agrupada por equipamento */}
            <div className="relative flex-1 min-w-[260px] max-w-2xl">
              <select
                aria-label="Selecionar Evento Mapeado"
                value={currentDeployment?.id || ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (!selectedId) return;
                  setActiveDeploymentId(selectedId);
                  if (onSelectDeployment) onSelectDeployment(selectedId);
                  setActiveTab('event');
                }}
                className="w-full bg-slate-900/95 border border-white/30 hover:border-white/50 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-md cursor-pointer transition truncate"
              >
                {causalDeployments.length === 0 ? (
                  <option value="" disabled>
                    Nenhum evento de perda cadastrado
                  </option>
                ) : (
                  groupedDeployments.map((group) => (
                    <optgroup
                      key={group.groupId}
                      label={`📍 ${group.processName} (${group.deployments.length})`}
                      className="bg-slate-900 text-blue-300 font-bold"
                    >
                      {group.deployments.map((dep) => {
                        const loss = lossMap.get(dep.lossId)?.name || dep.lossName || 'Perda';
                        const cause = dep.rootCauseName ? ` • ${dep.rootCauseName}` : '';
                        const code = dep.rootCauseCode ? ` [${dep.rootCauseCode}]` : '';
                        const pillar = dep.pillar ? ` [Pilar ${dep.pillar}]` : '';
                        return (
                          <option
                            key={dep.id}
                            value={dep.id}
                            className="bg-slate-900 text-slate-100 font-normal py-1"
                          >
                            {loss}{code}{cause}{pillar}
                          </option>
                        );
                      })}
                    </optgroup>
                  ))
                )}
              </select>
            </div>

            {/* Navegação Rápida Anterior / Próximo */}
            {causalDeployments.length > 1 && (
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevDeployment}
                  disabled={currentDeploymentIndex <= 0}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white border border-white/20 transition cursor-pointer"
                  title="Evento Anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-blue-100 px-1 select-none font-bold">
                  {currentDeploymentIndex >= 0 ? currentDeploymentIndex + 1 : 0}/{causalDeployments.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextDeployment}
                  disabled={currentDeploymentIndex < 0 || currentDeploymentIndex >= causalDeployments.length - 1}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white border border-white/20 transition cursor-pointer"
                  title="Próximo Evento"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end xl:self-center">
            <button
              onClick={handleCreateNewDeployment}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-300/50 flex items-center space-x-1.5 shadow-md transition cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Evento de Perda</span>
            </button>

            {currentDeployment && (
              <>
                <button
                  onClick={handleDuplicateCurrent}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/25 flex items-center space-x-1 transition cursor-pointer active:scale-95 shadow-xs"
                  title="Duplicar este evento para simular outro cenário"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Duplicar</span>
                </button>

                {causalDeployments.length > 1 && (
                  showDeleteConfirm ? (
                    <div className="flex items-center space-x-1.5 bg-rose-950/95 border border-rose-700/80 rounded-xl px-2.5 py-1 text-xs shadow-lg animate-in fade-in duration-150">
                      <span className="text-rose-200 text-[11px] font-semibold">Excluir?</span>
                      <button
                        onClick={handleDeleteDeploymentConfirmed}
                        className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition shadow cursor-pointer active:scale-95"
                        title="Confirmar exclusão deste evento de perda"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer"
                        title="Cancelar exclusão"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-1.5 rounded-xl text-xs text-rose-200 hover:text-white bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/40 transition active:scale-95 cursor-pointer shadow-xs"
                      title="Excluir este evento de perda"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: SINGLE INTEGRATED INTERACTIVE PANEL (Primary View) */}
      {activeTab === 'event' && currentDeployment && (
        <div className="space-y-6">
          {/* TWO MAIN CARDS: 1. EVENT CONTEXT (CABEÇALHO) + 2. COST ELEMENTS (PARÂMETROS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. CABEÇALHO DO EVENTO DE PERDA (Contexto) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 shadow-2xs">
                    <Factory className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      1. Cabeçalho do Evento de Perda (Contexto)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Defina a origem do desvio, equipamento, tempo padrão e causa raiz identificada
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-slate-500">Pilar:</span>
                  <select
                    value={currentDeployment.pillar}
                    onChange={(e) => handleUpdateCurrentField('pillar', e.target.value as WCMPillar)}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-blue-700 px-2.5 py-1 focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
                  >
                    {Object.keys(PILLAR_INFO).map((pillarKey) => (
                      <option key={pillarKey} value={pillarKey} className="text-slate-900 bg-white">
                        {pillarKey} - {PILLAR_INFO[pillarKey as WCMPillar]?.name || ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Campo 1: Equipamento / Sistema */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Equipamento / Sistema</span>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Origem</span>
                  </label>
                  <select
                    value={currentDeployment.originProcessId}
                    onChange={(e) => handleUpdateCurrentField('originProcessId', e.target.value)}
                    className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200 hover:border-blue-400 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition shadow-2xs"
                  >
                    {processes.map((proc) => (
                      <option key={proc.id} value={proc.id} className="text-slate-900 bg-white">
                        {proc.code} - {proc.name} ({proc.plantSection})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo 2: Tipo de Perda */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Tipo de Perda</span>
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Matriz A</span>
                  </label>
                  <select
                    value={currentDeployment.lossId}
                    onChange={(e) => handleUpdateCurrentField('lossId', e.target.value)}
                    className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200 hover:border-blue-400 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition shadow-2xs"
                  >
                    {losses.map((l) => (
                      <option key={l.id} value={l.id} className="text-slate-900 bg-white">
                        {l.code} - {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo 3: Tempo Padrão / Esperado (Editável com Unidade de Medida Padrão em Minutos) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tempo Padrão / Esperado</span>
                    </label>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded flex items-center space-x-1">
                      <span>Padrão:</span>
                      <strong className="text-blue-900">Minutos (min)</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Campo para digitação livre do valor numérico */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={standardTimeDisplayValue}
                        onChange={(e) => handleUpdateStandardTime(e.target.value)}
                        placeholder="Ex: 15 ou 0.25"
                        className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200 hover:border-blue-400 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition shadow-2xs"
                      />
                    </div>

                    {/* Seletor de Unidade de Medida com Padrão em Minutos */}
                    <select
                      value={standardTimeUnit}
                      onChange={(e) =>
                        handleUpdateStandardTime(
                          standardTimeDisplayValue,
                          e.target.value as 'min' | 'h' | 's'
                        )
                      }
                      className="bg-slate-50/90 hover:bg-white border border-slate-200 hover:border-blue-400 focus:border-blue-600 rounded-xl px-2.5 py-2 text-xs font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer shadow-2xs"
                      title="Unidade de medida do tempo padrão (Base para cálculos em minutos)"
                    >
                      <option value="min">min (Minutos) — Padrão</option>
                      <option value="h">h (Horas)</option>
                      <option value="s">s (Segundos)</option>
                    </select>
                  </div>

                  {/* Feedback reativo da base de cálculo em minutos */}
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-blue-50/60 rounded-xl px-2.5 py-1 border border-blue-100">
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                      <span>Base de Cálculo:</span>
                    </span>
                    <span className="font-mono font-bold text-blue-700">
                      {standardTimeMinCalculated.toFixed(2)} min{' '}
                      <span className="text-slate-500 font-normal">
                        ({standardTimeHoursCalculated.toFixed(4)} h)
                      </span>
                    </span>
                  </div>
                </div>

                {/* Campo 4: Causa Raiz / Descrição */}
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <label htmlFor="root-cause-select" className="flex items-center space-x-1.5 cursor-pointer">
                      <span>Causa Raiz / Descrição do Fator Gerador</span>
                      <span className="text-[10px] text-blue-600 font-mono font-normal">
                        ({ALL_WCM_ROOT_CAUSES.length} opções WCM)
                      </span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsCustomRootCauseInput(!isCustomRootCauseInput)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer transition"
                      >
                        {isCustomRootCauseInput ? '← Selecionar da Lista' : '✏️ Digitar Texto Livre'}
                      </button>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Foco Kaizen / WCM</span>
                    </div>
                  </div>

                  {isCustomRootCauseInput ? (
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="text"
                        value={currentDeployment.rootCauseName}
                        onChange={(e) => handleUpdateCurrentField('rootCauseName', e.target.value)}
                        placeholder="Digite a causa raiz ou descrição personalizada..."
                        className="w-full bg-white border border-blue-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomRootCauseInput(false)}
                        className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
                        title="Voltar para a lista suspensa"
                      >
                        Lista
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        id="root-cause-select"
                        value={currentDeployment.rootCauseName}
                        onChange={(e) => handleSelectRootCause(e.target.value)}
                        className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200 hover:border-blue-400 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs pr-8 transition truncate"
                      >
                        {/* Se o valor atual não estiver na lista padrão, exibe-o como selecionado */}
                        {!ALL_WCM_ROOT_CAUSES.includes(currentDeployment.rootCauseName) && (
                          <option value={currentDeployment.rootCauseName} className="text-slate-900 bg-white">
                            {currentDeployment.rootCauseName || '-- Selecione uma causa raiz --'}
                          </option>
                        )}
                        <option value="" disabled className="text-slate-900 bg-white">
                          -- Selecione da Lista Padronizada WCM ({ALL_WCM_ROOT_CAUSES.length} opções) --
                        </option>
                        {WCM_ROOT_CAUSES_CATEGORIZED.map((cat) => (
                          <optgroup
                            key={cat.category}
                            label={cat.category}
                            className="bg-slate-100 text-slate-900 font-bold"
                          >
                            {cat.items.map((item) => (
                              <option
                                key={item}
                                value={item}
                                className="bg-white text-slate-800 font-medium py-1"
                              >
                                {item}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                        <option value="__custom__" className="text-blue-700 font-bold bg-white">✏️ Outra causa (digitar texto livre)...</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Campo 5: Setor / Macro-processo de Origem */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Setor / Macro-processo de Origem</span>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Macro</span>
                  </label>
                  <input
                    type="text"
                    value={currentDeployment.originSector || processMap.get(currentDeployment.originProcessId)?.plantSection || 'Upstream'}
                    onChange={(e) => handleUpdateCurrentField('originSector', e.target.value)}
                    placeholder="ex: Upstream / Biorreatores / Envase"
                    className="w-full bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200 hover:border-blue-400 focus:border-blue-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition"
                  />
                </div>
              </div>

              {/* Status, Variance and Synchronize with Matrix A */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-600">
                      Origem:{' '}
                      <strong className="text-slate-900">
                        {processMap.get(currentDeployment.originProcessId)?.name || 'Equipamento'}
                      </strong>{' '}
                      ×{' '}
                      <strong className="text-blue-700">
                        {lossMap.get(currentDeployment.lossId)?.name || 'Perda'}
                      </strong>
                    </span>
                  </div>

                  <span className="text-slate-300 hidden sm:inline">|</span>

                  {/* Comparativo Tempo Padrão vs Tempo Parada Mapeado */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-600">
                      Padrão: <strong className="text-slate-900 font-mono">{standardTimeMinCalculated.toFixed(1)} min</strong>
                    </span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="text-slate-600">
                      Real Parado: <strong className="text-amber-700 font-mono">{actualStoppageMin.toFixed(1)} min</strong>
                    </span>
                    {varianceMin > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 font-mono">
                        +{varianceMin.toFixed(1)} min excedente
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                        Dentro do padrão
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PAINEL DE PARÂMETROS: ELEMENTOS DE CUSTO (Taxas Unitárias) */}
            <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        2. Elementos de Custo (Taxas)
                      </h3>
                      <p className="text-xs text-slate-500">Taxas unitárias editáveis em tempo real</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {financialParams.currency || 'BRL'}
                  </span>
                </div>

                {/* Scrollable Container with Lateral Scrollbar */}
                <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentCostElements.map((cost) => (
                    <div
                      key={cost.id}
                      className="bg-slate-50/90 border border-slate-200/80 hover:border-blue-300 rounded-xl p-3 flex items-center justify-between gap-3 group transition shadow-2xs"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between pr-2">
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {cost.name}
                          </span>
                          <button
                            onClick={() => handleDeleteCostElement(cost.id)}
                            title="Excluir este elemento de custo"
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition p-0.5 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Seletor de Unidade: R$/hora vs Só Reais */}
                        <div className="flex items-center space-x-2">
                          <select
                            value={cost.unit}
                            onChange={(e) =>
                              handleUpdateCostElementUnit(cost.id, e.target.value as CostUnitType)
                            }
                            className="bg-white text-[11px] font-bold text-blue-700 border border-slate-200 hover:border-blue-400 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
                            title="Alternar entre cobrança por hora ou valor monetário fixo (só reais)"
                          >
                            <option value="reais_hora">R$/hora</option>
                            <option value="reais_fixo">R$ (só reais / fixo)</option>
                          </select>
                          <span className="text-[10px] text-slate-500 truncate">
                            {cost.unit === 'reais_fixo'
                              ? 'valor fixo'
                              : cost.name.toLowerCase().includes('mão de obra')
                              ? 'por operador'
                              : 'processo'}
                          </span>
                        </div>
                      </div>

                      {/* Campo de Valor com R$ */}
                      <div className="w-32 relative shrink-0">
                        <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">R$</span>
                        <input
                          type="number"
                          step={cost.unit === 'reais_hora' ? '0.05' : '1'}
                          min="0"
                          value={cost.rate === 0 ? '' : cost.rate}
                          placeholder="0"
                          onChange={(e) => handleUpdateCostElementRate(cost.id, e.target.value)}
                          className={`w-full bg-white border border-slate-200 hover:border-blue-400 rounded-xl pl-8 pr-2.5 py-1.5 text-right font-black text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs ${
                            cost.unit === 'reais_fixo'
                              ? 'text-cyan-700'
                              : cost.name.toLowerCase().includes('energia')
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Formulário para Adicionar Outro Elemento de Custo */}
                  {showAddCostElement ? (
                    <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 space-y-2.5 animate-in fade-in duration-150 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900">Novo Elemento de Custo:</span>
                        <button
                          onClick={() => setShowAddCostElement(false)}
                          className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Nome (ex: Matéria-Prima, Vapor, Sucata)"
                        value={newCostName}
                        onChange={(e) => setNewCostName(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none shadow-2xs"
                        autoFocus
                      />
                      <div className="flex items-center space-x-2">
                        <div className="w-1/2">
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Unidade</label>
                          <select
                            value={newCostUnit}
                            onChange={(e) => setNewCostUnit(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-blue-700 focus:outline-none cursor-pointer shadow-2xs"
                          >
                            <option value="reais_hora">R$/hora (por tempo)</option>
                            <option value="reais_fixo">R$ (só reais / fixo)</option>
                          </select>
                        </div>
                        <div className="w-1/2">
                          <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Valor Inicial</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1.5 text-xs text-slate-400 font-bold">R$</span>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0"
                              value={newCostRate}
                              onChange={(e) => setNewCostRate(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-2 py-1.5 text-xs text-slate-900 font-black text-right focus:outline-none shadow-2xs"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          onClick={() => setShowAddCostElement(false)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleAddCostElement}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 shadow cursor-pointer"
                        >
                          Salvar Elemento
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setNewCostName('');
                        setNewCostRate('');
                        setNewCostUnit('reais_hora');
                        setShowAddCostElement(true);
                      }}
                      className="w-full py-2.5 border border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition active:scale-98 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Outro Elemento de Custo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Informative Subtotal Highlight */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="text-slate-500 font-bold">Total Calculado da Perda:</span>
                  {(currentCalculation.totalFixedCost ?? 0) > 0 && (
                    <span className="text-[10px] text-slate-400">
                      (Inclui {formatCurrency(currentCalculation.totalFixedCost ?? 0)} em custos fixos)
                    </span>
                  )}
                </div>
                <span className="text-base font-black text-emerald-600 font-mono">
                  {formatCurrency(currentCalculation.totalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* 3. TABELA INTEGRADA (MATRIZ B + MATRIZ C) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            {/* Table Header Bar with Actions */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <span>3. Tabela Integrada (Matriz B + Matriz C)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Colunas da esquerda representam o fluxo físico da Matriz B; colunas da direita calculam o impacto financeiro da Matriz C.
                </p>
              </div>

              {/* Quick Template Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-bold hidden md:inline">Modelos Rápidos:</span>
                <button
                  onClick={() => handleApplyProcessTemplate('bio')}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition shadow-2xs cursor-pointer active:scale-95"
                  title="Insere etapas típicas de Bioprocesso: Setup, Formulação, Inoculação, Cultivo"
                >
                  + Etapas Bioprocesso
                </button>
                <button
                  onClick={() => handleApplyProcessTemplate('packaging')}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition shadow-2xs cursor-pointer active:scale-95"
                  title="Insere etapas de Envase e Embalagem"
                >
                  + Etapas Envase
                </button>
              </div>
            </div>

            {/* Responsive Table Wrapper with Horizontal Scrollbar */}
            <div className="overflow-x-auto custom-scrollbar pb-3">
              <table
                className="w-full text-left border-collapse"
                style={{
                  minWidth: `${Math.max(980, 560 + Math.max(1, currentCostElements.length) * 150)}px`,
                }}
              >
                {/* Visual Category Super-Header */}
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-wider">
                    <th
                      colSpan={4}
                      className="bg-gradient-to-r from-blue-50 to-blue-100/70 text-blue-900 py-2.5 px-4 border-r border-blue-200 text-center font-black"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>COLUNAS DA MATRIZ B — Mapeamento Físico</span>
                      </div>
                    </th>
                    <th
                      colSpan={Math.max(1, currentCostElements.length) + 1}
                      className="bg-gradient-to-r from-indigo-50 to-emerald-50/70 text-indigo-950 py-2.5 px-4 border-r border-indigo-200 text-center font-black"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <CircleDollarSign className="w-4 h-4 text-emerald-600" />
                        <span>COLUNAS DA MATRIZ C — Impacto Financeiro (Cálculo Automático)</span>
                      </div>
                    </th>
                    <th className="bg-slate-50 text-slate-600 py-2.5 px-3 text-center w-16 font-bold">
                      Ações
                    </th>
                  </tr>

                  {/* Standard Column Headers */}
                  <tr className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-slate-200">
                    {/* B1: Etapa Impactada */}
                    <th className="py-3 px-4 min-w-[200px]">1. Etapa Impactada (Downstream)</th>

                    {/* B2: Houve Parada? */}
                    <th className="py-3 px-3 text-center min-w-[120px]">
                      2. Houve Parada?
                    </th>

                    {/* B3: Tempo de Parada */}
                    <th className="py-3 px-3 text-right min-w-[130px]">
                      3. Tempo de Parada (horas)
                    </th>

                    {/* B4: Nº Operadores */}
                    <th className="py-3 px-3 text-center min-w-[140px] border-r border-slate-200">
                      4. Nº Operadores Ociosos/Envolvidos
                    </th>

                    {/* Dynamic Matriz C Columns from currentCostElements */}
                    {currentCostElements.length === 0 ? (
                      <th className="py-3 px-4 text-center text-slate-400 italic min-w-[160px]">
                        Nenhum elemento cadastrado
                      </th>
                    ) : (
                      currentCostElements.map((cost, idx) => (
                        <th
                          key={cost.id}
                          className="py-3 px-3 text-right min-w-[140px] font-bold text-slate-800"
                        >
                          <div className="flex flex-col items-end">
                            <span>{5 + idx}. {cost.name} (R$)</span>
                            <span className="text-[10px] font-normal text-slate-400">
                              {cost.unit === 'reais_fixo'
                                ? 'Fixo'
                                : cost.name.toLowerCase().includes('mão de obra')
                                ? 'R$/h por op'
                                : 'R$/h'}
                            </span>
                          </div>
                        </th>
                      ))
                    )}

                    {/* Subtotal da Etapa */}
                    <th className="py-3 px-4 text-right min-w-[150px] text-slate-900 font-extrabold border-r border-slate-200">
                      {5 + currentCostElements.length}. Subtotal da Etapa (R$)
                    </th>

                    {/* Ações */}
                    <th className="py-3 px-2 text-center w-16 text-slate-400 font-bold">
                      Remover
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {currentCalculation.stages.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5 + Math.max(1, currentCostElements.length) + 1}
                        className="py-8 text-center text-slate-400"
                      >
                        Nenhuma etapa impactada adicionada ainda. Clique no botão abaixo para adicionar etapas.
                      </td>
                    </tr>
                  ) : (
                    currentCalculation.stages.map((stage) => {
                      const isStop = stage.isStop;
                      return (
                        <tr
                          key={stage.id}
                          className={`transition ${
                            isStop
                              ? 'hover:bg-blue-50/40 bg-white'
                              : 'bg-slate-50/40 text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {/* 1. Nome da Etapa */}
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={stage.stageName}
                              onChange={(e) => handleUpdateStage(stage.id, { stageName: e.target.value })}
                              className="w-full bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                            />
                          </td>

                          {/* 2. Houve Parada? (Dropdown Sim / Não) */}
                          <td className="py-2.5 px-3 text-center">
                            <select
                              value={isStop ? 'Sim' : 'Não'}
                              onChange={(e) => handleUpdateStage(stage.id, { isStop: e.target.value === 'Sim' })}
                              className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition cursor-pointer shadow-2xs ${
                                isStop
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500'
                                  : 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500'
                              }`}
                            >
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </td>

                          {/* 3. Tempo de Parada (horas) */}
                          <td className="py-2.5 px-3 text-right">
                            {isStop ? (
                              <div className="flex items-center justify-end space-x-1.5">
                                <input
                                  type="number"
                                  step="0.0001"
                                  min="0"
                                  value={stage.durationHours}
                                  onChange={(e) => {
                                    const parsed = parseFloat(e.target.value.replace(',', '.'));
                                    handleUpdateStage(stage.id, {
                                      durationHours: isNaN(parsed) ? 0 : Math.max(0, parsed),
                                    });
                                  }}
                                  className="w-24 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-xs text-slate-900 font-mono font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                                />
                                <span className="text-[10px] text-slate-500 font-mono">h</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono italic">0,0000 h (zerado)</span>
                            )}
                          </td>

                          {/* 4. Número de Operadores Ociosos/Envolvidos */}
                          <td className="py-2.5 px-3 text-center border-r border-slate-200">
                            {isStop ? (
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={stage.operatorCount}
                                onChange={(e) => {
                                  const parsed = parseInt(e.target.value, 10);
                                  handleUpdateStage(stage.id, {
                                    operatorCount: isNaN(parsed) ? 0 : Math.max(0, parsed),
                                  });
                                }}
                                className="w-16 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2 py-1 text-center text-xs text-slate-900 font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs mx-auto"
                              />
                            ) : (
                              <span className="text-slate-400 font-mono">-</span>
                            )}
                          </td>

                          {/* Dynamic Matriz C Cells for this Stage */}
                          {currentCostElements.length === 0 ? (
                            <td className="py-2.5 px-4 text-center text-slate-400 font-mono italic">
                              -
                            </td>
                          ) : (
                            currentCostElements.map((cost) => {
                              const cellCost = getStageElementCost(
                                stage,
                                cost,
                                currentCalculation.totalDurationHours,
                                currentCalculation.stages.filter((s) => s.isStop).length
                              );
                              return (
                                <td
                                  key={cost.id}
                                  className="py-2.5 px-3 text-right font-mono font-bold text-slate-800"
                                >
                                  {formatCurrency(cellCost)}
                                </td>
                              );
                            })
                          )}

                          {/* Subtotal da Etapa (R$) */}
                          <td className="py-2.5 px-4 text-right font-mono font-black text-slate-900 text-sm bg-slate-50/50 border-r border-slate-200">
                            {formatCurrency(stage.subtotalCost)}
                          </td>

                          {/* Ações */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => handleRemoveStage(stage.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Remover etapa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {/* RODAPÉ DA TABELA (TOTALIZADORES) */}
                <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-black text-xs text-slate-800">
                  <tr className="divide-x divide-slate-200">
                    {/* Legenda de Totais */}
                    <td className="py-4 px-4 text-slate-900 uppercase tracking-wider font-extrabold text-sm">
                      TOTALIZADORES GERAIS:
                    </td>

                    {/* Status Total */}
                    <td className="py-4 px-3 text-center text-slate-600 font-bold">
                      {currentCalculation.stages.filter((s) => s.isStop).length} Etapas com Parada
                    </td>

                    {/* Total Horas Paradas acumuladas */}
                    <td className="py-4 px-3 text-right font-mono text-blue-700 font-extrabold text-sm">
                      <div>{currentCalculation.totalDurationHours.toFixed(4)} h</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        (~{actualStoppageMin.toFixed(1)} min)
                      </div>
                      <div className="text-[9px] text-blue-600 font-mono mt-0.5">
                        Padrão: {standardTimeMinCalculated.toFixed(1)} min
                      </div>
                    </td>

                    {/* Total Operadores */}
                    <td className="py-4 px-3 text-center text-slate-600 font-medium">
                      Média:{' '}
                      {(
                        currentCalculation.stages.reduce((acc, s) => acc + (s.isStop ? s.operatorCount : 0), 0) /
                        (currentCalculation.stages.filter((s) => s.isStop).length || 1)
                      ).toFixed(1)}{' '}
                      op
                    </td>

                    {/* Dynamic Matriz C Column Totals */}
                    {currentCostElements.length === 0 ? (
                      <td className="py-4 px-4 text-center text-slate-400 font-mono italic">
                        R$ 0,00
                      </td>
                    ) : (
                      currentCostElements.map((cost) => {
                        const colTotal = getElementTotalCost(
                          currentCalculation.stages,
                          cost,
                          currentCalculation.totalDurationHours
                        );
                        return (
                          <td
                            key={cost.id}
                            className="py-4 px-3 text-right font-mono font-extrabold text-sm text-slate-900"
                          >
                            {formatCurrency(colTotal)}
                          </td>
                        );
                      })
                    )}

                    {/* CUSTO TOTAL DA PERDA (Soma de todos os custos) */}
                    <td className="py-3 px-4 text-right bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl shadow-md border border-blue-400/50">
                      <div className="text-[10px] uppercase text-cyan-200 font-bold tracking-wider">
                        CUSTO TOTAL DA PERDA
                      </div>
                      <div className="text-base sm:text-lg font-black text-white font-mono">
                        {formatCurrency(currentCalculation.totalCost)}
                      </div>
                    </td>

                    <td className="py-4 px-2 bg-slate-50"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Quick Add Row Toolbar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Nome da nova etapa downstream (ex: Descarte e Lavagem)"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddStage();
                  }}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 w-full sm:w-80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
                <button
                  onClick={() => handleAddStage()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shrink-0 transition shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Etapa</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cálculo em Tempo Real
                </span>
                {currentCostElements.map((cost) => (
                  <React.Fragment key={cost.id}>
                    <span>•</span>
                    <span className="text-slate-600">
                      {cost.name}:{' '}
                      <strong className="text-slate-900 font-bold">
                        {formatCurrency(cost.rate)}
                        {cost.unit === 'reais_fixo' ? ' (fixo)' : '/h'}
                      </strong>
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Explanatory Notes & Strategic Guidance */}
          <div className="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-4 text-xs text-slate-600 flex items-start space-x-3 shadow-2xs">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">
                Como funciona a correlação Matriz B + Matriz C:
              </p>
              <p>
                1. O evento nasce no <strong className="text-slate-900">Equipamento de Origem</strong> (Matriz A).<br />
                2. As colunas da <strong className="text-slate-900">Matriz B</strong> desdobram quais etapas do processo downstream sofreram parada e por quanto tempo.<br />
                3. A <strong className="text-slate-900">Matriz C</strong> converte o tempo físico em valor monetário direto (Mão de Obra ociosa + Consumo de Energia Elétrica/utilidades), fornecendo o custo real exato para priorização de projetos Kaizen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CONSOLIDATED PLANT OVERVIEW (Todas as Perdas da Fábrica) */}
      {activeTab === 'consolidated' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>Visão Consolidada: Todas as Perdas Mapeadas</span>
              </h3>
              <p className="text-xs text-slate-500">
                Tabela geral contendo todos os eventos de perda física (B) e financeira (C) da planta
              </p>
            </div>

            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Filtrar eventos..."
                value={searchEventTerm}
                onChange={(e) => setSearchEventTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Equipamento / Origem</th>
                  <th className="py-2.5 px-3">Setor</th>
                  <th className="py-2.5 px-3">Perda Mapeada</th>
                  <th className="py-2.5 px-3 text-center">Tempo Padrão</th>
                  <th className="py-2.5 px-3">Causa Raiz</th>
                  <th className="py-2.5 px-2 text-center">Pilar</th>
                  <th className="py-2.5 px-3 text-center">Etapas</th>
                  <th className="py-2.5 px-3 text-right">Horas Paradas</th>
                  <th className="py-2.5 px-3 text-right text-emerald-700">Mão de Obra</th>
                  <th className="py-2.5 px-3 text-right text-amber-700">Energia</th>
                  <th className="py-2.5 px-3 text-right text-slate-900 font-black">Custo Total R$</th>
                  <th className="py-2.5 px-2 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredEventsList.map((dep) => {
                  const proc = processMap.get(dep.originProcessId);
                  const loss = lossMap.get(dep.lossId);

                  let depHours = 0;
                  let depLabor = 0;
                  let depEnergy = 0;

                  (dep.impactedStages || []).forEach((stg) => {
                    const isStop = stg.isStop !== false;
                    const dur = isStop ? Number(stg.durationHours || 0) : 0;
                    const ops = isStop ? Number(stg.operatorCount || 1) : 0;
                    const energyRate = stg.customEnergyRatePerHour ?? electricityRate;

                    depHours += dur;
                    depLabor += dur * ops * hourlyLaborRate;
                    depEnergy += dur * energyRate;
                  });

                  const depTotal = depLabor + depEnergy;

                  return (
                    <tr
                      key={dep.id}
                      className="hover:bg-blue-50/40 transition cursor-pointer text-slate-800"
                      onClick={() => {
                        setActiveDeploymentId(dep.id);
                        setActiveTab('event');
                      }}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {proc?.name || dep.originProcessName || 'Equipamento'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {dep.originSector || proc?.plantSection || 'Upstream'}
                      </td>
                      <td className="py-2.5 px-3 text-blue-700 font-bold">
                        {loss?.name || dep.lossName || 'Perda'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-blue-700 font-bold">
                        {dep.standardTimeText || (dep.standardTimeMin !== undefined ? `${dep.standardTimeMin} min` : '15 min')}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {dep.rootCauseName}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {dep.pillar}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                        {dep.impactedStages?.length || 0}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700 font-bold">
                        {depHours.toFixed(2)} h
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">
                        {formatCurrency(depLabor)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-700 font-bold">
                        {formatCurrency(depEnergy)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900 text-sm bg-slate-50/60">
                        {formatCurrency(depTotal)}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDeploymentId(dep.id);
                            setActiveTab('event');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold shadow-2xs cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
