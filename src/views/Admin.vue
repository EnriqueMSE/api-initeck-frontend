
<template>
    <h1>Dashboard</h1>
    <div class="row">
        <div class="col-md-4">
            <div class="callout callout-success d-flex justify-content-center">
                <div class="row">
                    <div class="col-sm-2">
                        <h1 class="text-center">
                            <i class="fas fa-person-circle-check fa-lg text-success fa-opacity"></i>
                        </h1>
                    </div>
                    <div class="col-sm-6">
                        <h4 class="text-center">Clientes Activos</h4>
                    </div>
                    <div class="col-sm-4">
                        <h1 class="lato-regular text-center text-info text-wb">{{ count_customers }}</h1>
                    </div>
                </div>                      
            </div>
        </div>
        <div class="col-md-4">
            <div class="callout callout-danger d-flex justify-content-center">
                <div class="row">
                    <div class="col-sm-2">
                        <h1 class="text-center">
                            <i class="fa-solid fa-person-circle-xmark fa-lg text-danger fa-opacity"></i>
                        </h1>
                    </div>
                    <div class="col-sm-6">
                        <h4 class="text-center">Clientes Inactivos</h4>
                    </div>
                    <div class="col-sm-4">
                        <h1 class="lato-regular text-center text-info text-wb">{{ count_inactive }}</h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="callout callout-warning d-flex justify-content-center">
                <div class="row">
                    <div class="col-sm-2">
                        <h1 class="text-center">
                            <i class="fa-solid fa-cubes-stacked fa-lg text-warning fa-opacity"></i>
                        </h1>
                    </div>
                    <div class="col-sm-6">
                        <h5 class="text-center">Producto Más Vendido</h5>
                    </div>
                    <div class="col-sm-4">
                        <h3 class="lato-regular text-center text-info text-wb">{{best_seller}}</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6" style="height: 300px;"><Bar :data="chartConfig.data" :options="chartConfig.options" /></div>
        
    </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { customerService } from '../services/customersServices';
import { Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs';
import * as chartConfig from './chartConfig';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend )

export default {
    name: 'Admin',
    components: {
        Bar,
    },
    data() {
        return {
            chartConfig,
            count_customers,
            count_inactive,
            best_seller
        }
    }
}

let count_customers = ref<number>(0);
let count_inactive = ref<number>(0);
let best_seller = ref<string>('');

onMounted(async() => {
    console.log("Entro al montarse");
    getCustomers();
    getMostFrequentProducts();
});

async function getCustomers() {
    try {
      count_customers.value = await customerService.getCountCustomers();
      count_inactive.value = await customerService.getCountInactive();
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
}

async function getMostFrequentProducts() {
    try {
        best_seller.value = await customerService.getMostFrequentProducts();
    } catch (error) {
        console.error('Error al obtener los productos más vendidos:', error);
    }
}

</script>

<style scoped>
.fa-solid {
    color: #394E90;
}
</style>