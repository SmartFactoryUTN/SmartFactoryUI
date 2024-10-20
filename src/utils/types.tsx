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

export interface Tizada {
    uuid: string;
    name: string;
    parts: TizadaPart[];
    bin: string | null;
    results: any[];
    state: 'CREATED' | 'IN_PROGRESS' | 'FINISHED' | 'ERROR';
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface RolloDeTela {
    fabricRollId: string;
    name: string; 
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
    name: string;
    stock: number; //verificar que este bien
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface PrendaDetallada {
    name: string;
    stock: number;
    fabricPieces: GarmentPart[]
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
    color: string;
    colorId: string;
    moldeId: string;
    url: string;
    quantity: number;
}

export interface FabricColor {
    fabricColorId: string;
    name: string;
}

export interface ApiResponse<T> {
    status: string;
    data: T;
}