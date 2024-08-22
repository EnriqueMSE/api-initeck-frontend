<script lang="ts" setup>

    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { Product } from '@/models/Products';
    import { toast } from 'vue3-toastify';
    import { productService } from '../services/productsServices';

    const name = ref('');
    const description = ref('');
    const price = ref<number>(0);
    let products = ref<Product[]>([]);
    let selectedProduct = ref<Product | null>(null); // Para saber si se está editando un producto

    onMounted(() => {
      obtenerProductos();
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

            await obtenerProductos();
            
            formReset();

        } catch (error) {
            toast.error(`Error al agregar el producto ${name.value}.`);
        }
    }

    async function obtenerProductos() {
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
            await obtenerProductos();
        } catch (error) {
            toast.error('Error al eliminar el producto.');
        }
    }

    function formReset() {
        name.value = '';
        description.value = '';
        price.value = 0;
    }

</script>

<template>
    <h1 class="Nunito">Catálogo de productos</h1>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button class="btn-blue py-1" @click="formReset()" data-bs-toggle="modal" data-bs-target="#productModal" type="button">Agregar</button>
    </div>
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
                    <tr v-if="products.length > 0" v-for="(product, index) in products" :key="product.id">
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