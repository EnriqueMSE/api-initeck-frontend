
import axios from 'axios';
import { Customer } from '@/models/Customers';
import { Transaction } from '@/models/Transactions';
import { environment } from '@/environment/environment.develoment';

const apiUrl = environment.base_url;
const API_URL = `${apiUrl}transactions`;

export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // async getCustomer(name: string): Promise<Customer> {
  //   const response = await axios.get(`${API_URL}/${name}`);
  //   return response.data[0];
  // },

  async addTransaction(transaction: Transaction): Promise<void> {
    await axios.post(API_URL, transaction);
  },

  async updateTransaction(id: number, transaction: Transaction): Promise<void> {
    await axios.put(`${API_URL}/${id}`, transaction);
  },

  async deleteTransaction(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
