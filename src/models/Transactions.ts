
export interface ListTransaction {
    id?: number;
    contract: string;
    id_customer: number;
    customer: string;
    id_product: number;
    product: string;
    id_type: number;
    type: string;
    id_payment_method: number;
    payment_method: string;
    amount: number;
}

export interface Transaction {
    id?: number;
    // contract: string;
    customer: number;
    product: number;
    type: number;
    payment_method: number;
    amount: number;
}

export interface Frequency {
    name: string;
    id_product: number;
    frequency: number;
}