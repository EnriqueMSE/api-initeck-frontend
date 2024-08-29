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
    <div class="row" style="width: 100%;">
      <div class="col-sm-2">
        <Sidebar />
      </div>
      <div class="col-sm-10">
        <router-view></router-view>
      </div>
    </div>
</template>

<style scoped>
 .col-sm-10 {
    padding:2rem;
    background-image: url("/img/bg.png");
    background-size:cover;
  }
</style>