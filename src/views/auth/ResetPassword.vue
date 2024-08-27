<template>
    <div class="container h-100 d-flex justify-content-center align-items-center">
        <div class="row w-100">
            <div class="col-12 col-md-6 col-lg-4 mx-auto">
                <h1 class="Nunito text-center">Restablecer Contraseña</h1>
                <form @submit.prevent="resetPassword">
                    <div class="form-group">
                        <label for="password" class="form-label">Nueva Contraseña:</label>
                        <input type="password" class="form-control" id="password" v-model="password" required />
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword" class="form-label">Confirmar Contraseña:</label>
                        <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required />
                    </div>
                    <button type="submit" class="mt-3 btn btn-primary w-100">Restablecer Contraseña</button>
                </form>
            </div>
        </div>
    </div>
</template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';

      const route = useRoute();
      const password = ref('');
      const confirmPassword = ref('');
  
      const resetPassword = async () => {
        if (password.value !== confirmPassword.value) {
          alert('Las contraseñas no coinciden');
          return;
        }
  
        try {
          await axios.post('/api/auth/reset-password', {
            token: route.query.token,
            password: password.value,
          });
          alert('Su contraseña ha sido restablecida.');
        } catch (error) {
          alert('Hubo un problema restableciendo su contraseña.');
        }
      };

  </script>  