<template>
  <div id="app">
    <header>
      <h1>Chat Application</h1>
      <h2>ChatApp</h2>
    </header>
    <hr>
    <router-view/>
    <br/>
    <footer>
      <p>&copy; ChatApp</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #04213f;
}

footer, header
{
  background-color: rgb(83, 126, 218);
  float: left;
  width: 100%;
}
</style>
