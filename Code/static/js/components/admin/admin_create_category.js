const create_category = {
    template: `
    <div class="container mt-5">
        <h1>Create Category</h1>
        <form>
            <div class="form-group">
                <label for="categoryName">Category Name</label>
                <input type="text" class="form-control col-8" id="categoryName" placeholder="Enter category name" v-model="catData.category_name">
            </div>
            <div class="container">
                <button type="submit" class="btn btn-primary" @click.prevent="createCategory">Create</button>
            </div>
        </form>
    </div>
    `,

    data() {
        return {
            catData: {
                category_name: null,
            },
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },

    methods: {
        async createCategory() {
            if (!this.catData.category_name) {
                alert('Please enter category name')
            } else {
                const res = await fetch('/api/category', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token,
                    },
                    body: JSON.stringify(this.catData),
                })
                const data = await res.json()
                if (res.ok) {
                    console.log(data)
                    this.$router.push({ path: '/admin_categories' })
                } else {
                    this.error = data
                    console.log(this.error)
                    alert(this.error.error_message)
                }
            }
        },
    },
}

export default create_category;