const manager_request = {
    template: `
        <div class="container mt-5">
            <h1>Create Admin Request</h1>
            <form>
                <div class="form-group">
                    <label for="category">Category Name</label>
                    <select class="form-control" id="category" v-model="request.cat_id">
                        <option :value="0">New Category</option>
                        <option v-for="cat in catData" :value="cat.category_id">{{cat.category_name}}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Request Type</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="requestType" id="Create" value="create" v-model="request.request_type" required>
                        <label class="form-check-label" for="type1">Create</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="requestType" id="Update" value="update" v-model="request.request_type" required>
                        <label class="form-check-label" for="type2">Update</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="requestType" id="Delete" value="delete" v-model="request.request_type" required>
                        <label class="form-check-label" for="type2">Delete</label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea class="form-control" id="description" rows="3" v-model="request.description"required></textarea>
                </div>

                <button type="submit" class="btn btn-primary" @click.prevent="createRequest">Create Request</button>
            </form>
        </div>
    `,

    data() {
        return {
            catData: [],
            token: localStorage.getItem('auth-token'),
            error: null,
            role: localStorage.getItem('role'),
            request: {
                cat_id: null,
                request_type: null,
                description: null,
            }
        }
    },

    async mounted() {
        document.title = 'Admin Request';
        const res = await fetch('/api/category', {
            headers: {
                'Authentication-Token': this.token,
            },
        })
        const data = await res.json()
        if (res.ok) {             
            this.catData = data
            console.log(this.catData)
        } else {
            this.error = res.status
            console.log(this.error)
        }        
    },

    methods: {
        async createRequest() {

            if (this.request.cat_id == null) {
                alert("Please select a category")
                return;
            } else if (this.request.request_type == null) {
                alert("Please select a request type")
                return;
            } else if (this.request.description == null) {
                alert("Please enter a description")
                return;
            }

            const res = await fetch(`/category/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body: JSON.stringify(this.request),
            })

            const data = await res.json()

            if (res.ok) {
                console.log(data)
                this.$router.push({ path: '/admin_categories' })
                alert(data.message)
            } else {
                this.error = data
                console.log(this.error)
                alert(this.error.error_message)
            }
        },
    },
}

export default manager_request;