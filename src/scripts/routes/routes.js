import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/auth/login/login-page";
import RegisterPage from "../pages/auth/register/register-page";
import TambahStoryPage from "../pages/home/tambah-story/tambah-story";
import SaveStoryPage from "../pages/save-story/save-story-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/tambah-story": new TambahStoryPage(),
  "/save-story": new SaveStoryPage(),
};

export default routes;

function handleSkipToContent(event) {
  event.preventDefault();

  const mainContent = document.querySelector(
    'main, [role="main"], #main-content'
  );

  if (mainContent) {
    mainContent.setAttribute("tabindex", "-1");

    mainContent.focus();
    setTimeout(() => {
      mainContent.removeAttribute("tabindex");
    }, 1000);
  } else {
    console.warn("Elemen main content tidak ditemukan");
  }
}

document
  .getElementById("skip-to-content")
  ?.addEventListener("click", handleSkipToContent);
