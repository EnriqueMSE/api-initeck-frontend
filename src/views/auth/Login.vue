<template>
  <div class="container contlogin">
	<div class="screen">
		<div class="screen__content">
			<form class="login" @submit.prevent="handleSubmit">
        <img src="/img/initeck.png" style="width: 200px; height: 30px;">
				<div class="login__field">
					<i class="login__icon fas fa-user"></i>
					<input type="text" class="login__input" placeholder="Email" id="loginEmail" v-model="email" required>
				</div>
				<div class="login__field">
					<i class="login__icon fas fa-lock"></i>
					<input type="password" class="login__input" placeholder="Password" id="loginPassword" v-model="password" required >
				</div>
				<button class="button login__submit" type="submit">
					<span class="button__text">Iniciar Sesión</span>
					<i class="button__icon fas fa-chevron-right"></i>
				</button>
        <br><br><br><br>	
        <router-link class="text-center mt-3 custom-link text-white font-wb" to="/recover-password">Recuperar contraseña</router-link><br>
        <router-link class="text-center mt-2 custom-link text-white font-wb" to="/register">Registrarse</router-link>	
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

    router.push('/admin');

    setTimeout(() => {
      toast.success('Inicio de sesión exitoso');
    }, 100);

  } catch (error) {
    toast.error(`Error al iniciar sesión`);
  }
};
</script>

<style>
  
</style>
