const manager_products = {
    template: `
    <div>
        <button class="btn btn-primary" style="position: fixed; top: 0; right: 0; margin: 20px;" @click.prevent="downloadResource">Export Products</button>
        <div class="row">
            <div class="col-2" v-for="(prod, index) in prodData" :key="index">
                <div class="card bordered-card mb-3">
                    <img class="card-img-top" :src="'/static/images/products/' + prod.product_name + '.png'" alt="Product Image">
                    <div class="card-body">
                        <h5 class="card-title">{{ prod.product_name }}</h5>
                        <p class="card-text">Price: {{ prod.price_unit }} {{ prod.unit }}</p>
                        <p class="card-text">Stock: {{ prod.quantity }}</p>
                        <p v-for="cat in catData" :key="cat.category_id" class="card-text" v-if="cat.category_id === prod.ecategory_id">
                            Category: {{ cat.category_name }}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary" @click.prevent="editProduct(prod.product_id)">Edit</button>
                        <button class="btn btn-danger" @click.prevent="delProduct(prod.product_id)">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <button class="btn btn-primary position-absolute top-0 end-0 mt-4 mr-4" @click.prevent="addProduct">Add Products</button>
    </div>
    `,

    data: function() {
        return {
            prodData: [],
            token: localStorage.getItem('auth-token'),
            catData: [],
            error: null,
        }
    },

    async mounted() {
        document.title = 'Products';
        const res = await fetch('/api/product', {
            headers: {
                'Authentication-Token': this.token,
            },
        })
        const data = await res.json()
        if (res.ok) {             
            this.prodData = data
            console.log(this.prodData)
        } else {
            this.error = res.status
            console.log(this.error)
        }

        const res2 = await fetch('/api/category', {
            headers: {
                'Authentication-Token': this.token,
            },
        })

        const data2 = await res2.json()
        if (res2.ok) {             
            this.catData = data2
            console.log(this.catData)
        } else {
            this.error = res2.status
            console.log(this.error)
        }
    },

    methods: {
        addProduct() {
            this.$router.push({ path: '/manager_create_product' })
        },

        editProduct(product_id) {
            this.$router.push({ path: `/manager_edit_product/${product_id}` })
        },

        async delProduct(product_id) {
            const res = await fetch(`/product/request/${product_id}`, {
                headers: {
                    'Authentication-Token': this.token,
                },
            })
            const data = await res.json()
            if (res.ok) {
                console.log(data.message)
                this.$router.go(0)
                alert(data.message)
            } else {
                this.error = data.error_message
                alert(this.error)
            }
        },

        async downloadResource() {
            const res = await fetch('/admin/products_download_csv')
            const data = await res.json()
            if (res.ok) {
              const taskId = data['task_id']
              const intv = setInterval(async () => {
                const csv_res = await fetch(`/admin/products_download_csv/${taskId}`)
                if (csv_res.ok) {
                  clearInterval(intv)
                  window.location.href = `/admin/products_download_csv/${taskId}`
                  alert('Requested Data is Downloaded')
                } else {
                    console.log('waiting for csv')
                }
              }, 1000)
            } else {
                this.error = data.error_message
                console.log(this.error)
            }
        },
    }
}

export default manager_products;