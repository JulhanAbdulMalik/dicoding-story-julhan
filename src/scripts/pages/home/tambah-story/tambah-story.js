import TambahStoryPresenter from "./tambah-story-presenter";

export default class TambahStory {
  constructor() {
    this.presenter = new TambahStoryPresenter(this);
  }

  async render() {
    return `
      <section id="main-content" class="container" role="main">
        <form id="storyForm" aria-label="Formulir Tambah Story">
          <h1>Tambah Story</h1>

          <div class="form-group">
            <label for="cameraInput">Ambil Gambar</label>
            <video id="cameraPreview" autoplay playsinline></video>
            <button type="button" id="takePhoto">Ambil Foto</button>
            <div id="cameraError" style="color:red; margin:10px 0;"></div>
            <canvas id="photoCanvas" style="display:none;"></canvas>
            <img id="photoPreview" alt="Foto yang diambil" class="photo-preview" style="max-width: 100%; margin-top: 1rem;" />
          </div>

          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div class="form-group">
            <label for="map">Pilih Lokasi</label>
            <div id="map" style="height: 300px;"></div>
            <input type="hidden" id="latitude" name="latitude">
            <input type="hidden" id="longitude" name="longitude">
          </div>

          <button type="submit">Kirim Story</button>
        </form>

        <p id="formMessage" role="status" aria-live="polite"></p>
      </section>
    `;
  }

  async afterRender() {
    const elements = this.getElements();
    this._initCamera(elements);
    this._initMap(elements);
    this._initForm(elements);
    window.addEventListener("hashchange", () => {
      this.presenter.stopCamera();
    });
  }

  getElements() {
    return {
      form: document.getElementById("storyForm"),
      video: document.getElementById("cameraPreview"),
      canvas: document.getElementById("photoCanvas"),
      takePhotoButton: document.getElementById("takePhoto"),
      photoPreview: document.getElementById("photoPreview"),
      latitude: document.getElementById("latitude"),
      longitude: document.getElementById("longitude"),
      description: document.getElementById("description"),
      formMessage: document.getElementById("formMessage"),
      cameraError: document.getElementById("cameraError"),
    };
  }

  _initCamera({ video, canvas, takePhotoButton }) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.presenter.setCameraStream(stream);
        video.srcObject = stream;
        this.updateCameraError("");
      })
      .catch((error) => {
        this.logError(error);
        this.updateCameraError(
          "Akses kamera ditolak. Silakan izinkan akses kamera melalui pengaturan browser."
        );
        takePhotoButton.disabled = true;
      });

    takePhotoButton.addEventListener("click", () => {
      if (!this.presenter.hasCameraStream()) {
        alert(
          "Tidak dapat mengakses kamera. Silakan izinkan akses kamera terlebih dahulu."
        );
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        this.presenter.setPhotoBlob(blob);
        this.updatePhotoPreview(blob);
      }, "image/jpeg");
    });
  }

  _initMap({ latitude, longitude }) {
    const map = L.map("map").setView([-6.2, 106.8], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("Lokasi Anda")
        .openPopup();
      latitude.value = lat;
      longitude.value = lng;
    });
  }

  _initForm({ form, description, latitude, longitude }) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = {
        description: description.value,
        latitude: latitude.value,
        longitude: longitude.value,
      };
      this.presenter.handleFormSubmit(data);
    });
  }

  updatePhotoPreview(blob) {
    const { photoPreview } = this.getElements();
    photoPreview.src = URL.createObjectURL(blob);
  }

  updateMessage(message) {
    const { formMessage } = this.getElements();
    formMessage.textContent = message;
  }

  updateCameraError(message) {
    const { cameraError } = this.getElements();
    cameraError.textContent = message;
  }

  navigateTo(hash) {
    window.location.hash = hash;
  }

  logError(error) {
    console.error("View Error:", error);
  }
}
