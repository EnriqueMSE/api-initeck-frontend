
import axios from 'axios';
import { Customer } from '@/models/Customers';
import { environment } from '@/environment/environment.develoment';

const apiUrl = environment.base_url;
const API_URL = `${apiUrl}customers`;

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await axios.get(API_URL);
    console.log(response.data);
    return response.data;
  },

  async getCountCustomers(): Promise<number> {
    const response = await axios.get(`${API_URL}/count`);
    console.log(response.data.count);
    return response.data.count;
  },

  async getCountInactive(): Promise<number> {
    const response = await axios.get(`${API_URL}/inactive_count`);
    return response.data.count;
  },

  async getMostFrequentProducts(): Promise<string> {
    const response = await axios.get(`${API_URL}/most_frequent_products`);
    return response.data;
  },

  async getCustomer(name: string): Promise<Customer> {
    const response = await axios.get(`${API_URL}/${name}`);
    return response.data[0];
  },

  async addCustomer(customer: Customer): Promise<void> {
    await axios.post(API_URL, customer);
  },

  async updateCustomer(id: number, customer: Customer): Promise<void> {
    await axios.put(`${API_URL}/${id}`, customer);
  },

  async editStatus(id: number, status: string): Promise<void> {
    await axios.patch(`${API_URL}/status/${id}/${status}`);
  },

  async deleteCustomer(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
