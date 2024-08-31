
export interface Transaction {
    id?: number;
    customer: string;
    product: string;
    type: string;
    payment_method: string;
}