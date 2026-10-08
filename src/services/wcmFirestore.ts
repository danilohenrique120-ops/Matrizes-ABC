import { db, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from '../lib/firebase';
import {
  ProcessArea,
  LossCategory,
  RootCause,
  MatrixACell,
  MatrixBCell,
  FinancialParameters,
  CausalDeployment,
  PlantArea,
} from '../types/wcm';

export const DEFAULT_PLANT_DOC_ID = 'default_plant';
export const AREAS_REGISTRY_DOC_ID = '_areas_registry';

export const DEFAULT_PLANT_AREAS: PlantArea[] = [
  {
    id: 'default_plant',
    name: 'Fábrica Principal (Default)',
    code: 'PLT-01',
    description: 'Área Industrial Principal e Linhas de Produção',
  },
];

export interface WcmPlantFirestoreData {
  plantName?: string;
  plantCode?: string;
  plantDescription?: string;
  processes: ProcessArea[];
  losses: LossCategory[];
  rootCauses: RootCause[];
  matrixA: MatrixACell[];
  matrixB: MatrixBCell[];
  causalDeployments?: CausalDeployment[];
  financialParams: FinancialParameters;
  updatedAt?: any;
  lastUpdatedISO?: string;
}

export type SyncStatus = 'synced' | 'saving' | 'offline' | 'error' | 'loading';

/**
 * Subscribes to real-time updates from Firestore for the registered plant areas list.
 */
export function subscribeToPlantAreas(
  onUpdate: (areas: PlantArea[]) => void,
  onError: (error: Error) => void
) {
  try {
    const docRef = doc(db, 'wcm_plants', AREAS_REGISTRY_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.areas) && data.areas.length > 0) {
            onUpdate(data.areas as PlantArea[]);
            return;
          }
        }
        onUpdate([]);
      },
      (err) => {
        console.error('Firestore areas snapshot error:', err);
        onError(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.error('Failed to initialize Firestore areas listener:', err);
    onError(err);
    return () => {};
  }
}

/**
 * Persists registered areas list to Firestore
 */
export async function savePlantAreasToFirestore(areas: PlantArea[]): Promise<void> {
  try {
    const docRef = doc(db, 'wcm_plants', AREAS_REGISTRY_DOC_ID);
    await setDoc(
      docRef,
      {
        areas,
        updatedAt: serverTimestamp(),
        lastUpdatedISO: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving plant areas to Firestore:', error);
    throw error;
  }
}

/**
 * Updates an existing plant metadata in Firestore
 */
export async function updatePlantMetadataInFirestore(
  plantId: string,
  data: { name: string; code?: string; description?: string }
): Promise<void> {
  try {
    const docRef = doc(db, 'wcm_plants', plantId);
    await setDoc(
      docRef,
      {
        plantName: data.name,
        plantCode: data.code || '',
        plantDescription: data.description || '',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error(`Error updating plant ${plantId} metadata in Firestore:`, error);
    throw error;
  }
}

/**
 * Deletes a plant document from Firestore
 */
export async function deletePlantFromFirestore(plantId: string): Promise<void> {
  try {
    const docRef = doc(db, 'wcm_plants', plantId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting plant ${plantId} from Firestore:`, error);
    throw error;
  }
}

/**
 * Subscribes to real-time updates from Firestore for the given plant document.
 */
export function subscribeToWcmPlant(
  plantId: string = DEFAULT_PLANT_DOC_ID,
  onUpdate: (data: WcmPlantFirestoreData) => void,
  onError: (error: Error) => void
) {
  try {
    const docRef = doc(db, 'wcm_plants', plantId);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.data() as WcmPlantFirestoreData;
          onUpdate(rawData);
        } else {
          // Document does not exist yet on Firestore
          onUpdate({} as WcmPlantFirestoreData);
        }
      },
      (err) => {
        console.error('Firestore snapshot error:', err);
        onError(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.error('Failed to initialize Firestore listener:', err);
    onError(err);
    return () => {};
  }
}

/**
 * Persists full plant data directly to Firestore
 */
export async function saveWcmPlantToFirestore(
  data: {
    plantName?: string;
    plantCode?: string;
    plantDescription?: string;
    processes: ProcessArea[];
    losses: LossCategory[];
    rootCauses: RootCause[];
    matrixA: MatrixACell[];
    matrixB: MatrixBCell[];
    causalDeployments?: CausalDeployment[];
    financialParams: FinancialParameters;
  },
  plantId: string = DEFAULT_PLANT_DOC_ID
): Promise<void> {
  try {
    const docRef = doc(db, 'wcm_plants', plantId);
    await setDoc(
      docRef,
      {
        plantName: data.plantName,
        plantCode: data.plantCode,
        plantDescription: data.plantDescription,
        processes: data.processes,
        losses: data.losses,
        rootCauses: data.rootCauses,
        matrixA: data.matrixA,
        matrixB: data.matrixB,
        causalDeployments: data.causalDeployments || [],
        financialParams: data.financialParams,
        updatedAt: serverTimestamp(),
        lastUpdatedISO: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving WCM Plant to Firestore:', error);
    throw error;
  }
}

