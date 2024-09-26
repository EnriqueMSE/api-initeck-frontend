<template>
    <div class="container contlogin">
      <div class="screen">
          <div class="screen__content">
              <form class="login" @submit.prevent="submitEmail">
                  <img src="/img/initeck.png" style="width: 200px; height: 30px;">
                  <h3 class="text-center mt-3 font-wb">RECUPERACION</h3>
                  <div class="login__field">
                      <i class="login__icon fas fa-user"></i>
                      <input type="email" class="login__input" placeholder="Email" id="email" v-model="email" required>
                  </div>
                  <button class="button login__submit" type="submit">
                      <span class="button__text">Enviar enlace de recuperación</span>
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

    import axios from 'axios';
    import { ref } from 'vue';

    const email = ref('');
    const submitEmail = async () => {
        try {
            await axios.post('/api/auth/recover-password', { email: email.value });
            alert('Se ha enviado un enlace de recuperación a su correo electrónico.');
        } catch (error) {
            alert('Hubo un problema enviando el enlace. Por favor, intente de nuevo.');
        }
    };

</script>

<style>
</style>