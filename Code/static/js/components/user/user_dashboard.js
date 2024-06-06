const user_dashboard = {
    template: `
        <div>
            <div class="card mb-2">
                <div class="card-body">
                    <form class="d-flex justify-content-center mb-2">
                        <input class="form-control me-2" type="search" placeholder="Enter Category, Product Name to search" aria-label="Search" style="width: 60%; max-width: 600px; font-size: 16px;" v-model="searchQuery">
                        <select class="form-select me-2" style="padding: 8px; border-radius: 4px; margin-left: 10px; font-size: 14px;" v-model="searchOption">
                            <option value="category_name">Category Search</option>
                            <option value="product_name">Product Search</option>
                            <option value="product_price">Price Search</option>
                        </select>
                        <button class="btn btn-outline-primary" type="submit" @click.prevent="filteredItems" style="padding: 8px; border-radius: 4px; margin-left: 10px; font-size: 14px;">Search</button>
                        <button v-if="search_category || search_product || search_price" class="btn btn-outline-primary" type="submit" @click.prevent="unfilteredItems" style="padding: 8px; border-radius: 4px; margin-left: 10px; font-size: 14px;">Clear Search</button>
                    </form>
                </div>
            </div>

            <div v-if="!search_category && !search_product && !search_price" v-for="cat in catData" :key="cat.category_id" class="mb-4">
                <h2 class="mb-3">{{ cat.category_name }}</h2>
                <div v-if="hasProducts(cat.category_id)" class="row row-cols-1 row-cols-md-2 g-4">
                    <div v-for="prod in prodData" :key="prod.product_id" v-if="cat.category_id === prod.ecategory_id" class="col-3 mb-4">
                        <div class="card">
                            <img :src="'/static/images/products/' + prod.product_name + '.png'" class="card-img-top" alt="Product Image" width="250" height="250">
                            <div class="card-body">
                                <h5 class="card-title">{{ prod.product_name }}</h5>
                                <p class="card-text">Price: {{ prod.price_unit }} {{ prod.unit }}</p>
                                <p class="card-text" v-if="prod.isInStock">Stock: Available</p>
                                <p class="card-text" v-else>Stock: Out of Stock</p>
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-primary" @click.prevent="buy(prod.ecategory_id, prod.product_id)" v-if="prod.isInStock">Buy</button>
                                <button class="btn btn-primary" v-else disabled>Buy</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!hasProducts(cat.category_id)" class="col">
                    <p>No products available under this category</p>
                </div>
            </div>

            <div v-if="search_category && !search_product && !search_price" v-for="cat in searchCategories" :key="cat.category_id" class="mb-4">
                <h2 class="mb-3">{{ cat.category_name }}</h2>
                <div class="row row-cols-1 row-cols-md-2 g-4">
                    <div v-for="prod in prodData" :key="prod.product_id" v-if="cat.category_id === prod.ecategory_id" class="col-3 mb-4">
                        <div class="card">
                            <img :src="'/static/images/products/' + prod.product_name + '.png'" class="card-img-top" alt="Product Image" width="250" height="250">
                            <div class="card-body">
                                <h5 class="card-title">{{ prod.product_name }}</h5>
                                <p class="card-text">Price: {{ prod.price_unit }} {{ prod.unit }}</p>
                                <p class="card-text" v-if="prod.isInStock">Stock: Available</p>
                                <p class="card-text" v-else>Stock: Out of Stock</p>
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-primary" @click.prevent="buy(prod.ecategory_id, prod.product_id)" v-if="prod.isInStock">Buy</button>
                                <button class="btn btn-primary" v-else disabled>Buy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>   

            <div v-if="!search_category && search_product && !search_price" v-for="cat in searchCategories" :key="cat.category_id" class="mb-4">
                <h2 class="mb-3">{{ cat.category_name }}</h2>
                <div class="row row-cols-1 row-cols-md-2 g-4">
                    <div v-for="prod in searchProducts" :key="prod.product_id" v-if="cat.category_id === prod.ecategory_id" class="col-3 mb-4">
                        <div class="card">
                            <img :src="'/static/images/products/' + prod.product_name + '.png'" class="card-img-top" alt="Product Image" width="250" height="250">
                            <div class="card-body">
                                <h5 class="card-title">{{ prod.product_name }}</h5>
                                <p class="card-text">Price: {{ prod.price_unit }} {{ prod.unit }}</p>
                                <p class="card-text" v-if="prod.isInStock">Stock: Available</p>
                                <p class="card-text" v-else>Stock: Out of Stock</p>
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-primary" @click.prevent="buy(prod.ecategory_id, prod.product_id)" v-if="prod.isInStock">Buy</button>
                                <button class="btn btn-primary" v-else disabled>Buy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!search_category && !search_product && search_price" v-for="cat in searchCategories" :key="cat.category_id" class="mb-4">
                <h2 class="mb-3">{{ cat.category_name }}</h2>
                <div class="row row-cols-1 row-cols-md-2 g-4">
                    <div v-for="prod in searchPrice" :key="prod.product_id" v-if="cat.category_id === prod.ecategory_id" class="col-3 mb-4">
                        <div class="card">
                            <img :src="'/static/images/products/' + prod.product_name + '.png'" class="card-img-top" alt="Product Image" width="250" height="250">
                            <div class="card-body">
                                <h5 class="card-title">{{ prod.product_name }}</h5>
                                <p class="card-text">Price: {{ prod.price_unit }} {{ prod.unit }}</p>
                                <p class="card-text" v-if="prod.isInStock">Stock: Available</p>
                                <p class="card-text" v-else>Stock: Out of Stock</p>
                            </div>
                            <div class="card-footer">
                                <button class="btn btn-primary" @click.prevent="buy(prod.ecategory_id, prod.product_id)" v-if="prod.isInStock">Buy</button>
                                <button class="btn btn-primary" v-else disabled>Buy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-5">
                <div v-if="noProductsCategories" class="mb-4">
                    <h4 class="mb-4">No Categories / Products to display</h4>
                </div>
            </div>
        

        </div>
    `,

    data: function() {
        return {
            catData: [],
            prodData: [],
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            searchQuery: '',
            searchOption: 'category_name',
            searchCategories: [],
            searchProducts: [],
            searchPrice: [],
            search_category: false,
            search_product: false,
            search_price: false,
            error: null,
            noProductsCategories: false,
        }
    },

    async mounted() {
        document.title = 'User Dashboard';

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

        for (const product of this.prodData) {
            if (product.quantity > 0) {
                product['isInStock'] = true
            } else {
                product['isInStock'] = false
            }
        }
        
        setTimeout(() => {
            if (this.catData.length == 0 && this.prodData.length == 0) {
                this.noProductsCategories = true;
            }
        }, 2000); 

    },

    methods: {
        buy(cat_id, prod_id) {
            this.$router.push({ path: `/user_purchase/${cat_id}/${prod_id}` })
        },

        filteredItems() {
            if (this.searchOption === 'category_name') {
                if (this.searchQuery.trim() === '') {
                    alert('Please enter a search query')
                } else {
                    this.search_category = true
                    this.search_product = false
                    this.searchCategories = this.catData.filter((cat) => cat.category_name.toLowerCase().includes(this.searchQuery.trim().toLowerCase()))

                    if (this.searchCategories.length === 0) {
                        alert('No categories found')
                        this.unfilteredItems()
                    }
                }
            } else if (this.searchOption === 'product_name') {
                if (this.searchQuery.trim() === '') {
                    alert('Please enter a search query')
                } else {
                    this.searchCategories = []
                    this.search_category = false
                    this.search_product = true
                    this.searchProducts = this.prodData.filter((prod) => prod.product_name.toLowerCase().includes(this.searchQuery.trim().toLowerCase()))

                    if (this.searchProducts.length === 0) {
                        alert('No products found')
                        this.unfilteredItems()
                    }
                    
                    for (const product of this.searchProducts) {
                        for (const category of this.catData) {
                            if (category.category_id === product.ecategory_id) {
                                this.searchCategories.push(category)
                            }
                        }
                    }      
                }
            } else if (this.searchOption === 'product_price') {
                if (this.searchQuery.trim() === '') {
                    alert('Please enter a search query')
                } else {
                    this.search_price = true
                    this.search_category = false
                    this.search_product = false
                    this.searchPrice = this.prodData.filter((prod) => prod.price_unit == this.searchQuery.trim().toLowerCase())

                    if (this.searchPrice.length === 0) {
                        alert('No products found')
                        this.unfilteredItems()
                    }

                    for (const product of this.searchPrice) {
                        for (const category of this.catData) {
                            if (category.category_id === product.ecategory_id) {
                                this.searchCategories.push(category)
                            }
                        }
                    }
                }
            }
        },

        unfilteredItems() {
            this.search_category = false
            this.search_product = false
            this.search_price = false
            this.searchCategories = []
            this.searchProducts = []
            this.searchPrice = []
            this.searchQuery = ''
            this.searchOption = 'category_name'
        },

        hasProducts(category_id) {
            return this.prodData.some((prod) => prod.ecategory_id === category_id)
        },
    },       
}

export default user_dashboard;