const user_cart = {
    template: `
    <div class="container mt-5">
        <div v-if="cartData.length>0">
            <h2>Shopping Cart</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Product</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Modify</th>
                    </tr>
                </thead>
                <tbody v-for="cart in cartData">
                    <tr>
                        <td v-for="cat in catData" v-if="cart.c_category_id == cat.category_id">{{cat.category_name}}</td>
                        <td v-for="prod in prodData" v-if="cart.c_product_id == prod.product_id">{{prod.product_name}}</td>
                        <td v-for="prod in prodData" v-if="cart.c_product_id == prod.product_id">{{prod.price_unit}}</td>
                        <td v-for="prod in prodData" v-if="cart.c_product_id == prod.product_id">{{cart.c_quantity}}</td>
                        <td v-for="prod in prodData" v-if="cart.c_product_id == prod.product_id">{{cart.c_totalprice}}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" @click.prevent="editCart(cart.cart_id, cart.c_category_id, cart.c_product_id)">Edit</button>
                            <button class="btn btn-danger btn-sm" @click.prevent="deleteCart(cart.cart_id)">Delete</button>
                        </td>
                    </tr>   
                </tbody>
            </table>
            <div class="text-right">
                <p><strong>Cart Value: {{grandTotal}} INR</strong></p>
                <button class="btn btn-success" @click.prevent="placeOrder">Place Order</button>
            </div>
        </div>
        <div v-if="showNoItems">
            <h5>No items in your cart</h5>
        </div>
    </div>
    `,

    data: function() {
        return {
            cartData: [],
            catData: [],
            prodData: [],
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            ord_no: null,
            error: '',
            showNoItems: false,
        }
    },

    computed: {
        grandTotal() {
            return this.cartData.reduce((total, cart) => total + cart.c_totalprice, 0)
        },      
    },

    async mounted() {
        document.title = 'Cart';

        setTimeout(() => {
            if (this.cartData.length == 0) {
                this.showNoItems = true;
            }
        }, 15000);
        

        // Fetch all categories
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

        // Fetch all products
        const res_prod = await fetch('/api/product', {
            headers: {
                'Authentication-Token': this.token,
            },
        })

        const data_prod = await res_prod.json()
        if (res_prod.ok) {             
            this.prodData = data_prod
            console.log(this.prodData)
        } else {
            this.error = res_prod.status
            console.log(this.error)
        }

        // Fetch all cart items
        const res_cart = await fetch('/api/cart', {
            headers: {
                'Authentication-Token': this.token,
            },
        })

        const data_cart = await res_cart.json()
        if (res_cart.ok) {             
            this.cartData = data_cart
            console.log(this.cartData)
        } else {
            this.error = res_cart.status
            console.log(this.error)
        }
    },

    methods: {
        async deleteCart(cart_id) {
            const res = await fetch('/api/cart/' + cart_id, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.token,
                },
            })
            if (res.ok) {
                this.$router.go(0)
            } else {
                this.error = res.status
                console.log(this.error)
            }
        },

        editCart(cart_id, cat_id, prod_id) {
            this.$router.push('/user_edit_purchase/' + cart_id + '/' + cat_id + '/' + prod_id)
        },

        async placeOrder() {
            const res = await fetch('/place_order', {
                headers: {
                    'Authentication-Token': this.token,
                },
            })

            const data = await res.json()

            if (res.ok) {
                console.log(data.message)
                this.ord_no = data.ord_no
                this.$router.push(`/user_place_order/${this.ord_no}`)
            } else {
                this.error = data.error_message
                alert(data.error_message + '\n' + data.category + '\n' + data.product + '\n' + data.quantity)
            }
            
        }

    },
}

export default user_cart;