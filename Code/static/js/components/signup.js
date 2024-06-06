const signup = {
    template: `
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h2>Sign Up</h2>
                <form>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="text" class="form-control" id="email" placeholder="Enter your email" v-model="formData.email" required>
                    </div>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" placeholder="Choose a username" v-model="formData.username" required>
                    </div>
                    <div class="form-group" required>
                        <label>Roles</label>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="role" id="manager" value="manager" v-model="formData.role">
                            <label class="form-check-label" for="manager">
                                Manager
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="role" id="customer" value="customer" v-model="formData.role">
                            <label class="form-check-label" for="customer">
                                Customer
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Enter a password" v-model="formData.password" required>
                    </div>
                    <div class="form-group">
                        <label for="checkPassword">Confirm Password</label>
                        <input type="password" class="form-control" id="checkPassword" placeholder="Re-enter your password" v-model="formData.checkPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary" @click.prevent="register">Register</button>
                </form>
            </div>
        </div>
    </div>
    `,

    mounted: function() {
        document.title = 'Sign Up';
    },

    data() {
        return {
            formData: {
                email: '',
                username: '',
                role: '',
                password: '',
                checkPassword: '',
            },
            error: '',
        }
    },

    methods: {
        password_match(){
            return this.formData.password === this.formData.checkPassword;
        },

        async register() {

            if (this.formData.username === ''){
                this.error = "Username cannot be empty";
                alert(this.error)
            } else if (this.formData.email === ''){
                this.error = "Email cannot be empty";
                alert(this.error)
            } else if (this.formData.password === ''){
                this.error = "Password cannot be empty";
                alert(this.error)
            } else if (this.formData.checkPassword === ''){
                this.error = "Please confirm your password";
                alert(this.error)
            } else if (this.formData.role === ''){
                this.error = "Please select a role";
                alert(this.error)
            } else if (this.formData.password.length < 4){
                this.error = "Password must be at least 4 characters";
                alert(this.error)
            } else if (this.formData.username.length < 4){
                this.error = "Username must be at least 4 characters";
                alert(this.error)
            } else if (this.formData.username.length > 20){
                this.error = "Username cannot be longer than 20 characters";
                alert(this.error)
            } else if (this.formData.email.length > 50){
                this.error = "Email cannot be longer than 50 characters";
                alert(this.error)
            } else if (this.formData.password.length > 50){
                this.error = "Password cannot be longer than 50 characters";
                alert(this.error)
            } else if (this.formData.checkPassword.length > 50){
                this.error = "Password cannot be longer than 50 characters";
                alert(this.error)
            }
            
            if (this.password_match()){
                console.log(this.formData)
                const res = await fetch('/user-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.formData),
                })

                const data = await res.json()

                if (res.ok) {
                    console.log(data)
                    this.$router.push({ path: '/login'})
                } else {
                    this.error = data.message
                    alert(this.error)
                }
            } else{
                this.error = "Passwords do not match";
                alert(this.error)
            }
        }
    }
}

export default signup;