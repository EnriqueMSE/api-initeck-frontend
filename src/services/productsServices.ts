
import axios from 'axios';
import { Product } from '@/models/Products';
import { environment } from '../../src/environment/environment.develoment'

const apiUrl = environment.base_url;
const API_URL = `${apiUrl}productos`;

export const productService = {
  async getProducts(): Promise<Product[]> {
    console.log(API_URL);
    const response = await axios.get(API_URL);
    return response.data;
  },

  async addProduct(product: Product): Promise<void> {
    await axios.post(API_URL, product);
  },

  async updateProduct(id: number, product: Product): Promise<void> {
    await axios.put(`${API_URL}/${id}`, product);
  },

  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
