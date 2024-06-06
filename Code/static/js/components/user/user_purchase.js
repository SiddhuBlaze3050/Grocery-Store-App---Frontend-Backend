const user_purchase = {
    template: `
    <div class="container mt-5">
        <h2 class="mb-4">Product Information</h2>
        <form>
            <div class="mb-3 col-4">
                <label for="categoryName" class="form-label">Category Name</label>
                <input type="text" class="form-control" id="categoryName" v-model="catData.category_name" disabled>
            </div>            
            <div class="mb-3 col-4">
                <label for="productName" class="form-label">Product Name</label>
                <input type="text" class="form-control" id="productName" v-model="prodData.product_name" disabled>
            </div>
            <div class="mb-3 col-4">
                <label for="price" class="form-label">Price</label>
                <div class="input-group">
                    <input type="number" class="form-control" id="price" v-model="prodData.price_unit" disabled>
                    <span class="input-group-text">{{prodData.unit}}</span>
                </div>
            </div>
            <div class="mb-3 col-4">
                <label for="quantity" class="form-label">Quantity</label>
                <input type="number" class="form-control" id="quantity" placeholder="Enter quantity" v-model="quantity" required>
            </div>
            <div class="mb-3 col-6">
                <label for="totalPrice" class="form-label">Total Price</label>
                <input type="number" class="form-control" id="totalPrice" :placeholder="calculateTotal" v-model="calculateTotal" readonly>
            </div>

            <div class="container">
                <button type="button" class="btn btn-primary" @click.prevent="addToCart">Add to Cart</button>
            </div>

        </form>
    </div>
    `,

    data: function() {
        return {
            catData: {
                category_id: null,
                category_name: null,
            },
            prodData: {
                product_id: null,
                product_name: null,
                unit: null,
                price_unit: null,
                quantity: null,
                ecategory_id: null,
            },
            cart_info: {
                c_category_id: null,
                c_product_id: null,
                c_quantity: null,
                c_price: null,
                total_price: null,
            },
            quantity: 0,
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            cat_id: this.$route.params.cat_id,
            prod_id: this.$route.params.prod_id,
            error: null,
        }
    },

    computed: {
        calculateTotal() {
            return this.prodData.price_unit * this.quantity;
        }
    },

    async mounted() {
        document.title = 'User Purchase';

        const res_cat = await fetch('/api/category', {
            headers: {
                'Authentication-Token': this.token,
            },
        })
        const data_cat = await res_cat.json()

        if (res_cat.ok) {
            this.catData = data_cat.filter(cat => cat.category_id == this.cat_id)[0]
            console.log(this.catData)
        } else {
            this.error = res_cat.status
            console.log(this.error)
        }

        const res_prod = await fetch('/api/product', {
            headers: {
                'Authentication-Token': this.token,
            },
        })

        const data_prod = await res_prod.json()

        if (res_prod.ok) {
            this.prodData = data_prod.filter(prod => prod.product_id == this.prod_id)[0]
            console.log(this.prodData)
        } else {
            this.error = res_prod.status
            console.log(this.error)
        }
    },

    methods: {
        async addToCart() {

            if (this.quantity == 0 || this.quantity == '') {
                alert("Please enter quantity")
                return
            }

            this.cart_info = {
                c_category_id: this.cat_id,
                c_product_id: this.prod_id,
                c_quantity: this.quantity,
                c_price: this.prodData.price_unit,
                c_totalprice: this.calculateTotal,
            }
            console.log(this.cart_info)

            const res_cart = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body: JSON.stringify(this.cart_info),
            })

            const data_cart = await res_cart.json()

            if (res_cart.ok) {
                console.log(data_cart.message)
                this.$router.push('/user_dashboard')
            } else {
                this.error = data_cart.error_message
                alert(this.error)
            }
        },
    }
}

export default user_purchase;