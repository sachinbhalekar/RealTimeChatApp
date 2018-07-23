<template>
  <div class="ChatProfile">
    <div id="info">
      <span>Profile for User: {{ loggedUser }}</span>
      <button @click="logout">Log Out</button>
    </div>
    <br />
    <div id="chatMsgDiv">
      <div id="currentChatDiv">
        <h4>Current Chat with User: {{ to_user }} </h4>
        <div id="currentChatWindow">
          <div v-for="msg in currentChat" :key="msg.id" v-bind:class="{'container':true, 'container darker':(msg.From === loggedUser)}">
            <p>{{ msg.From }} : {{ msg.Message }}</p>
            <span class="time-right">{{ msg.Date }}</span>
            </div>
        </div>To:
        <select v-model="to_user" @click="fetchTodayChat">
          <option disabled value="">Please select user</option>
          <option v-for="user in userList" :key="user.id">
            {{ user.email }}
          </option>
        </select>
        &nbsp;
        Message:<input v-model="msg" placeholder="type message here..." style="width:300px"/>
        <button @click="sendMsg">Send</button>
      </div>
      <div id="chatHistoryDiv">
        <h4>Last 50 messages</h4>
        <div id="chatHistoryWindow">
          <div v-for="msg in msgHistory" :key="msg.id" v-bind:class="{'container':true, 'container darker':(msg.From === loggedUser)}">
            <p>{{ msg.From }} : {{ msg.Message }}</p>
            <span class="time-right">{{ msg.Date }}</span>
            </div>
        </div>
        <br />
        <button @click="fetchLastMsgs">Refresh Messages</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import chatProfileService from '@/services/chatProfileService'

var socket = io('http://localhost:8081')

export default {
  name: 'ChatProfile',

  data () {
    return {
      loggedUser: '',
      to_user: '',
      msg: '',
      userList: [],
      currentChat: [],
      msgHistory: [],
      timer1: '',
      timer2: '',
      interval: 1000
    }
  },

  beforeCreate () {
    if (!this.$session.exists()) {
      this.$router.push({ name: 'Login' })
    }
  },
  mounted () {
    this.loggedUser = this.$session.get('loggedUser')
    this.fetchUserList()
    this.fetchLastMsgs()
    this.chkMsg()
  },
  methods: {
    async chkMsg () {
      socket.on(this.loggedUser, function (data) {
        console.log('New msg recieved')
        console.log(socket.loggedUser)
        alert(data.userFrom + ' : ' + data.msg)
        this.to_user = data.userFrom
        var jsonOj = {To: this.loggedUser, From: data.userFrom, Message: data.msg, Date: data.date}
        if (this.currentChat.length === 0) {
          this.fetchTodayChat()
        } else {
          this.currentChat.push(jsonOj)
        }
      }.bind(this))
    },

    async sendMsg () {
      socket.emit('fromClient', { userFrom: this.loggedUser, userTo: this.to_user, msg: this.msg })
      console.log('data sent')
      var jsonOj = {To: this.to_user, From: this.loggedUser, Message: this.msg, Date: new Date()}
      this.currentChat.push(jsonOj)
    },

    logout () {
      socket.emit('disconnect')
      this.$session.destroy()
      this.$router.push({ name: 'Login' })
    },

    async fetchUserList () {
      const response = await chatProfileService.fetchUserList({
        userId: this.loggedUser
      })
      if (response.data.msg === 'success') {
        this.userList = response.data.userList
      }
    },

    async fetchLastMsgs () {
      const response = await chatProfileService.fetchLastMsgs({
        userId: this.loggedUser,
        limit: 50
      })
      if (response.data.msg === 'success') {
        console.log(' Fetch Last 50 msg')
        this.msgHistory = response.data.history
      }
    },

    async fetchTodayChat () {
      if (this.to_user !== '') {
        const response = await chatProfileService.fetchTodayChat({
          userId: this.loggedUser,
          userFor: this.to_user
        })
        if (response.data.msg === 'success') {
          // this.currentChat = response.data.todayChat
          for (var i = 0; i < response.data.todayChat.length; i++) {
            var jsonOj = {To: response.data.todayChat[i].To, From: response.data.todayChat[i].From, Message: response.data.todayChat[i].Message, Date: response.data.todayChat[i].Date}
            this.currentChat.push(jsonOj)
          }
        }
      }
    },

    async setScrollPos () {
      var objDiv = document.getElementById('currentChatWindow')
      objDiv.scrollTop = objDiv.scrollHeight
    }
  },

  beforeDestroy () {
    this.logout()
  }
}
</script>

<style>
.container {
    border: 2px solid #dedede;
    background-color: rgb(174, 188, 214);
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
}

.darker {
    border-color: #ccc;
    background-color: rgb(142, 157, 224);
}

.container::after {
    content: "";
    clear: both;
    display: table;
}
.time-right {
    float: right;
    color: rgb(9, 5, 34);
}
#chatMsgDiv
{
  float: left;
  width: 100%;
}

#currentChatDiv
{
  float: left;
  width: 49%;
}

#chatHistoryDiv
{
  float: left;
  width: 49%;
}

#currentChatWindow
{
  background-color: rgb(39, 97, 173);
  height: 500px;
  width: 99%;
  overflow-y: auto;
}

#chatHistoryWindow
{
  background-color: rgb(39, 97, 173);
  float: right;
  height: 500px;
  width: 99%;
  overflow-y: auto;
}
</style>
