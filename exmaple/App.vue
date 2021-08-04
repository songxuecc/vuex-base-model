<template>
  <div id="app">
    <div style="display: flex">
      <div style="padding:10px">
        <h1>model自定义设置 pagenation</h1>
        <HelloWorld msg="Welcome to Your Vue.js App" />
      </div>
      <!-- <div style="padding:10px">
        <h1>使用默认初始化设置 pagenation</h1>
        <HelloWorld2 msg="Welcome to Your Vue.js App" />
      </div> -->
      <div style="padding:10px">
        <h1>使用默认初始化设置 pagenation</h1>
        <HelloWorld3 msg="Welcome to Your Vue.js App" />
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import HelloWorld2 from './components/HelloWorld2.vue'
import HelloWorld3 from './components/HelloWorld3.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    // HelloWorld2,
    HelloWorld3,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
