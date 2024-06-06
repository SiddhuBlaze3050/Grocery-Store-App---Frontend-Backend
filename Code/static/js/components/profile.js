const profile = {
    template: `
        <div class="container mt-5">
            <h2>User Profile</h2>
            <form>
                <div class="mb-3 col-4">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter new username" v-model="userData.username">
                </div>

                <div class="mb-3 col-4">
                    <label for="email" class="form-label">Email</label>
                    <input type="text" class="form-control" id="email" placeholder="Enter new email" v-model="userData.email">
                </div>

                <div class="mb-3 col-6">
                    <label for="password" class="form-label">Old Password</label>
                    <input type="password" class="form-control" id="oldPassword" placeholder="Enter new password" v-model="userData.oldPassword">
                </div>

                <div class="mb-3 col-6">
                    <label for="password" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter new password" v-model="userData.password">
                </div>

                <div class="mb-3 col-6">
                    <label for="checkPassword" class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control" id="checkPassword" placeholder="Confirm new password" v-model="userData.checkPassword">
                </div>

                <div class="container">
                    <button type="button" class="btn btn-primary" @click.prevent="updateProfile">Save</button>
                </div>
            </form>
        </div>
    `,

    data() {
        return {
            role: localStorage.getItem('role'),
            userData: {
                email: null,
                username: null,
                password: null,
                checkPassword: null,
                oldPassword: null,
            },
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },

    async mounted() {
        document.title = 'Profile';

        const res = await fetch('/get/profile', {
            method: 'GET',
            headers: {
                'Authentication-Token': this.token,
            },
        });

        const data = await res.json();

        if (res.ok) {
            this.userData = data;
            console.log(this.userData);
        } else {
            this.error = data.error_message;
            console.log(this.error);
            alert(this.error);
        }
    },

    methods: {
        async updateProfile() {
            if (this.userData.password != this.userData.checkPassword) {
                alert("Passwords do not match!");
                return;
            }


            if (this.userData.email == null || this.userData.email == '') {
                alert("Email cannot be empty!");
                return;
            } else if (this.userData.username == null || this.userData.username == '') {
                alert("Username cannot be empty!");
                return;
            }

            if (this.userData.password != null) {
                if (this.userData.password.length < 4) {
                alert("Password must be at least 4 characters long!");
                return;
                } else if (this.userData.username.length < 4) {
                    alert("Username must be at least 4 characters long!");
                    return;
                } else if (this.userData.email.length < 4) {
                    alert("Email must be at least 4 characters long!");
                    return;
                } else if (this.userData.password.length > 20) {
                    alert("Password must be at most 20 characters long!");
                    return;
                }
            }

            if (this.userData.username.length > 20) {
                alert("Username must be at most 20 characters long!");
                return;
            } else if (this.userData.email.length > 20) {
                alert("Email must be at most 20 characters long!");
                return;
            } else if (!this.userData.email.includes('@')) {
                alert("Email must contain an '@'!");
                return;
            } else if (!this.userData.email.includes('.')) {
                alert("Email must contain a '.'!");
                return;
            } 

            const res = await fetch('/update/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body: JSON.stringify(this.userData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Profile updated successfully!");
                localStorage.removeItem('auth-token')
                localStorage.removeItem('role')
                this.$router.push({ path: '/login' });
            } else {
                this.error = data.error_message;
                console.log(this.error);
                alert(this.error);
            }
        },
    },
}

export default profile;