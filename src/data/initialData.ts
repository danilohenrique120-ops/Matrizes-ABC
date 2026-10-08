import { ProcessArea, LossCategory, RootCause, MatrixACell, MatrixBCell, FinancialParameters, CausalDeployment } from '../types/wcm';

export const INITIAL_PROCESSES: ProcessArea[] = [
  // Env/Embalagem
  {
    id: 'proc_1',
    code: 'EMB-01',
    name: 'QUALITY (BIOLÓGICO)',
    plantSection: 'Env/Embalagem',
    sectionColor: '#854d0e', // amber/brown
    description: 'Linha Quality de Envase e Embalagem de Biológicos',
  },
  {
    id: 'proc_2',
    code: 'EMB-02',
    name: 'TECNOR (BIOLÓGICO)',
    plantSection: 'Env/Embalagem',
    sectionColor: '#854d0e',
    description: 'Linha Tecnor de Envase e Embalagem de Biológicos',
  },
  // Biorreatores
  {
    id: 'proc_3',
    code: 'BIO-100',
    name: 'TANQUES 100L (BIOLÓGICO)',
    plantSection: 'Biorreatores',
    sectionColor: '#0284c7', // sky/blue
    description: 'Biorreatores e Tanques de Fermentação 100 Litros',
  },
  {
    id: 'proc_4',
    code: 'BIO-500',
    name: 'TANQUES 500L (BIOLÓGICO)',
    plantSection: 'Biorreatores',
    sectionColor: '#0284c7',
    description: 'Biorreatores e Tanques de Fermentação 500 Litros',
  },
  {
    id: 'proc_5',
    code: 'BIO-3000',
    name: 'TANQUES 3000L (BIOLÓGICO)',
    plantSection: 'Biorreatores',
    sectionColor: '#0284c7',
    description: 'Biorreatores e Tanques de Fermentação 3000 Litros',
  },
  {
    id: 'proc_6',
    code: 'BIO-5000',
    name: 'TANQUES 5000L (BIOLÓGICO)',
    plantSection: 'Biorreatores',
    sectionColor: '#0284c7',
    description: 'Biorreatores e Tanques de Fermentação 5000 Litros',
  },
];

export const INITIAL_LOSS_CATEGORIES: LossCategory[] = [
  // 01. EQUIPAMENTOS - 1.1 TEMPO OCIOSO
  {
    id: 'loss_1_1_1',
    code: '1.1.1',
    name: 'QUEBRA',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'C',
    pillar: 'AM/PM',
    unit: 'horas',
    description: 'Paradas repentinas por pane mecânica, elétrica ou falha de componente',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: true,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_1_2',
    code: '1.1.2',
    name: 'AJUSTES',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'C/R',
    pillar: 'FI',
    unit: 'horas',
    description: 'Ajustes operacionais, regulagens e setup de parâmetros em produção',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_1_3',
    code: '1.1.3',
    name: 'FALHA DE PROCESSO',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'R',
    pillar: 'FI/QC',
    unit: 'horas',
    description: 'Interrupção devido a desvio de esterilização, aeração ou parâmetros bioquímicos',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: true,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_1_4',
    code: '1.1.4',
    name: 'PERDA DE INICIALIZAÇÃO / PERDA DE DESLIGAMENTO',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'C/R',
    pillar: 'FI',
    unit: 'horas',
    description: 'Tempo de estabilização térmica, CIP/SIP, vácuo e purga de linhas',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: true,
      useWaterSteam: true,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_1_5',
    code: '1.1.5',
    name: 'ESCASSEZ DE OPERADORES',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'C',
    pillar: 'PD',
    unit: 'horas',
    description: 'Linha ociosa por falta de mão de obra ou remanejamento de equipe',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: false,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_1_6',
    code: '1.1.6',
    name: 'ESCASSEZ DE MATERIAL',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'C',
    pillar: 'LOG',
    unit: 'horas',
    description: 'Parada por falta de meio de cultura, frascos, tampas ou reagentes',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_1_7',
    code: '1.1.7',
    name: 'ESCASSEZ DE ENERGIA',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'horas',
    description: 'Falta de suprimento de energia elétrica, ar comprimido ou vapor',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_1_8',
    code: '1.1.8',
    name: 'MONTANTE / JUSANTE',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'R',
    pillar: 'FI/LOG',
    unit: 'horas',
    description: 'Paradas causadas por bloqueio no processo posterior ou falta no anterior',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_1_9',
    code: '1.1.9',
    name: 'TEMPO NÃO UTILIZADO',
    lossType: '01. EQUIPAMENTOS',
    category: '1.1 - TEMPO OCIOSO DO EQUIPAMENTO',
    causeResult: 'C',
    pillar: 'FI',
    unit: 'horas',
    description: 'Tempo disponível planejado mas não ocupado por falta de demanda/programação',
    wcmType: 'Disponibilidade',
    costDrivers: {
      useLabor: false,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },

  // 1.2 DESEMPENHO DO EQUIPAMENTO
  {
    id: 'loss_1_2_1',
    code: '1.2.1',
    name: 'MICROPARADA',
    lossType: '01. EQUIPAMENTOS',
    category: '1.2 - DESEMPENHO DO EQUIPAMENTO',
    causeResult: 'C',
    pillar: 'FI',
    unit: 'horas',
    description: 'Pequenas paradas momentâneas (< 5 min) por sensores, travamentos ou pequenas falhas',
    wcmType: 'Performance',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_2_2',
    code: '1.2.2',
    name: 'PERDA DE VELOCIDADE',
    lossType: '01. EQUIPAMENTOS',
    category: '1.2 - DESEMPENHO DO EQUIPAMENTO',
    causeResult: 'C/R',
    pillar: 'FI/AM/PM',
    unit: 'horas',
    description: 'Operação abaixo da capacidade nominal de projeto do biorreator ou linha',
    wcmType: 'Performance',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_2_3',
    code: '1.2.3',
    name: 'MARCHA EM VAZIO',
    lossType: '01. EQUIPAMENTOS',
    category: '1.2 - DESEMPENHO DO EQUIPAMENTO',
    causeResult: 'R',
    pillar: 'FI',
    unit: 'horas',
    description: 'Equipamento ligado consumindo utilidades sem processar produto',
    wcmType: 'Performance',
    costDrivers: {
      useLabor: false,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: true,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },

  // 1.3 DEFEITO DO EQUIPAMENTO
  {
    id: 'loss_1_3_1',
    code: '1.3.1',
    name: 'SUCATA',
    lossType: '01. EQUIPAMENTOS',
    category: '1.3 - DEFEITO DO EQUIPAMENTO',
    causeResult: 'C/R',
    pillar: 'FI/QC',
    unit: 'kg',
    description: 'Lote biológico contaminado, frascos quebrados ou produto descartado',
    wcmType: 'Qualidade',
    costDrivers: {
      useLabor: false,
      useMachineOverhead: false,
      useMaterial: true,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_1_3_2',
    code: '1.3.2',
    name: 'RETRABALHO / REFILTRAGEM',
    lossType: '01. EQUIPAMENTOS',
    category: '1.3 - DEFEITO DO EQUIPAMENTO',
    causeResult: 'R',
    pillar: 'QC',
    unit: 'horas',
    description: 'Tempo e custos adicionais para reprocessamento, reesterilização ou nova rotulagem',
    wcmType: 'Qualidade',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: true,
      useWaterSteam: true,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },

  // 02. MÃO DE OBRA
  {
    id: 'loss_2_1_1',
    code: '2.1.1',
    name: 'MOVIMENTAÇÃO EXCESSIVA',
    lossType: '02. MÃO DE OBRA',
    category: '2.1 - EFICIÊNCIA DO TRABALHO',
    causeResult: 'C',
    pillar: 'FI',
    unit: 'horas',
    description: 'Deslocamentos desnecessários de operadores buscando ferramentas ou insumos',
    wcmType: 'Performance',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: false,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_2_1_2',
    code: '2.1.2',
    name: 'FALTA DE BALANCEAMENTO DE LINHA',
    lossType: '02. MÃO DE OBRA',
    category: '2.1 - EFICIÊNCIA DO TRABALHO',
    causeResult: 'C/R',
    pillar: 'FI',
    unit: 'horas',
    description: 'Espera entre postos de trabalho desbalanceados durante o envase',
    wcmType: 'Performance',
    costDrivers: {
      useLabor: true,
      useMachineOverhead: true,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },

  // 03. ENERGIA & UTILIDADES
  {
    id: 'loss_4_1_1',
    code: '4.1.1',
    name: 'CONSUMO EXCESSIVO DE ENERGIA',
    lossType: '03. ENERGIA & UTILIDADES',
    category: '3.1 - EFICIÊNCIA ENERGÉTICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Consumo fora do padrão em chillers, agitação de biorreatores e iluminação',
    wcmType: 'Energia',
    costDrivers: {
      useLabor: false,
      useMachineOverhead: false,
      useMaterial: false,
      useElectricity: true,
      useWaterSteam: false,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
  {
    id: 'loss_4_1_2',
    code: '4.1.2',
    name: 'VAZAMENTO DE VAPOR & ÁGUA WFI',
    lossType: '03. ENERGIA & UTILIDADES',
    category: '3.1 - EFICIÊNCIA ENERGÉTICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'm³',
    description: 'Perdas em purgadores de vapor limpo e água purificada para injetáveis (WFI)',
    wcmType: 'Energia',
    costDrivers: {
      useLabor: false,
      useMachineOverhead: false,
      useMaterial: false,
      useElectricity: false,
      useWaterSteam: true,
      useMaintenance: false,
      customMultiplier: 1.0,
    },
  },
];

export const INITIAL_ROOT_CAUSES: RootCause[] = [
  {
    id: 'cause_1',
    code: 'C01',
    name: 'Falta de Manutenção Preventiva / Desgaste de Selos',
    category: 'Equipamento',
    wcmPillar: 'PM',
    description: 'Desgaste de selos mecânicos de biorreatores e bicos de envase',
  },
  {
    id: 'cause_2',
    code: 'C02',
    name: 'Falta de Limpeza Padrão e Inspeção Autônoma',
    category: 'Manutenção Autônoma',
    wcmPillar: 'AM',
    description: 'Incrustações em sensores de nível/pH e esteiras desreguladas',
  },
  {
    id: 'cause_3',
    code: 'C03',
    name: 'Tempo Excessivo de CIP / SIP & Setup Térmico',
    category: 'Método / SMED',
    wcmPillar: 'FI',
    description: 'Ciclos de sanitização não padronizados e rampas de aquecimento lentas',
  },
  {
    id: 'cause_4',
    code: 'C04',
    name: 'Variabilidade do Meio de Cultura / Frascos',
    category: 'Material / Fornecedor',
    wcmPillar: 'QC',
    description: 'Desvios de qualidade em insumos biológicos e tampas plásticas',
  },
  {
    id: 'cause_5',
    code: 'C05',
    name: 'Desbalanceamento Logístico & Atraso de Insumos',
    category: 'Logística Interna',
    wcmPillar: 'LOG',
    description: 'Demora no abastecimento de frascos estéreis e caixas secundárias',
  },
  {
    id: 'cause_6',
    code: 'C06',
    name: 'Falta de Treinamento & Desvio de SOP',
    category: 'Pessoas / Treinamento',
    wcmPillar: 'PD',
    description: 'Operadores novatos sem certificação na operação dos tanques e envase',
  },
  {
    id: 'cause_7',
    code: 'C07',
    name: 'Isolamento Térmico Deficiente & Purgadores Travados',
    category: 'Meio Ambiente / Energia',
    wcmPillar: 'ENV',
    description: 'Perda de calor em linhas de vapor puro e condensado sem retorno',
  },
];

// Initial Matrix A values - Matching exactly the user's sample table
// 1 = Verde (Baixo impacto), 2 = Amarelo (Médio impacto), 3 = Vermelho (Alto impacto / Crítico)
export const INITIAL_MATRIX_A_VALUES: MatrixACell[] = [
  // 1.1.1 - QUEBRA: Quality: 1, Tecnor: 1, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_1_1', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_1_1', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_1_1', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_1_1', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_1_1', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_1_1', value: 1 },

  // 1.1.2 - AJUSTES: Quality: 2, Tecnor: 2, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_1_2', value: 2 },
  { processId: 'proc_2', lossId: 'loss_1_1_2', value: 2 },
  { processId: 'proc_3', lossId: 'loss_1_1_2', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_1_2', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_1_2', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_1_2', value: 1 },

  // 1.1.3 - FALHA DE PROCESSO: Quality: 1, Tecnor: 2, T100: 2, T500: 2, T3000: 2, T5000: 2
  { processId: 'proc_1', lossId: 'loss_1_1_3', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_1_3', value: 2 },
  { processId: 'proc_3', lossId: 'loss_1_1_3', value: 2 },
  { processId: 'proc_4', lossId: 'loss_1_1_3', value: 2 },
  { processId: 'proc_5', lossId: 'loss_1_1_3', value: 2 },
  { processId: 'proc_6', lossId: 'loss_1_1_3', value: 2 },

  // 1.1.4 - PERDA DE INICIALIZAÇÃO / DESLIGAMENTO: Quality: 2, Tecnor: 1, T100: 3, T500: 3, T3000: 3, T5000: 3 (CRÍTICO EM BIORREATORES)
  { processId: 'proc_1', lossId: 'loss_1_1_4', value: 2 },
  { processId: 'proc_2', lossId: 'loss_1_1_4', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_1_4', value: 3 },
  { processId: 'proc_4', lossId: 'loss_1_1_4', value: 3 },
  { processId: 'proc_5', lossId: 'loss_1_1_4', value: 3 },
  { processId: 'proc_6', lossId: 'loss_1_1_4', value: 3 },

  // 1.1.5 - ESCASSEZ DE OPERADORES: Quality: 1, Tecnor: 1, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_1_5', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_1_5', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_1_5', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_1_5', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_1_5', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_1_5', value: 1 },

  // 1.1.6 - ESCASSEZ DE MATERIAL: Quality: 1, Tecnor: 1, T100: 2, T500: 2, T3000: 2, T5000: 2
  { processId: 'proc_1', lossId: 'loss_1_1_6', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_1_6', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_1_6', value: 2 },
  { processId: 'proc_4', lossId: 'loss_1_1_6', value: 2 },
  { processId: 'proc_5', lossId: 'loss_1_1_6', value: 2 },
  { processId: 'proc_6', lossId: 'loss_1_1_6', value: 2 },

  // 1.1.7 - ESCASSEZ DE ENERGIA: Quality: 1, Tecnor: 1, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_1_7', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_1_7', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_1_7', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_1_7', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_1_7', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_1_7', value: 1 },

  // 1.1.8 - MONTANTE / JUSANTE: Quality: 1, Tecnor: 2, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_1_8', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_1_8', value: 2 },
  { processId: 'proc_3', lossId: 'loss_1_1_8', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_1_8', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_1_8', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_1_8', value: 1 },

  // 1.1.9 - TEMPO NÃO UTILIZADO: Quality: 2, Tecnor: 1, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_1_9', value: 2 },
  { processId: 'proc_2', lossId: 'loss_1_1_9', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_1_9', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_1_9', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_1_9', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_1_9', value: 1 },

  // 1.2.1 - MICROPARADA: Quality: 2, Tecnor: 2, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_2_1', value: 2 },
  { processId: 'proc_2', lossId: 'loss_1_2_1', value: 2 },
  { processId: 'proc_3', lossId: 'loss_1_2_1', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_2_1', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_2_1', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_2_1', value: 1 },

  // 1.2.2 - PERDA DE VELOCIDADE: Quality: 1, Tecnor: 1, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_2_2', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_2_2', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_2_2', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_2_2', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_2_2', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_2_2', value: 1 },

  // 1.2.3 - MARCHA EM VAZIO: Quality: 1, Tecnor: 1, T100: 1, T500: 1, T3000: 1, T5000: 1
  { processId: 'proc_1', lossId: 'loss_1_2_3', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_2_3', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_2_3', value: 1 },
  { processId: 'proc_4', lossId: 'loss_1_2_3', value: 1 },
  { processId: 'proc_5', lossId: 'loss_1_2_3', value: 1 },
  { processId: 'proc_6', lossId: 'loss_1_2_3', value: 1 },

  // 1.3.1 - SUCATA: Quality: 2, Tecnor: 2, T100: 3, T500: 3, T3000: 3, T5000: 3 (CRÍTICO EM BIORREATORES)
  { processId: 'proc_1', lossId: 'loss_1_3_1', value: 2 },
  { processId: 'proc_2', lossId: 'loss_1_3_1', value: 2 },
  { processId: 'proc_3', lossId: 'loss_1_3_1', value: 3 },
  { processId: 'proc_4', lossId: 'loss_1_3_1', value: 3 },
  { processId: 'proc_5', lossId: 'loss_1_3_1', value: 3 },
  { processId: 'proc_6', lossId: 'loss_1_3_1', value: 3 },

  // 1.3.2 - RETRABALHO
  { processId: 'proc_1', lossId: 'loss_1_3_2', value: 1 },
  { processId: 'proc_2', lossId: 'loss_1_3_2', value: 1 },
  { processId: 'proc_3', lossId: 'loss_1_3_2', value: 2 },
  { processId: 'proc_4', lossId: 'loss_1_3_2', value: 2 },
  { processId: 'proc_5', lossId: 'loss_1_3_2', value: 2 },
  { processId: 'proc_6', lossId: 'loss_1_3_2', value: 2 },

  // 2.1.1 - MOVIMENTAÇÃO EXCESSIVA
  { processId: 'proc_1', lossId: 'loss_2_1_1', value: 2 },
  { processId: 'proc_2', lossId: 'loss_2_1_1', value: 2 },
  { processId: 'proc_3', lossId: 'loss_2_1_1', value: 1 },
  { processId: 'proc_4', lossId: 'loss_2_1_1', value: 1 },
  { processId: 'proc_5', lossId: 'loss_2_1_1', value: 1 },
  { processId: 'proc_6', lossId: 'loss_2_1_1', value: 1 },

  // 2.1.2 - FALTA DE BALANCEAMENTO
  { processId: 'proc_1', lossId: 'loss_2_1_2', value: 1 },
  { processId: 'proc_2', lossId: 'loss_2_1_2', value: 2 },
  { processId: 'proc_3', lossId: 'loss_2_1_2', value: 1 },
  { processId: 'proc_4', lossId: 'loss_2_1_2', value: 1 },
  { processId: 'proc_5', lossId: 'loss_2_1_2', value: 1 },
  { processId: 'proc_6', lossId: 'loss_2_1_2', value: 1 },

  // 4.1.1 - CONSUMO ENERGIA
  { processId: 'proc_1', lossId: 'loss_4_1_1', value: 1 },
  { processId: 'proc_2', lossId: 'loss_4_1_1', value: 1 },
  { processId: 'proc_3', lossId: 'loss_4_1_1', value: 2 },
  { processId: 'proc_4', lossId: 'loss_4_1_1', value: 2 },
  { processId: 'proc_5', lossId: 'loss_4_1_1', value: 2 },
  { processId: 'proc_6', lossId: 'loss_4_1_1', value: 2 },

  // 4.1.2 - VAZAMENTO VAPOR / ÁGUA
  { processId: 'proc_1', lossId: 'loss_4_1_2', value: 1 },
  { processId: 'proc_2', lossId: 'loss_4_1_2', value: 1 },
  { processId: 'proc_3', lossId: 'loss_4_1_2', value: 2 },
  { processId: 'proc_4', lossId: 'loss_4_1_2', value: 2 },
  { processId: 'proc_5', lossId: 'loss_4_1_2', value: 2 },
  { processId: 'proc_6', lossId: 'loss_4_1_2', value: 2 },
];

export const INITIAL_MATRIX_B_VALUES: MatrixBCell[] = [
  // 1.1.1 QUEBRA -> C01 (9), C02 (3)
  { lossId: 'loss_1_1_1', rootCauseId: 'cause_1', correlation: 9 },
  { lossId: 'loss_1_1_1', rootCauseId: 'cause_2', correlation: 3 },

  // 1.1.2 AJUSTES -> C03 (9), C06 (3)
  { lossId: 'loss_1_1_2', rootCauseId: 'cause_3', correlation: 9 },
  { lossId: 'loss_1_1_2', rootCauseId: 'cause_6', correlation: 3 },

  // 1.1.3 FALHA DE PROCESSO -> C04 (9), C03 (3)
  { lossId: 'loss_1_1_3', rootCauseId: 'cause_4', correlation: 9 },
  { lossId: 'loss_1_1_3', rootCauseId: 'cause_3', correlation: 3 },

  // 1.1.4 PERDA DE INICIALIZAÇÃO / DESLIGAMENTO -> C03 (9), C07 (3)
  { lossId: 'loss_1_1_4', rootCauseId: 'cause_3', correlation: 9 },
  { lossId: 'loss_1_1_4', rootCauseId: 'cause_7', correlation: 3 },

  // 1.1.5 ESCASSEZ DE OPERADORES -> C06 (9)
  { lossId: 'loss_1_1_5', rootCauseId: 'cause_6', correlation: 9 },

  // 1.1.6 ESCASSEZ DE MATERIAL -> C05 (9)
  { lossId: 'loss_1_1_6', rootCauseId: 'cause_5', correlation: 9 },

  // 1.1.7 ESCASSEZ DE ENERGIA -> C07 (9)
  { lossId: 'loss_1_1_7', rootCauseId: 'cause_7', correlation: 9 },

  // 1.1.8 MONTANTE / JUSANTE -> C05 (9), C03 (3)
  { lossId: 'loss_1_1_8', rootCauseId: 'cause_5', correlation: 9 },
  { lossId: 'loss_1_1_8', rootCauseId: 'cause_3', correlation: 3 },

  // 1.1.9 TEMPO NÃO UTILIZADO -> C03 (9)
  { lossId: 'loss_1_1_9', rootCauseId: 'cause_3', correlation: 9 },

  // 1.2.1 MICROPARADA -> C02 (9), C01 (3)
  { lossId: 'loss_1_2_1', rootCauseId: 'cause_2', correlation: 9 },
  { lossId: 'loss_1_2_1', rootCauseId: 'cause_1', correlation: 3 },

  // 1.2.2 PERDA DE VELOCIDADE -> C01 (3), C02 (3), C03 (3)
  { lossId: 'loss_1_2_2', rootCauseId: 'cause_1', correlation: 3 },
  { lossId: 'loss_1_2_2', rootCauseId: 'cause_2', correlation: 3 },

  // 1.2.3 MARCHA EM VAZIO -> C07 (9)
  { lossId: 'loss_1_2_3', rootCauseId: 'cause_7', correlation: 9 },

  // 1.3.1 SUCATA -> C04 (9), C01 (3), C06 (3)
  { lossId: 'loss_1_3_1', rootCauseId: 'cause_4', correlation: 9 },
  { lossId: 'loss_1_3_1', rootCauseId: 'cause_1', correlation: 3 },
  { lossId: 'loss_1_3_1', rootCauseId: 'cause_6', correlation: 3 },

  // 1.3.2 RETRABALHO -> C04 (9), C06 (3)
  { lossId: 'loss_1_3_2', rootCauseId: 'cause_4', correlation: 9 },
  { lossId: 'loss_1_3_2', rootCauseId: 'cause_6', correlation: 3 },

  // 2.1.1 MOVIMENTAÇÃO EXCESSIVA -> C03 (9)
  { lossId: 'loss_2_1_1', rootCauseId: 'cause_3', correlation: 9 },

  // 2.1.2 FALTA DE BALANCEAMENTO -> C05 (9)
  { lossId: 'loss_2_1_2', rootCauseId: 'cause_5', correlation: 9 },

  // 4.1.1 CONSUMO ENERGIA -> C07 (9)
  { lossId: 'loss_4_1_1', rootCauseId: 'cause_7', correlation: 9 },

  // 4.1.2 VAZAMENTO VAPOR / ÁGUA -> C07 (9), C01 (3)
  { lossId: 'loss_4_1_2', rootCauseId: 'cause_7', correlation: 9 },
  { lossId: 'loss_4_1_2', rootCauseId: 'cause_1', correlation: 3 },
];

export const INITIAL_FINANCIAL_PARAMS: FinancialParameters = {
  hourlyLaborRate: 100.0, // R$ 100,00/h (Salário do Operador)
  hourlyMachineOverhead: 150.0, // R$ 150,00/h
  rawMaterialCostPerKg: 45.0, // R$ 45,00/kg
  electricityCostPerKWh: 0.70, // R$ 0,70/h (Energia Elétrica)
  waterSteamCostPerM3: 65.0, // R$ 65,00/m³
  averageMaintenanceCostPerHour: 140.0, // R$ 140,00/h
  scrapCostPerUnit: 18.5, // R$ 18,50 por unidade
  currency: 'BRL',
  customCostElements: [
    {
      id: 'cost_vapor',
      name: 'Vapor & Utilidades Térmicas',
      unit: 'R$/h',
      rate: 15.0,
      isActive: false,
    },
  ],
};

export const INITIAL_CAUSAL_DEPLOYMENTS: CausalDeployment[] = [
  // Exemplo idêntico da Planilha do Excel:
  // SETUP | temp padrao 15 min | Causa: OPERADOR EM MOVIMENTO | Biorreator 100L | Setor: Upstream
  {
    id: 'dep_1',
    originProcessId: 'proc_3', // TANQUES 100L (BIOLÓGICO)
    lossId: 'loss_1_1_2', // AJUSTES / SETUP
    standardTimeMin: 15,
    standardTimeValue: 15,
    standardTimeUnit: 'min',
    standardTimeText: '15 min',
    rootCauseName: 'OPERADOR EM MOVIMENTO',
    rootCauseCode: 'C01',
    originSector: 'Upstream',
    pillar: 'FI',
    category: 'Movimentação Desnecessária & Método',
    notes: 'Deslocamento frequente para buscar ferramentas e insumos não padronizados no ponto de uso',
    impactedStages: [
      {
        id: 'stg_1_1',
        stageName: 'Setup',
        isStop: true,
        durationHours: 0.33333,
        operatorCount: 1,
      },
      {
        id: 'stg_1_2',
        stageName: 'Formulação',
        isStop: true,
        durationHours: 0.33333,
        operatorCount: 1,
      },
      {
        id: 'stg_1_3',
        stageName: 'Inoculação',
        isStop: true,
        durationHours: 0.33333,
        operatorCount: 1,
      },
      {
        id: 'stg_1_4',
        stageName: 'Cultivo',
        isStop: true,
        durationHours: 0.33333,
        operatorCount: 1,
      },
    ],
    costElements: [
      {
        id: 'elem_mo_1',
        name: 'Custo Mão de Obra',
        rate: 85,
        unit: 'reais_hora',
        unitDetail: 'R$/hora por operador',
        isActive: true,
      },
      {
        id: 'elem_ee_1',
        name: 'Custo Energia Elétrica',
        rate: 0.95,
        unit: 'reais_hora',
        unitDetail: 'R$/hora processo',
        isActive: true,
      },
    ],
  },
  // Desdobramento 2: Quebra em Biorreator 100L (PM)
  {
    id: 'dep_2',
    originProcessId: 'proc_3', // TANQUES 100L
    lossId: 'loss_1_1_1', // QUEBRA
    standardTimeMin: 0,
    rootCauseName: 'DESGASTE PREMATURO DE SELO MECÂNICO',
    rootCauseCode: 'C02',
    pillar: 'PM',
    category: 'Falha Mecânica / Desgaste',
    notes: 'Falta de lubrificação no plano preventivo gerou atrito e parada forçada',
    costElements: [
      {
        id: 'elem_mo_2',
        name: 'Custo Mão de Obra',
        rate: 85,
        unit: 'reais_hora',
        unitDetail: 'R$/hora por operador',
        isActive: true,
      },
      {
        id: 'elem_ee_2',
        name: 'Custo Energia Elétrica',
        rate: 0.95,
        unit: 'reais_hora',
        unitDetail: 'R$/hora processo',
        isActive: true,
      },
    ],
    impactedStages: [
      {
        id: 'stg_2_1',
        stageName: 'Cultivo',
        isStop: true,
        durationHours: 2.0,
        operatorCount: 2,
      },
      {
        id: 'stg_2_2',
        stageName: 'Esterilização',
        isStop: true,
        durationHours: 1.0,
        operatorCount: 1,
      },
    ],
  },
  // Desdobramento 3: Falha de Aquecimento / Utilidades (ENV / PM)
  {
    id: 'dep_3',
    originProcessId: 'proc_4', // TANQUES 500L
    lossId: 'loss_1_1_4', // PERDA DE INICIALIZAÇÃO / CIP
    standardTimeMin: 45,
    rootCauseName: 'OSCILAÇÃO DE PRESSÃO NO COLETOR DE VAPOR',
    rootCauseCode: 'C03',
    pillar: 'ENV',
    category: 'Eficiência Térmica & Utilidades',
    notes: 'Válvula redutora de vapor descalibrada aumenta tempo de esterilização térmica',
    impactedStages: [
      {
        id: 'stg_3_1',
        stageName: 'Pré-aquecimento',
        isStop: true,
        durationHours: 1.5,
        operatorCount: 1,
      },
      {
        id: 'stg_3_2',
        stageName: 'CIP Térmico',
        isStop: false,
        durationHours: 0.8,
        operatorCount: 1,
      },
    ],
  },
  // Desdobramento 4: Setup na Linha Quality Envase (FI)
  {
    id: 'dep_4',
    originProcessId: 'proc_1', // QUALITY (BIOLÓGICO)
    lossId: 'loss_1_1_2', // AJUSTES / SETUP
    standardTimeMin: 20,
    rootCauseName: 'FALTA DE PADRÃO NO GUIA DE ALIMENTAÇÃO',
    rootCauseCode: 'C04',
    pillar: 'FI',
    category: 'Regulagem & Setup Rápido (SMED)',
    notes: 'Troca de formato de frasco sem gabarito fixo gera tentativas e micro-ajustes',
    impactedStages: [
      {
        id: 'stg_4_1',
        stageName: 'Setup Envase',
        isStop: true,
        durationHours: 0.75,
        operatorCount: 2,
      },
      {
        id: 'stg_4_2',
        stageName: 'Rotulagem',
        isStop: true,
        durationHours: 0.5,
        operatorCount: 1,
      },
    ],
  },
  // Desdobramento 5: Contaminação por vedação (QC)
  {
    id: 'dep_5',
    originProcessId: 'proc_5', // TANQUES 3000L
    lossId: 'loss_1_1_3', // FALHA DE PROCESSO
    standardTimeMin: 0,
    rootCauseName: 'DESVIO DE VEDAÇÃO DE CONEXÃO ASSEPTICA',
    rootCauseCode: 'C05',
    pillar: 'QC',
    category: 'Garantia da Qualidade & Assepsia',
    notes: 'O-ring com microfissura permitiu perda de esterilidade durante a transferência',
    impactedStages: [
      {
        id: 'stg_5_1',
        stageName: 'Inoculação',
        isStop: true,
        durationHours: 2.5,
        operatorCount: 2,
      },
      {
        id: 'stg_5_2',
        stageName: 'Descarte e Limpeza',
        isStop: true,
        durationHours: 1.5,
        operatorCount: 2,
      },
    ],
  },
];

