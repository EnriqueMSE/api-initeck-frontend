<script lang="ts" setup>

    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { Product } from '@/models/Products';
    import { toast } from 'vue3-toastify';
    import { transactionService } from '../services/transactionsServices';
    import { customerService } from '../services/customersServices';
    import { generalCatService } from '../services/generalCatServices';
    import { productService } from '../services/productsServices';
    import { Customer } from '@/models/Customers';
    import { ListTransaction, Transaction } from '@/models/Transactions';
    import { Tooltip } from 'bootstrap';
    import { computed } from 'vue';
    import { GeneralCat } from '@/models/GeneralCat';

    // Form inputs
    const type = ref<number>(0);
    const payment_method = ref<number>(0);
    const amount = ref<number>(0);
    const customer = ref<number>(0);
    const product = ref<number>(0);
    // Arrays
    let customers = ref<Customer[]>([]);
    let generalCatTM = ref<GeneralCat[]>([]);
    let generalCatPM = ref<GeneralCat[]>([]);
    let products = ref<Product[]>([]);
    let transactions = ref<ListTransaction[]>([]);

    let enforceability = ref<boolean>(false);
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
        getGeneralCat();
        getEnforceability();
    });

    async function handleSubmit() {
        try {
            const transactionData: Transaction = {
                customer: customer.value,
                product: product.value,
                type: type.value,
                payment_method: payment_method.value,
                amount: amount.value,
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

    async function getGeneralCat() {
        try {
            let generalCat = await generalCatService.getCatalogs();
            for (let i = 0; i < generalCat.length; i++) {
                if (generalCat[i].code == 'PM') generalCatPM.value.push(generalCat[i]);
                if (generalCat[i].code == 'TM') generalCatTM.value.push(generalCat[i]);
            }
            if (tooltipButton.value) {
                new Tooltip(tooltipButton.value);
            }
        } catch (error) {
            console.error('Error al obtener los catálogos:', error);
        }
    }

    async function getEnforceability() {
        let list = await transactionService.getEnforceability();
        if (list.valueOf.length > 0) enforceability.value = false;
        else enforceability.value = true;
    }

    function editTransaction(transaction: ListTransaction) {
        // console.log(transaction.customer);
        // selectedTransactions.value = transaction;
        // customer.value = transaction.customer;
        // product.value = transaction.product;
        // type.value = transaction.type;
        // payment_method.value = transaction.payment_method;
        // amount.value = transaction.amount;
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
        customer.value = 0;
        product.value = 0;
        type.value = 0;
        payment_method.value = 0;
        amount.value = 0;
        selectedTransactions.value = null;
    }

    async function createEnforceability() {
        enforceability.value = false;
        await transactionService.createEnforceability();
    }

    async function domiciliation() {
        enforceability.value = true;
        await transactionService.createDomiciliation();
    }

</script>

<template>
    <nav class="navbar">
        <div class="container-fluid">
            <a class="navbar-brand mb-0 h1"><h3><i class="fa-solid fa-arrow-right-arrow-left"></i>&nbsp;Movimientos</h3></a>
            <div class="login__field" data-bs-toggle="tooltip" data-bs-placement="top" title="Buscar Por Cliente" ref="tooltipButton">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" v-model="searchQuery" class="login__input" placeholder="Ingresa nombre" />
            </div>
            <div class="d-flex justify-content-md-end">
                <button type="button" class="btn btn-warning btn-sm me-3" @click="domiciliation()" data-bs-toggle="modal" data-bs-target="#transactionModal" >                    
                    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar Movimiento" ref="tooltipButton">
                        <i class="fa-solid fa-money-bill-transfer"></i>&nbsp;Domiciliación
                    </div>
                </button>
                <button type="button" class="btn btn-success btn-sm py-1" @click="formReset()" data-bs-toggle="modal" data-bs-target="#transactionModal" >                    
                    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar Movimiento" ref="tooltipButton">
                        <i class="fa-solid fa-plus fa-sm"></i>&nbsp;Agregar
                    </div>
                </button>
            </div>
        </div>    
    </nav>
    <div class="container mt-2">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-primary">
                    <tr>
                        <th scope="col">Cliente</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Método de pago</th>
                        <th scope="col">Monto</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedTransactions.length > 0" v-for="(TransactionPost, index) in paginatedTransactions" :key="TransactionPost.id">
                        <td>{{ TransactionPost.customer }}</td>
                        <td>{{ TransactionPost.product }}</td>
                        <td>{{ TransactionPost.type }}</td>
                        <td>{{ TransactionPost.payment_method }}</td>
                        <td>$ {{ TransactionPost.amount }}</td>
                        <td class="text-center">
                            <button class="btn btn-sm me-2" data-bs-toggle="modal" data-bs-target="#transactionModal" @click="editTransaction(TransactionPost)">
                                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Editar Clientes" ref="tooltipButton">  
                                    <i class="fa-solid fa-pen-to-square text-info"></i>
                                </div>
                            </button>                                
                            <button v-if="TransactionPost.id" type="button" class="btn btn-sm" @click="deleteTransaction(TransactionPost.id)">
                                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Cliente" ref="tooltipButton">
                                    <i class="fa-solid fa-trash text-danger"></i>                                
                                </div>
                            </button>
                        </td>
                    </tr>
                    <tr v-else>
                        <td colspan="5" class="text-center">No hay movimientos registrados.</td>
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
                        <i class="fa-solid fa-arrow-right-arrow-left"></i>&nbsp;&nbsp;{{ selectedTransactions ? 'Editar el movimiento' : 'Agregar un movimiento' }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <div class="login__field form-floating">
                                <i class="fa-solid fa-person-circle-check"></i>                              
                                <select name="customer" v-model="customer" class="login__select" id="customer" required>
                                    <option v-for="(customer, index) in customers" :key="index" :value="customer.id">
                                        {{ customer.name }}
                                    </option>
                                </select>
                                <label class="login__field" for="customer">Clientes Disponibles</label>                               
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="login__field form-floating">
                                <i class="fa-solid fa-cubes-stacked"></i>                              
                                <select name="product" v-model="product" class="login__select" id="product" required>
                                    <option v-for="(product, index) in products" :key="index" :value="product.id">
                                        {{ product.name }}
                                    </option>
                                </select>
                                <label class="login__field" for="product">Productos Disponibles</label>                               
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="login__field form-floating">
                                <i class="fa-solid fa-person-circle-check"></i>                              
                                <select name="type"  v-model="type" class="login__select" id="type" required>
                                    <option v-for="(cat, index) in generalCatTM" :key="index" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                                <label class="login__field" for="type">Tipo de Movimiento</label>                               
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="login__field form-floating">
                                <i class="fa-solid fa-person-circle-check"></i>                              
                                <select name="payment_method"  v-model="payment_method" class="login__select" id="payment_method" required>
                                    <option v-for="(cat, index) in generalCatPM" :key="index" :value="cat.id">
                                        {{ cat.name }}
                                    </option>
                                </select>
                                <label class="login__field" for="type">Metodo de Pago</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="login__field form-floating">
                                <i class="fa-solid fa-person-circle-check"></i>                              
                                <input class="login__select" type="number" name="amount" v-model="amount" id="amount">
                                <label class="login__field" for="type">Cantidad</label>
                            </div>
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