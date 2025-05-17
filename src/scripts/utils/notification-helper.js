import {
  subscribeNotification,
  unsubscribeNotification,
  VAPID_PUBLIC_KEY,
} from "../data/api";

export async function subscribePushNotification() {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    alert("Izin notifikasi tidak diberikan.");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    alert("Sudah berlangganan notifikasi.");
    return;
  }

  const newSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  await subscribeNotification({
    endpoint: newSubscription.endpoint,
    keys: newSubscription.toJSON().keys,
  });

  alert("Berhasil berlangganan notifikasi");
}

export async function unsubscribePushNotification() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    alert("Anda belum berlangganan notifikasi");
    return;
  }

  await unsubscribeNotification({ endpoint: subscription.endpoint });
  await subscription.unsubscribe();

  alert("Berhasil berhenti berlangganan notifikasi");
}

// Konversi base64 public key ke Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
