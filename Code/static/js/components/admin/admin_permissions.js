const admin_permissions = {
    template: `
        <div class="container">
        <h2 class="mt-5">Admin's Manager Permissions</h2>
            <div v-if="error"> 
                {{error}}
            </div>
            <table class="table mt-3" v-else>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Access</th>
                    </tr>
                </thead>
                <tbody v-for="user in allUsers">
                    <tr>
                        <td> {{user.username}}</td>
                        <td>{{user.email}}</td>
                        <td class="col-2">
                            <button class="btn btn-success btn-block" v-if="!user.active" @click="approve_revoke(user.id)" >Approve</button>
                            <button class="btn btn-danger btn-block" v-else  @click="approve_revoke(user.id)">Revoke</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
      return {
        allUsers: [],
        token: localStorage.getItem('auth-token'),
        error: '',
      }
    },
    methods: {
      async approve_revoke(mg_id) {
        const res = await fetch(`/activate_revoke/manager/${mg_id}`, {
          headers: {
            'Authentication-Token': this.token,
          },
        })
        const data = await res.json()
        if (res.ok) {
            this.$router.go(0)
        }
      },
    },
    async mounted() {
      const res = await fetch('/managers', {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json().catch((e) => {})
      if (res.ok) {
        console.log(data)
        this.allUsers = data
      } else {
        this.error = res.status
      }
    },
}

export default admin_permissions;