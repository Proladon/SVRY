<template>
  <div id="nav">
      <Home />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Home from '@/views/Home.vue'


export default defineComponent({
    components: {Home}
    
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
:root{
    --primary-dark: #374150;
    --highlight-yellow: #ECC45C;
    --highlight-red: #D086A1;
    --highlight-green: #9BF570;
    --primary-gray: #878787;
    --secondary-gray: #C4C4C4;

}

html, body, #app{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Share Tech Mono', monospace;
    text-align: center;
    background-color: var(--primary-dark);
}

#nav{
       height: 100%;
    padding: 30px;
}
</style>
