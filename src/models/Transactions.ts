import { Customer } from "./Customers";
import { Product } from "./Products";

export interface Transaction {
    id?: number;
    type: string;
    payment_method: string;
    amount: number;
    customer: Customer;
    product: Product;
}  