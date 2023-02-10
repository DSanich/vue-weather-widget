
import '../style.css';
import { defineCustomElement, createApp } from 'vue';
import App from './App.vue';

const vueElement = defineCustomElement(App);

customElements.define('weather-widget', vueElement);

createApp(App).mount('#app');