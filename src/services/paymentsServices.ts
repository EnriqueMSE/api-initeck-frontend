
import axios from 'axios';
import { Pay } from '@/models/Pay';
import { environment } from '@/environment/environment.develoment';

const apiUrl = environment.base_url;
const API_URL = `${apiUrl}payments`;

export const paymentsService = {
//   async getPayments(): Promise<Pay[]> {
//     const response = await axios.get(API_URL);
//     return response.data;
//   },

//   async getPay(name: string): Promise<Pay> {
//     const response = await axios.get(`${API_URL}/${name}`);
//     return response.data;
//   },

  async addPay(pay: Pay): Promise<void> {
    await axios.post(API_URL, pay);
  },

//   async updatePay(id: number, pay: Pay): Promise<void> {
//     await axios.put(`${API_URL}/${id}`, pay);
//   },

//   async deletePay(id: number): Promise<void> {
//     await axios.delete(`${API_URL}/${id}`);
//   },
};