import { registerUser } from "../../../data/api";

export default class RegisterPresenter {
  constructor(view) {
    this._view = view;
  }

  init() {
    this._view.bindFormSubmit(this._onFormSubmit.bind(this));
  }

  async _onFormSubmit() {
    const { name, email, password } = this._view.getFormValues();

    this._view.showMessage("Mendaftarkan akun...", "info");

    try {
      const result = await registerUser({ name, email, password });

      if (result.error) {
        this._view.showMessage(`Gagal: ${result.message}`, "error");
      } else {
        this._view.showMessage(
          "Registrasi berhasil! Silakan login.",
          "success"
        );
        this._view.navigateTo("/login");
      }
    } catch (err) {
      this._view.showMessage(`Terjadi kesalahan: ${err.message}`, "error");
    }
  }
}
