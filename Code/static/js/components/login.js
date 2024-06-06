const login = {
    template: `
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card mt-5">
                    <div class="card-header text-center">
                        <h2>Login</h2>
                    </div>
                    <div class="card-body">
                        <form>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="text" class="form-control" id="email" name="email" placeholder="Enter your email" v-model="formData.email" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" name="password" placeholder="Enter your password" v-model="formData.password" required>
                            </div>
                            <div class="d-flex justify-content-between">
                                <button type="submit" class="btn btn-primary" @click.prevent="loginUser">Login</button>
                                <button type="button" class="btn btn-primary" @click.prevent="signUp">Sign up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    mounted: function() {
        document.title = 'Login';
    },

    data() {
        return {
            formData: {
                email: '',
                password: '',
            },
            error: '',
        }
    },

    methods: {
        async loginUser() {
            const res = await fetch('/user-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.formData),
            })

            const data = await res.json()

            if (res.ok) {
                console.log(data)
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                if (data.role == 'admin') {
                    this.$router.push('/admin_categories');
                } else if (data.role == 'manager') {
                    this.$router.push('/manager_products');
                } else {
                    this.$router.push('/user_dashboard');
                }
            } else {
                this.error = data.message
                alert(this.error)
            }            
        },

        signUp() {
            this.$router.push('/signup')
        }
    }
}

export default login;