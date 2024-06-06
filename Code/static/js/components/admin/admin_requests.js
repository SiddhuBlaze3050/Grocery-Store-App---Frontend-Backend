const admin_requests = {
    template: `
        <div class="container mt-5">
            <h2>Category Requests Table</h2>
            <table class="table" v-if="!showNoCat">
                <thead>
                    <tr>
                        <th scope="col">Category Name</th>
                        <th scope="col">Request Type</th>
                        <th scope="col">Description</th>
                        <th scope="col">Request Access</th>
                    </tr>
                </thead>
                <tbody v-for="cat_req in catReqData">
                    <tr>
                        <td v-if="cat_req.r_category_id==0"> New Category </p> </td>
                        <span v-else v-for="cat in catData">
                            <td v-if="cat.category_id==cat_req.r_category_id"> {{cat.category_name}} </td>
                        </span>
                        <td>{{cat_req.request_type}}</td>
                        <td>{{cat_req.description}}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click.prevent="approveReject(cat_req.request_id)">Approve</button>
                            <button type="button" class="btn btn-danger"  @click.prevent="approveReject(cat_req.request_id)">Reject</button>
                        </td>
                    </tr>                    
                </tbody>
            </table>
            <div container v-else>
                <p>No Category Requests from Manager</p>
            </div>

            <h2>Product Requests Table</h2>
            <table class="table" v-if="!showNoProd">
                <thead>
                    <tr>
                        <th scope="col">Product Name</th>
                        <th scope="col">Request Type</th>
                        <th scope="col">Request Access</th>
                    </tr>
                </thead>
                <tbody v-for="prod_req in prodReqData">
                    <tr>
                        <span v-for="prod in prodData">
                            <td v-if="prod.product_id==prod_req.r_product_id">{{prod.product_name}}</td>
                        </span>
                        <td>{{prod_req.request_type}}</td>
                        <td>
                            <button type="button" class="btn btn-success" @click.prevent="acceptProduct(prod_req.request_id, prod_req.r_product_id)">Accept</button>
                            <button type="button" class="btn btn-danger" @click.prevent="rejectProduct(prod_req.request_id)">Reject</button>
                        </td>
                    </tr>                    
                </tbody>
            </table>
            <div container v-else>
                <p>No Product Requests from Manager</p>
            </div>
        </div>
    `,
    data() {
        return {
            catData: [],
            prodData: [],
            catReqData: [],
            prodReqData: [],
            token: localStorage.getItem('auth-token'),
            error: null,
            role: localStorage.getItem('role'),
            showNoCat: false,
            showNoProd: false,
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

        const res_cat_req = await fetch('/admin/category/requests', {
            headers: {
                'Authentication-Token': this.token,
            },
        })

        const data_cat_req = await res_cat_req.json()
        if (res_cat_req.ok) {             
            this.catReqData = data_cat_req
            console.log(this.catReqData)
        } else {
            this.error = res_cat_req.status
            console.log(this.error)
        }

        const res_prod_req = await fetch('/admin/product/requests', {
            headers: {
                'Authentication-Token': this.token,
            },
        })

        const data_prod_req = await res_prod_req.json()
        if (res_prod_req.ok) {             
            this.prodReqData = data_prod_req
            console.log(this.prodReqData)
        } else {
            this.error = res_prod_req.status
            console.log(this.error)
        }

        setTimeout(() => {
            if (this.catReqData.length == 0) {
                this.showNoCat = true;
            }

            if (this.prodReqData.length == 0) {
                this.showNoProd = true;
            }
        }, 10000);
    },

    methods: {
        async approveReject(req_id) {
            const res = await fetch(`/admin/category/request/${req_id}`, {
                headers: {
                    'Authentication-Token': this.token,
                },
            })

            if (res.ok) {
                alert("Request processed successfully")
                this.$router.go(0)
            } else {
                alert("Error approving/rejecting request")
            }
        },

        async acceptProduct(req_id, prod_id) {
            const res = await fetch(`/admin/product/request/${req_id}`, {
                headers: {
                    'Authentication-Token': this.token,
                },
            })

            if (res.ok) {
                alert("Request processed successfully")
                this.$router.go(0)
            } else {
                alert("Error accepting request")
            }

            const res_prod = await fetch(`/api/product/${prod_id}`, {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.token,
                },
            })

            const data_prod = await res_prod.json()

            if (res_prod.ok) {
                console.log("Request Deleted ")
            } else {
                this.error = data_prod.error_message
            }
        },

        async rejectProduct(req_id) {
            const res = await fetch(`/admin/product/request/${req_id}`, {
                headers: {
                    'Authentication-Token': this.token,
                },
            })

            if (res.ok) {
                alert("Request processed successfully")
                this.$router.go(0)
            } else {
                alert("Error rejecting request")
            }
        }
    }
}

export default admin_requests;