<template>
  <nav class="navbar bg-body-tertiary sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="/img/Ichtus-48.png" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">&nbsp;
        <router-link class="custom-link" to="/admin">Dashboard</router-link>
      </a>
    </div>
  </nav>
  <div class="container h-100 d-flex justify-content-center align-items-center">
    <div class="row w-100">
      <div class="col-12 col-md-6 col-lg-4 mx-auto">
        <h1 class="text-center">Formulario de Pago</h1>
        <div v-if="flag_form">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" id="name" v-model="name" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="product" class="form-label">Producto</label>
              <input type="text" id="product" v-model="product" class="form-control"/>
            </div>
            <div class="mb-3">
              <label for="quantity" class="form-label">Cantidad</label>
              <input type="number" id="quantity" v-model.number="quantity" class="form-control" min="1"/>
            </div>
            <button class="btn btn-primary" type="submit">
              Realizar pago
            </button>
          </form>
        </div>
        <div v-else>
          <form @submit.prevent="searchCustomer">
            <div class="mb-3">
              <label for="name" class="form-label">Nombre</label>
              <input type="text" id="name" v-model="name" class="form-control" required />
            </div>
            <button class="btn btn-primary" type="submit">
              Buscar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import { jsPDF } from 'jspdf';
import { paymentsService } from '../services/paymentsServices';
import { productService } from '../services/productsServices';
import { customerService } from '../services/customersServices';
import { toast } from 'vue3-toastify';
import { Pay } from '@/models/Pay';
import { Product } from '@/models/Products';
import { User } from '@/models/Auth';

  const name = ref<string>('');
  const product = ref<string>('');
  const quantity = ref<number>(0);
  let products = ref<Product[]>([]);
  let user = ref<User[]>([]);
  let flag_form = ref<boolean>(false);

  onMounted(() => {
    getProducts();
  });

  async function getProducts() {
    try {
      products.value = await productService.getProducts();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  }

  // Función para buscar el cliente y el producto
  const searchCustomer = async () => {
    try {
      const user = await customerService.getCustomer(name.value);
      for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].name == user.product) {
          product.value = products.value[i].name;
          quantity.value = products.value[i].price;
          flag_form.value = true;
        }
      }
    } catch (e) {
      toast.error('No se encontró el cliente');
    }
  };

  async function handleSubmit() {
    try {
      const payData: Pay = {
        customer: name.value,
        product: product.value,
        quantity: quantity.value,
      };

      await paymentsService.addPay(payData);
      generatePDF();
      toast.success('Pago realizado con éxito');
      name.value = '';
      product.value = '';
      quantity.value = 0;
      user.value.length = 0;
    } catch (e) {
      toast.error(`No se logró realizar el pago`);
    }
  }

  // async function getCustomer(name: string) {
  //   try {
  //     const user = await customerService.getCustomer(name);
  //     console.log(user);
  //     product.value = user.product;
  //     let search = products.value.find((p) => p.name == user.name);
  //     if (search) {
  //       quantity.value = search.price;
  //     }
  //   } catch (error) {
  //     console.error('Error al obtener el cliente:', error);
  //   }
  // }

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Ticket de Pago', 20, 20);
    doc.setFontSize(12);
    doc.text(`Usuario: ${name.value}`, 20, 40);
    doc.text(`Producto: ${product.value}`, 20, 50);
    doc.text(`Cantidad: ${quantity.value}`, 20, 60);
    // Descargar el PDF
    doc.save('ticket_pago.pdf');
  };
</script>

<style scoped>
  .custom-link {
    text-decoration: none;
    font-family: Nunito;
    font-size: 16px;
    line-height: 3rem;
  }
  .fa-solid, .custom-link {
    color: #818094;
  }
</style>
