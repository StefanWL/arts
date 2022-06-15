<template>
  <div @mousedown="startLine" @mouseup="endLine" @mousemove="extendLine" v-if="canvas.renderer?.domElement"
    v-child="canvas.renderer?.domElement">

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { LineCanvas } from '@/canvases/DrawCanvas';

export default defineComponent({
  setup() {
    return {}
  },
  name: 'LinesView',
  data() {
    return {
      canvas: {} as LineCanvas,
    };
  },
  props: {
    color: String,
  },
  methods: {
    startLine(event: MouseEvent): void {
      if (this.color) {
        this.canvas.startLine(
          this.color,
          event.clientX,
          event.clientY
        );
      }
    },

    extendLine(event: MouseEvent): void {
      this.canvas.extendActiveLine(event.clientX, event.clientY);
    },

    endLine(): void {
      this.canvas.endLine();
    },

  },
  mounted() {
    this.canvas = new LineCanvas();
    this.canvas.animate();
  },
  unmounted() {
    this.canvas.cleanUp();
  }
})
</script>

<style scoped>
</style>