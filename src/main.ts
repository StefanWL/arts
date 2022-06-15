import { createApp, DirectiveBinding } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .directive('child', (el: Node, binding: DirectiveBinding): void => {
    el.appendChild(binding.value);
  })
  .use(router)
  .mount('#app');