<script setup lang="ts">
import router from '@/routes';
import { authService } from '@/services/authServices';

  function logOut() {
    authService.logout();
    router.push('/');
  }
</script>

<template>
  <div class="container">
    <img src="/img/Ichtus-48.png" alt="Avatar" class="avatar">
    <ul class="nav flex-column">
      <li class="nav-item">
        <i class="fa-solid fa-gauge"></i>&nbsp;
        <router-link class="custom-link" to="/admin">Dashboard</router-link>
      </li>
      <li class="nav-item">
        <details class="custom-link">
          <summary class="no-arrow">
            <i class="fa-solid fa-list"></i>&nbsp;
            Catálogos
          </summary>
          &nbsp; <i class="fa-solid fa-cubes-stacked"></i>&nbsp;
          <router-link class="custom-link" to="/admin/productos">Productos</router-link>
        </details>
      </li>
      <li class="nav-item">
        <i class="fa-solid fa-file-circle-check"></i>&nbsp;
        <router-link class="custom-link" to="/admin/reportes">Reportes</router-link>
      </li>
      <li class="nav-item">
        <i class="fa-solid fa-person-circle-check"></i>&nbsp;
        <router-link class="custom-link" to="/admin/clientes">Clientes</router-link>
      </li>
    </ul>
    <ul class="nav flex-column">
      <li class="nav-item">
        <div class="custom-link" @click="logOut">
          <i class="fa-solid fa-right-from-bracket"></i>&nbsp;
          Log Out
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .container {
    background-color: white;
    height: 100vh;
  }

  .avatar {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .custom-link {
    text-decoration: none;
    font-family: Nunito;
    font-size: 16px;
    line-height: 3rem;
  }

  .fa-solid, .custom-link {
    color: #818094;
    cursor: pointer;
  }
  summary.no-arrow {
    list-style: none;
  }
  summary.no-arrow {
    cursor: pointer;
  }
</style>
