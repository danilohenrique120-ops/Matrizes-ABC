/**
 * Lista Padronizada de Causas Raízes e Perdas WCM (World Class Manufacturing)
 * Extraída da taxonomia oficial da Matriz de Desdobramento Causal.
 */

export interface WCMRootCauseOption {
  code: string;
  label: string;
  category: string;
  suggestedPillar?: 'FI' | 'PM' | 'AM' | 'QC' | 'LOG' | 'ENV' | 'EEM' | 'SAF';
}

export const WCM_ROOT_CAUSES_CATEGORIZED: { category: string; items: string[] }[] = [
  {
    category: '1. Perdas Relacionadas a Equipamento & Linha',
    items: [
      '1.1.1 - QUEBRA',
      '1.1.2 - AJUSTES',
      '1.1.3 - FALHA DE PROCESSO',
      '1.1.4 - PERDA DE INICIALIZAÇÃO / PERDA DE DESLIGAMENTO',
      '1.1.5 - FALTA DE OPERADORES',
      '1.1.6 - FALTA DE MATERIAL',
      '1.1.7 - FALTA DE UTILIDADES',
      '1.1.8 - MONTANTE / JUSANTE',
      '1.1.9 - TEMPO NÃO UTILIZADO',
      '1.1.10 - SETUP',
      '1.2.1 - MICROPARADA',
      '1.2.2 - PERDA DE VELOCIDADE',
      '1.2.3 - MARCHA EM VAZIO',
      '1.2.4 - MANUTENÇÃO',
      '1.3.1 - SUCATA',
      '1.3.2 - RETRABALHO',
      '1.4.1 - OPORTUNIDADE DO EQUIPAMENTO',
    ],
  },
  {
    category: '2. Perdas de Mão de Obra, Gestão & NVAA',
    items: [
      '2.1.1 - NVAA – TRABALHO EXTRA',
      '2.1.2 - NVAA - OPERADOR EM MOVIMENTO',
      '2.1.3 - NVAA - PROCESSAMENTO MANUAL EXCESSIVO',
      '2.2.1 - NVAA – OPERADOR MANUSEANDO MATERIAL',
      '2.2.2 - NVAA - OPERADOR AGUARDANDO',
      '2.2.3 - NVAA - DESBALANCEAMENTO',
      '2.3.1 - NVAA - CHECAGEM DE QUALIDADE',
      '2.3.2 - CONTROLE DE QUALIDADE',
      '2.4.1 - GESTÃO E PLANEJAMENTO',
      '2.4.2 - HORA EXTRA',
      '2.4.3 - ABSENTEÍSMO',
      '2.4.4 - EFICIÊNCIA OPERACIONAL',
      '2.4.5 - TREINAMENTO & REUNIÃO',
      '2.4.6 - ATIVIDADES AUTÔNOMAS',
      '2.5.1 - SUCATA',
      '2.5.2 - RETRABALHO',
      '2.6.1 - OPORTUNIDADE DE TRABALHO',
      '2.7.1 - LIMPEZA ESPECIALIZADA',
      '2.7.2 - LIMPEZA COMUM',
      '2.8.1 - GESTÃO DA PRODUÇÃO E ADMINISTRAÇÃO',
      '2.9.1 - SUCATA',
      '2.9.2 - RETRABALHO',
      '2.10.1 - SUCATA',
      '2.10.2 - RETRABALHO',
    ],
  },
  {
    category: '3. Perdas de Materiais, Ferramentas & Peças',
    items: [
      '3.1.1 - SUCATA',
      '3.1.2 - RETRABALHO',
      '3.2.1 - MATERIAL DE CONSUMO',
      '3.2.2 - PEÇA DE MANUTENÇÃO',
      '3.2.3 - EPI',
    ],
  },
  {
    category: '4. Perdas Ambientais, Efluentes, Químicos & Resíduos',
    items: [
      '4.1.1 - RESÍDUOS RECICLADOS',
      '4.1.2 - MANEJO DE RESÍDUOS',
      '4.1.3 - UTILIDADES DE RESÍDUOS',
      '4.2.1 - ÓLEOS LUBRIFICANTES',
      '4.2.2 - ÓLEOS HIDRÁULICOS',
      '4.2.3 - PRODUTOS QUÍMICOS DE LAVAGEM',
      '4.2.4 - PRODUTOS QUÍMICOS PARA TRATAMENTO DE ÁGUA DE ENTRADA',
      '4.3.1 - ÁGUA NO LOCAL',
      '4.4.1 - CONTROLE DE EMISSÕES ATMOSFÉRICAS',
      '4.4.2 - CONTROLE DE GEE (GASES DE EFEITO ESTUFA)',
      '4.5.1 - ÁGUA RESIDUAL INDUSTRIAL (PROCESSO FÍSICO-QUÍMICO)',
      '4.5.2 - ÁGUA RESIDUAL BIOLÓGICA',
      '4.5.3 - ÁGUA PLUVIAL (ÁGUA DA CHUVA)',
      '4.6.1 - PREVENÇÃO AMBIENTAL',
      '4.7.1 - GERENCIAMENTO DE EMERGÊNCIAS AMBIENTAIS',
    ],
  },
  {
    category: '5. Perdas de Energia, Utilidades & Térmica',
    items: [
      '5.1.1 - CONSUMO DE ENERGIA',
      '5.1.2 - VAZAMENTO DE AR COMPRIMIDO',
      '5.1.3 - ILUMINAÇÃO (GERAL)',
      '5.1.5 - ILUMINAÇÃO (PRODUÇÃO)',
      '5.1.6 - REFRIGERAÇÃO (GERAL)',
      '5.1.7 - PROCESSO DE REFRIGERAÇÃO (HVAC)',
      '5.1.8 - AR CONDICIONADO DE REFRIGERAÇÃO (RIZOTEC)',
      '5.1.9 - AQUECIMENTO (ELÉTRICO)',
      '5.1.10 - PRODUÇÃO DE VAPOR',
    ],
  },
  {
    category: '6. Perdas de Logística, Estoque & Movimentação',
    items: [
      '6.1.1 - TRANSPORTE S/ EQUIPAMENTO',
      '6.1.2 - TRANSPORTE C/ EQUIPAMENTO',
      '6.1.3 - REEMBALAGEM',
      '6.1.4 - EQUIPAMENTO',
      '6.2.1 - INVENTÁRIO DE MATERIAL DIRETO',
      '6.2.2 - INVENTÁRIO DE MATERIAL INDIRETO',
      '6.2.3 - INVENTÁRIO DE PRODUTO ACABADO',
      '6.2.4 - RETRABALHO',
      '6.3.1 - ESPAÇO PARA MATERIAL DIRETO E INDIRETO',
      '6.3.2 - ESPAÇO PARA PRODUTOS ACABADOS',
      '6.3.3 - ESPAÇO PARA TRANSPORTE',
    ],
  },
];

export const ALL_WCM_ROOT_CAUSES: string[] = WCM_ROOT_CAUSES_CATEGORIZED.flatMap((c) => c.items);
