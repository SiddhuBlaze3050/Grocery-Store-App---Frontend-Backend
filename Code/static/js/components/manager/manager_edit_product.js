const edit_product = {
    template: `
    <div class="container mt-5">
        <h1>Edit Product</h1>
        <form>
            <div class="form-group col-8">
                <label for="productName">Product Name</label>
                <input type="text" class="form-control" id="productName" placeholder="Enter product name" v-model="prodData.product_name"required>
            </div>

            <div class="form-group col-8">
                <label for="price">Price</label>
                <input type="number" class="form-control" id="price" placeholder="Enter price" v-model="prodData.price_unit"required>
            </div>

            <div class="form-group col-8">
                <label>Units</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="units" id="unitsKg" value="Rs/kg" v-model="prodData.unit">
                    <label class="form-check-label" for="unitsKg">Kg</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="units" id="unitsDozen" value="Rs/dozen" v-model="prodData.unit">
                    <label class="form-check-label" for="unitsDozen">Dozen</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="units" id="unitsLitre" value="Rs/L" v-model="prodData.unit">
                    <label class="form-check-label" for="unitsLitre">Litre</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="units" id="unitsUnit" value="Rs/unit" v-model="prodData.unit">
                    <label class="form-check-label" for="unitsUnit">Unit</label>
                </div>            
            </div>

            <div class="form-group col-8">
                <label for="stock">Stock</label>
                <input type="number" class="form-control" id="stock" placeholder="Enter stock" v-model="prodData.quantity"required>
            </div>

            <div class="form-group col-8">
                <label for="category">Category</label>
                <select class="form-control" id="category" v-model="prodData.ecategory_id" required>
                    <option v-for="cat in catData" :value="cat.category_id">{{cat.category_name}}</option>
                </select>
            </div>

            <div class="container">
                <button type="submit" class="btn btn-primary justify-content-between"  @click.prevent="editProduct(prodData.product_id)">Save</button>
            </div>

        </form>
    </div>
    `,

    data() {
        return {
            prodData: {
                product_id: null,
                product_name: null,
                unit: null,
                price_unit: null,
                quantity: null,
                ecategory_id: null
            },
            prod_id: this.$route.params.id,
            catData: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },

    methods: {
        async editProduct(product_id) {

            if (!this.prodData.price_unit) {
                alert('Please enter price')
            } else if (!this.prodData.quantity) {
                alert('Please enter quantity')
            } else if (!this.prodData.unit) {
                alert('Please select unit') 
            } else if (!this.prodData.product_name) {
                alert('Please enter product name')
            } else if (!this.prodData.ecategory_id) {
                alert('Please select category')
            } else {

                const res = await fetch(`/api/product/${product_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token,
                    },
                    body: JSON.stringify(this.prodData),
                })
                const data = await res.json()
                if (res.ok) {
                    console.log(data)
                    this.$router.push({ path: '/manager_products' })
                } else {
                    this.error = data
                    console.log(this.error)
                    alert(this.error.error_message)
                }
            }
        },
    },

    async mounted() {
        document.title = 'Create Product';
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


        const res_prod = await fetch(`/api/product`, {
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
    }
}

export default edit_product;