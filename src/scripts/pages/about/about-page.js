export default class AboutPage {
  async render() {
    return `
      <section class="container" id="main-content" role="main">
        <h1 id="main-content">Tentang Aplikasi</h1>
        <br>
        <p>
          Aplikasi Dicoding Story adalah platform sederhana berbasis Single Page Application (SPA).
          Aplikasi ini dibangun dengan menerapkan arsitektur MVP, penggunaan routing hash (#), 
          dan memperhatikan prinsip aksesibilitas.
        </p>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
