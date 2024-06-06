import router from './router.js';
import navbar from './components/navbar.js';

// router.beforeEach((to, from, next) => {
//     if (to.name !== 'Login' && !localStorage.getItem('auth-token') ? true : false)
//       next({ name: 'Login' })
//     else next()
//   })

const app = new Vue({
    el: '#app',
    router: router,

    template: `
    <div>
        <navbar :key='has_changed' style="margin-bottom: 30px;"></navbar>
        <router-view></router-view>
    </div>
    `,

    delimiters: ['${', '}'],

    components: {
        'navbar': navbar,
    },

    data: {
        has_changed: true,
    },

    watch: {
        $route(to, from) {
          this.has_changed = !this.has_changed
        },
    },
})