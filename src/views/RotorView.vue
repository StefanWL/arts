<template>
  <div @mousedown="grabRotor" @mouseup="releaseRotor" @mousemove="spinRotor" v-if="canvas.renderer?.domElement"
    v-child="canvas.renderer?.domElement">

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { RotorCanvas } from '@/canvases/RotorCanvas';
import { ColorRepresentation } from 'three';

export default defineComponent({
  setup() {
    return {}
  },
  name: 'RotorView',
  data() {
    return {
      canvas: {} as RotorCanvas,
    };
  },
  props: {
    color: String,
  },
  watch: {
    color(newVal: ColorRepresentation): void {
      this.canvas.updateColor(newVal);
    }
  },
  methods: {
    grabRotor(event: MouseEvent): void {
      this.canvas.setGrabbedRotor(event.clientX, event.clientY);
    },
    spinRotor(event: MouseEvent): void {
      this.canvas.rotateGrabbedRotor(event.clientX, event.clientY);
    },
    releaseRotor(): void {
      this.canvas.releaseGrabbedRotor();
    }
  },
  mounted() {
    if (this.color)
      this.canvas = new RotorCanvas(this.color);
    this.canvas.animate();
  },
  unmounted() {
    this.canvas.cleanUp();
  }
})
</script>

<style scoped>
</style>