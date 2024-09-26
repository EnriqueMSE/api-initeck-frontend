<template>
  <div class="container contlogin">
	<div class="screen_reg">
      <div class="screen__content">
          <form class="login" @submit.prevent="handleSubmit">
              <img src="/img/initeck.png" style="width: 200px; height: 30px;">
              <h3 class="text-center mt-3 font-wb">REGISTRO</h3>
              <div class="login__field">
                <i class="login__icon fas fa-user"></i>
                <input type="email" class="login__input" placeholder="Email" id="registerEmail" v-model="email" required >
              </div>
              <div class="login__field">
                <i class="login__icon fas fa-lock"></i>
                <input type="password" class="login__input" placeholder="Password" id="registerPassword" v-model="password" required>
              </div>
              <div class="login__field">
                <i class="login__icon fas fa-lock"></i>
                <input type="password" class="login__input" placeholder="Confirm Password" id="registerConfirmPassword" v-model="confirmPassword" required>
              </div>      
              <button class="button login__submit" type="submit">
                <span class="button__text">Registrar</span>
                <i class="button__icon fas fa-chevron-right"></i>
              </button>
              <br><br><br><br>	
              <router-link class="text-center mt-5 custom-link text-white font-wb" to="/login">Iniciar sesión</router-link>
          </form>
          <div class="social-login">	
            <div class="social-icons">
              <a href="#" class="social-login__icon fab fa-instagram"></a>
              <a href="#" class="social-login__icon fab fa-facebook"></a>
              <a href="#" class="social-login__icon fab fa-twitter"></a>
            </div>
          </div>
      </div>
      <div class="screen__background">
        <span class="screen__background__shape screen__background__shape4"></span>
        <span class="screen__background__shape screen__background__shape3"></span>		
        <span class="screen__background__shape screen__background__shape2"></span>
        <span class="screen__background__shape screen__background__shape1"></span>
      </div>		
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
  </style>
  