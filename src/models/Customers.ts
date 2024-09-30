
export interface Customer {
    id?: number;
    contract: string;
    name: string;
    email: string;
    address: string;
    coordinates: string;
    product: number;
    account: number;
    status: string;
}

export interface CustomerList {
    id?: number;
    contract: string;
    name: string;
    email: string;
    address: string;
    coordinates: string;
    product: number;
    id_product: number;
    id_account: number;
    account: number;
    status: string;
}