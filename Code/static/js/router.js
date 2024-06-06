import profile from './components/profile.js';
import home from './components/home.js';
import login from './components/login.js';
import admin_categories from './components/admin/admin_categories.js';
import manager_products from './components/manager/manager_products.js';
import user_dashboard from './components/user/user_dashboard.js';
import signup from './components/signup.js';
import admin_requests from './components/admin/admin_requests.js';
import admin_permissions from './components/admin/admin_permissions.js';
import admin_create_category from './components/admin/admin_create_category.js';
import admin_edit_category from './components/admin/admin_edit_category.js';
import manager_create_product from './components/manager/manager_create_product.js';
import manager_edit_product from './components/manager/manager_edit_product.js';
import manager_request from './components/manager/manager_request.js';
import user_purchase from './components/user/user_purchase.js';
import user_cart from './components/user/user_cart.js';
import user_edit_purchase from './components/user/user_edit_purchase.js';
import user_place_order from './components/user/user_place_order.js';

const routes = [
    { path: '/', component: home },
    { path: '/profile', component: profile},
    { path: '/login', component: login, name: 'Login' },
    { path: '/admin_categories', component: admin_categories },
    { path: '/signup', component: signup },
    { path: '/admin_permissions', component: admin_permissions},
    { path: '/admin_requests', component: admin_requests},
    { path: '/admin_create_category', component: admin_create_category},
    { path: '/admin_edit_category/:id', component: admin_edit_category},
    { path: '/manager_products', component: manager_products },
    { path: '/manager_create_product', component: manager_create_product},
    { path: '/manager_edit_product/:id', component: manager_edit_product},
    { path: '/manager_request', component: manager_request},
    { path: '/user_dashboard', component: user_dashboard },
    { path: '/user_purchase/:cat_id/:prod_id', component: user_purchase},
    { path: '/user_cart', component: user_cart},
    { path: '/user_edit_purchase/:cart_id/:cat_id/:prod_id', component: user_edit_purchase},
    { path: '/user_place_order/:ord_no', component: user_place_order},
]

const router = new VueRouter({
    routes: routes,
    base: '/',
})

export default router;