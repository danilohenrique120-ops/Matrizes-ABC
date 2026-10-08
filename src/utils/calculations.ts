import {
  ProcessArea,
  LossCategory,
  RootCause,
  MatrixACell,
  MatrixBCell,
  FinancialParameters,
  LossCostBreakdown,
  CalculatedProcessCost,
  CalculatedRootCauseCost,
  CalculatedLossSummary,
  WCMPillar,
  CausalDeployment,
  CalculatedDeploymentCost,
  CalculatedStageCost,
} from '../types/wcm';

/**
 * Calculates Cost Deployment directly from Causal Deployments (Excel Interpretation)
 * Total Cost = Labor Cost (Hours * Operators * LaborRate) + Energy Cost (Hours * ElectricityRate)
 */
export function calculateCausalDeployments(
  deployments: CausalDeployment[],
  processes: ProcessArea[],
  losses: LossCategory[],
  financialParams: FinancialParameters
) {
  const hourlyLaborRate = financialParams.hourlyLaborRate || 100.0;
  const electricityRate = financialParams.electricityCostPerKWh || 0.70;

  // Fast lookup maps
  const processMap = new Map<string, ProcessArea>(processes.map((p) => [p.id, p]));
  const lossMap = new Map<string, LossCategory>(losses.map((l) => [l.id, l]));

  let totalPlantCost = 0;
  let totalLaborCost = 0;
  let totalEnergyCost = 0;
  let totalDurationHours = 0;

  // Calculate each deployment line and its impacted stages
  const calculatedDeployments: CalculatedDeploymentCost[] = (deployments || []).map((dep) => {
    const originProc = processMap.get(dep.originProcessId);
    const loss = lossMap.get(dep.lossId);

    let depLaborCost = 0;
    let depEnergyCost = 0;
    let depOtherHourlyCost = 0;
    let depDurationHours = 0;

    const hasCustomElements = Array.isArray(dep.costElements);
    
    // Find labor element if specified
    const depLaborElement = hasCustomElements
      ? dep.costElements?.find((e) => e.isActive !== false && e.unit === 'reais_hora' && (e.name.toLowerCase().includes('mão de obra') || (e.unitDetail && e.unitDetail.includes('operador'))))
      : null;
    const depLaborRate = depLaborElement !== undefined && depLaborElement !== null
      ? depLaborElement.rate
      : (hasCustomElements ? 0 : hourlyLaborRate);

    // Find energy element if specified
    const depEnergyElement = hasCustomElements
      ? dep.costElements?.find((e) => e.isActive !== false && e.unit === 'reais_hora' && e.name.toLowerCase().includes('energia'))
      : null;
    const depEnergyRate = depEnergyElement !== undefined && depEnergyElement !== null
      ? depEnergyElement.rate
      : (hasCustomElements ? 0 : electricityRate);

    // Other hourly elements (R$/hora)
    const otherHourlyElements = hasCustomElements
      ? (dep.costElements || []).filter(
          (e) =>
            e.isActive !== false &&
            e.unit === 'reais_hora' &&
            e.id !== depLaborElement?.id &&
            e.id !== depEnergyElement?.id
        )
      : [];

    // Fixed cost elements (R$ só reais / fixo)
    const depFixedCost = hasCustomElements
      ? (dep.costElements || [])
          .filter((e) => e.isActive !== false && e.unit === 'reais_fixo')
          .reduce((sum, el) => sum + (Number(el.rate) || 0), 0)
      : 0;

    const stages: CalculatedStageCost[] = (dep.impactedStages || []).map((stage) => {
      const dur = typeof stage.durationHours === 'number' ? stage.durationHours : parseFloat(String(stage.durationHours)) || 0;
      const ops = typeof stage.operatorCount === 'number' ? stage.operatorCount : parseInt(String(stage.operatorCount), 10) || 1;
      
      const labor = dur * ops * depLaborRate;
      const energyRate = typeof stage.customEnergyRatePerHour === 'number' ? stage.customEnergyRatePerHour : depEnergyRate;
      const energy = dur * energyRate;
      const otherHourly = otherHourlyElements.reduce((acc, el) => acc + dur * (Number(el.rate) || 0), 0);
      const total = labor + energy + otherHourly;

      depLaborCost += labor;
      depEnergyCost += energy;
      depOtherHourlyCost += otherHourly;
      depDurationHours += dur;

      return {
        stageId: stage.id,
        stageName: stage.stageName,
        isStop: stage.isStop,
        durationHours: dur,
        operatorCount: ops,
        laborCost: labor,
        energyCost: energy + otherHourly,
        totalCost: total,
      };
    });

    const depTotalCost = depLaborCost + depEnergyCost + depOtherHourlyCost + depFixedCost;

    totalPlantCost += depTotalCost;
    totalLaborCost += depLaborCost;
    totalEnergyCost += depEnergyCost;
    totalDurationHours += depDurationHours;

    return {
      deployment: dep,
      originProcessName: originProc?.name || dep.originProcessName || 'Equipamento',
      originProcessCode: originProc?.code || 'EQP',
      lossName: loss?.name || dep.lossName || 'Perda',
      lossCode: loss?.code || '1.1.2',
      standardTimeMin: dep.standardTimeMin ?? 15,
      rootCauseName: dep.rootCauseName,
      pillar: dep.pillar || 'FI',
      stages,
      totalLaborCost: depLaborCost,
      totalEnergyCost: depEnergyCost,
      totalCost: depTotalCost,
      totalDurationHours: depDurationHours,
    };
  });

  // Calculate Equipment / Process Costs
  const processCostsMap: Record<
    string,
    {
      processId: string;
      processName: string;
      processCode: string;
      section: string;
      totalLossCost: number;
      laborCost: number;
      energyCost: number;
      hours: number;
    }
  > = {};

  calculatedDeployments.forEach((calc) => {
    const pId = calc.deployment.originProcessId;
    const proc = processMap.get(pId);
    if (!processCostsMap[pId]) {
      processCostsMap[pId] = {
        processId: pId,
        processName: proc?.name || calc.originProcessName,
        processCode: proc?.code || calc.originProcessCode,
        section: proc?.plantSection || 'Produção',
        totalLossCost: 0,
        laborCost: 0,
        energyCost: 0,
        hours: 0,
      };
    }
    processCostsMap[pId].totalLossCost += calc.totalCost;
    processCostsMap[pId].laborCost += calc.totalLaborCost;
    processCostsMap[pId].energyCost += calc.totalEnergyCost;
    processCostsMap[pId].hours += calc.totalDurationHours;
  });

  const sortedProcesses = Object.values(processCostsMap).sort((a, b) => b.totalLossCost - a.totalLossCost);
  let cumProc = 0;
  const processPareto = sortedProcesses.map((p) => {
    cumProc += p.totalLossCost;
    return {
      ...p,
      costsByLoss: {},
      percentage: totalPlantCost > 0 ? (p.totalLossCost / totalPlantCost) * 100 : 0,
      cumulativePercentage: totalPlantCost > 0 ? (cumProc / totalPlantCost) * 100 : 0,
    };
  });

  // Calculate Root Cause Pareto
  const rootCausesMap: Record<
    string,
    {
      causeName: string;
      causeCode: string;
      pillar: WCMPillar;
      totalCost: number;
      laborCost: number;
      energyCost: number;
      hours: number;
      count: number;
      category: string;
    }
  > = {};

  calculatedDeployments.forEach((calc) => {
    const key = `${calc.rootCauseName}_${calc.pillar}`;
    if (!rootCausesMap[key]) {
      rootCausesMap[key] = {
        causeName: calc.rootCauseName,
        causeCode: calc.deployment.rootCauseCode || 'C01',
        pillar: calc.pillar,
        totalCost: 0,
        laborCost: 0,
        energyCost: 0,
        hours: 0,
        count: 0,
        category: calc.deployment.category || 'Método',
      };
    }
    rootCausesMap[key].totalCost += calc.totalCost;
    rootCausesMap[key].laborCost += calc.totalLaborCost;
    rootCausesMap[key].energyCost += calc.totalEnergyCost;
    rootCausesMap[key].hours += calc.totalDurationHours;
    rootCausesMap[key].count += 1;
  });

  const sortedCauses = Object.values(rootCausesMap).sort((a, b) => b.totalCost - a.totalCost);
  let cumCause = 0;
  const rootCausePareto = sortedCauses.map((c, idx) => {
    cumCause += c.totalCost;
    return {
      causeId: `cause_${idx + 1}`,
      causeCode: c.causeCode,
      causeName: c.causeName,
      pillar: c.pillar,
      category: c.category,
      totalCost: c.totalCost,
      percentage: totalPlantCost > 0 ? (c.totalCost / totalPlantCost) * 100 : 0,
      cumulativePercentage: totalPlantCost > 0 ? (cumCause / totalPlantCost) * 100 : 0,
      affectedLossesCount: c.count,
    };
  });

  // Pillar Summary
  const pillarMap: Record<string, { totalCost: number; count: number }> = {};
  calculatedDeployments.forEach((calc) => {
    if (!pillarMap[calc.pillar]) {
      pillarMap[calc.pillar] = { totalCost: 0, count: 0 };
    }
    pillarMap[calc.pillar].totalCost += calc.totalCost;
    pillarMap[calc.pillar].count += 1;
  });

  const pillarSummary = Object.entries(pillarMap)
    .map(([pillar, val]) => ({
      pillar: pillar as WCMPillar,
      totalCost: val.totalCost,
      percentage: totalPlantCost > 0 ? (val.totalCost / totalPlantCost) * 100 : 0,
      causesCount: val.count,
    }))
    .sort((a, b) => b.totalCost - a.totalCost);

  return {
    calculatedDeployments,
    totalPlantCost,
    totalLaborCost,
    totalEnergyCost,
    totalDurationHours,
    processPareto,
    rootCausePareto,
    pillarSummary,
    costBreakdown: {
      laborCost: totalLaborCost,
      machineCost: 0,
      materialCost: 0,
      energyCost: totalEnergyCost,
      maintenanceCost: 0,
      totalCost: totalPlantCost,
    } as LossCostBreakdown,
  };
}

/**
 * Calculates the financial cost breakdown for a specific physical loss quantity
 */
export function calculateLossCost(
  loss: LossCategory,
  physicalQuantity: number,
  params: FinancialParameters
): LossCostBreakdown {
  if (physicalQuantity <= 0) {
    return {
      laborCost: 0,
      machineCost: 0,
      materialCost: 0,
      energyCost: 0,
      maintenanceCost: 0,
      totalCost: 0,
    };
  }

  const multiplier = loss.costDrivers.customMultiplier || 1.0;
  let laborCost = 0;
  let machineCost = 0;
  let materialCost = 0;
  let energyCost = 0;
  let maintenanceCost = 0;

  if (loss.unit === 'horas') {
    if (loss.costDrivers.useLabor) {
      laborCost = physicalQuantity * params.hourlyLaborRate * multiplier;
    }
    if (loss.costDrivers.useMachineOverhead) {
      machineCost = physicalQuantity * params.hourlyMachineOverhead * multiplier;
    }
    if (loss.costDrivers.useMaintenance) {
      maintenanceCost = physicalQuantity * params.averageMaintenanceCostPerHour * multiplier;
    }
  } else if (loss.unit === 'kg') {
    if (loss.costDrivers.useMaterial) {
      materialCost = physicalQuantity * params.rawMaterialCostPerKg * multiplier;
    }
  } else if (loss.unit === 'kWh') {
    if (loss.costDrivers.useElectricity) {
      energyCost = physicalQuantity * params.electricityCostPerKWh * multiplier;
    }
  } else if (loss.unit === 'm³') {
    if (loss.costDrivers.useWaterSteam) {
      energyCost = physicalQuantity * params.waterSteamCostPerM3 * multiplier;
    }
  } else if (loss.unit === 'peças' || loss.unit === 'unidades') {
    materialCost = physicalQuantity * params.scrapCostPerUnit * multiplier;
  }

  const totalCost = laborCost + machineCost + materialCost + energyCost + maintenanceCost;

  return {
    laborCost,
    machineCost,
    materialCost,
    energyCost,
    maintenanceCost,
    totalCost,
  };
}

/**
 * Comprehensive Cost Deployment Calculation Engine
 */
export function calculateWCMDeployment(
  processes: ProcessArea[],
  losses: LossCategory[],
  rootCauses: RootCause[],
  matrixA: MatrixACell[],
  matrixB: MatrixBCell[],
  financialParams: FinancialParameters
) {
  // 1. Matrix A Fast Lookup map: (processId_lossId) -> value
  const matrixAMap = new Map<string, number>();
  matrixA.forEach((cell) => {
    matrixAMap.set(`${cell.processId}_${cell.lossId}`, cell.value);
  });

  // 2. Matrix B Fast Lookup map: (lossId_rootCauseId) -> correlation
  const matrixBMap = new Map<string, number>();
  matrixB.forEach((cell) => {
    matrixBMap.set(`${cell.lossId}_${cell.rootCauseId}`, cell.correlation);
  });

  // 3. Calculate Loss Totals across all processes (Physical & Financial)
  const lossSummaries: CalculatedLossSummary[] = losses.map((loss) => {
    let totalPhysicalValue = 0;
    processes.forEach((proc) => {
      const val = matrixAMap.get(`${proc.id}_${loss.id}`) || 0;
      totalPhysicalValue += val;
    });

    const breakdown = calculateLossCost(loss, totalPhysicalValue, financialParams);

    return {
      lossId: loss.id,
      lossCode: loss.code,
      lossName: loss.name,
      unit: loss.unit,
      totalPhysicalValue,
      totalFinancialCost: breakdown.totalCost,
      percentage: 0, // calculated next
      cumulativePercentage: 0,
      breakdown,
    };
  });

  // Calculate total plant financial loss
  const totalPlantCost = lossSummaries.reduce((sum, item) => sum + item.totalFinancialCost, 0);

  // Calculate total breakdowns
  const totalCostBreakdown: LossCostBreakdown = lossSummaries.reduce(
    (acc, curr) => ({
      laborCost: acc.laborCost + curr.breakdown.laborCost,
      machineCost: acc.machineCost + curr.breakdown.machineCost,
      materialCost: acc.materialCost + curr.breakdown.materialCost,
      energyCost: acc.energyCost + curr.breakdown.energyCost,
      maintenanceCost: acc.maintenanceCost + curr.breakdown.maintenanceCost,
      totalCost: acc.totalCost + curr.breakdown.totalCost,
    }),
    { laborCost: 0, machineCost: 0, materialCost: 0, energyCost: 0, maintenanceCost: 0, totalCost: 0 }
  );

  // Sort losses descending for Pareto
  const sortedLosses = [...lossSummaries].sort((a, b) => b.totalFinancialCost - a.totalFinancialCost);
  let cumLossSum = 0;
  sortedLosses.forEach((item) => {
    cumLossSum += item.totalFinancialCost;
    item.percentage = totalPlantCost > 0 ? (item.totalFinancialCost / totalPlantCost) * 100 : 0;
    item.cumulativePercentage = totalPlantCost > 0 ? (cumLossSum / totalPlantCost) * 100 : 0;
  });

  // 4. Calculate Process Costs
  const processCosts: CalculatedProcessCost[] = processes.map((proc) => {
    let totalLossCost = 0;
    const costsByLoss: Record<string, LossCostBreakdown> = {};

    losses.forEach((loss) => {
      const physicalVal = matrixAMap.get(`${proc.id}_${loss.id}`) || 0;
      const breakdown = calculateLossCost(loss, physicalVal, financialParams);
      costsByLoss[loss.id] = breakdown;
      totalLossCost += breakdown.totalCost;
    });

    return {
      processId: proc.id,
      processName: proc.name,
      processCode: proc.code,
      section: proc.plantSection,
      totalLossCost,
      costsByLoss,
    };
  });

  // Sort processes descending for Pareto
  const sortedProcesses = [...processCosts].sort((a, b) => b.totalLossCost - a.totalLossCost);
  let cumProcSum = 0;
  const processPareto = sortedProcesses.map((proc) => {
    cumProcSum += proc.totalLossCost;
    const percentage = totalPlantCost > 0 ? (proc.totalLossCost / totalPlantCost) * 100 : 0;
    const cumulativePercentage = totalPlantCost > 0 ? (cumProcSum / totalPlantCost) * 100 : 0;
    return {
      ...proc,
      percentage,
      cumulativePercentage,
    };
  });

  // 5. Calculate Matrix B Desdobramento & Root Cause Financial Costs
  // For each loss, compute the total correlation weight across all root causes
  const lossTotalWeights: Record<string, number> = {};
  losses.forEach((loss) => {
    let sumWeights = 0;
    rootCauses.forEach((cause) => {
      const weight = matrixBMap.get(`${loss.id}_${cause.id}`) || 0;
      sumWeights += weight;
    });
    lossTotalWeights[loss.id] = sumWeights;
  });

  // Calculate how much financial cost each Root Cause receives
  const rootCauseCosts: CalculatedRootCauseCost[] = rootCauses.map((cause) => {
    let causeTotalFinancialCost = 0;
    let affectedLossesCount = 0;

    losses.forEach((loss) => {
      const weight = matrixBMap.get(`${loss.id}_${cause.id}`) || 0;
      const totalWeightForLoss = lossTotalWeights[loss.id] || 0;

      if (weight > 0 && totalWeightForLoss > 0) {
        affectedLossesCount++;
        const lossSummary = lossSummaries.find((l) => l.lossId === loss.id);
        const lossCost = lossSummary ? lossSummary.totalFinancialCost : 0;
        const causeShare = (weight / totalWeightForLoss) * lossCost;
        causeTotalFinancialCost += causeShare;
      }
    });

    return {
      causeId: cause.id,
      causeCode: cause.code,
      causeName: cause.name,
      pillar: cause.wcmPillar,
      category: cause.category,
      totalCost: causeTotalFinancialCost,
      percentage: 0,
      cumulativePercentage: 0,
      affectedLossesCount,
    };
  });

  // Sort root causes descending for Pareto
  const sortedRootCauses = [...rootCauseCosts].sort((a, b) => b.totalCost - a.totalCost);
  let cumCauseSum = 0;
  const rootCausePareto = sortedRootCauses.map((cause) => {
    cumCauseSum += cause.totalCost;
    const percentage = totalPlantCost > 0 ? (cause.totalCost / totalPlantCost) * 100 : 0;
    const cumulativePercentage = totalPlantCost > 0 ? (cumCauseSum / totalPlantCost) * 100 : 0;
    return {
      ...cause,
      percentage,
      cumulativePercentage,
    };
  });

  // 6. Calculate Costs per WCM Pillar (FI, AM, PM, QC, E&T, ENV, etc.)
  const pillarCostsMap: Record<string, { cost: number; count: number }> = {};

  rootCauseCosts.forEach((cause) => {
    if (!pillarCostsMap[cause.pillar]) {
      pillarCostsMap[cause.pillar] = { cost: 0, count: 0 };
    }
    pillarCostsMap[cause.pillar].cost += cause.totalCost;
    pillarCostsMap[cause.pillar].count += 1;
  });

  const pillarSummary = Object.entries(pillarCostsMap)
    .filter(([_, data]) => data.cost > 0 || data.count > 0)
    .map(([pillar, data]) => ({
      pillar: pillar as WCMPillar,
      totalCost: data.cost,
      percentage: totalPlantCost > 0 ? (data.cost / totalPlantCost) * 100 : 0,
      causesCount: data.count,
    }))
    .sort((a, b) => b.totalCost - a.totalCost);

  return {
    totalPlantCost,
    totalCostBreakdown,
    lossSummaries: sortedLosses,
    processPareto,
    rootCausePareto,
    pillarSummary,
    matrixAMap,
    matrixBMap,
    lossTotalWeights,
  };
}

/**
 * Format currency to Brazilian Real format
 */
export function formatCurrency(value: number, compact = false): string {
  if (isNaN(value)) return 'R$ 0,00';

  if (compact) {
    if (value >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}M`;
    }
    if (value >= 1_000) {
      return `R$ ${(value / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`;
    }
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format physical values with appropriate decimals
 */
export function formatPhysicalValue(value: number, unit?: string): string {
  if (isNaN(value)) return '0';
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  if (isNaN(value)) return '0,0%';
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

/**
 * Pillar metadata and styling helpers
 */
export const PILLAR_INFO: Record<string, { name: string; color: string; bg: string; border: string }> = {
  PM: {
    name: 'Manutenção Planejada (PM)',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 text-amber-300',
    border: 'border-amber-500/30',
  },
  AM: {
    name: 'Manutenção Autônoma (AM)',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 text-emerald-300',
    border: 'border-emerald-500/30',
  },
  'AM/PM': {
    name: 'Manutenção Autônoma / Planejada (AM/PM)',
    color: 'text-amber-300',
    bg: 'bg-amber-500/20 text-amber-200',
    border: 'border-amber-500/40',
  },
  FI: {
    name: 'Melhoria Focada (FI)',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 text-blue-300',
    border: 'border-blue-500/30',
  },
  'FI/QC': {
    name: 'Melhoria Focada / Qualidade (FI/QC)',
    color: 'text-purple-300',
    bg: 'bg-purple-500/20 text-purple-200',
    border: 'border-purple-500/40',
  },
  'FI/LOG': {
    name: 'Melhoria Focada / Logística (FI/LOG)',
    color: 'text-orange-300',
    bg: 'bg-orange-500/20 text-orange-200',
    border: 'border-orange-500/40',
  },
  'FI/AM/PM': {
    name: 'Melhoria Focada / Manutenção (FI/AM/PM)',
    color: 'text-sky-300',
    bg: 'bg-sky-500/20 text-sky-200',
    border: 'border-sky-500/40',
  },
  QC: {
    name: 'Controle de Qualidade (QC)',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 text-purple-300',
    border: 'border-purple-500/30',
  },
  'QC/FI': {
    name: 'Qualidade / Melhoria (QC/FI)',
    color: 'text-purple-300',
    bg: 'bg-purple-500/20 text-purple-200',
    border: 'border-purple-500/40',
  },
  'E&T': {
    name: 'Educação & Treinamento (E&T)',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 text-cyan-300',
    border: 'border-cyan-500/30',
  },
  PD: {
    name: 'Desenvolvimento de Pessoas (PD)',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/20 text-cyan-200',
    border: 'border-cyan-500/40',
  },
  ENV: {
    name: 'Energia & Meio Ambiente (ENV)',
    color: 'text-lime-400',
    bg: 'bg-lime-500/10 text-lime-300',
    border: 'border-lime-500/30',
  },
  'ENV/AM': {
    name: 'Meio Ambiente / Manutenção (ENV/AM)',
    color: 'text-lime-300',
    bg: 'bg-lime-500/20 text-lime-200',
    border: 'border-lime-500/40',
  },
  LOG: {
    name: 'Logística & Suprimentos (LOG)',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 text-orange-300',
    border: 'border-orange-500/30',
  },
  SE: {
    name: 'Segurança & Saúde (SE)',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 text-rose-300',
    border: 'border-rose-500/30',
  },
};
