import LoginPresenter from "./login-presenter";

export default class LoginPage {
  async render() {
    return `
      <section id="main-content" class="container" role="main">
        <form id="loginForm" aria-label="Formulir Login">
          <h1>Login</h1>  
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>

          <button type="submit" id="loginButton">Masuk</button>

          <p>Belum punya akun? silahkan <a href="#/register">Daftar</a></p>
        </form>

        <p id="loginMessage" role="status" aria-live="polite"></p>
      </section>
    `;
  }

  async afterRender() {
    const formElement = document.querySelector("#loginForm");
    const messageElement = document.querySelector("#loginMessage");

    const view = {
      onSubmit: (callback) => {
        formElement.addEventListener("submit", (event) => {
          event.preventDefault();
          const email = formElement.querySelector("#email").value.trim();
          const password = formElement.querySelector("#password").value.trim();
          callback({ email, password });
        });
      },
      showMessage: (message, type = "info") => {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
      },
      redirectToHome: () => {
        window.location.hash = "/";
      },
    };

    const presenter = new LoginPresenter({ view });
    presenter.init();
  }
}
