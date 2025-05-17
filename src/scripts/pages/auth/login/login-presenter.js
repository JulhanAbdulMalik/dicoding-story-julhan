import { loginUser, TOKEN_KEY } from "../../../data/api";

export default class LoginPresenter {
  constructor({ view }) {
    this._view = view;
  }

  init() {
    this._view.onSubmit(this._handleLogin.bind(this));
  }

  async _handleLogin({ email, password }) {
    this._view.showMessage("Sedang memproses...", "info");

    try {
      const result = await loginUser({ email, password });

      if (result.error) {
        this._view.showMessage(`Gagal: ${result.message}`, "error");
        return;
      }

      // Simpan token
      localStorage.setItem(TOKEN_KEY, result.loginResult.token);
      this._view.showMessage("Login berhasil! Mengarahkan...", "success");

      setTimeout(() => {
        this._view.redirectToHome();
      }, 1000);
    } catch (error) {
      this._view.showMessage(`Terjadi kesalahan: ${error.message}`, "error");
    }
  }
}
