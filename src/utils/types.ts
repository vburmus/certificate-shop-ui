export interface Tag {
    id: number,
    name: string,
    imageUrl: string
}

export interface Token {
    userId: number;
    accessToken: string;
    refreshToken: string;
}

export interface Certificate {
    id: number,
    name: string,
    longDescription: string,
    shortDescription: string,
    price: number,
    imageUrl: string,
    tags: Tag[],
    durationDate: string,
    createDate: string,
    lastUpdateDate: string
}

export interface User {
    id: number,
    name: string,
    surname: string,
    phone: string,
    email: string,
    role: string,
    provider: string,
    imageUrl: string
}

export interface FilterState {
    loading: boolean,
    error: string | null,
    tags: number[],
    input: string
}

export interface Sort {
    sortDate: string,
    sortName: string
}

export interface OrderPosition {
    certificateId: number,
    quantity: number
}

export interface OrderPositionResponse {
    certificate: Certificate,
    quantity: number
}

export interface CartPosition {
    certificateId: number,
    durationDate: string
    quantity: number
}

export interface OrderRequest {
    positions: OrderPosition[],
    description: string,
}

export interface Order {
    id: number,
    description: string,
    cost: number,
    createDate: string,
    lastUpdateDate: string,
    userId: number,
    purchaseCertificates: OrderPositionResponse[]
}