<template>
  <div class="RegisterUser">
    <div class="form">
      <h2>Sign Up</h2>
      <input type="email" v-model="sign_up_email" placeholder="Enter email" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required />
      <input type="password" v-model="sign_up_pwd" placeholder="Enter password" minlength="8" required />
      <button @click="registerUser">Sign Up</button>
    </div>
    <div>
      <br>
      <a @click="login" >Click here to Login</a>
    </div>
  </div>
</template>

<script>
import LoginService from '@/services/LoginService'

export default {
  name: 'RegisterUser',

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
    async registerUser () {
      const response = await LoginService.register({
        email: this.sign_up_email,
        pwd: this.sign_up_pwd
      })
      var vMsg = ''
      if (response.data.msg === 'success') {
        console.log('SUCCESSFUL SIGN-UP!')
        vMsg = 'Successfully Registered! Login to start Chatting!'
        alert(vMsg)
        this.$router.push({ name: 'Login' })
      } else if (response.data.msg === 'found') {
        vMsg = 'Email ID already exixts!'
        console.log(vMsg)
        alert(vMsg)
      } else {
        vMsg = 'Some problem with Sign Up!'
        console.log(vMsg)
        alert(vMsg)
      }
    },
    async login () {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>
