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

export type TizadaStatus = 'CREATED' | 'IN_PROGRESS' | 'FINISHED' | 'ERROR';

export interface Tizada {
    uuid: string;
    name: string;
    parts: TizadaPart[];
    bin: string | null;
    results: any[];
    state: TizadaStatus;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface RolloDeTela {
    uuid: string;
    name: string; 
    color: string; // verificar y completar los atributos
    // TODO: atributos de los rollos de tela
}

export interface FabricPiece {
    uuid: string;
    name: string;
    stock: number; //verificar que este bien
    // TODO: atributos de moldes cortados
}

export interface Prenda {
    uuid: string;
    name: string;
    stock: number; //verificar que este bien
    color: string; //verificar que este bien
    garmentParts: GarmentPart[]; //verificar que este bien
    // TODO: atributos de la prenda
}

export interface GarmentPart {
    uuid: string;
    cantidad: string;
    color: string;
    moldeUUID: string; // ver que este bien
    //TODO: Atributos de las partes de prenda
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
