import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { TOKEN_KEY } from "../data/api";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });

    // event untuk logout
    document.getElementById("logout-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      this._logout();
    });
  }

  async _logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._updateAuthUI();
    window.location.hash = "#/login";
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    await this._cleanupBeforeNavigation();
    this._updateAuthUI();

    this.#content.style.viewTransitionName = "main-content";

    if (!document.startViewTransition) {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      return;
    }

    const transition = document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      this.#content.style.viewTransitionName = "";
    });

    transition.finished.finally(() => {
      this.#content.style.viewTransitionName = "";
    });
  }

  _updateAuthUI() {
    const token = localStorage.getItem(TOKEN_KEY);
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const authItems = document.querySelectorAll(".auth-item");

    if (token) {
      // User sudah login
      loginLink?.parentElement?.setAttribute("hidden", "");
      logoutLink?.parentElement?.removeAttribute("hidden");
    } else {
      // User belum login
      loginLink?.parentElement?.removeAttribute("hidden");
      logoutLink?.parentElement?.setAttribute("hidden", "");
    }

    authItems.forEach((item) => item.clientHeight);
  }

  async _cleanupBeforeNavigation() {
    const activePresenter = this.#content._presenter;
    if (activePresenter && activePresenter._stopCamera) {
      activePresenter._stopCamera();
    }
  }
}

export default App;
