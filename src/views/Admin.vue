<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { customerService } from '../services/customersServices';

let count_customers = ref<number>(0);
let best_seller = ref<string>('');

onMounted(() => {
    getCustomers();
    getMostFrequentProducts();
});

async function getCustomers() {
    try {
      count_customers.value = await customerService.getCountCustomers();
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
}

async function getMostFrequentProducts() {
    try {
        best_seller.value = await customerService.getMostFrequentProducts();
        console.log(best_seller.value);
    } catch (error) {
      console.error('Error al obtener los productos más vendidos:', error);
    }
}

</script>

<template>
    <h1 class="Nunito">Dashboard</h1>
    <div class="row">
        <div class="col-md-4">
            <div class="card d-flex justify-content-center">
                <div class="card-body">
                    <p class="text-center">
                        <i class="fa-solid fa-user-plus"></i>
                    </p>
                    <p class="text-center Nunito">Cliente activos</p>
                    <p class="Nunito text-center">{{ count_customers }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <p class="text-center">
                        <i class="fa-solid fa-user-minus"></i>
                    </p>
                    <p class="text-center Nunito">Clientes inactivos</p>
                    <p class="text-center Nunito">2</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <p class="text-center">
                        <i class="fa-solid fa-cubes"></i>
                    </p>
                    <p class="text-center Nunito">Producto mas vendido</p>
                    <p class="text-center Nunito">{{ best_seller }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fa-solid {
    color: #394E90;
}
</style>