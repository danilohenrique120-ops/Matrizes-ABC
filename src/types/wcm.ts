export type WCMPillar =
  | 'FI'
  | 'AM'
  | 'PM'
  | 'QC'
  | 'E&T'
  | 'ENV'
  | 'LOG'
  | 'SE'
  | 'PD'
  | 'WO'
  | 'SAF'
  | 'AM/PM'
  | 'FI/QC'
  | 'FI/LOG'
  | 'FI/AM/PM'
  | 'FI/WO'
  | 'FI/PD'
  | 'WO/QC'
  | 'PD/QC'
  | 'LOG/QC';

export type CauseResultType = 'C' | 'R' | 'C/R';

export interface ProcessArea {
  id: string;
  code: string;
  name: string;
  plantSection: string; // e.g. "Env/Embalagem", "Biorreatores"
  sectionColor?: string; // Optional custom color for the section header
  description?: string;
}

export type LossUnit = 'horas' | 'kg' | 'kWh' | 'm³' | 'peças' | 'unidades' | 'pts';

export interface LossCategory {
  id: string;
  code: string; // e.g. "1.1.1"
  name: string; // e.g. "QUEBRA"
  lossType?: string; // e.g. "01. EQUIPAMENTOS", "02. MÃO DE OBRA", "03. MATERIAL / QUALIDADE"
  category?: string; // e.g. "1.1 - TEMPO OCIOSO DO EQUIPAMENTO", "1.2 - DESEMPENHO DO EQUIPAMENTO"
  causeResult?: CauseResultType; // "C" | "R" | "C/R"
  pillar?: string; // e.g. "AM/PM", "FI", "FI/QC", "PD", "LOG", "ENV"
  unit: LossUnit;
  description: string;
  wcmType: 'Disponibilidade' | 'Performance' | 'Qualidade' | 'Energia' | 'Consumíveis';
  costDrivers: {
    useLabor: boolean;
    useMachineOverhead: boolean;
    useMaterial: boolean;
    useElectricity: boolean;
    useWaterSteam: boolean;
    useMaintenance: boolean;
    customMultiplier?: number;
  };
}

export type CorrelationLevel = 0 | 1 | 3 | 9; // 0=None, 1=Weak, 3=Medium, 9=Strong (WCM standard)

export interface RootCause {
  id: string;
  code: string;
  name: string;
  category: string;
  wcmPillar: WCMPillar;
  description?: string;
}

export interface CustomCostElement {
  id: string;
  name: string; // e.g. "Vapor & Utilidades", "Depreciação de Máquina"
  unit: string; // e.g. "R$/hora", "R$/kWh", "R$/m³"
  rate: number; // e.g. 15.50
  isActive: boolean;
}

export interface ImpactedStage {
  id: string;
  stageName: string; // e.g. "Setup", "Formulação", "Inoculação", "Cultivo", "Envase"
  isStop: boolean; // Houve Parada? (Sim / Não). Se "Não", o tempo de parada zera.
  durationHours: number; // Tempo de parada em horas (ex: 0.3333 h)
  operatorCount: number; // Número de operadores envolvidos (ex: 1)
  customEnergyRatePerHour?: number; // Custo customizado de energia se houver
}

export type CostUnitType = 'reais_hora' | 'reais_fixo';

export interface DeploymentCostElement {
  id: string;
  name: string; // ex: "Custo Mão de Obra", "Custo Energia Elétrica", "Matéria-prima"
  rate: number; // valor numérico (ex: 85, 0.95, 250)
  unit: CostUnitType; // 'reais_hora' = "R$/hora" | 'reais_fixo' = "R$"
  unitDetail?: string; // ex: "por operador", "processo", "fixo"
  isActive?: boolean;
}

export interface CausalDeployment {
  id: string;
  originProcessId: string; // ID do Equipamento/Processo de Origem (ex: "proc_3" - Tanques 100L)
  originProcessName?: string;
  lossId: string; // ID da Perda Mapeada (ex: "loss_1_1_2" - Setup/Ajustes)
  lossName?: string;
  standardTimeMin?: number; // Tempo padrão normalizado em minutos (unidade de medida padrão para cálculos)
  standardTimeValue?: number | string; // Valor numérico informado pelo usuário (ex: 15 ou 0.25)
  standardTimeUnit?: 'min' | 'h' | 's'; // Unidade de medida selecionada (padrão: 'min')
  standardTimeText?: string; // Tempo padrão textual/formatado (ex: "15 min" ou "0.25 h")
  rootCauseName: string; // Causa Raiz / Descrição (ex: "OPERADOR EM MOVIMENTO")
  rootCauseCode?: string; // Código opcional (ex: "C01")
  originSector?: string; // Setor / Macro-processo de Origem (ex: "Upstream", "Env/Embalagem")
  pillar: WCMPillar; // Pilar WCM Responsável (ex: "FI", "PM", "AM", "QC", "LOG", "ENV")
  category?: string; // Categoria do método/gargalo
  impactedStages: ImpactedStage[]; // Lista das etapas do fluxo impactadas
  costElements?: DeploymentCostElement[]; // Elementos de custo específicos deste evento de perda
  notes?: string;
}

export interface CalculatedStageCost {
  stageId: string;
  stageName: string;
  isStop: boolean;
  durationHours: number;
  operatorCount: number;
  laborCost: number; // durationHours * operatorCount * hourlyLaborRate
  energyCost: number; // durationHours * electricityCostPerKWh (or machine rate)
  totalCost: number; // laborCost + energyCost
}

export interface CalculatedDeploymentCost {
  deployment: CausalDeployment;
  originProcessName: string;
  originProcessCode: string;
  lossName: string;
  lossCode: string;
  standardTimeMin: number;
  rootCauseName: string;
  pillar: WCMPillar;
  stages: CalculatedStageCost[];
  totalLaborCost: number;
  totalEnergyCost: number;
  totalCost: number;
  totalDurationHours: number;
}

export interface MatrixACell {
  processId: string;
  lossId: string;
  value: number; // Physical value (e.g. hours, kg, kWh)
}

export interface MatrixBCell {
  lossId: string;
  rootCauseId: string;
  correlation: CorrelationLevel; // 0, 1, 3, 9
}

export interface FinancialParameters {
  hourlyLaborRate: number; // R$/hora
  hourlyMachineOverhead: number; // R$/hora
  rawMaterialCostPerKg: number; // R$/kg
  electricityCostPerKWh: number; // R$/kWh
  waterSteamCostPerM3: number; // R$/m³
  averageMaintenanceCostPerHour: number; // R$/hora de reparo mecânico
  scrapCostPerUnit: number; // R$/peça descartada
  currency: string;
  customCostElements?: CustomCostElement[];
}

export interface LossCostBreakdown {
  laborCost: number;
  machineCost: number;
  materialCost: number;
  energyCost: number;
  maintenanceCost: number;
  totalCost: number;
}

export interface CalculatedProcessCost {
  processId: string;
  processName: string;
  processCode: string;
  section: string;
  totalLossCost: number;
  costsByLoss: Record<string, LossCostBreakdown>;
}

export interface CalculatedRootCauseCost {
  causeId: string;
  causeCode: string;
  causeName: string;
  pillar: WCMPillar;
  category: string;
  totalCost: number;
  percentage: number;
  cumulativePercentage: number;
  affectedLossesCount: number;
}

export interface CalculatedLossSummary {
  lossId: string;
  lossCode: string;
  lossName: string;
  unit: LossUnit;
  totalPhysicalValue: number;
  totalFinancialCost: number;
  percentage: number;
  cumulativePercentage: number;
  breakdown: LossCostBreakdown;
}

export interface KaizenSimulationItem {
  targetId: string; // causeId or lossId
  targetType: 'cause' | 'loss';
  reductionPercent: number; // e.g. 30 for 30% reduction
  projectCost: number; // R$ invested in project
  targetPillar: WCMPillar;
  projectName: string;
}

export interface PlantArea {
  id: string;
  name: string;
  code?: string;
  description?: string;
  createdAt?: string;
}
