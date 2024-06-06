const create_product = {
    template: `
    <div class="container mt-5">
        <h1>Create Product</h1>
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
                    <input class="form-check-input" type="radio" name="units" id="unitsKg" value="Rs/kg" v-model="prodData.unit" checked>
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
                <select class="form-control" id="category" v-model="cat_id" required>
                    <option v-for="cat in catData" :value="cat.category_id">{{cat.category_name}}</option>
                </select>
            </div>
            
            <div class="container">
                <button type="submit" class="btn btn-primary justify-content-between"  @click.prevent="createProduct(cat_id)">Create</button>
            </div>
            
        </form>
    </div>
    `,

    data() {
        return {
            prodData: {
                product_name: null,
                unit: null,
                price_unit: null,
                quantity: null
            },
            catData: [],
            token: localStorage.getItem('auth-token'),
            error: null,
            cat_id: null,
        }
    },

    methods: {
        async createProduct(category_id) {

            if (!this.prodData.price_unit) {
                alert('Please enter price')
            } else if (!this.prodData.quantity) {
                alert('Please enter quantity')
            } else if (!this.prodData.unit) {
                alert('Please select unit') 
            } else if (!this.prodData.product_name) {
                alert('Please enter product name')
            } else if (!this.cat_id) {
                alert('Please select category')
            } else {
                const res = await fetch(`/api/category/${category_id}/product`, {
                    method: 'POST',
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
    }
}

export default create_product;