import { Customer } from "./Customers";
import { GeneralCat } from "./GeneralCat";
import { Product } from "./Products";

export interface Transaction {
    id?: number;
    type: GeneralCat;
    payment_method: GeneralCat;
    amount: number;
    customer: Customer;
    product: Product;
}  