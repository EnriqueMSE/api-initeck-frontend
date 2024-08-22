// composables/useAuth.ts
import { ref } from 'vue';

export function useAuth() {
  const isAuthenticated = ref<boolean>(false);

  const login = () => {
    isAuthenticated.value = true;
  };

  const logout = () => {
    isAuthenticated.value = false;
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
}