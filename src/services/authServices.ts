import axios from 'axios';
import { environment } from '../environment/environment.develoment';
import { LoginPayload, User } from '../models/Auth';

const apiUrl = environment.base_url;
const API_URL_LOGIN = `${apiUrl}login`;
const API_URL_REGISTER = `${apiUrl}register`;

export const authService = {

    // async login(username: string, password: string) {
  //   const response = await axios.post('/api/login', { username, password });
  //   const token = response.data.token;
  //   localStorage.setItem('token', token); // Guarda el token en localStorage
  //   return token;
  // },

  async login(payload: LoginPayload) {
    try {
      // const response = await axios.post(API_URL_LOGIN, payload);
      // return response.data;
      const response = await axios.post(API_URL_LOGIN, payload);
      const token = response.data.token;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || error.message);
      } else {
        throw new Error('Error inesperado');
      }
    }
  },

  async register(user: User): Promise<void> {
    await axios.post(API_URL_REGISTER, user);
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};
