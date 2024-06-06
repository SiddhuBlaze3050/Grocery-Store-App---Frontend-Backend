const navbar = {
    template: `
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="/static/images/your-logo.png" alt="EZ Stores Logo" width="50">
            </a>
            <h5 v-if="is_login"> <a class="navbar-brand" href="#"><router-link to="">EZ Stores</router-link></a> </h5>
            <h5 v-else> <a class="navbar-brand" href="#"><router-link to="/">EZ Stores</router-link></a> </h5>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item" v-if="role!='user' && is_login">
                        <a class="nav-link" href="#"><router-link to="/admin_categories">Categories</router-link></a>
                    </li>
                    <li class="nav-item" v-if="role=='manager'">
                        <a class="nav-link" href="#"><router-link to="/manager_products">Products</router-link></a>
                    </li>
                    <li class="nav-item" v-if="role=='user'">
                        <a class="nav-link" href="#"><router-link to="/user_dashboard">Shopping</router-link></a>
                    </li>
                </ul>

                <ul class="navbar-nav ml-auto">
                    <li class="nav-item" v-if="role=='admin'">
                        <a class="nav-link" href="#"><router-link to="/admin_permissions">Permissions</router-link></a>
                    </li>
                    <li class="nav-item" v-if="role=='admin'">
                        <a class="nav-link" href="#"><router-link to="/admin_requests">Requests</router-link></a>
                    </li>
                    <li class="nav-item" v-if="is_login">
                        <a class="nav-link" href="#"><router-link to="/profile">Profile</router-link></a>
                    </li>   
                    <li class="nav-item" v-if="role=='user'">
                        <a class="nav-link" href="#"><router-link to="/user_cart">My Cart</router-link></a>
                    </li>                
                    <li class="nav-item">
                        <a class="nav-link" href="#" @click.prevent='logout' v-if="is_login" ><router-link to="/logout">Logout</router-link></a>    
                        <a class="nav-link" href="#" v-else ><router-link to="/login">Login</router-link></a>  <!-- Write v-if to toggle this button between login and logout -->
                    </li>                                                    
                </ul>
            </div>
        </div>
    </nav>
    `,

    data() {
        return {
            role: localStorage.getItem('role'),
            is_login: localStorage.getItem('auth-token')? true : false,
            searchResults: [],
            searchQuery: {
                query: '',
            },
            searchOption: 'name',
        }
    },

    methods: {
        logout() {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            this.$router.push({ path: '/login' })
        },
    },
}

export default navbar;