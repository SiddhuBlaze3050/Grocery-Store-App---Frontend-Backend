const user_place_order = {
    template: `
    <div class="container mt-5">
        <div class="container">
            <h4> Thanks for ordering! </h4>
            <p> Your order is successfully placed and will be delivered to you as soon as possible. </p>
        </div>
        <div class="card mt-4">
            <div class="card-body">
                <h5 class="card-title">Order Summary</h5>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody v-for="ord in ordData">
                        <tr>
                            <td v-for="cat in catData" v-if="ord.o_category_id == cat.category_id">{{cat.category_name}}</td>
                            <td v-for="prod in prodData" v-if="ord.o_product_id == prod.product_id">{{prod.product_name}}</td>
                            <td v-for="prod in prodData" v-if="ord.o_product_id == prod.product_id">{{ord.o_quantity}}</td>
                            <td v-for="prod in prodData" v-if="ord.o_product_id == prod.product_id">{{prod.price_unit}} INR</td>
                            <td v-for="prod in prodData" v-if="ord.o_product_id == prod.product_id">{{ord.o_totalprice}} INR</td>
                        </tr>
                    </tbody>
                </table>

                <div class="text-right">
                    <p><strong>Order Value: {{grandTotal}} INR</strong></p>
                </div>
            </div>
        </div>
    </div>
    `,

    data: function() {
        return {
            ordData: [],
            ord_no: this.$route.params.ord_no,
            catData: [],
            prodData: [],
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },

    computed: {
        grandTotal() {
            return this.ordData.reduce((total, ord) => total + ord.o_totalprice, 0)
        },      
    },

    async mounted() {
        document.title = 'Order Placed';

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

        // Fetch recent order items
        const res_ord = await fetch(`/order_placed/${this.ord_no}`, {
            headers: {
                'Authentication-Token': this.token,
            },
        })

        const data_ord = await res_ord.json()
        if (res_ord.ok) {             
            this.ordData = data_ord
            console.log(this.ordData)
        } else {
            this.error = res_ord.status
            console.log(this.error)
        }
    }

}

export default user_place_order;