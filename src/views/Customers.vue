<script lang="ts" setup>

    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { Product } from '@/models/Products';
    import { toast } from 'vue3-toastify';
    import { customerService } from '../services/customersServices';
    import { productService } from '../services/productsServices';
    import { Customer } from '@/models/Customers';
    import { Tooltip } from 'bootstrap';

    const name = ref('');
    const address = ref('');
    const coordinates = ref('');
    const product = ref('');
    let customers = ref<Customer[]>([]);
    let products = ref<Product[]>([]);
    let selectedCustomer = ref<Customer | null>(null);
    const tooltipButton = ref<HTMLElement | null>(null);

    onMounted(() => {
        if (tooltipButton.value) {
            new Tooltip(tooltipButton.value);
        }
        getCustomers();
        getProducts();
    });

    async function handleSubmit() {
        try {
            const customerData: Customer = {
                name: name.value,
                address: address.value,
                coordinates: coordinates.value,
                product: product.value,
                status: 'ACTIVO'
            };

            if (selectedCustomer.value?.id) {
                await customerService.updateCustomer(selectedCustomer.value.id, customerData);
                toast.success(`¡Cliente ${customerData.name} editado exitosamente!`);
            } else {
                await customerService.addCustomer(customerData);
                toast.success(`¡Cliente ${customerData.name} agregado exitosamente!`);
            }

            await getCustomers();
            
            formReset();

        } catch (error) {
            toast.error(`Error al agregar el cliente ${name.value}.`);
        }
    }

    async function getCustomers() {
        try {
            customers.value = await customerService.getCustomers();
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    }

    async function getProducts() {
        try {
            products.value = await productService.getProducts();
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

    function editCustomer(customer: Customer) {
        selectedCustomer.value = customer;
        name.value = customer.name;
        address.value = customer.address
        coordinates.value = customer.coordinates
        product.value = customer.product
    }

    async function editStatus(id: number, status: string) {
        try {
            if(status == "ACTIVO") status = "INACTIVO";
            else status = "ACTIVO";

            await customerService.editStatus(id, status);
            await getCustomers();
        } catch (error) {
            toast.error(`Error al cambiar el estado del cliente ${name.value}.`);
        }
        // toast.success(`El estado del cliente ${name.value} ha sido cambiado exitosamente`);
    }

    async function deleteCustomer(id: number) {
        try {
            await customerService.deleteCustomer(id);
            toast.success(`Cliente ${name.value} eliminado exitosamente`);
            await getCustomers();
        } catch (error) {
            toast.error(`Error al eliminar el cliente ${name.value}.`);
        }
    }

    function formReset() {
        name.value = '';
        address.value = '';
        coordinates.value = '';
        product.value = '';
        selectedCustomer.value = null;
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    coordinates.value = `${lat}, ${lng}`;
                },
                (error) => {
                    console.error('Error al obtener la ubicación', error);
                }
            );
        } else {
            console.error('La geolocalización no es compatible con este navegador.');
        }
    }

</script>

<template>
    <h1 class="Nunito">Clientes</h1>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="button" class="btn btn-primary py-1" @click="formReset()" data-bs-toggle="modal" data-bs-target="#customerModal">
            <div data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar" ref="tooltipButton">
                <i class="fa-solid fa-circle-plus"></i>
            </div>
        </button>
    </div>
    <div class="container mt-2">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-primary">
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Coordenadas</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Estatus</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="customers.length > 0" v-for="(customer, index) in customers" :key="customer.id">
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.address }}</td>
                        <td>{{ customer.coordinates }}</td>
                        <td>{{ customer.product }}</td>
                        <td>
                            <button :class="['btn-sm', 'me-2', customer.status == 'ACTIVO' ? 'btn-green' : 'btn-gray']"
                                @click="editStatus(customer.id || 0, customer.status)">{{ customer.status }}
                            </button>
                        </td>
                        <td class="text-center">
                            <button class="btn-yellow btn-sm me-2" data-bs-toggle="modal" data-bs-target="#customerModal" @click="editCustomer(customer)">
                                Editar
                            </button>
                            <button v-if="customer.id" type="button" class="btn-red btn-sm" @click="deleteCustomer(customer.id)">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                    <tr v-else>
                        <td colspan="5" class="text-center">No hay productos registrados.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="customerModal" tabindex="-1" aria-labelledby="customerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="customerModalLabel">
                        {{ selectedCustomer ? 'Editar cliente' : 'Agregar cliente' }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" id="name" v-model="name" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Dirección</label>
                            <input type="text" id="address" class="form-control" v-model="address" required>
                        </div>
                        <div class="mb-3">
                            <label for="coordinates" class="form-label">Coordenadas</label>
                            <div class="input-group">
                                <input type="text" id="coordinates" v-model="coordinates" class="form-control" readonly />
                                <button type="button" class="btn btn-secondary" @click="getLocation">Obtener Ubicación</button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="product" class="form-label">Producto</label>
                            <select name="product" v-model="product" class="form-control" id="product" required>
                                <option v-for="(product, index) in products" :key="index" :value="product.name">
                                    {{ product.name }}
                                </option>
                            </select>
                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="submit" class="btn-blue">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

  
<style scoped>
    .table {
        margin-top: 20px;
    }
</style>