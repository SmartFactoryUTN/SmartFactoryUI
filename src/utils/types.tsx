export interface Molde {
    uuid: string;
    name: string;
    description: string;
    area: number;
    active: boolean;
    stock: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface TizadaPart {
    mold: Molde;
    quantity: number;
}

// CREATE NEW TIZADA: Form-specific tizada type
export interface CreateTizadaFormData {
    name: string;
    width: number;
    height: number;
    utilizationPercentage: number | null;
    maxTime: number;
    maxIterations?: number;
    molds: {
        uuid: string;
        quantity: number;
    }[];
}

// GET DATA: API Response types
export type TizadaStatus = 'CREATED' | 'IN_PROGRESS' | 'FINISHED' | 'ERROR';

export interface TizadaBin {
    width: number;
    height: number;
}

interface TizadaConfiguration {
    id: string;
    time: number;  // in milliseconds
    utilizationPercentage: number;
}
  
  // Update TizadaResult to include configuration
export interface TizadaResult {
      uuid: string;
      name: string;
      configuration: TizadaConfiguration;  // add this field
      parts: TizadaPart[];
      bin: TizadaBin | null;
      results: TizadaResultData[];
      state: TizadaStatus;
      active: boolean;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      invokedAt: string | null;
      estimatedEndTime: string | null;
}

export interface TizadaResultData {
    uuid: string;
    url: string;
    materialUtilization: number;
    iterations: number;
    timeoutReached: boolean;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
}

export interface RolloDeTela {
    fabricRollId: string;
    name: string;
    description: string;
    color: FabricColor;
    stock: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface FabricPiece {
    uuid: string;
    name: string;
    stock: number; //verificar que este bien
    // TODO: atributos de moldes cortados
}

export interface Prenda {
    garmentId: string;
    article: string;
    description: string;
    fabricPieces: GarmentPart[];
    stock: number; //verificar que este bien
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface MoldeCortado {
    fabricPieceId: string;
    color: FabricColor;
    molde: Molde;
    name: string;
    stock: number;
}

export interface GarmentPart {
    fabricPieceId: string;
    name: string;
    fabricRoll: RolloDeTela;
    molde: Molde;
    url: string;
    quantity: number;
    stock: number;
}

export interface FabricColor {
    fabricColorId: string;
    name: string;
}

export interface ApiResponse<T> {
    status: string;
    data: T;
}

export interface CreateMoldePayload {
    name: string;
    description: string;
    userUUID: string;
    file: File;
}
