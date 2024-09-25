export interface Mold {
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
    mold: Mold;
    quantity: number;
}

export interface Tizada {
    uuid: string;
    name: string;
    parts: TizadaPart[];
    bin: string | null;
    results: any[]; // You might want to define a more specific type for results
    state: 'CREATED' | 'IN_PROGRESS' | 'FINISHED' | 'ERROR';
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface ApiResponse<T> {
    status: string;
    data: T;
}