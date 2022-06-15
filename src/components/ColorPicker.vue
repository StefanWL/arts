<template>
  <div class="colorpickerContainer">
    <div class="colorBox" v-for="(color, index) in colors" :key="color">
      <input :checked="index == 0" type="radio" name="color" :id="color" :value="color" />
      <label :for="color" :style="{ backgroundColor: color }" @click="onClick(color)"></label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
  name: 'ColorPicker',
  data() {
    return {
      colors: [
        "#da324b",
        "#df7348",
        "#f2c167",
        "#b4d87b",
        "#5bbf8b",
        "#327155",
        "#235358",
        "#282947",
        "#112c75",
        "#191331",
        "#94355c",
        "#66135d",
      ],
    };
  },
  methods: {
    onClick(color: string): void {
      this.$emit("handleChange", color);
    },
  },
})
</script>

<style scoped>
label {
  cursor: pointer;
  border: solid 2px #2c3e50;
  border-radius: 0.5em;
  transition: border-color 0.1s;

  height: 22px;
  width: 0;
  margin-right: 0.5em;

  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 15px;
  padding-right: 15px;
}

label:hover {
  border: solid 2px #b8860b;
}

input:checked~label {
  border: solid 2px #b8860b;
}

.colorpickerContainer {
  display: flex;
  flex-wrap: wrap;

  position: absolute;
  left: 3%;
  top: 25%;
  width: 90px;
}

.colorBox {
  margin-bottom: 20px;
}

input {
  display: none;
  height: 0;
  width: 0;
}
</style>