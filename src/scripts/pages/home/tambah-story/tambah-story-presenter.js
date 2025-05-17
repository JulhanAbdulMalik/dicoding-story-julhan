import { addStory } from "../../../data/api";

export default class TambahStoryPresenter {
  constructor(view) {
    this.view = view;
    this.stream = null;
    this.photoBlob = null;
  }

  setCameraStream(stream) {
    this.stream = stream;
  }

  hasCameraStream() {
    return !!this.stream;
  }

  setPhotoBlob(blob) {
    this.photoBlob = blob;
  }

  async handleFormSubmit({ description, latitude, longitude }) {
    if (!this.photoBlob) {
      this.view.updateMessage("Foto belum diambil.");
      return;
    }

    const storyData = {
      description,
      photo: this.photoBlob,
      lat: latitude,
      lon: longitude,
    };

    try {
      const result = await addStory(storyData);

      if (!result.error) {
        this.view.updateMessage("Story berhasil ditambahkan!");
        this.stopCamera();
        this.view.navigateTo("#/");
      } else {
        this.view.updateMessage(result.message || "Gagal menambahkan story");
      }
    } catch (error) {
      this.view.updateMessage("Terjadi kesalahan saat mengirim story.");
      this.view.logError?.(error);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}
