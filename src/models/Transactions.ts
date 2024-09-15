
export interface ListTransaction {
    id?: number;
    customer: string;
    product: string;
    type: string;
    payment_method: string;
    amount: number;
}

export interface Transaction {
    id?: number;
    customer: number;
    product: number;
    type: number;
    payment_method: number;
    amount: number;
}