<template>
  <div @mousedown="handleClick" @mousemove="moveBubble" @mouseup="releaseBubble" v-if="canvas.renderer?.domElement"
    v-child="canvas.renderer?.domElement">

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { BubbleCanvas } from '@/canvases/BubbleCanvas';

export default defineComponent({
  setup() {
    return {}
  },
  name: 'BubblesView',
  data() {
    return {
      canvas: {} as BubbleCanvas,
    };
  },
  props: {
    color: String,
  },
  methods: {
    handleClick(event: MouseEvent): void {
      const bubblesClicked = this.canvas.bubblesClicked(
        event.clientX,
        event.clientY
      );

      if (bubblesClicked.length) {
        this.canvas.removeBubbles(bubblesClicked);
      }
      else if (this.color) {
        this.canvas.placeBubble(
          this.color,
          event.clientX,
          event.clientY
        );
      }
    },

    moveBubble(event: MouseEvent): void {
      this.canvas.moveBubble(
        event.clientX,
        event.clientY
      );
    },

    releaseBubble(): void {
      this.canvas.releaseBubble();
    }
  },
  mounted() {
    this.canvas = new BubbleCanvas();
    this.canvas.animate();
  },
  unmounted() {
    this.canvas.cleanUp();
  }
})
</script>

<style scoped>
</style>