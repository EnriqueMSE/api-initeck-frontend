<template>
  <div class="container h-100 d-flex justify-content-center align-items-center">
    <div class="row w-100">
      <div class="col-12 col-md-6 col-lg-4 mx-auto">
        <h1 class="Nunito text-center">Login</h1>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="loginEmail" class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" id="loginEmail" v-model="email" required >
          </div>
          <div class="mb-3">
            <label for="loginPassword" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="loginPassword" v-model="password" required >
          </div>
          <button type="submit" class="btn btn-primary w-100">Iniciar sesión</button>
        </form>
      </div>
      <router-link class="text-center mt-3 custom-link" to="/recover-password">Recuperar contraseña</router-link>
      <router-link class="text-center mt-2 custom-link" to="/register">Registrarse</router-link>
    </div>
  </div>
</template>
<script lang="ts" setup>

import { ref } from 'vue';
import { authService } from '../../services/authServices';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';
import { User } from '@/models/Auth';

const email = ref('');
const password = ref('');

const router = useRouter();

const handleSubmit = async () => {
  try {
    const user: User = {
      email: email.value,
      password: password.value
    }
    
    const response = await authService.login(user);

    router.push('/');

    setTimeout(() => {
      toast.success('Inicio de sesión exitoso');
    }, 100);

  } catch (error) {
    toast.error(`Error al iniciar sesión`);
  }
};
</script>

<style scoped>

</style>
