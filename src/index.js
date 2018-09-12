import Vue from 'vue';
import App from './app.vue';

import style from './assets/styles/test.css';
import bg from './assets/images/bg.jpg';
import styl from './assets/styles/test-stylus.styl';

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
  render: (h) => h(App)
}).$mount(root)
