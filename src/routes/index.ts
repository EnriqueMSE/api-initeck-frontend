import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/auth/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Reports from '../views/Reports.vue';
import Customers from '../views/Customers.vue';
import Admin from '../views/Admin.vue';
import Products from '../views/Products.vue';
import Register from '@/views/auth/Register.vue';
import { useAuth } from '../composables/useAuth';

const routes: Array<RouteRecordRaw> = [
  { 
    path: '/',
    name: 'Home',
    component: Home
  },
  { 
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  { 
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: Admin
      },
      {
        path: 'productos',
        name: 'Productos',
        component: Products
      },
      { 
        path: 'reportes',
        name: 'Reportes',
        component: Reports
      },
      {
        path: 'clientes',
        name: 'Clientes',
        component: Customers
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si hay un token almacenado

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' }); // Redirige al login si no está autenticado
    } else {
      next(); // Permite el acceso si está autenticado
    }
  } else {
    next(); // Continúa si la ruta no requiere autenticación
  }
});

export default router;
