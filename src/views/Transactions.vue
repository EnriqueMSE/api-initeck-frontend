<script lang="ts" setup>

    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { Product } from '@/models/Products';
    import { toast } from 'vue3-toastify';
    import { transactionService } from '../services/transactionsServices';
    import { customerService } from '../services/customersServices';
    import { productService } from '../services/productsServices';
    import { Customer } from '@/models/Customers';
    import { Transaction } from '@/models/Transactions';
    import { Tooltip } from 'bootstrap';
    import { computed } from 'vue';

    // Form inputs
    const customer = ref('');
    const product = ref('');
    const type = ref('');
    const payment_method = ref('');
    // Arrays
    let customers = ref<Customer[]>([]);
    let products = ref<Product[]>([]);
    let transactions = ref<Transaction[]>([]);
    // Selected customer
    let selectedTransactions = ref<Transaction | null>(null);
    // Tooltip
    const tooltipButton = ref<HTMLElement | null>(null);
    // search filter
    const searchQuery = ref('');
    // Paginate
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    onMounted(() => {
        if (tooltipButton.value) {
            new Tooltip(tooltipButton.value);
        }
        getCustomers();
        getProducts();
        getTransactions();
    });

    async function handleSubmit() {
        try {
            const transactionData: Transaction = {
                customer: customer.value,
                product: product.value,
                type: type.value,
                payment_method: payment_method.value,
            };

            if (selectedTransactions.value?.id) {
                await transactionService.updateTransaction(selectedTransactions.value.id, transactionData);
                toast.success(`¡El movimiento se actualizó exitosamente!`);
            } else {
                await transactionService.addTransaction(transactionData);
                toast.success(`¡El movimiento se realizó exitosamente!`);
            }

            await getTransactions();
            
            formReset();

        } catch (error) {
            toast.error('Error al agregar el movimiento');
        }
    }

    async function getTransactions() {
        try {
            transactions.value = await transactionService.getTransactions();
        } catch (error) {
            console.error('Error al obtener los movimientos:', error);
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

    function editTransaction(transaction: Transaction) {
        selectedTransactions.value = transaction;
        customer.value = transaction.customer;
        product.value = transaction.product;
        type.value = transaction.type;
        payment_method.value = transaction.payment_method;
    }

    async function deleteTransaction(id: number) {
        try {
            await transactionService.deleteTransaction(id);
            toast.success(`El movimiento del cliente se eliminó exitosamente`);
            await getCustomers();
        } catch (error) {
            toast.error(`Error al eliminar el movimiento.`);
        }
    }

    const filteredTransactions = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return transactions.value.filter((transactions) =>
            transactions.customer.toLowerCase().includes(query)
        );
    });

    const paginatedTransactions = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredTransactions.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() =>
        Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
    );

    function handlePageChange(page: number) {
        currentPage.value = page;
    }

    function formReset() {
        customer.value = '';
        product.value = '';
        type.value = '';
        payment_method.value = '';
        selectedTransactions.value = null;
    }

</script>

<template>
    <h1 class="Nunito">Movimientos</h1>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <div class="mr-2">
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar por cliente" />
        </div>
        <button type="button" class="btn btn-primary py-1" @click="formReset()" data-bs-toggle="modal" data-bs-target="#transactionModal">
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
                        <th scope="col">Cliente</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Método de pago</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedTransactions.length > 0" v-for="(transaction, index) in paginatedTransactions" :key="transaction.id">
                        <td>{{ transaction.customer }}</td>
                        <td>{{ transaction.product }}</td>
                        <td>{{ transaction.type }}</td>
                        <td>{{ transaction.payment_method }}</td>
                        <td class="text-center">
                            <button class="btn-yellow btn-sm me-2" data-bs-toggle="modal" data-bs-target="#transactionModal" @click="editTransaction(transaction)">
                                Editar
                            </button>
                            <button v-if="transaction.id" type="button" class="btn-red btn-sm" @click="deleteTransaction(transaction.id)">
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
        <!-- Pagination Controls -->
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage - 1)">Anterior</a>
                </li>
                <li class="page-item" :class="{ active: currentPage === page }" v-for="page in totalPages" :key="page">
                    <a class="page-link" href="#" @click.prevent="handlePageChange(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage + 1)">Siguiente</a>
                </li>
            </ul>
        </nav>
    </div>

    <div class="modal fade" id="transactionModal" tabindex="-1" aria-labelledby="transactionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="transactionModalLabel">
                        {{ selectedTransactions ? 'Editar el movimiento' : 'Agregar un movimiento' }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="customer" class="form-label">Cliente</label>
                            <select name="customer" v-model="customer" class="form-control" id="customer" required>
                                <option v-for="(customer, index) in customers" :key="index" :value="customer.name">
                                    {{ customer.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="product" class="form-label">Producto</label>
                            <select name="product" v-model="product" class="form-control" id="product" required>
                                <option v-for="(product, index) in products" :key="index" :value="product.name">
                                    {{ product.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="type" class="form-label">Tipo</label>
                            <select name="type" v-model="type" class="form-control" id="type" required>
                                <option value="Entrada">Entrada</option>
                                <option value="Salida">Salida</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="payment_method" class="form-label">Metodo de pago</label>
                            <select name="payment_method" id="payment_method" v-model="payment_method" class="form-control" readonly>
                                <option value="Efectivo">Efectivo</option>
                                <option value="TDC">Tarjeta de crédito</option>
                                <option value="Transferencia">Efectivo</option>
                                <option value="TDD">Tarjeta de débito</option>
                            </select>
                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="submit" class="btn btn-sm btn-success"><i class="fa-solid fa-floppy-disk fa-sm"></i> Guardar</button>
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