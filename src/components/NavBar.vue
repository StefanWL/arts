<template>
  <nav>
    <router-link to="/bubbles">Bubbles</router-link>
    <router-link to="/draw">Draw</router-link>
    <router-link to="/rotor">Rotor</router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
  name: 'NavBar',
})
</script>

<style scoped>
nav {
  padding: 30px;
}

a {
  font-weight: bold;
  font-size: large;
  text-decoration: none;
  margin-right: 2em;
  color: #42b883;
  transition: color 0.1s;
}

a:last-child {
  margin-right: 0;
}

a:hover {
  color: #b8860b;
}

a.router-link-exact-active {
  color: #b8860b;
}
</style>