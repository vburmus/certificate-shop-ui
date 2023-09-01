export interface Tag {
    id: number,
    name: string,
    imageURL: string
}

export interface Token {
    token: {
        userId: number;
        accessToken: string;
        refreshToken: string;
    }
}

export interface Certificate {
    id: number,
    name: string,
    longDescription: string,
    shortDescription: string,
    price: number,
    imageURL: string,
    tags: Tag[],
    durationDate: string,
    createDate: string,
    lastUpdateDate: string
}

export interface User {
    id: number,
    name: string,
    surname: string,
    number: string,
    email: string,
    role: string,
    provider: string,
    imageURL: string
}

export interface FilterState {
    loading: boolean,
    error: string|null,
    tags: number[],
    input: string
}
export interface Sort {
    sortDate:string,
    sortName:string
}
export interface Order{
    user:User,
    giftCertificateHasOrders:Summary[],
    description:string
}
export interface Summary{
    giftCertificate:Certificate,
    quantity:number
}