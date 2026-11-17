const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Nav: background on scroll, mobile menu, active section */
const gnav = document.getElementById("gnav");
const toggle = document.getElementById("gnav-toggle");
const navLinks = document.querySelectorAll(".gnav-links a");

toggle.addEventListener("click", () => {
  const open = gnav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    gnav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) =>
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute("href"));
  if (section) sectionObserver.observe(section);
});

/* Reveal on scroll */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* Statement: split into words that light up with scroll */
const statement = document.querySelector("[data-words]");
const words = [];

if (statement) {
  // Split every text node into word spans, keeping highlight <mark>s intact
  const splitInto = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        splitInto(child);
        return;
      }
      const parts = child.textContent.replace(/\s+/g, " ").split(/( )/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (part === "" ) return;
        if (part === " ") {
          frag.appendChild(document.createTextNode(" "));
          return;
        }
        const span = document.createElement("span");
        span.className = "w";
        span.textContent = part;
        frag.appendChild(span);
        words.push(span);
      });
      child.replaceWith(frag);
    });
  };
  splitInto(statement);
}

/* Hero phone + statement driven by scroll */
const hero = document.getElementById("hero");
const heroPhone = document.querySelector(".hero-phone");
let ticking = false;

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const onScroll = () => {
  const y = window.scrollY;
  gnav.classList.toggle("scrolled", y > 10);

  if (!reduceMotion) {
    const p = clamp(y / (hero.offsetHeight * 0.6), 0, 1);
    hero.style.setProperty("--p", p.toFixed(3));
  }

  if (words.length) {
    const rect = statement.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = reduceMotion ? 1 : clamp((vh * 0.9 - rect.top) / (rect.height + vh * 0.15), 0, 1);
    const lit = Math.round(progress * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < lit));
  }

  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  },
  { passive: true }
);
window.addEventListener("resize", onScroll);
if (!reduceMotion) heroPhone.classList.add("intro");
onScroll();

/* Count-up numbers */
const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      observer.unobserve(el);

      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }

      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));


/* Email: open Gmail compose on desktop, the device mail app on phones */
const gmailCompose =
  "https://mail.google.com/mail/?view=cm&fs=1&to=singlapriyanka744@gmail.com&su=" +
  encodeURIComponent("Hello Priyanka");

document.querySelectorAll("[data-gmail]").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    e.preventDefault();
    window.open(gmailCompose, "_blank", "noopener");
  });
});

/* ---------- Motion polish ---------- */

/* Scroll progress bar */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
progressBar.setAttribute("aria-hidden", "true");
document.body.prepend(progressBar);

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.setProperty("--sp", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
};
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

/* Auto-stagger reveal delays inside grids */
document
  .querySelectorAll(".bento, .skill-grid, .numbers-grid, .timeline, .writing")
  .forEach((group) => {
    [...group.querySelectorAll(":scope > .reveal")].forEach((el, i) => {
      el.style.setProperty("--d", `${(i % 6) * 70}ms`);
    });
  });

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (finePointer && !reduceMotion) {
  /* Soft glow that follows the cursor */
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.prepend(glow);

  let gx = -999, gy = -999, tx = -999, ty = -999;
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  const followGlow = () => {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.setProperty("--cx", `${gx}px`);
    glow.style.setProperty("--cy", `${gy}px`);
    requestAnimationFrame(followGlow);
  };
  requestAnimationFrame(followGlow);

  /* Card spotlight + gentle 3D tilt */
  document.querySelectorAll(".tile, .skill-card, .article").forEach((card) => {
    const tilt = card.classList.contains("tile");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      if (tilt) {
        card.style.setProperty("--ry", `${(x - 0.5) * 4}deg`);
        card.style.setProperty("--rx", `${(0.5 - y) * 4}deg`);
      }
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });

  /* Magnetic primary buttons */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.15;
      const dy = (e.clientY - r.top - r.height / 2) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy - 2}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}
