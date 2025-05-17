import RegisterPresenter from "./register-presenter";

export default class RegisterPage {
  async render() {
    return `
      <section id="main-content" class="container" role="main">
        <form id="registerForm" aria-label="Formulir Registrasi">
          <h1>Register</h1>
          <div class="form-group">
            <label for="name">Nama</label>
            <input id="name" name="name" type="text" required />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
          
          <button type="submit" id="registerButton">Daftar</button>
        </form>
        
        <p id="registerMessage" role="status" aria-live="polite"></p>
      </section>
    `;
  }

  async afterRender() {
    const formElement = document.querySelector("#registerForm");
    const messageElement = document.querySelector("#registerMessage");

    const view = {
      getFormValues: () => {
        return {
          name: formElement.querySelector("#name").value.trim(),
          email: formElement.querySelector("#email").value.trim(),
          password: formElement.querySelector("#password").value.trim(),
        };
      },
      showMessage: (message, type = "info") => {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
      },
      navigateTo: (hash) => {
        window.location.hash = hash;
      },
      bindFormSubmit: (handler) => {
        formElement.addEventListener("submit", (event) => {
          event.preventDefault();
          handler();
        });
      },
    };

    const presenter = new RegisterPresenter(view);
    presenter.init();
  }
}
