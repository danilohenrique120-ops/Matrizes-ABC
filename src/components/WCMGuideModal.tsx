import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Layers,
  ArrowRight,
  Target,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  CircleDollarSign,
  GitMerge,
  Grid3X3,
  ShieldCheck,
} from 'lucide-react';

interface WCMGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WCMGuideModal: React.FC<WCMGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Passo 1: Identificar e Mapear Perdas (Matriz A)',
      icon: Grid3X3,
      desc: 'Mapear todos os processos produtivos e registrar as perdas físicas ocorridas (tempo de parada em horas, refugo em kg, desperdício de energia em kWh).',
      detail: 'A Matriz A conecta Processos (Linhas) com Categorias de Perda (Colunas). É a base quantitativa de tudo.',
    },
    {
      step: 2,
      title: 'Passo 2: Mapear Relação Causa x Efeito (Matriz B)',
      icon: GitMerge,
      desc: 'Desdobrar cada perda física identificada nas causas raiz geradoras (Desgaste, Método, Limpeza 5S, etc.) e associar ao Pilar WCM responsável.',
      detail: 'Utiliza correlações Forte (9), Média (3) e Fraca (1) para distribuir a perda proporcionalmente.',
    },
    {
      step: 3,
      title: 'Passo 3: Transformar Perdas em Custos (Matriz C)',
      icon: CircleDollarSign,
      desc: 'Aplicar direcionadores financeiros (taxas horárias de mão de obra, custos de material por kg, energia por kWh) para mensurar o impacto monetário em R$.',
      detail: 'Calcula o custo exato de cada perda por processo e quanto cada causa raiz custa para a empresa.',
    },
    {
      step: 4,
      title: 'Passo 4: Priorizar no Diagrama de Pareto (Curva ABC 80/20)',
      icon: Target,
      desc: 'Estratificar as perdas e causas raiz em ordem decrescente de custo para focar recursos nos 20% de problemas que geram 80% das perdas.',
      detail: 'Evita dispersão de energia e garante foco estratégico nos maiores ralos financeiros.',
    },
    {
      step: 5,
      title: 'Passo 5: Definir Projetos Kaizen & Alocação (Matriz D)',
      icon: TrendingUp,
      desc: 'Selecionar métodos adequados de melhoria contínua (Kaizen Quick, Standard, Major, Advanced) e definir líderes de projeto.',
      detail: 'Designa os pilares WCM (PM, AM, FI, QC, E&T) para atacar as causas da Zona A do Pareto.',
    },
    {
      step: 6,
      title: 'Passo 6: Implementar Ações e Acompanhar Execução',
      icon: Layers,
      desc: 'Executar as contramedidas, aplicar Lições Ponto a Ponto (LPP), padronizar novos procedimentos e treinar os operadores.',
      detail: 'Garante que a melhoria seja sustentável e não volte a se deteriorar.',
    },
    {
      step: 7,
      title: 'Passo 7: Avaliar ROI e Relação Benefício/Custo (Matriz E)',
      icon: ShieldCheck,
      desc: 'Auditar a economia financeira obtida (Saving Real vs. Previsto) e calcular a relação Benefício/Custo (B/C Ratio) do projeto.',
      detail: 'Valida o sucesso do Pilar Cost Deployment e alimenta o novo ciclo de planejamento.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Guia Metodológico: Pilar Cost Deployment (WCM)
              </h2>
              <p className="text-xs text-slate-400">
                O fluxo integrado das 7 etapas e Matrizes A, B, C, D e E
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm">
          {/* Conceptual Overview */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 leading-relaxed">
            <p className="font-semibold text-slate-100 mb-1">
              O que é o Pilar de Cost Deployment (CD)?
            </p>
            <p className="text-slate-300 text-xs">
              O <strong>Cost Deployment</strong> é a bússola financeira do World Class Manufacturing. Ele conecta a contabilidade de custos com as perdas reais do chão de fábrica, garantindo que cada projeto de melhoria (Kaizen) tenha retorno financeiro comprovado e ataque a causa raiz verdadeira do desperdício.
            </p>
          </div>

          {/* 7 Steps Interactive Flow */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Os 7 Passos do Cost Deployment
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {steps.map((item) => {
                const Icon = item.icon;
                const isSelected = activeStep === item.step;

                return (
                  <div
                    key={item.step}
                    onClick={() => setActiveStep(item.step)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-900/30 border-blue-500/60 shadow-lg'
                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {item.step}
                        </span>
                        <span className="font-bold text-slate-100 text-xs sm:text-sm">
                          {item.title}
                        </span>
                      </div>
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected ? 'text-blue-400' : 'text-slate-500'
                        }`}
                      />
                    </div>
                    <p className="text-slate-300 text-xs pl-8">{item.desc}</p>
                    {isSelected && (
                      <div className="mt-2.5 pt-2 pl-8 border-t border-slate-700/60 text-xs text-blue-300 font-medium">
                        💡 <strong>Detalhe Operacional:</strong> {item.detail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matrix Flow Diagram */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700 text-xs space-y-3">
            <h4 className="font-bold text-white">Fluxo de Dados Entre as Matrizes:</h4>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 w-full">
                <div className="font-bold text-blue-400 font-mono">MATRIZ A</div>
                <div className="text-[11px] text-slate-300">Processos x Perdas Físicas</div>
                <div className="text-[10px] text-slate-400">(horas, kg, kWh)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 rotate-90 sm:rotate-0 flex-shrink-0" />
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 w-full">
                <div className="font-bold text-indigo-400 font-mono">MATRIZ B</div>
                <div className="text-[11px] text-slate-300">Efeito x Causas Raiz</div>
                <div className="text-[10px] text-slate-400">(Forte 9, Médio 3, Fraco 1)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 rotate-90 sm:rotate-0 flex-shrink-0" />
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 w-full">
                <div className="font-bold text-emerald-400 font-mono">MATRIZ C</div>
                <div className="text-[11px] text-slate-300">Conversão Financeira</div>
                <div className="text-[10px] text-slate-400">(R$ por Perda e Causa)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow text-xs transition-all"
          >
            Entendido, Voltar ao Sistema
          </button>
        </div>
      </div>
    </div>
  );
};
