import { showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"

export default {
    template: `
    <section class="login-signup">
        <form v-if="isSignup" @submit.prevent="signup">
            <h2>Signup</h2>
            <input type="text" v-model="signupInfo.fullname" placeholder="Full name" /><br>
            <input type="text" v-model="signupInfo.username" placeholder="Username" /><br>
            <input type="password" v-model="signupInfo.password" placeholder="Password" /><br><br>
            <button>Signup</button>
        </form>
        <form v-else @submit.prevent="login">
            <h2>Login</h2>
            <input type="text" v-model="credentials.username" placeholder="Username" /><br>
            <input type="password" v-model="credentials.password" placeholder="Password" /><br><br>
            <button>Login</button>
        </form>
        <hr />
        <div className="btns">
                <a href="#" @click="isSignup = !isSignup">
                    {{isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }}
                </a >
        </div>
    </section>
    `,
    data() {
        return {
            isSignup: false,
            credentials: {
                username: 'puki',
                password: 'puki'
            },
            signupInfo: {
                fullname: '',
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            userService.login(this.credentials)
                .then(user => {
                    this.$emit('setUser', user)
                })
                .catch(err => {
                    console.log('Cannot login', err)
                    showErrorMsg(`Cannot login`)
                })
        },
        signup() {
            userService.signup(this.signupInfo)
                .then(user => {
                    this.$emit('setUser', user)
                })
                .catch(err => {
                    console.log('Cannot signup', err)
                    showErrorMsg(`Cannot signup`)
                })
        },
    }
}