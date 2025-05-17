// CSS imports
import "../styles/styles.css";

// Components
import App from "./pages/app";
import { registerServiceWorker } from "./utils/index";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();
  await registerServiceWorker();

  window.addEventListener("hashchange", async () => {
    if (!document.startViewTransition) {
      await app.renderPage();
      return;
    }

    document.startViewTransition(async () => {
      await app.renderPage();
    });
  });
});
