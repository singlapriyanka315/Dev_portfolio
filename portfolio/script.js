const skillTabs = document.querySelectorAll(".chip");
const panels = document.querySelectorAll(".tab-panel");
const filters = document.querySelectorAll(".filter");
const timelineCards = document.querySelectorAll(".experience-card");
const statValues = document.querySelectorAll(".metric-value");
const previewCards = document.querySelectorAll(".preview-card");

skillTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    skillTabs.forEach((item) => item.classList.toggle("active", item === tab));
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === target);
    });
  });
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const target = filter.dataset.filter;

    filters.forEach((item) => item.classList.toggle("active", item === filter));
    timelineCards.forEach((card) => {
      const show = target === "all" || card.dataset.category === target;
      card.classList.toggle("is-hidden", !show);
    });
  });
});

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1100;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * progress);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  },
  { threshold: 0.45 }
);

statValues.forEach((value) => statObserver.observe(value));

let previewIndex = 0;
setInterval(() => {
  previewCards[previewIndex].classList.remove("active");
  previewIndex = (previewIndex + 1) % previewCards.length;
  previewCards[previewIndex].classList.add("active");
}, 2200);
