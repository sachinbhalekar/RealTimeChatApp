<template>
  <div class="Login">
    <div class="form">
      <h2>Sign In</h2>
      <input type="email" v-model="sign_in_email" placeholder="Enter email" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required />
      <input type="password" v-model="sign_in_pwd" placeholder="Enter password" minlength="8" required />
      <button @click="auth">Sign In</button>
    </div>

    <div>
      <br>
      New User? <a @click="register" >Click here to register </a>
    </div>

  </div>
</template>

<script>
import LoginService from '@/services/LoginService'

export default {
  name: 'Login',

  data () {
    return {
      sign_in_email: '',
      sign_in_pwd: '',
      sign_up_email: '',
      sign_up_pwd: ''
    }
  },

  beforeCreate: function () {
    if (this.$session.exists()) {
      this.$router.push({ name: 'ChatProfile' })
    }
  },

  methods: {
    async auth () {
      const response = await LoginService.authenticate({
        email: this.sign_in_email,
        pwd: this.sign_in_pwd
      })
      var vMsg = ''
      if (response.data.msg === 'success') {
        console.log('SUCCESSFUL SIGN-IN!')
        this.$session.start()
        this.$session.set('loggedUser', this.sign_in_email)
        this.$router.push({ name: 'ChatProfile' })
      } else if (response.data.msg === 'invalid') {
        vMsg = 'Password is incorrect!'
        console.log(vMsg)
        alert(vMsg)
      } else if (response.data.msg === 'no data') {
        vMsg = 'Email ID is not registered!'
        console.log(vMsg)
        alert(vMsg)
      } else {
        vMsg = 'Some problem with Sign Up!'
        console.log(vMsg)
        alert(vMsg)
      }
    },

    async register () {
      this.$router.push({ name: 'RegisterUser' })
    }
  }
}
</script>
