<script lang="ts" setup>

    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { Product } from '@/models/Products';
    import { toast } from 'vue3-toastify';
    import { customerService } from '../services/customersServices';
    import { productService } from '../services/productsServices';
    import { Customer } from '@/models/Customers';
    import { Tooltip } from 'bootstrap';
    import { computed } from 'vue';
import jsPDF from 'jspdf';
import { GeneralCat } from '@/models/GeneralCat';
import { generalCatService } from '@/services/generalCatServices';

    // Form inputs
    const contract = ref('');
    const name = ref('');
    const email = ref('');
    const address = ref('');
    const coordinates = ref('');
    const product = ref(0);
    const account = ref(0);
    // Arrays
    let customers = ref<Customer[]>([]);
    let products = ref<Product[]>([]);
    let generalCatAC = ref<GeneralCat[]>([]);
    // Selected customer
    let selectedCustomer = ref<Customer | null>(null);
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
        getGeneralCat();
    });

    async function getGeneralCat() {
        try {
            let generalCat = await generalCatService.getCatalogs();
            for (let i = 0; i < generalCat.length; i++) {
                if (generalCat[i].code == 'AC') generalCatAC.value.push(generalCat[i]);
            }
            // if (tooltipButton.value) {
            //     new Tooltip(tooltipButton.value);
            // }
        } catch (error) {
            console.error('Error al obtener los catálogos:', error);
        }
    }

    async function handleSubmit() {
        try {
            const customerData: Customer = {
                contract: contract.value,
                name: name.value,
                email: email.value,
                address: address.value,
                coordinates: coordinates.value,
                product: product.value,
                account: account.value,
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
            if (tooltipButton.value) {
                new Tooltip(tooltipButton.value);
            }
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
        contract.value = customer.contract;
        name.value = customer.name;
        address.value = customer.address;
        coordinates.value = customer.coordinates;
        product.value = customer.product;
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

    const filteredCustomers = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return customers.value.filter((customer) =>
            customer.name.toLowerCase().includes(query)
        );
    });

    const paginatedCustomers = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredCustomers.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() =>
        Math.ceil(filteredCustomers.value.length / itemsPerPage.value)
    );

    function handlePageChange(page: number) {
        currentPage.value = page;
    }

    function formReset() {
        contract.value = '';
        name.value = '';
        address.value = '';
        coordinates.value = '';
        product.value = 0;
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

    function generatePdf(customer: Customer) {
      // Crear una nueva instancia de jsPDF
      let folio_date = getFirstDayOfMonth();
      const doc = new jsPDF();

      // Agregar texto al PDF
      doc.text('Hello, this is a PDF generated with jsPDF!', 10, 10);

      // Agregar más contenido como título
      doc.setFontSize(16);
      doc.text('Title of the PDF', 10, 30);

      doc.text(`${customer.account}`, 10, 20);

      // Agregar tabla, imágenes, etc. si lo necesitas

      // Guardar el archivo PDF
      doc.save(`${customer.contract}_${folio_date}.pdf`);
    }

    function getFirstDayOfMonth(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // January is 0
      const firstDay = new Date(year, month, 1);

      // Format day, month, and year as two digits each
      const day = String(firstDay.getDate()).padStart(2, '0');
      const monthFormatted = String(firstDay.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const yearFormatted = year;

      // Format in ddmmyyyy
      return `${day}${monthFormatted}${yearFormatted}`;
    }

</script>

<template>
    <nav class="navbar">
        <div class="container-fluid">
            <a class="navbar-brand mb-0 h1"><h3><i class="fa-solid fa-person"></i>&nbsp;Clientes</h3></a>
            <div class="login__field" data-bs-toggle="tooltip" data-bs-placement="top" title="Buscar Por Nombre del Cliente" ref="tooltipButton">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" v-model="searchQuery" class="login__input me-2" placeholder="Ingresa nombre" />
                </div>     
                <button type="button" class="btn btn-success btn-sm py-1" @click="formReset()" data-bs-toggle="modal" data-bs-target="#customerModal" >                    
                    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar Cliente" ref="tooltipButton">
                        <i class="fa-solid fa-plus fa-sm"></i>&nbsp;Agregar
                    </div>
                </button>
        </div>    
    </nav>
    <div class="container">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-primary">
                    <tr>
                        <th scope="col">Contrato</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Coordenadas</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Estatus</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedCustomers.length > 0" v-for="(customer, index) in paginatedCustomers" :key="customer.id">
                        <td>{{ customer.contract }}</td>
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.address }}</td>
                        <td>{{ customer.coordinates }}</td>
                        <td>{{ customer.product }}</td>
                        <td> 
                            <div data-bs-toggle="tooltip" data-bs-placement="top" title="Cambiar Estatus" ref="tooltipButton">                         
                                <div class="form-check form-switch" v-if="customer.status == 'ACTIVO'">
                                    <input class="form-check-input bg-success" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked @click="editStatus(customer.id || 0, customer.status)">                               
                                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                                </div>
                                <div class="form-check form-switch" v-else>
                                    <input class="form-check-input bg-danger" type="checkbox" role="switch" id="flexSwitchCheckDefault" @click="editStatus(customer.id || 0, customer.status)">                               
                                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                                </div>
                            </div> 
                        </td>
                        <td class="text-center">
                            <button class="btn btn-sm me-2" data-bs-toggle="modal" data-bs-target="#receiptModal" @click="generatePdf(customer)">                             
                                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Ver Recibo" ref="tooltipButton">  
                                    <i class="fa-solid fa-file-invoice text-warning"></i>
                                </div> 
                            </button> 
                            <button class="btn btn-sm me-2" data-bs-toggle="modal" data-bs-target="#customerModal" @click="editCustomer(customer)">                             
                                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Editar Clientes" ref="tooltipButton">  
                                    <i class="fa-solid fa-pen-to-square text-info"></i>
                                </div> 
                            </button>                                
                            <button v-if="customer.id" type="button" class="btn btn-sm" @click="deleteCustomer(customer.id)">
                                <div data-bs-toggle="tooltip" data-bs-placement="top" title="Eliminar Cliente" ref="tooltipButton">
                                    <i class="fa-solid fa-trash text-danger"></i>                                
                                </div>
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

    <div class="modal fade" id="customerModal" tabindex="-1" aria-labelledby="customerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="customerModalLabel">
                        <i class="fa-solid fa-person"></i>&nbsp;&nbsp;{{ selectedCustomer ? 'Editar cliente' : 'Agregar cliente' }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body me-20">
                    <form @submit.prevent="handleSubmit" class="te-5">
                        <div class="mb-2">
                            <div class="login__field">
                                <i class="fa-solid fa-user-tag"></i>                  
                                <input type="text" id="contract" placeholder="Contrato" v-model="contract" class="login__input" required />
                            </div>
                        </div>
                        <div class="mb-2">
                            <div class="login__field">
                                <i class="fa-solid fa-user-tag"></i>                  
                                <input type="text" id="name" placeholder="Nombre" v-model="name" class="login__input" required />
                            </div>
                        </div>
                        <div class="mb-2">
                            <div class="login__field">
                                <i class="fa-solid fa-at"></i>                   
                                <input type="email" id="email" placeholder="Email" class="login__input" v-model="email" required>
                            </div>
                        </div>
                        <div class="mb-2">
                            <div class="login__field">
                                <i class="fa-solid fa-map-location-dot"></i>                        
                                <input type="text" id="address" placeholder="Dirección" class="login__input" v-model="address" required>
                            </div>
                        </div>
                        <div class="mb-1">
                                <div class="login__field">
                                    <i class="fa-solid fa-location-crosshairs"></i> 
                                    <input type="text" id="coordinates" placeholder="Ubicación" v-model="coordinates" class="login__input" readonly/> 
                                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getLocation"><i class="fa-solid fa-map-pin"></i>&nbsp;Obtener</button>
                                </div>                                                                   
                        </div>
                        <div class="mb-2">
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
                        <div class="mb-2">
                            <div class="login__field form-floating">
                                <i class="fa-solid fa-building-columns"></i>                         
                                <select name="account" v-model="account" class="login__select" id="account" required>
                                    <option v-for="(account, index) in generalCatAC" :key="index" :value="account.id">
                                        {{ account.name }}
                                    </option>
                                </select>
                                <label class="login__field" for="product">Cuentas Disponibles</label>                               
                            </div>
                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="submit" class="btn btn-sm btn-success"><div data-bs-toggle="tooltip" data-bs-placement="top" title="Guardar Cliente" ref="tooltipButton"><i class="fa-solid fa-floppy-disk fa-sm"></i> Guardar</div></button>
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