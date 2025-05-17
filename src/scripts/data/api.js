import CONFIG from "../config";

const BASE_URL = CONFIG.BASE_URL;
export const TOKEN_KEY = CONFIG.ACCESS_TOKEN_KEY;
export const VAPID_PUBLIC_KEY = CONFIG.VAPID_PUBLIC_KEY;

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Header untuk authenticated request
function getAuthHeaders(isJson = true) {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
}

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  STORIES: `${BASE_URL}/stories`,
  STORIES_GUEST: `${BASE_URL}/stories/guest`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  NOTIFICATION_SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};

// REGISTER
export async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, email, password }),
  });

  return await response.json();
}

// LOGIN
export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  if (!result.error) {
    localStorage.setItem(TOKEN_KEY, result.loginResult.token);
  }

  return result;
}

// ADD STORY (AUTH)
export async function addStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (lat) formData.append("lat", lat);
  if (lon) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.STORIES, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  return await response.json();
}

// ADD STORY (GUEST)
export async function addGuestStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (lat) formData.append("lat", lat);
  if (lon) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.STORIES_GUEST, {
    method: "POST",
    body: formData,
  });

  return await response.json();
}

// GET ALL STORIES
export async function getAllStories({ page = 1, size = 5, location = 0 } = {}) {
  const url = new URL(ENDPOINTS.STORIES);
  url.searchParams.append("page", page);
  url.searchParams.append("size", size);
  url.searchParams.append("location", location);

  const response = await fetch(url, {
    headers: getAuthHeaders(false),
  });

  return await response.json();
}

// GET STORY DETAIL
export async function getStoryDetail(id) {
  const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: getAuthHeaders(false),
  });

  return await response.json();
}

// SUBSCRIBE PUSH NOTIFICATION
export async function subscribeNotification({ endpoint, keys }) {
  const response = await fetch(ENDPOINTS.NOTIFICATION_SUBSCRIBE, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    }),
  });

  return await response.json();
}

// UNSUBSCRIBE PUSH NOTIFICATION
export async function unsubscribeNotification({ endpoint }) {
  const response = await fetch(ENDPOINTS.NOTIFICATION_SUBSCRIBE, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ endpoint }),
  });

  return await response.json();
}
