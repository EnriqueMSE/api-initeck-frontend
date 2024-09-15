
import axios from 'axios';
import { Customer } from '@/models/Customers';
import { ListTransaction, Transaction } from '@/models/Transactions';
import { environment } from '@/environment/environment.develoment';

const apiUrl = environment.base_url;
const API_URL = `${apiUrl}transactions`;

export const transactionService = {
  async getTransactions(): Promise<ListTransaction[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async addTransaction(transaction: Transaction): Promise<void> {
    console.log(transaction);
    await axios.post(API_URL, transaction);
  },

  async updateTransaction(id: number, transaction: Transaction): Promise<void> {
    await axios.put(`${API_URL}/${id}`, transaction);
  },

  async deleteTransaction(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },

  async createEnforceability(): Promise<void> {
    await axios.get(`${API_URL}/enforceability`);
  }

  async getEnforceability(): Promise<number> {
    const response = await axios.get(`${API_URL}/enforceability/count`);
    return response.data;
  }
};
