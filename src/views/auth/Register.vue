<template>
    <div class="container h-100 d-flex justify-content-center align-items-center">
      <div class="row w-100">
        <div class="col-12 col-md-6 col-lg-4 mx-auto">
          <h1 class="Nunito text-center">Registro</h1>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="registerEmail" class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" id="registerEmail" v-model="email" required >
            </div>
            <div class="mb-3">
              <label for="registerPassword" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="registerPassword" v-model="password" required>
            </div>
            <div class="mb-3">
              <label for="registerConfirmPassword" class="form-label">Confirmar Contraseña</label>
              <input type="password" class="form-control" id="registerConfirmPassword" v-model="confirmPassword" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Registrar</button>
          </form>
        </div>
        <router-link class="text-center mt-5 custom-link" to="/login">Iniciar sesión</router-link>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>

  import { ref } from 'vue';
  import axios from 'axios';
  import { toast } from 'vue3-toastify';
  import { authService } from '../../services/authServices';
import { User } from '@/models/Auth';
  
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  // const error = ref<string | null>(null);
  
  const handleSubmit = async () => {
    if (password.value !== confirmPassword.value) {
        toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      const user: User = {
        email: email.value,
        password: password.value
      }

      await authService.register(user);
      toast.success('Registro exitoso');
      email.value = '';
      password.value = '';
      confirmPassword.value = '';
    } catch (err) {
      toast.error('Error en el registro, por favor intenta nuevamente');
    }
  };
  </script>
  
  <style scoped>
  /* Aquí puedes añadir estilos personalizados si es necesario */
  </style>
  