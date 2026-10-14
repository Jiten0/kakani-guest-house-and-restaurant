const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeColor = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem("kakani-theme");
const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  if (themeLabel) themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  if (themeColor) themeColor.content = isDark ? "#111923" : "#f5f7fa";
}

setTheme(initialTheme);
themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("kakani-theme", nextTheme);
  setTheme(nextTheme);
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  mainNav?.classList.toggle("is-open", !isExpanded);
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

const visitContent = {
  stay: {
    tab: "#stay-tab",
    index: "A PLACE TO UNWIND",
    title: "Let the day<br>take its time.",
    description: "Make Kakani your base for a slower kind of getaway. Call us directly to ask about availability and plan your stay.",
    link: "Call about a stay ",
    hint: "Showing guesthouse stays"
  },
  dine: {
    tab: "#dine-tab",
    index: "GATHER AROUND THE TABLE",
    title: "Good food.<br>Good company.",
    description: "Drop by for a meal in Kakani. Call us to ask about the restaurant, dishes, and when you'd like to visit.",
    link: "Call about dining ",
    hint: "Showing restaurant dining"
  }
};

const visitTabs = document.querySelectorAll(".tab");
const visitPanel = document.querySelector("#visit-panel");

function showVisit(type, moveFocus = false) {
  const content = visitContent[type];
  if (!content || !visitPanel) return;

  visitTabs.forEach((tab) => {
    const isSelected = tab.dataset.visit === type;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    if (isSelected && moveFocus) tab.focus();
  });

  visitPanel.setAttribute("aria-labelledby", content.tab.slice(1));
  document.querySelector("#visit-index").textContent = content.index;
  document.querySelector("#visit-title").innerHTML = content.title;
  document.querySelector("#visit-description").textContent = content.description;
  const visitLink = document.querySelector("#visit-link");
  document.querySelector("#visit-link-label").textContent = content.link.trim();
  visitLink.href = "tel:+9779851068240";
  document.querySelector("#visit-hint").textContent = content.hint;
  visitPanel.animate(
    [{ opacity: 0.55, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 280, easing: "ease-out" }
  );
}

visitTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showVisit(tab.dataset.visit));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextIndex = (index + (event.key === "ArrowRight" ? 1 : -1) + visitTabs.length) % visitTabs.length;
    showVisit(visitTabs[nextIndex].dataset.visit, true);
  });
});

const gallerySlides = [
  {
    src: "images/kakani-listing-cover.jpg",
    alt: "Garden and grounds at Kakani Guest House",
    caption: "The garden at Kakani"
  },
  {
    src: "images/kakani-business-sign.jpg",
    alt: "Illuminated Kakani Guest House and Restaurant sign",
    caption: "A warm welcome, day or night"
  },
  {
    src: "images/kakani-firepit-visit.jpg",
    alt: "Guests gathered by the outdoor fire pit",
    caption: "An evening around the fire"
  }
];

const gallery = document.querySelector("#visit-slideshow");
const galleryImage = document.querySelector("#slide-image");
const galleryCaption = document.querySelector("#slide-caption");
const galleryCount = document.querySelector("#slide-count");
const galleryDots = document.querySelectorAll(".slide-dot");
let activeSlide = 0;

function showSlide(index) {
  if (!gallery || !galleryImage || !galleryCaption || !galleryCount) return;
  activeSlide = (index + gallerySlides.length) % gallerySlides.length;
  const slide = gallerySlides[activeSlide];
  galleryImage.src = slide.src;
  galleryImage.alt = slide.alt;
  galleryCaption.textContent = slide.caption;
  galleryCount.textContent = `${activeSlide + 1} / ${gallerySlides.length}`;
  galleryDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });
}

document.querySelector("#slide-previous")?.addEventListener("click", () => showSlide(activeSlide - 1));
document.querySelector("#slide-next")?.addEventListener("click", () => showSlide(activeSlide + 1));
galleryDots.forEach((dot) => {
  dot.addEventListener("click", () => showSlide(Number(dot.dataset.slide)));
});
gallery?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  showSlide(activeSlide + (event.key === "ArrowRight" ? 1 : -1));
});

gallerySlides.slice(1).forEach((slide) => {
  const image = new Image();
  image.src = slide.src;
});
