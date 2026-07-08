import { createApp } from "vue";
import "./assets/styles/index.scss";
import App from "./App.vue";
import router from "./router";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const app = createApp(App);

// Remove preloader immediately for admin routes
if (window.location.pathname.startsWith('/admin')) {
  document.body.classList.remove('is-loading');
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.remove();
  }
}

app.use(router).mount("#app");
