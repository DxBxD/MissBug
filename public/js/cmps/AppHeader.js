import { showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import LoginSignup from './LoginSignup.js'

export default {
    template: `
        <header class="app-header">
            <div v-if="user" @click="navigateToProfile()" class="user-details-link">{{user.fullname}} - profile page</div>
            <h1 class="header-title" @click="$router.push('/')">Miss Bug</h1>  
            <div class="user-login-container">
                <section v-if="user">
                    <p>Welcome {{user.fullname}}</p>   
                    <button @click="logout">Logout</button>
                </section>
                <section v-else>
                    <LoginSignup @setUser="onSetUser" />
                 </section>
            </div>  
        </header>
    `,
    data() {
        return {
            user: userService.getLoggedinUser()
        }
    },
    methods: {
        onSetUser(user) {
            this.user = user
            this.$router.push('/')
        },
        logout() {
            userService.logout()
                .then(()=>{
                    this.user = null
                    this.$router.push('/')
                }) 
                .catch(err => {
                    console.log('Cannot logout', err)
                    showErrorMsg(`Cannot logout`)
                })
        },
        navigateToProfile() {
            this.$router.push({path: '/user/' + this.user._id})
        },
    },
    components: {
        LoginSignup
    }
}
