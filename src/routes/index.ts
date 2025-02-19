import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// import Home from '../views/Home.vue';
import Login from '../views/auth/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Reports from '../views/Reports.vue';
import Customers from '../views/Customers.vue';
import Admin from '../views/Admin.vue';
import Products from '../views/Products.vue';
import Register from '@/views/auth/Register.vue';
import RecoverPassword from '@/views/auth/RecoverPassword.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import { useAuth } from '../composables/useAuth';
import Transactions from '@/views/Transactions.vue';
import GeneralCat from '@/views/GeneralCat.vue';

const routes: Array<RouteRecordRaw> = [
  { 
    path: '/',
    name: 'Home',
    redirect: '/login'
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
    path: '/recover-password',
    name: 'Recover Password',
    component: RecoverPassword
    // component: () => import('../views/auth/RecoverPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'Reset Password',
    component: ResetPassword
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
        path: 'catalogos-generales',
        name: 'Catalogos generales',
        component: GeneralCat
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
        path: 'movimientos',
        name: 'Movimientos',
        component: Transactions
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
