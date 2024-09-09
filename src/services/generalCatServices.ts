
import axios from 'axios';
import { environment } from '@/environment/environment.develoment';
import { GeneralCat } from '@/models/GeneralCat';

const apiUrl = environment.base_url;
const API_URL = `${apiUrl}general-cat`;

export const generalCatService = {
  async getCatalogs(): Promise<GeneralCat[]> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async addCat(generalCatData: GeneralCat): Promise<void> {
    await axios.post(API_URL, generalCatData);
  },

  async updateCat(id: number, generalCat: GeneralCat): Promise<void> {
    await axios.put(`${API_URL}/${id}`, generalCat);
  },

  async editStatus(id: number, status: string): Promise<void> {
    await axios.patch(`${API_URL}/status/${id}/${status}`);
  },

  async deleteCat(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },
};
