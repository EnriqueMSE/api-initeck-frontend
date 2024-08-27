<template>
    <div class="container h-100 d-flex justify-content-center align-items-center">
        <div class="row w-100">
            <div class="col-12 col-md-6 col-lg-4 mx-auto">
                <h1 class="Nunito text-center">Recuperar Contraseña</h1>
                <form @submit.prevent="submitEmail">
                    <div class="form-group">
                        <label for="email" class="form-label">Correo Electrónico:</label>
                        <input type="email" class="form-control" id="email" v-model="email" required />
                    </div>
                    <button class="mt-3 btn btn-primary w-100" type="submit">Enviar enlace de recuperación</button>
                </form>
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