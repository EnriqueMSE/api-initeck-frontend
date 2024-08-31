<script lang="ts" setup>

    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { Product } from '@/models/Products';
    import { toast } from 'vue3-toastify';
    import { productService } from '../services/productsServices';
    import { Tooltip } from 'bootstrap';
    import { computed } from 'vue';

    // Form inputs
    const name = ref('');
    const description = ref('');
    const price = ref<number>(0);
    // Arrays
    let products = ref<Product[]>([]);
    // Selected products
    let selectedProduct = ref<Product | null>(null);
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
        getProducts();
    });

    async function handleSubmit() {
        try {
            const productData: Product = {
                name: name.value,
                description: description.value,
                price: price.value,
            };

            if (selectedProduct.value?.id) {
                await productService.updateProduct(selectedProduct.value.id, productData);
                toast.success(`¡Producto ${productData.name} editado exitosamente!`);
            } else {
                await productService.addProduct(productData);
                toast.success(`¡Producto ${productData.name} agregado exitosamente!`);
            }

            await getProducts();
            
            formReset();

        } catch (error) {
            toast.error(`Error al agregar el producto ${name.value}.`);
        }
    }

    async function getProducts() {
        try {
            products.value = await productService.getProducts();
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    }

    function editarProducto(producto: Product) {
        selectedProduct.value = producto;
        name.value = producto.name;
        description.value = producto.description;
        price.value = producto.price;
    }

    async function eliminarProducto(id: number) {
        try {
            await productService.deleteProduct(id);
            toast.success('Producto eliminado exitosamente');
            await getProducts();
        } catch (error) {
            toast.error('Error al eliminar el producto.');
        }
    }

    function formReset() {
        name.value = '';
        description.value = '';
        price.value = 0;
        selectedProduct.value = null;
    }

    const filteredProducts = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return products.value.filter((product) => 
            product.name.toLowerCase().includes(query)
        );
    });

    const paginatedProducts = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredProducts.value.slice(startIndex + endIndex);
    });

    const totalPages = computed(() =>
        Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    );

    function handlePageChange(page: number) {
        currentPage.value = page;
    }

</script>

<template>
    <nav class="navbar">
        <div class="container-fluid">
            <a class="navbar-brand mb-0 h1"><h3><i class="fa-solid fa-cubes-stacked"></i>&nbsp;Productos</h3></a>
            <div class="login__field" data-bs-toggle="tooltip" data-bs-placement="top" title="Buscar Por Nombre del Producto" ref="tooltipButton">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" v-model="searchQuery" class="login__input" placeholder="Ingresa nombre" />
            </div>
            <div class="d-flex justify-content-md-end">
                <button type="button" class="btn btn-success btn-sm py-1" @click="formReset()" data-bs-toggle="modal" data-bs-target="#productModal" >                    
                    <div data-bs-toggle="tooltip" data-bs-placement="top" title="Agregar Producto" ref="tooltipButton">
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
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Precio</th>
                        <th scope="col" class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="paginatedProducts.length > 0" v-for="(product, index) in paginatedProducts" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>{{ product.description }}</td>
                        <td>$ {{ product.price }}</td>
                        <td class="text-center">
                            <button class="btn-yellow btn-sm me-2" data-bs-toggle="modal" data-bs-target="#productModal" @click="editarProducto(product)">Editar</button>
                            <button v-if="product.id" class="btn-red btn-sm" @click="eliminarProducto(product.id)">Eliminar</button>
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

    <!-- Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="productModalLabel">
                        {{ selectedProduct ? 'Editar producto' : 'Agregar producto' }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" id="nombre" v-model="name" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <input type="text" id="description" class="form-control" v-model="description" required>
                        </div>
                        <div class="mb-3">
                            <label for="precio" class="form-label">Precio</label>
                            <input type="number" id="precio" v-model.number="price" class="form-control" step="0.01" min="0" required />
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