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
  // 2.1 - TEMPO PERDIDO DE PRODUÇÃO
  {
    id: 'loss_2_1_1',
    code: '2.1.1',
    name: 'NVAA - TRABALHO EXTRA',
    lossType: '02. MÃO DE OBRA',
    category: '2.1 - TEMPO PERDIDO DE PRODUÇÃO',
    causeResult: 'R',
    pillar: 'FI',
    unit: 'horas',
    description: 'Atividades não agregadoras de valor gerando esforço e horas extras de produção',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_1_2',
    code: '2.1.2',
    name: 'NVAA - OPERADOR EM MOVIMENTO',
    lossType: '02. MÃO DE OBRA',
    category: '2.1 - TEMPO PERDIDO DE PRODUÇÃO',
    causeResult: 'C/R',
    pillar: 'WO',
    unit: 'horas',
    description: 'Deslocamentos e movimentações desnecessárias do operador no posto de trabalho',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 2.2 - ORGANIZAÇÃO DA LINHA
  {
    id: 'loss_2_2_1',
    code: '2.2.1',
    name: 'NVAA - OPERADOR MANUSEANDO MATERIAL',
    lossType: '02. MÃO DE OBRA',
    category: '2.2 - ORGANIZAÇÃO DA LINHA',
    causeResult: 'C/R',
    pillar: 'WO',
    unit: 'horas',
    description: 'Manuseio excessivo de frascos, embalagens e insumos na linha operacional',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_2_2',
    code: '2.2.2',
    name: 'NVAA - OPERADOR AGUARDANDO',
    lossType: '02. MÃO DE OBRA',
    category: '2.2 - ORGANIZAÇÃO DA LINHA',
    causeResult: 'C',
    pillar: 'FI/WO',
    unit: 'horas',
    description: 'Tempo de espera de operador aguardando liberação de máquina, insumo ou processo anterior',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_2_3',
    code: '2.2.3',
    name: 'NVAA - DESBALANCEAMENTO',
    lossType: '02. MÃO DE OBRA',
    category: '2.2 - ORGANIZAÇÃO DA LINHA',
    causeResult: 'C',
    pillar: 'WO',
    unit: 'horas',
    description: 'Diferença de tempos de ciclo entre postos de trabalho gerando ociosidade',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 2.3 - QUALIDADE
  {
    id: 'loss_2_3_1',
    code: '2.3.1',
    name: 'CHECAGEM DE QUALIDADE',
    lossType: '02. MÃO DE OBRA',
    category: '2.3 - QUALIDADE',
    causeResult: 'C/R',
    pillar: 'QC',
    unit: 'horas',
    description: 'Tempo despendido em amostragens, checagens repetitivas e inspeções em linha',
    wcmType: 'Qualidade',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_3_2',
    code: '2.3.2',
    name: 'CONTROLE DE QUALIDADE',
    lossType: '02. MÃO DE OBRA',
    category: '2.3 - QUALIDADE',
    causeResult: 'C/R',
    pillar: 'QC',
    unit: 'horas',
    description: 'Tempo de parada ou liberação aguardando análises laboratoriais e controle de processo',
    wcmType: 'Qualidade',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 2.4 - EFICIÊNCIA DA ÁREA
  {
    id: 'loss_2_4_1',
    code: '2.4.1',
    name: 'GESTÃO',
    lossType: '02. MÃO DE OBRA',
    category: '2.4 - EFICIÊNCIA DA ÁREA',
    causeResult: 'C/R',
    pillar: 'FI',
    unit: 'horas',
    description: 'Ineficiências de coordenação, programação de ordens e alocação da área fabril',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_4_2',
    code: '2.4.2',
    name: 'HORA EXTRA',
    lossType: '02. MÃO DE OBRA',
    category: '2.4 - EFICIÊNCIA DA ÁREA',
    causeResult: 'R',
    pillar: 'PD',
    unit: 'horas',
    description: 'Custo e tempo em horas extraordinárias para compensar atrasos ou paradas fabris',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_4_3',
    code: '2.4.3',
    name: 'ABSENTEÍSMO',
    lossType: '02. MÃO DE OBRA',
    category: '2.4 - EFICIÊNCIA DA ÁREA',
    causeResult: 'C',
    pillar: 'PD',
    unit: 'horas',
    description: 'Falta de operadores programados impactando o ritmo da linha de produção',
    wcmType: 'Disponibilidade',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_4_4',
    code: '2.4.4',
    name: 'EFICIÊNCIA OPERACIONAL',
    lossType: '02. MÃO DE OBRA',
    category: '2.4 - EFICIÊNCIA DA ÁREA',
    causeResult: 'C',
    pillar: 'PD',
    unit: 'horas',
    description: 'Ritmo operacional abaixo do padrão nominal de velocidade da equipe',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_4_5',
    code: '2.4.5',
    name: 'TREINAMENTO & REUNIÃO',
    lossType: '02. MÃO DE OBRA',
    category: '2.4 - EFICIÊNCIA DA ÁREA',
    causeResult: 'C',
    pillar: 'FI/PD',
    unit: 'horas',
    description: 'Tempo de linha parada para treinamentos de equipe, alinhamentos diários e reuniões',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_4_6',
    code: '2.4.6',
    name: 'ATIVIDADES AUTÔNOMAS',
    lossType: '02. MÃO DE OBRA',
    category: '2.4 - EFICIÊNCIA DA ÁREA',
    causeResult: 'C',
    pillar: 'AM',
    unit: 'horas',
    description: 'Interrupções para inspeção, reaperto e manutenções autônomas operacionais',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 2.5 - DEFEITO LABORAL
  {
    id: 'loss_2_5_1',
    code: '2.5.1',
    name: 'SUCATA',
    lossType: '02. MÃO DE OBRA',
    category: '2.5 - DEFEITO LABORAL',
    causeResult: 'C/R',
    pillar: 'WO/QC',
    unit: 'horas',
    description: 'Descarte e perdas de produto originadas por erro de manuseio ou operação',
    wcmType: 'Qualidade',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_5_2',
    code: '2.5.2',
    name: 'RETRABALHO',
    lossType: '02. MÃO DE OBRA',
    category: '2.5 - DEFEITO LABORAL',
    causeResult: 'C/R',
    pillar: 'PD/QC',
    unit: 'horas',
    description: 'Horas reprocessando produtos rejeitados devido a desvios operacionais',
    wcmType: 'Qualidade',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 2.6 - OPORTUNIDADE DE TRABALHO
  {
    id: 'loss_2_6_1',
    code: '2.6.1',
    name: 'OPORTUNIDADE DE TRABALHO',
    lossType: '02. MÃO DE OBRA',
    category: '2.6 - OPORTUNIDADE DE TRABALHO',
    causeResult: 'C/R',
    pillar: 'FI',
    unit: 'horas',
    description: 'Potencial de ganho por melhor alocação e otimização das tarefas da mão de obra',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 2.7 - PERDA DE MANUTENÇÃO
  {
    id: 'loss_2_7_1',
    code: '2.7.1',
    name: 'LIMPEZA ESPECIALIZADA',
    lossType: '02. MÃO DE OBRA',
    category: '2.7 - PERDA DE MANUTENÇÃO',
    causeResult: 'C',
    pillar: 'FI',
    unit: 'horas',
    description: 'Limpeza técnica aprofundada, sanitização e esterilização de circuitos',
    wcmType: 'Disponibilidade',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: true, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_2_7_2',
    code: '2.7.2',
    name: 'LIMPEZA COMUM',
    lossType: '02. MÃO DE OBRA',
    category: '2.7 - PERDA DE MANUTENÇÃO',
    causeResult: 'C/R',
    pillar: 'FI',
    unit: 'horas',
    description: 'Higienização de rotina de pisos, bancadas e superfícies da área produtiva',
    wcmType: 'Disponibilidade',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 2.8 - GESTÃO E PERDA ADMINISTRATIVA
  {
    id: 'loss_2_8_1',
    code: '2.8.1',
    name: 'GESTÃO DA PRODUÇÃO E ADMINISTRAÇÃO',
    lossType: '02. MÃO DE OBRA',
    category: '2.8 - GESTÃO E PERDA ADMINISTRATIVA',
    causeResult: 'C/R',
    pillar: 'FI/PD',
    unit: 'horas',
    description: 'Apontamentos manuais, documentação de lote, burocracia e pausas administrativas',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 03. MATERIAL
  // 3.1 - MATERIAL DIRETO
  {
    id: 'loss_3_1_1',
    code: '3.1.1',
    name: 'SUCATA',
    lossType: '03. MATERIAL',
    category: '3.1 - MATERIAL DIRETO',
    causeResult: 'C',
    pillar: 'LOG/QC',
    unit: 'kg',
    description: 'Perda direta de matéria-prima, formulação e insumos descartados',
    wcmType: 'Qualidade',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_3_1_2',
    code: '3.1.2',
    name: 'RETRABALHO',
    lossType: '03. MATERIAL',
    category: '3.1 - MATERIAL DIRETO',
    causeResult: 'C/R',
    pillar: 'LOG/QC',
    unit: 'kg',
    description: 'Matéria-prima reprocessada ou reblended por não conformidade imediata',
    wcmType: 'Qualidade',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 3.2 - MATERIAL INDIRETO
  {
    id: 'loss_3_2_1',
    code: '3.2.1',
    name: 'MATERIAL DE CONSUMO',
    lossType: '03. MATERIAL',
    category: '3.2 - MATERIAL INDIRETO',
    causeResult: 'C/R',
    pillar: 'FI',
    unit: 'unidades',
    description: 'Desperdício de filtros, membranas, mangueiras e consumíveis industriais',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_3_2_2',
    code: '3.2.2',
    name: 'PEÇA DE MANUTENÇÃO',
    lossType: '03. MATERIAL',
    category: '3.2 - MATERIAL INDIRETO',
    causeResult: 'C/R',
    pillar: 'PM',
    unit: 'peças',
    description: 'Substituição prematura de sobressalentes mecânicos, selos e gaxetas',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: true, customMultiplier: 1.0 },
  },
  {
    id: 'loss_3_2_3',
    code: '3.2.3',
    name: 'EPI',
    lossType: '03. MATERIAL',
    category: '3.2 - MATERIAL INDIRETO',
    causeResult: 'C',
    pillar: 'SAF',
    unit: 'unidades',
    description: 'Desgaste ou descarte excessivo de equipamentos de proteção individual',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 04. MEIO AMBIENTE
  // 4.1 - RESÍDUOS AMBIENTAIS
  {
    id: 'loss_4_1_1',
    code: '4.1.1',
    name: 'RESÍDUOS RECICLADOS',
    lossType: '04. MEIO AMBIENTE',
    category: '4.1 - RESÍDUOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'kg',
    description: 'Volume de papelão, plásticos e pallets encaminhados para reciclagem',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_4_1_2',
    code: '4.1.2',
    name: 'MANEJO DE RESÍDUOS',
    lossType: '04. MEIO AMBIENTE',
    category: '4.1 - RESÍDUOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'horas',
    description: 'Tempo e custos de movimentação interna e triagem de resíduos sólidos',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_4_1_3',
    code: '4.1.3',
    name: 'UTILIDADES DE RESÍDUOS',
    lossType: '04. MEIO AMBIENTE',
    category: '4.1 - RESÍDUOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'm³',
    description: 'Descarte e destinação de insumos de utilidades e borras industriais',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 4.2 - QUÍMICOS AMBIENTAIS
  {
    id: 'loss_4_2_1',
    code: '4.2.1',
    name: 'ÓLEOS LUBRIFICANTES',
    lossType: '04. MEIO AMBIENTE',
    category: '4.2 - QUÍMICOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'kg',
    description: 'Descarte e reposição de óleos lubrificantes de redutores e bombas',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_4_2_2',
    code: '4.2.2',
    name: 'ÓLEOS HIDRÁULICOS',
    lossType: '04. MEIO AMBIENTE',
    category: '4.2 - QUÍMICOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'kg',
    description: 'Perdas em sistemas hidráulicos de prensas e tanques de formulação',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_4_2_3',
    code: '4.2.3',
    name: 'PRODUTOS QUÍMICOS DE LAVAGEM',
    lossType: '04. MEIO AMBIENTE',
    category: '4.2 - QUÍMICOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'kg',
    description: 'Consumo de soda, ácidos e detergentes em ciclos CIP/SIP de limpeza',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_4_2_4',
    code: '4.2.4',
    name: 'PRODUTOS QUÍMICOS PARA TRATAMENTO DE ÁGUA DE ENTRADA',
    lossType: '04. MEIO AMBIENTE',
    category: '4.2 - QUÍMICOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'kg',
    description: 'Insumos químicos utilizados na osmose reversa e abrandamento da água',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 4.3 - ÁGUA AMBIENTAL
  {
    id: 'loss_4_3_1',
    code: '4.3.1',
    name: 'ÁGUA NO LOCAL',
    lossType: '04. MEIO AMBIENTE',
    category: '4.3 - ÁGUA AMBIENTAL',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'm³',
    description: 'Consumo de água potável e industrial na lavagem e processos gerais',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: true, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 4.4 - EMISSÃO DE AR AMBIENTAL
  {
    id: 'loss_4_4_1',
    code: '4.4.1',
    name: 'CONTROLE DE EMISSÕES ATMOSFÉRICAS',
    lossType: '04. MEIO AMBIENTE',
    category: '4.4 - EMISSÃO DE AR AMBIENTAL',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'unidades',
    description: 'Custos de lavadores de gases, exaustão e filtros absolutos de ar',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_4_4_2',
    code: '4.4.2',
    name: 'CONTROLE DE GEE (GASES DE EFEITO ESTUFA)',
    lossType: '04. MEIO AMBIENTE',
    category: '4.4 - EMISSÃO DE AR AMBIENTAL',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'kg',
    description: 'Emissões de gases refrigerantes (R134a, R404a) e pegada de carbono',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 4.5 - EFLUENTES LÍQUIDOS AMBIENTAIS
  {
    id: 'loss_4_5_1',
    code: '4.5.1',
    name: 'ÁGUA RESIDUAL INDUSTRIAL (PROCESSO FÍSICO-QUÍMICO)',
    lossType: '04. MEIO AMBIENTE',
    category: '4.5 - EFLUENTES LÍQUIDOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'm³',
    description: 'Volume de efluente industrial enviado à estação de tratamento físico-química',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: true, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_4_5_2',
    code: '4.5.2',
    name: 'ÁGUA RESIDUAL BIOLÓGICA',
    lossType: '04. MEIO AMBIENTE',
    category: '4.5 - EFLUENTES LÍQUIDOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'm³',
    description: 'Efluente orgânico de fermentação de biorreatores exigindo tratamento biológico',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: true, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_4_5_3',
    code: '4.5.3',
    name: 'ÁGUA PLUVIAL (ÁGUA DA CHUVA)',
    lossType: '04. MEIO AMBIENTE',
    category: '4.5 - EFLUENTES LÍQUIDOS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'm³',
    description: 'Drenagem, contenção e monitoramento de galerias pluviais da fábrica',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: true, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 4.6 - PREVENÇÃO AMBIENTAL
  {
    id: 'loss_4_6_1',
    code: '4.6.1',
    name: 'PREVENÇÃO AMBIENTAL',
    lossType: '04. MEIO AMBIENTE',
    category: '4.6 - PREVENÇÃO AMBIENTAL',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'horas',
    description: 'Auditorias, simulados, monitoramento e certificações ambientais ISO 14001',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 4.7 - GESTÃO DE EMERGÊNCIAS AMBIENTAIS
  {
    id: 'loss_4_7_1',
    code: '4.7.1',
    name: 'GERENCIAMENTO DE EMERGÊNCIAS AMBIENTAIS',
    lossType: '04. MEIO AMBIENTE',
    category: '4.7 - GESTÃO DE EMERGÊNCIAS AMBIENTAIS',
    causeResult: 'C/R',
    pillar: 'ENV',
    unit: 'horas',
    description: 'Ações de contingência para vazamentos acidentais ou contenção de drenos',
    wcmType: 'Consumíveis',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 05. ENERGIA
  // 5.1 - ENERGIA ELÉTRICA
  {
    id: 'loss_5_1_1',
    code: '5.1.1',
    name: 'CONSUMO DE ENERGIA',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Consumo fora do padrão teórico em motores, bombas e linhas produtivas',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_5_1_2',
    code: '5.1.2',
    name: 'VAZAMENTO DE AR COMPRIMIDO',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Vazamentos em mangueiras, conexões pneumáticas e pistões em operação',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_5_1_3',
    code: '5.1.3',
    name: 'ILUMINAÇÃO (GERAL)',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Luminárias acesas em setores sem atividade ou fora de horário',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_5_1_5',
    code: '5.1.5',
    name: 'ILUMINAÇÃO (PRODUÇÃO)',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Eficiência e adequação do parque luminotécnico sobre os equipamentos',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_5_1_6',
    code: '5.1.6',
    name: 'REFRIGERAÇÃO (GERAL)',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Carga térmica em chillers e torres de resfriamento para utilidades',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_5_1_7',
    code: '5.1.7',
    name: 'PROCESSO DE REFRIGERAÇÃO (HVAC)',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Controle de umidade e temperatura em salas limpas classe ISO e câmaras frias',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_5_1_8',
    code: '5.1.8',
    name: 'AR CONDICIONADO DE REFRIGERAÇÃO (RIZOTEC)',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Sistemas de climatização especializada para bioculturas e equipamentos sensíveis',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_5_1_9',
    code: '5.1.9',
    name: 'AQUECIMENTO (ELÉTRICO)',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'kWh',
    description: 'Resistências elétricas de pré-aquecimento e mantas térmicas de biorreatores',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_5_1_10',
    code: '5.1.10',
    name: 'PRODUÇÃO DE VAPOR',
    lossType: '05. ENERGIA',
    category: '5.1 - ENERGIA ELÉTRICA',
    causeResult: 'C',
    pillar: 'ENV',
    unit: 'm³',
    description: 'Perdas térmicas e rendimento de caldeiras e geradores de vapor puro',
    wcmType: 'Energia',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: true, useWaterSteam: true, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 06. LOGÍSTICA
  // 6.1 - PERDA DE MANUSEIO DE MATERIAIS
  {
    id: 'loss_6_1_1',
    code: '6.1.1',
    name: 'TRANSPORTE S/ EQUIPAMENTO',
    lossType: '06. LOGÍSTICA',
    category: '6.1 - PERDA DE MANUSEIO DE MATERIAIS',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'horas',
    description: 'Transporte manual de embalagens e matérias-primas sem carrinho ou esteira',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_6_1_2',
    code: '6.1.2',
    name: 'TRANSPORTE C/ EQUIPAMENTO',
    lossType: '06. LOGÍSTICA',
    category: '6.1 - PERDA DE MANUSEIO DE MATERIAIS',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'horas',
    description: 'Movimentações com empilhadeiras, transpaleteiras e tempo de transporte motorizado',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_6_1_3',
    code: '6.1.3',
    name: 'REEMBALAGEM',
    lossType: '06. LOGÍSTICA',
    category: '6.1 - PERDA DE MANUSEIO DE MATERIAIS',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'horas',
    description: 'Horas reempacotando caixas danificadas ou trocando paletização no fluxo logístico',
    wcmType: 'Performance',
    costDrivers: { useLabor: true, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_6_1_4',
    code: '6.1.4',
    name: 'EQUIPAMENTO',
    lossType: '06. LOGÍSTICA',
    category: '6.1 - PERDA DE MANUSEIO DE MATERIAIS',
    causeResult: 'R',
    pillar: 'LOG',
    unit: 'horas',
    description: 'Falta ou quebra de equipamentos de movimentação (baterias, esteiras, empilhadeiras)',
    wcmType: 'Disponibilidade',
    costDrivers: { useLabor: true, useMachineOverhead: true, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: true, customMultiplier: 1.0 },
  },

  // 6.2 - PERDA DE INVENTÁRIO
  {
    id: 'loss_6_2_1',
    code: '6.2.1',
    name: 'INVENTÁRIO DE MATERIAL DIRETO',
    lossType: '06. LOGÍSTICA',
    category: '6.2 - PERDA DE INVENTÁRIO',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'unidades',
    description: 'Diferenças de estoque e matéria-prima vencida ou estocada em excesso',
    wcmType: 'Performance',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_6_2_2',
    code: '6.2.2',
    name: 'INVENTÁRIO DE MATERIAL INDIRETO',
    lossType: '06. LOGÍSTICA',
    category: '6.2 - PERDA DE INVENTÁRIO',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'unidades',
    description: 'Capital imobilizado e divergências em almoxarifado de peças e consumíveis',
    wcmType: 'Performance',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_6_2_3',
    code: '6.2.3',
    name: 'INVENTÁRIO DE PRODUTO ACABADO',
    lossType: '06. LOGÍSTICA',
    category: '6.2 - PERDA DE INVENTÁRIO',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'unidades',
    description: 'Excesso de produto pronto retido por lote pendente ou atraso de despacho',
    wcmType: 'Performance',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: true, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },

  // 6.3 - PERDA DE ESPAÇO
  {
    id: 'loss_6_3_1',
    code: '6.3.1',
    name: 'ESPAÇO PARA MATERIAL DIRETO E INDIRETO',
    lossType: '06. LOGÍSTICA',
    category: '6.3 - PERDA DE ESPAÇO',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'unidades',
    description: 'Área fabril ocupada por pallets e bombonas de matéria-prima fora do layout ótimo',
    wcmType: 'Performance',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_6_3_2',
    code: '6.3.2',
    name: 'ESPAÇO PARA PRODUTOS ACABADOS',
    lossType: '06. LOGÍSTICA',
    category: '6.3 - PERDA DE ESPAÇO',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'unidades',
    description: 'Congestionamento de corredores e expedição aguardando transporte',
    wcmType: 'Performance',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
  },
  {
    id: 'loss_6_3_3',
    code: '6.3.3',
    name: 'ESPAÇO PARA TRANSPORTE',
    lossType: '06. LOGÍSTICA',
    category: '6.3 - PERDA DE ESPAÇO',
    causeResult: 'C/R',
    pillar: 'LOG',
    unit: 'unidades',
    description: 'Área de docas, baías de carregamento e circulação ociosa ou bloqueada',
    wcmType: 'Performance',
    costDrivers: { useLabor: false, useMachineOverhead: false, useMaterial: false, useElectricity: false, useWaterSteam: false, useMaintenance: false, customMultiplier: 1.0 },
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

// Mapeamento dos valores da tabela WCM fornecida para os 6 equipamentos:
// [proc_1 (Quality), proc_2 (Tecnor), proc_3 (T100), proc_4 (T500), proc_5 (T3000), proc_6 (T5000)]
const NEW_MATRIX_A_DATA: { lossId: string; vals: [number, number, number, number, number, number] }[] = [
  // 2.1 - TEMPO PERDIDO DE PRODUÇÃO
  { lossId: 'loss_2_1_1', vals: [2, 1, 1, 1, 1, 1] }, // 2.1.1 - NVAA - TRABALHO EXTRA
  { lossId: 'loss_2_1_2', vals: [1, 1, 1, 1, 1, 1] }, // 2.1.2 - NVAA - OPERADOR EM MOVIMENTO

  // 2.2 - ORGANIZAÇÃO DA LINHA
  { lossId: 'loss_2_2_1', vals: [3, 3, 2, 2, 2, 2] }, // 2.2.1 - NVAA - OPERADOR MANUSEANDO MATERIAL
  { lossId: 'loss_2_2_2', vals: [3, 1, 3, 3, 3, 3] }, // 2.2.2 - NVAA - OPERADOR AGUARDANDO
  { lossId: 'loss_2_2_3', vals: [1, 1, 1, 1, 1, 1] }, // 2.2.3 - NVAA - DESBALANCEAMENTO

  // 2.3 - QUALIDADE
  { lossId: 'loss_2_3_1', vals: [2, 2, 2, 2, 2, 2] }, // 2.3.1 - CHECAGEM DE QUALIDADE
  { lossId: 'loss_2_3_2', vals: [1, 1, 3, 3, 3, 3] }, // 2.3.2 - CONTROLE DE QUALIDADE

  // 2.4 - EFICIÊNCIA DA ÁREA
  { lossId: 'loss_2_4_1', vals: [1, 1, 1, 1, 1, 1] }, // 2.4.1 - GESTÃO
  { lossId: 'loss_2_4_2', vals: [3, 1, 3, 3, 3, 3] }, // 2.4.2 - HORA EXTRA
  { lossId: 'loss_2_4_3', vals: [1, 1, 1, 1, 1, 1] }, // 2.4.3 - ABSENTEÍSMO
  { lossId: 'loss_2_4_4', vals: [1, 1, 2, 2, 2, 2] }, // 2.4.4 - EFICIÊNCIA OPERACIONAL
  { lossId: 'loss_2_4_5', vals: [1, 1, 2, 2, 2, 2] }, // 2.4.5 - TREINAMENTO & REUNIÃO
  { lossId: 'loss_2_4_6', vals: [2, 3, 2, 2, 2, 2] }, // 2.4.6 - ATIVIDADES AUTÔNOMAS

  // 2.5 - DEFEITO LABORAL
  { lossId: 'loss_2_5_1', vals: [1, 1, 2, 2, 2, 2] }, // 2.5.1 - SUCATA
  { lossId: 'loss_2_5_2', vals: [1, 2, 1, 1, 1, 1] }, // 2.5.2 - RETRABALHO

  // 2.6 - OPORTUNIDADE DE TRABALHO
  { lossId: 'loss_2_6_1', vals: [1, 1, 2, 2, 2, 2] }, // 2.6.1 - OPORTUNIDADE DE TRABALHO

  // 2.7 - PERDA DE MANUTENÇÃO
  { lossId: 'loss_2_7_1', vals: [1, 2, 1, 1, 1, 1] }, // 2.7.1 - LIMPEZA ESPECIALIZADA
  { lossId: 'loss_2_7_2', vals: [1, 1, 1, 1, 1, 1] }, // 2.7.2 - LIMPEZA COMUM

  // 2.8 - GESTÃO E PERDA ADMINISTRATIVA
  { lossId: 'loss_2_8_1', vals: [2, 2, 2, 2, 2, 2] }, // 2.8.1 - GESTÃO DA PRODUÇÃO E ADMINISTRAÇÃO

  // 03. MATERIAL
  // 3.1 - MATERIAL DIRETO
  { lossId: 'loss_3_1_1', vals: [0, 0, 0, 0, 0, 0] }, // 3.1.1 - SUCATA
  { lossId: 'loss_3_1_2', vals: [0, 0, 0, 0, 0, 0] }, // 3.1.2 - RETRABALHO

  // 3.2 - MATERIAL INDIRETO
  { lossId: 'loss_3_2_1', vals: [0, 0, 0, 0, 0, 0] }, // 3.2.1 - MATERIAL DE CONSUMO
  { lossId: 'loss_3_2_2', vals: [0, 0, 0, 0, 0, 0] }, // 3.2.2 - PEÇA DE MANUTENÇÃO
  { lossId: 'loss_3_2_3', vals: [0, 0, 0, 0, 0, 0] }, // 3.2.3 - EPI

  // 04. MEIO AMBIENTE
  // 4.1 - RESÍDUOS AMBIENTAIS
  { lossId: 'loss_4_1_1', vals: [1, 3, 1, 1, 1, 1] }, // 4.1.1 - RESÍDUOS RECICLADOS
  { lossId: 'loss_4_1_2', vals: [1, 1, 1, 1, 1, 1] }, // 4.1.2 - MANEJO DE RESÍDUOS
  { lossId: 'loss_4_1_3', vals: [1, 1, 1, 1, 1, 1] }, // 4.1.3 - UTILIDADES DE RESÍDUOS

  // 4.2 - QUÍMICOS AMBIENTAIS
  { lossId: 'loss_4_2_1', vals: [1, 1, 1, 1, 1, 1] }, // 4.2.1 - ÓLEOS LUBRIFICANTES
  { lossId: 'loss_4_2_2', vals: [1, 1, 1, 1, 1, 1] }, // 4.2.2 - ÓLEOS HIDRÁULICOS
  { lossId: 'loss_4_2_3', vals: [3, 1, 3, 3, 3, 3] }, // 4.2.3 - PRODUTOS QUÍMICOS DE LAVAGEM
  { lossId: 'loss_4_2_4', vals: [3, 1, 3, 3, 3, 3] }, // 4.2.4 - PRODUTOS QUÍMICOS PARA TRATAMENTO DE ÁGUA DE ENTRADA

  // 4.3 - ÁGUA AMBIENTAL
  { lossId: 'loss_4_3_1', vals: [3, 1, 3, 3, 3, 3] }, // 4.3.1 - ÁGUA NO LOCAL

  // 4.4 - EMISSÃO DE AR AMBIENTAL
  { lossId: 'loss_4_4_1', vals: [1, 1, 1, 1, 1, 1] }, // 4.4.1 - CONTROLE DE EMISSÕES ATMOSFÉRICAS
  { lossId: 'loss_4_4_2', vals: [1, 1, 1, 1, 1, 1] }, // 4.4.2 - CONTROLE DE GEE (GASES DE EFEITO ESTUFA)

  // 4.5 - EFLUENTES LÍQUIDOS AMBIENTAIS
  { lossId: 'loss_4_5_1', vals: [1, 1, 1, 1, 1, 1] }, // 4.5.1 - ÁGUA RESIDUAL INDUSTRIAL (PROCESSO FÍSICO-QUÍMICO)
  { lossId: 'loss_4_5_2', vals: [3, 1, 3, 3, 3, 3] }, // 4.5.2 - ÁGUA RESIDUAL BIOLÓGICA
  { lossId: 'loss_4_5_3', vals: [1, 1, 1, 1, 1, 1] }, // 4.5.3 - ÁGUA PLUVIAL (ÁGUA DA CHUVA)

  // 4.6 - PREVENÇÃO AMBIENTAL
  { lossId: 'loss_4_6_1', vals: [1, 1, 1, 1, 1, 1] }, // 4.6.1 - PREVENÇÃO AMBIENTAL

  // 4.7 - GESTÃO DE EMERGÊNCIAS AMBIENTAIS
  { lossId: 'loss_4_7_1', vals: [1, 1, 1, 1, 1, 1] }, // 4.7.1 - GERENCIAMENTO DE EMERGÊNCIAS AMBIENTAIS

  // 05. ENERGIA
  // 5.1 - ENERGIA ELÉTRICA
  { lossId: 'loss_5_1_1', vals: [1, 1, 1, 1, 1, 1] }, // 5.1.1 - CONSUMO DE ENERGIA
  { lossId: 'loss_5_1_2', vals: [2, 2, 2, 2, 2, 2] }, // 5.1.2 - VAZAMENTO DE AR COMPRIMIDO
  { lossId: 'loss_5_1_3', vals: [1, 1, 1, 1, 1, 1] }, // 5.1.3 - ILUMINAÇÃO (GERAL)
  { lossId: 'loss_5_1_5', vals: [1, 1, 1, 1, 1, 1] }, // 5.1.5 - ILUMINAÇÃO (PRODUÇÃO)
  { lossId: 'loss_5_1_6', vals: [2, 2, 2, 2, 2, 2] }, // 5.1.6 - REFRIGERAÇÃO (GERAL)
  { lossId: 'loss_5_1_7', vals: [2, 2, 2, 2, 2, 2] }, // 5.1.7 - PROCESSO DE REFRIGERAÇÃO (HVAC)
  { lossId: 'loss_5_1_8', vals: [1, 1, 1, 1, 1, 1] }, // 5.1.8 - AR CONDICIONADO DE REFRIGERAÇÃO (RIZOTEC)
  { lossId: 'loss_5_1_9', vals: [1, 1, 1, 1, 1, 1] }, // 5.1.9 - AQUECIMENTO (ELÉTRICO)
  { lossId: 'loss_5_1_10', vals: [1, 1, 1, 1, 1, 1] }, // 5.1.10 - PRODUÇÃO DE VAPOR

  // 06. LOGÍSTICA
  // 6.1 - PERDA DE MANUSEIO DE MATERIAIS
  { lossId: 'loss_6_1_1', vals: [1, 1, 1, 1, 1, 1] }, // 6.1.1 - TRANSPORTE S/ EQUIPAMENTO
  { lossId: 'loss_6_1_2', vals: [1, 1, 1, 1, 1, 1] }, // 6.1.2 - TRANSPORTE C/ EQUIPAMENTO
  { lossId: 'loss_6_1_3', vals: [1, 3, 1, 1, 1, 1] }, // 6.1.3 - REEMBALAGEM
  { lossId: 'loss_6_1_4', vals: [1, 1, 1, 1, 1, 1] }, // 6.1.4 - EQUIPAMENTO

  // 6.2 - PERDA DE INVENTÁRIO
  { lossId: 'loss_6_2_1', vals: [1, 1, 1, 1, 1, 1] }, // 6.2.1 - INVENTÁRIO DE MATERIAL DIRETO
  { lossId: 'loss_6_2_2', vals: [1, 1, 1, 1, 1, 1] }, // 6.2.2 - INVENTÁRIO DE MATERIAL INDIRETO
  { lossId: 'loss_6_2_3', vals: [1, 1, 1, 1, 1, 1] }, // 6.2.3 - INVENTÁRIO DE PRODUTO ACABADO

  // 6.3 - PERDA DE ESPAÇO
  { lossId: 'loss_6_3_1', vals: [1, 1, 1, 1, 1, 1] }, // 6.3.1 - ESPAÇO PARA MATERIAL DIRETO E INDIRETO
  { lossId: 'loss_6_3_2', vals: [1, 1, 1, 1, 1, 1] }, // 6.3.2 - ESPAÇO PARA PRODUTOS ACABADOS
  { lossId: 'loss_6_3_3', vals: [1, 1, 1, 1, 1, 1] }, // 6.3.3 - ESPAÇO PARA TRANSPORTE
];

const WCM_PROCESS_IDS = ['proc_1', 'proc_2', 'proc_3', 'proc_4', 'proc_5', 'proc_6'];

const ADDITIONAL_MATRIX_A_CELLS: MatrixACell[] = NEW_MATRIX_A_DATA.flatMap(({ lossId, vals }) =>
  WCM_PROCESS_IDS.map((processId, idx) => ({
    processId,
    lossId,
    value: vals[idx] ?? 0,
  }))
);

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

  // Matriz A com valores completos das novas categorias WCM:
  ...ADDITIONAL_MATRIX_A_CELLS,
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
    costElements: [
      {
        id: 'elem_mo_3',
        name: 'Custo Mão de Obra',
        rate: 85,
        unit: 'reais_hora',
        unitDetail: 'R$/hora por operador',
        isActive: true,
      },
      {
        id: 'elem_ee_3',
        name: 'Custo Energia Elétrica',
        rate: 0.95,
        unit: 'reais_hora',
        unitDetail: 'R$/hora processo',
        isActive: true,
      },
    ],
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
    costElements: [
      {
        id: 'elem_mo_4',
        name: 'Custo Mão de Obra',
        rate: 85,
        unit: 'reais_hora',
        unitDetail: 'R$/hora por operador',
        isActive: true,
      },
      {
        id: 'elem_ee_4',
        name: 'Custo Energia Elétrica',
        rate: 0.95,
        unit: 'reais_hora',
        unitDetail: 'R$/hora processo',
        isActive: true,
      },
    ],
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
    costElements: [
      {
        id: 'elem_mo_5',
        name: 'Custo Mão de Obra',
        rate: 85,
        unit: 'reais_hora',
        unitDetail: 'R$/hora por operador',
        isActive: true,
      },
      {
        id: 'elem_ee_5',
        name: 'Custo Energia Elétrica',
        rate: 0.95,
        unit: 'reais_hora',
        unitDetail: 'R$/hora processo',
        isActive: true,
      },
    ],
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

