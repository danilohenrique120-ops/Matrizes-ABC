/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ProcessArea,
  LossCategory,
  RootCause,
  MatrixACell,
  MatrixBCell,
  FinancialParameters,
  CorrelationLevel,
  CausalDeployment,
  PlantArea,
} from './types/wcm';
import {
  INITIAL_PROCESSES,
  INITIAL_LOSS_CATEGORIES,
  INITIAL_ROOT_CAUSES,
  INITIAL_MATRIX_A_VALUES,
  INITIAL_MATRIX_B_VALUES,
  INITIAL_FINANCIAL_PARAMS,
  INITIAL_CAUSAL_DEPLOYMENTS,
} from './data/initialData';
import {
  calculateWCMDeployment,
  calculateCausalDeployments,
} from './utils/calculations';
import { Navbar, TabType } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { OperationalCellSelector } from './components/OperationalCellSelector';
import { KPICards } from './components/KPICards';
import { DashboardView } from './components/DashboardView';
import { MatrixAView } from './components/MatrixAView';
import { MatrixBView } from './components/MatrixBView';
import { MatrixCView } from './components/MatrixCView';
import { IntegratedMatrixBCView } from './components/IntegratedMatrixBCView';
import { WCMGuideModal } from './components/WCMGuideModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { NewAreaModal } from './components/NewAreaModal';
import {
  DEFAULT_PLANT_DOC_ID,
  DEFAULT_PLANT_AREAS,
  subscribeToPlantAreas,
  savePlantAreasToFirestore,
  updatePlantMetadataInFirestore,
  deletePlantFromFirestore,
  subscribeToWcmPlant,
  saveWcmPlantToFirestore,
  SyncStatus,
  WcmPlantFirestoreData,
} from './services/wcmFirestore';

const STORAGE_KEY = 'WCM_COST_DEPLOYMENT_DATA_V3';

export default function App() {
  // 1. Plant Areas Management State
  const [plantAreas, setPlantAreas] = useState<PlantArea[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_PLANT_AREAS`);
      return saved ? JSON.parse(saved) : DEFAULT_PLANT_AREAS;
    } catch {
      return DEFAULT_PLANT_AREAS;
    }
  });

  const [currentPlantId, setCurrentPlantId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CURRENT_PLANT_ID`);
      return saved || DEFAULT_PLANT_DOC_ID;
    } catch {
      return DEFAULT_PLANT_DOC_ID;
    }
  });

  const [isNewAreaModalOpen, setIsNewAreaModalOpen] = useState(false);
  const [editingPlantIdInModal, setEditingPlantIdInModal] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<string>('');

  // Helper to load plant data from LocalStorage for any plant ID
  const loadPlantFromStorage = (plantId: string) => {
    const isDefault = plantId === DEFAULT_PLANT_DOC_ID;
    const prefix = isDefault ? '' : `${plantId}_`;
    let p = INITIAL_PROCESSES;
    let l = INITIAL_LOSS_CATEGORIES;
    let r = INITIAL_ROOT_CAUSES;
    let ma = INITIAL_MATRIX_A_VALUES;
    let mb = INITIAL_MATRIX_B_VALUES;
    let cd = INITIAL_CAUSAL_DEPLOYMENTS;
    let fp = INITIAL_FINANCIAL_PARAMS;

    try {
      const savedP = localStorage.getItem(`${STORAGE_KEY}_${prefix}PROCESSES`) || (isDefault ? localStorage.getItem(`${STORAGE_KEY}_PROCESSES`) : null);
      if (savedP) p = JSON.parse(savedP);

      const savedL = localStorage.getItem(`${STORAGE_KEY}_${prefix}LOSSES`) || (isDefault ? localStorage.getItem(`${STORAGE_KEY}_LOSSES`) : null);
      if (savedL) l = JSON.parse(savedL);

      const savedR = localStorage.getItem(`${STORAGE_KEY}_${prefix}ROOT_CAUSES`) || (isDefault ? localStorage.getItem(`${STORAGE_KEY}_ROOT_CAUSES`) : null);
      if (savedR) r = JSON.parse(savedR);

      const savedMA = localStorage.getItem(`${STORAGE_KEY}_${prefix}MATRIX_A`) || (isDefault ? localStorage.getItem(`${STORAGE_KEY}_MATRIX_A`) : null);
      if (savedMA) ma = JSON.parse(savedMA);

      const savedMB = localStorage.getItem(`${STORAGE_KEY}_${prefix}MATRIX_B`) || (isDefault ? localStorage.getItem(`${STORAGE_KEY}_MATRIX_B`) : null);
      if (savedMB) mb = JSON.parse(savedMB);

      const savedCD = localStorage.getItem(`${STORAGE_KEY}_${prefix}CAUSAL_DEPLOYMENTS`) || (isDefault ? localStorage.getItem(`${STORAGE_KEY}_CAUSAL_DEPLOYMENTS`) : null);
      if (savedCD) cd = JSON.parse(savedCD);

      const savedFP = localStorage.getItem(`${STORAGE_KEY}_${prefix}FIN_PARAMS`) || (isDefault ? localStorage.getItem(`${STORAGE_KEY}_FIN_PARAMS`) : null);
      if (savedFP) fp = JSON.parse(savedFP);
    } catch (e) {
      console.warn('Error reading from localStorage cache:', e);
    }

    return { p, l, r, ma, mb, cd, fp };
  };

  // Helper to persist plant data to LocalStorage
  const persistPlantToStorage = (
    plantId: string,
    data: {
      processes: ProcessArea[];
      losses: LossCategory[];
      rootCauses: RootCause[];
      matrixA: MatrixACell[];
      matrixB: MatrixBCell[];
      causalDeployments: CausalDeployment[];
      financialParams: FinancialParameters;
    }
  ) => {
    const isDefault = plantId === DEFAULT_PLANT_DOC_ID;
    const prefix = isDefault ? '' : `${plantId}_`;
    try {
      localStorage.setItem(`${STORAGE_KEY}_${prefix}PROCESSES`, JSON.stringify(data.processes));
      localStorage.setItem(`${STORAGE_KEY}_${prefix}LOSSES`, JSON.stringify(data.losses));
      localStorage.setItem(`${STORAGE_KEY}_${prefix}ROOT_CAUSES`, JSON.stringify(data.rootCauses));
      localStorage.setItem(`${STORAGE_KEY}_${prefix}MATRIX_A`, JSON.stringify(data.matrixA));
      localStorage.setItem(`${STORAGE_KEY}_${prefix}MATRIX_B`, JSON.stringify(data.matrixB));
      localStorage.setItem(`${STORAGE_KEY}_${prefix}CAUSAL_DEPLOYMENTS`, JSON.stringify(data.causalDeployments));
      localStorage.setItem(`${STORAGE_KEY}_${prefix}FIN_PARAMS`, JSON.stringify(data.financialParams));

      if (isDefault) {
        localStorage.setItem(`${STORAGE_KEY}_PROCESSES`, JSON.stringify(data.processes));
        localStorage.setItem(`${STORAGE_KEY}_LOSSES`, JSON.stringify(data.losses));
        localStorage.setItem(`${STORAGE_KEY}_ROOT_CAUSES`, JSON.stringify(data.rootCauses));
        localStorage.setItem(`${STORAGE_KEY}_MATRIX_A`, JSON.stringify(data.matrixA));
        localStorage.setItem(`${STORAGE_KEY}_MATRIX_B`, JSON.stringify(data.matrixB));
        localStorage.setItem(`${STORAGE_KEY}_CAUSAL_DEPLOYMENTS`, JSON.stringify(data.causalDeployments));
        localStorage.setItem(`${STORAGE_KEY}_FIN_PARAMS`, JSON.stringify(data.financialParams));
      }
    } catch (err) {
      console.error('Error saving WCM data to localStorage:', err);
    }
  };

  // Active matrix state for current plant
  const initialCache = loadPlantFromStorage(currentPlantId);
  const [processes, setProcesses] = useState<ProcessArea[]>(initialCache.p);
  const [losses, setLosses] = useState<LossCategory[]>(initialCache.l);
  const [rootCauses, setRootCauses] = useState<RootCause[]>(initialCache.r);
  const [matrixA, setMatrixA] = useState<MatrixACell[]>(initialCache.ma);
  const [matrixB, setMatrixB] = useState<MatrixBCell[]>(initialCache.mb);
  const [causalDeployments, setCausalDeployments] = useState<CausalDeployment[]>(initialCache.cd);
  const [financialParams, setFinancialParams] = useState<FinancialParameters>(initialCache.fp);

  const [currentTab, setCurrentTab] = useState<TabType>('matrixBC');
  const [selectedBCDeploymentId, setSelectedBCDeploymentId] = useState<string>('');

  // Cloud Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // References to prevent echo saves on remote updates
  const isRemoteSyncRef = useRef<boolean>(false);
  const isInitialLoadDoneRef = useRef<boolean>(false);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // 1. Subscribe to Plant Areas Registry in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToPlantAreas(
      (cloudAreas) => {
        if (cloudAreas && cloudAreas.length > 0) {
          setPlantAreas(cloudAreas);
          try {
            localStorage.setItem(`${STORAGE_KEY}_PLANT_AREAS`, JSON.stringify(cloudAreas));
          } catch {}
        } else {
          // If not in cloud yet, seed with current local plant areas
          savePlantAreasToFirestore(plantAreas).catch(console.warn);
        }
      },
      (err) => {
        console.warn('Areas registry operates offline/local mode:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Active Plant in Firestore in Real-Time
  useEffect(() => {
    isInitialLoadDoneRef.current = false;
    setSyncStatus('loading');

    // Load fast from localStorage cache
    const cached = loadPlantFromStorage(currentPlantId);
    isRemoteSyncRef.current = true;
    setProcesses(cached.p);
    setLosses(cached.l);
    setRootCauses(cached.r);
    setMatrixA(cached.ma);
    setMatrixB(cached.mb);
    setCausalDeployments(cached.cd);
    setFinancialParams(cached.fp);

    setTimeout(() => {
      isRemoteSyncRef.current = false;
      isInitialLoadDoneRef.current = true;
    }, 150);

    const unsubscribe = subscribeToWcmPlant(
      currentPlantId,
      (cloudData: WcmPlantFirestoreData) => {
        if (cloudData && cloudData.processes && cloudData.processes.length > 0) {
          isRemoteSyncRef.current = true;
          setProcesses(cloudData.processes);
          if (cloudData.losses) setLosses(cloudData.losses);
          if (cloudData.rootCauses) setRootCauses(cloudData.rootCauses);
          if (cloudData.matrixA) setMatrixA(cloudData.matrixA);
          if (cloudData.matrixB) setMatrixB(cloudData.matrixB);
          if (cloudData.causalDeployments) {
            setCausalDeployments(cloudData.causalDeployments);
          }
          if (cloudData.financialParams) setFinancialParams(cloudData.financialParams);

          setLastSyncedAt(
            cloudData.lastUpdatedISO ? new Date(cloudData.lastUpdatedISO) : new Date()
          );
          setSyncStatus('synced');
          isInitialLoadDoneRef.current = true;
          setTimeout(() => {
            isRemoteSyncRef.current = false;
          }, 300);
        } else {
          // Document does not exist in Firestore yet -> seed with current data
          saveWcmPlantToFirestore(
            {
              processes: cached.p,
              losses: cached.l,
              rootCauses: cached.r,
              matrixA: cached.ma,
              matrixB: cached.mb,
              causalDeployments: cached.cd,
              financialParams: cached.fp,
            },
            currentPlantId
          )
            .then(() => {
              setSyncStatus('synced');
              setLastSyncedAt(new Date());
              isInitialLoadDoneRef.current = true;
            })
            .catch(() => {
              setSyncStatus('offline');
              isInitialLoadDoneRef.current = true;
            });
        }
      },
      (err) => {
        console.warn(`Plant ${currentPlantId} operating in offline/local mode:`, err);
        setSyncStatus('offline');
        isInitialLoadDoneRef.current = true;
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentPlantId]);

  // 3. Debounced Save to Firestore on local user modifications + LocalStorage backup
  useEffect(() => {
    // Always persist to localStorage for instant offline safety
    persistPlantToStorage(currentPlantId, {
      processes,
      losses,
      rootCauses,
      matrixA,
      matrixB,
      causalDeployments,
      financialParams,
    });

    // Skip Firestore save if this update came directly from Firestore or before initial load
    if (isRemoteSyncRef.current || !isInitialLoadDoneRef.current) {
      return;
    }

    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await saveWcmPlantToFirestore(
          {
            processes,
            losses,
            rootCauses,
            matrixA,
            matrixB,
            causalDeployments,
            financialParams,
          },
          currentPlantId
        );
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
      } catch (error) {
        console.warn('Firestore save failed for plant:', currentPlantId, error);
        setSyncStatus('offline');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [processes, losses, rootCauses, matrixA, matrixB, causalDeployments, financialParams, currentPlantId]);

  // --- Handlers for Switching & Managing Areas ---
  const handleSelectPlant = (newPlantId: string) => {
    if (newPlantId === currentPlantId) return;

    // Immediately persist current plant
    persistPlantToStorage(currentPlantId, {
      processes,
      losses,
      rootCauses,
      matrixA,
      matrixB,
      causalDeployments,
      financialParams,
    });

    setCurrentPlantId(newPlantId);
    try {
      localStorage.setItem(`${STORAGE_KEY}_CURRENT_PLANT_ID`, newPlantId);
    } catch {}
    setSelectedBCDeploymentId('');
  };

  const handleCreatePlant = async (newArea: {
    name: string;
    code?: string;
    description?: string;
    useTemplate: boolean;
  }) => {
    const newId = `plant_${Date.now()}`;
    const newPlant: PlantArea = {
      id: newId,
      name: newArea.name,
      code: newArea.code || `PLT-${(plantAreas.length + 1).toString().padStart(2, '0')}`,
      description: newArea.description || '',
      createdAt: new Date().toISOString(),
    };

    const updatedAreas = [...plantAreas, newPlant];
    setPlantAreas(updatedAreas);
    try {
      localStorage.setItem(`${STORAGE_KEY}_PLANT_AREAS`, JSON.stringify(updatedAreas));
      localStorage.setItem(`${STORAGE_KEY}_CURRENT_PLANT_ID`, newId);
    } catch {}

    savePlantAreasToFirestore(updatedAreas).catch(console.warn);

    // Initial data for new area
    const initialProcesses = newArea.useTemplate
      ? INITIAL_PROCESSES
      : [
          {
            id: 'proc_1',
            code: 'EQ-01',
            name: `${newArea.name} - Linha 01`,
            plantSection: newArea.name,
            description: 'Primeiro equipamento cadastrado da área',
          },
        ];

    const initialData = {
      processes: initialProcesses,
      losses: INITIAL_LOSS_CATEGORIES,
      rootCauses: newArea.useTemplate ? INITIAL_ROOT_CAUSES : [],
      matrixA: newArea.useTemplate ? INITIAL_MATRIX_A_VALUES : [],
      matrixB: newArea.useTemplate ? INITIAL_MATRIX_B_VALUES : [],
      causalDeployments: newArea.useTemplate ? INITIAL_CAUSAL_DEPLOYMENTS : [],
      financialParams: INITIAL_FINANCIAL_PARAMS,
    };

    persistPlantToStorage(newId, initialData);

    try {
      await saveWcmPlantToFirestore(
        {
          plantName: newPlant.name,
          plantCode: newPlant.code,
          plantDescription: newPlant.description,
          ...initialData,
        },
        newId
      );
    } catch (e) {
      console.warn('Saved area locally, cloud pending:', e);
    }

    // Switch active area
    setCurrentPlantId(newId);
    setSelectedBCDeploymentId('');
  };

  const handleOpenAreaModal = (plantIdToEdit?: string) => {
    setEditingPlantIdInModal(plantIdToEdit || null);
    setIsNewAreaModalOpen(true);
  };

  const handleUpdatePlant = async (
    plantId: string,
    updatedData: { name: string; code?: string; description?: string }
  ) => {
    const updatedAreas = plantAreas.map((p) =>
      p.id === plantId
        ? {
            ...p,
            name: updatedData.name,
            code: updatedData.code || '',
            description: updatedData.description || '',
          }
        : p
    );
    setPlantAreas(updatedAreas);
    try {
      localStorage.setItem(`${STORAGE_KEY}_PLANT_AREAS`, JSON.stringify(updatedAreas));
    } catch {}

    savePlantAreasToFirestore(updatedAreas).catch(console.warn);
    updatePlantMetadataInFirestore(plantId, updatedData).catch(console.warn);
  };

  const handleDeletePlant = async (plantIdToDelete: string) => {
    if (plantAreas.length <= 1) {
      alert('Não é possível excluir a única área existente.');
      return;
    }

    const updatedAreas = plantAreas.filter((p) => p.id !== plantIdToDelete);
    setPlantAreas(updatedAreas);
    try {
      localStorage.setItem(`${STORAGE_KEY}_PLANT_AREAS`, JSON.stringify(updatedAreas));
    } catch {}

    savePlantAreasToFirestore(updatedAreas).catch(console.warn);
    deletePlantFromFirestore(plantIdToDelete).catch(console.warn);

    if (currentPlantId === plantIdToDelete) {
      const fallbackId = updatedAreas[0].id;
      setCurrentPlantId(fallbackId);
      try {
        localStorage.setItem(`${STORAGE_KEY}_CURRENT_PLANT_ID`, fallbackId);
      } catch {}
      setSelectedBCDeploymentId('');
    }
  };

  // LIVE REACTIVE CALCULATIONS (Causal Deployment Model + Matrix A calculations)
  const causalCalculatedData = useMemo(() => {
    return calculateCausalDeployments(
      causalDeployments,
      processes,
      losses,
      financialParams
    );
  }, [causalDeployments, processes, losses, financialParams]);

  const legacyCalculatedData = useMemo(() => {
    return calculateWCMDeployment(
      processes,
      losses,
      rootCauses,
      matrixA,
      matrixB,
      financialParams
    );
  }, [processes, losses, rootCauses, matrixA, matrixB, financialParams]);

  // Combined Dashboard / KPI metrics prioritizing the Causal Deployment valuation
  const dashboardCalculatedData = useMemo(() => {
    const isCausalActive = causalDeployments.length > 0;
    if (isCausalActive) {
      return {
        totalPlantCost: causalCalculatedData.totalPlantCost,
        processPareto: causalCalculatedData.processPareto,
        lossSummaries: legacyCalculatedData.lossSummaries,
        rootCausePareto: causalCalculatedData.rootCausePareto,
        pillarSummary: causalCalculatedData.pillarSummary,
        totalCostBreakdown: {
          laborCost: causalCalculatedData.totalLaborCost,
          machineCost: 0,
          materialCost: 0,
          energyCost: causalCalculatedData.totalEnergyCost,
          maintenanceCost: 0,
          total: causalCalculatedData.totalPlantCost,
        },
      };
    }

    return legacyCalculatedData;
  }, [causalCalculatedData, legacyCalculatedData, causalDeployments.length]);

  // --- Handlers for Matrix A ---
  const handleUpdateMatrixACell = (processId: string, lossId: string, value: number) => {
    setMatrixA((prev) => {
      const filtered = prev.filter(
        (cell) => !(cell.processId === processId && cell.lossId === lossId)
      );
      return [...filtered, { processId, lossId, value }];
    });
  };

  const handleAddProcess = (newProcess: Omit<ProcessArea, 'id'>) => {
    const id = `proc_${Date.now()}`;
    setProcesses((prev) => [...prev, { ...newProcess, id }]);
  };

  const handleEditProcess = (updatedProcess: ProcessArea) => {
    setProcesses((prev) =>
      prev.map((p) => (p.id === updatedProcess.id ? updatedProcess : p))
    );
  };

  const handleDeleteProcess = (processId: string) => {
    setProcesses((prev) => prev.filter((p) => p.id !== processId));
    setMatrixA((prev) => prev.filter((cell) => cell.processId !== processId));
  };

  const handleAddLossCategory = (newLoss: Omit<LossCategory, 'id'>) => {
    const id = `loss_${Date.now()}`;
    setLosses((prev) => [...prev, { ...newLoss, id }]);
  };

  const handleEditLossCategory = (updatedLoss: LossCategory) => {
    setLosses((prev) =>
      prev.map((l) => (l.id === updatedLoss.id ? updatedLoss : l))
    );
  };

  const handleDeleteLossCategory = (lossId: string) => {
    setLosses((prev) => prev.filter((l) => l.id !== lossId));
    setMatrixA((prev) => prev.filter((cell) => cell.lossId !== lossId));
  };

  const handleClearMatrixA = () => {
    setMatrixA([]);
  };

  // --- Handlers for Causal Deployments (Matrix B & C) ---
  const handleAddCausalDeployment = (newDeployment: Omit<CausalDeployment, 'id'>) => {
    const id = `dep_${Date.now()}`;
    setCausalDeployments((prev) => [...prev, { ...newDeployment, id }]);
  };

  const handleEditCausalDeployment = (updatedDeployment: CausalDeployment) => {
    setCausalDeployments((prev) =>
      prev.map((d) => (d.id === updatedDeployment.id ? updatedDeployment : d))
    );
  };

  const handleDeleteCausalDeployment = (deploymentId: string) => {
    setCausalDeployments((prev) => prev.filter((d) => d.id !== deploymentId));
  };

  const handleResetCausalDeployments = () => {
    setCausalDeployments(INITIAL_CAUSAL_DEPLOYMENTS);
  };

  // --- Handlers for Matrix C Financial Params ---
  const handleUpdateFinancialParams = (newParams: FinancialParameters) => {
    setFinancialParams(newParams);
  };

  const handleOpenIntegratedBC = (processId?: string, lossId?: string, deploymentId?: string) => {
    if (deploymentId) {
      setSelectedBCDeploymentId(deploymentId);
    } else if (processId && lossId) {
      const match = causalDeployments.find(
        (d) => d.originProcessId === processId && d.lossId === lossId
      );
      if (match) {
        setSelectedBCDeploymentId(match.id);
      } else {
        const proc = processes.find((p) => p.id === processId);
        const loss = losses.find((l) => l.id === lossId);
        const newId = `dep_${Date.now()}`;
        const newDep: CausalDeployment = {
          id: newId,
          originProcessId: processId,
          originProcessName: proc?.name || 'Equipamento',
          lossId: lossId,
          lossName: loss?.name || 'Perda',
          standardTimeMin: 15,
          standardTimeText: '15 min',
          rootCauseName: 'OPERADOR EM MOVIMENTO',
          rootCauseCode: `C${(causalDeployments.length + 1).toString().padStart(2, '0')}`,
          originSector: proc?.plantSection || 'Upstream',
          pillar: (loss?.pillar as any) || 'FI',
          category: 'Método / Movimentação',
          impactedStages: [
            { id: `stg_${Date.now()}_1`, stageName: 'Setup', isStop: true, durationHours: 0.3333, operatorCount: 1 },
            { id: `stg_${Date.now()}_2`, stageName: 'Formulação', isStop: true, durationHours: 0.3333, operatorCount: 1 },
          ],
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
        };
        setCausalDeployments((prev) => [...prev, newDep]);
        setSelectedBCDeploymentId(newId);
      }
    }
    setCurrentTab('matrixBC');
  };

  // --- Handlers for Demo Reset ---
  const handleResetToDemo = () => {
    setProcesses(INITIAL_PROCESSES);
    setLosses(INITIAL_LOSS_CATEGORIES);
    setRootCauses(INITIAL_ROOT_CAUSES);
    setMatrixA(INITIAL_MATRIX_A_VALUES);
    setMatrixB(INITIAL_MATRIX_B_VALUES);
    setCausalDeployments(INITIAL_CAUSAL_DEPLOYMENTS);
    setFinancialParams(INITIAL_FINANCIAL_PARAMS);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex antialiased">
      {/* Left Sidebar (Matching Aptis Suite Style) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        plantAreas={plantAreas}
        currentPlantId={currentPlantId}
        onSelectPlant={handleSelectPlant}
        onOpenNewAreaModal={handleOpenAreaModal}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        totalPlantCost={dashboardCalculatedData.totalPlantCost}
        syncStatus={syncStatus}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-x-hidden">
        {/* Top Header Bar */}
        <TopHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          plantAreas={plantAreas}
          currentPlantId={currentPlantId}
          onSelectPlant={handleSelectPlant}
          onOpenNewAreaModal={handleOpenAreaModal}
          totalPlantCost={dashboardCalculatedData.totalPlantCost}
          onOpenReport={() => setIsReportOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onResetData={handleResetToDemo}
          syncStatus={syncStatus}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-5 space-y-5">
          {/* Operational Cell / Process Selector Carousel (Matching Screenshot 1) */}
          <OperationalCellSelector
            processes={processes}
            selectedProcessId={selectedProcessId || processes[0]?.id}
            onSelectProcess={(procId) => {
              setSelectedProcessId(procId);
              const dep = causalDeployments.find((d) => d.originProcessId === procId);
              if (dep) {
                setSelectedBCDeploymentId(dep.id);
              }
            }}
            totalPlantCost={dashboardCalculatedData.totalPlantCost}
          />

          {/* KPI Cards (Always visible on all screens to maintain strategic context) */}
          <KPICards
            totalPlantCost={dashboardCalculatedData.totalPlantCost}
            processPareto={dashboardCalculatedData.processPareto}
            lossSummaries={dashboardCalculatedData.lossSummaries}
            rootCausePareto={dashboardCalculatedData.rootCausePareto}
            costBreakdown={dashboardCalculatedData.totalCostBreakdown}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />

          {/* Tab Views */}
          {currentTab === 'dashboard' && (
            <DashboardView
              totalPlantCost={dashboardCalculatedData.totalPlantCost}
              processPareto={dashboardCalculatedData.processPareto}
              lossSummaries={dashboardCalculatedData.lossSummaries}
              rootCausePareto={dashboardCalculatedData.rootCausePareto}
              pillarSummary={dashboardCalculatedData.pillarSummary}
              costBreakdown={dashboardCalculatedData.totalCostBreakdown}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'matrixA' && (
            <MatrixAView
              processes={processes}
              losses={losses}
              matrixA={matrixA}
              causalDeployments={causalDeployments}
              onUpdateCellValue={handleUpdateMatrixACell}
              onAddProcess={handleAddProcess}
              onEditProcess={handleEditProcess}
              onDeleteProcess={handleDeleteProcess}
              onAddLossCategory={handleAddLossCategory}
              onEditLossCategory={handleEditLossCategory}
              onDeleteLossCategory={handleDeleteLossCategory}
              onClearMatrix={handleClearMatrixA}
              onOpenIntegratedBC={handleOpenIntegratedBC}
            />
          )}

          {(currentTab === 'matrixBC' || currentTab === 'matrixB' || currentTab === 'matrixC') && (
            <IntegratedMatrixBCView
              processes={processes}
              losses={losses}
              causalDeployments={causalDeployments}
              financialParams={financialParams}
              onUpdateFinancialParams={handleUpdateFinancialParams}
              onAddDeployment={handleAddCausalDeployment}
              onEditDeployment={handleEditCausalDeployment}
              onDeleteDeployment={handleDeleteCausalDeployment}
              selectedDeploymentId={selectedBCDeploymentId}
              onSelectDeployment={setSelectedBCDeploymentId}
              onNavigateToMatrixA={() => setCurrentTab('matrixA')}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/90 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              WCM Cost Deployment System • Metodologia World Class Manufacturing
            </span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
              >
                Guia dos 7 Passos WCM
              </button>
              <button
                onClick={() => setIsReportOpen(true)}
                className="text-slate-600 hover:text-cyan-600 font-medium cursor-pointer"
              >
                Relatório A3
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <WCMGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        totalPlantCost={dashboardCalculatedData.totalPlantCost}
        processCosts={dashboardCalculatedData.processPareto}
        rootCausePareto={dashboardCalculatedData.rootCausePareto}
        lossSummaries={dashboardCalculatedData.lossSummaries}
        costBreakdown={dashboardCalculatedData.totalCostBreakdown}
        pillarSummary={dashboardCalculatedData.pillarSummary}
      />
      <NewAreaModal
        isOpen={isNewAreaModalOpen}
        onClose={() => {
          setIsNewAreaModalOpen(false);
          setEditingPlantIdInModal(null);
        }}
        plantAreas={plantAreas}
        currentPlantId={currentPlantId}
        onSelectPlant={handleSelectPlant}
        onCreatePlant={handleCreatePlant}
        onUpdatePlant={handleUpdatePlant}
        onDeletePlant={handleDeletePlant}
        initialEditingPlantId={editingPlantIdInModal}
      />
    </div>
  );
}
