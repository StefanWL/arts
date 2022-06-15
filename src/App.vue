<template>
  <NavBar />
  <ColorPicker @handleChange="changeColor" />
  <router-view :color="color" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import NavBar from '@/components/NavBar.vue';
import ColorPicker from '@/components/ColorPicker.vue';

export default defineComponent({
  setup() {
    return {};
  },
  name: "App",
  data() {
    return {
      color: "#da324b",
    };
  },
  components: { ColorPicker, NavBar },
  methods: {
    changeColor(color: string): void {
      this.color = color;
    },
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

canvas {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}
</style>
