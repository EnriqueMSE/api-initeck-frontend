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
    <img src="/img/initeck.png" alt="Avatar" class="avatar">
    <ul class="nav flex-column">
      <li class="nav-item" ref="nav-item1">
        <i class="fa-solid fa-gauge"></i>&nbsp;
        <router-link class="custom-link" to="/admin">Dashboard</router-link>
      </li>
      <li class="nav-item" ref="nav-item2">
        <details class="custom-link">
          <summary class="no-arrow">
            <i class="fa-solid fa-list"></i>&nbsp;
            Catálogos
          </summary>
          <div class="catalogs">
            <i class="fa-solid fa-cubes-stacked"></i>&nbsp;
            <router-link class="custom-link" to="/admin/catalogos-generales">Catálogo general</router-link>
          </div>
          <div class="catalogs">
            <i class="fa-solid fa-cubes-stacked"></i>&nbsp;
            <router-link class="custom-link" to="/admin/productos">Productos</router-link>
          </div>
        </details>
      </li>
      <li class="nav-item" ref="nav-item3">
        <i class="fa-solid fa-file-circle-check"></i>&nbsp;
        <router-link class="custom-link" to="/admin/reportes">Reportes</router-link>
      </li>
      <li class="nav-item" ref="nav-item4">
        <i class="fa-solid fa-arrow-right-arrow-left"></i>&nbsp;
        <router-link class="custom-link" to="/admin/movimientos">Movimientos</router-link>
      </li>
      <li class="nav-item" ref="nav-item5">
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
  @import url('https://fonts.googleapis.com/css?family=Raleway:400,700');

  .container {
    background-color: rgb(255, 255, 255);
    height: 100vh;
  }

  .avatar {
    vertical-align: middle;
    width: 90%;
    height: 50px;
    padding: 10px;
    /* border-radius: 50%; */
  }

  .custom-link {
    text-decoration: none;
    font-family: Raleway, sans-serif; 
    font-size: 16px;
    line-height: 3rem;
  }

  .custom-link:hover{
    color:rgb(20, 88, 235);
  }

  .fa-solid, .custom-link {
    color: #133E6C;
    cursor: pointer;
  }
  summary.no-arrow {
    list-style: none;
  }
  summary.no-arrow {
    cursor: pointer;
  }
  .catalogs {
    padding-left: 0.8rem;
    background-color: rgb(243, 243, 243);
  }
</style>
