<script lang="ts">
import { defineComponent } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

export default defineComponent({
  components: {
    Sidebar,
  },
});
</script>

<template>
  <div class="content">
    <div class="row">
      <div class="col-md-2">
        <Sidebar />
      </div>
      <div class="col-md-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
 .col-md-10 {
    padding: 2rem;
    background-color: #dfdfdf;
  }
</style>