const admin_categories = {
    template: `
    <div>
        <div class="row row-cols-1 row-cols-md-4 g-4">
            <div class="col-3" v-for="cat in catData" :key="cat.category_id">
                <div class="card bordered-card mb-4" style="width: 18rem;">
                    <img class="card-img-top" :src="'/static/images/categories/' + cat.category_name + '.png'" alt="Category Image" >
                    <div class="card-body">
                        <h5 class="card-title">{{cat.category_name}}</h5>
                        <p class="card-text">This category of groceries belongs to {{cat.category_name}}.</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between" v-if="role=='admin'">
                        <button class="btn btn-secondary" @click.prevent="editCategory(cat.category_id)">Edit</button>
                        <button class="btn btn-danger" @click.prevent="delConfirm(cat.category_id)">Delete</button>                        
                    </div>
                </div>
                <div v-if="delete_confirm.is_delete_confirm && delete_confirm.category_id==cat.category_id">
                    <p class="card-text">Are you sure you want to delete this?</p>
                    <div class="d-flex justify-content-between mb-3">
                        <small>
                            <button class="btn btn-danger" @click.prevent="delCategory(cat.category_id)">Yes</button>
                            <button class="btn btn-secondary" @click.prevent="cancDelCategory">No</button>
                        </small>
                    </div>
                </div>
            </div>
        </div>
        <button class="btn btn-primary position-absolute top-0 end-0 mt-4 mr-4" @click.prevent="addCategory" v-if="role=='admin'">Add Categories</button>
        <button class="btn btn-primary position-absolute top-0 end-0 mt-4 mr-4" @click.prevent="reqAdmin" v-else>Request Admin</button>
    </div>
    `,

    data() {
        return {
            catData: [],
            token: localStorage.getItem('auth-token'),
            error: null,
            role: localStorage.getItem('role'),
            delete_confirm: {
                category_id: null,
                is_delete_confirm: false,
            },
        }
    },

    methods: {
        addCategory() {
            this.$router.push({ path: '/admin_create_category' })
        },

        delConfirm(category_id) {
            this.delete_confirm.category_id = category_id
            this.delete_confirm.is_delete_confirm = true
        },

        cancDelCategory() {
            this.delete_confirm.category_id = null
            this.delete_confirm.is_delete_confirm = false
        },

        async delCategory(category_id) {
            const res = await fetch(`/api/category/${category_id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.token,
                },
            })
            const data = await res.json()
            if (res.ok) {
                console.log(data.message)
                this.$router.go(0)
            } else {
                this.error = data.error_message
                alert(this.error)
            }

            this.delete_confirm.category_id = null
            this.delete_confirm.is_delete_confirm = false
        },

        editCategory(category_id) {
            this.$router.push({ path: `/admin_edit_category/${category_id}` })
        },

        reqAdmin() {
            this.$router.push({ path: '/manager_request' })
        },
    },

    async mounted() {
        document.title = 'Categories';
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
}

export default admin_categories;