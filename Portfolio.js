const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const finePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;

if (!prefersReducedMotion) {
  const revealTargets = document.querySelectorAll(
    "#about .about-copy, #about .about-journey, #about .story-item, #skills .skills-header, #skills .skill-card, #projects .projects-header, #projects .project-card, #animations .animation-lab__header, #animations .animation-card, #contact .contact-heading, #contact .contact-info, #contact .contact-form-card",
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealTargets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      target.style.transitionDelay = `${(index % 4) * 90}ms`;
      revealObserver.observe(target);
    });

    document.documentElement.classList.add("js-reveal-enabled");
  }
}

if (finePointer && !prefersReducedMotion) {
  const cursor = document.createElement("div");
  cursor.className = "cursor-effect";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML =
    '<span class="cursor-effect__ring"></span><span class="cursor-effect__dot"></span>';
  document.body.append(cursor);
  document.documentElement.classList.add("custom-cursor-enabled");

  let pointerX = 0;
  let pointerY = 0;

  const positionCursor = (x, y) => {
    const horizontalLimit = Math.max(
      16,
      document.documentElement.clientWidth - 16,
    );
    const verticalLimit = Math.max(16, window.innerHeight - 16);
    pointerX = Math.min(Math.max(x, 16), horizontalLimit);
    pointerY = Math.min(Math.max(y, 16), verticalLimit);
    cursor.style.setProperty("--cursor-x", `${pointerX}px`);
    cursor.style.setProperty("--cursor-y", `${pointerY}px`);
  };

  document.addEventListener("pointermove", (event) => {
    positionCursor(event.clientX, event.clientY);
    cursor.classList.add("is-visible");
  });

  document.addEventListener("pointerover", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button")) {
      cursor.classList.add("is-hovering");
    }
  });

  document.addEventListener("pointerout", (event) => {
    const previousTarget =
      event.target instanceof Element
        ? event.target.closest("a, button")
        : null;
    const nextTarget =
      event.relatedTarget instanceof Element
        ? event.relatedTarget.closest("a, button")
        : null;

    if (previousTarget && previousTarget !== nextTarget) {
      cursor.classList.remove("is-hovering");
    }
  });

  document.addEventListener("pointerleave", () => {
    cursor.classList.remove("is-visible");
  });

  window.addEventListener("resize", () => {
    positionCursor(pointerX, pointerY);
  });

  const hero = document.querySelector(".hero-section");
  const portrait = document.querySelector(".hero-portrait");

  if (hero instanceof HTMLElement && portrait instanceof HTMLElement) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      hero.style.setProperty("--hero-pointer-x", `${x * 100}%`);
      hero.style.setProperty("--hero-pointer-y", `${y * 100}%`);
      portrait.style.setProperty("--hero-tilt-x", `${(0.5 - y) * 3}deg`);
      portrait.style.setProperty("--hero-tilt-y", `${(x - 0.5) * 4}deg`);
    });

    hero.addEventListener("pointerleave", () => {
      hero.style.removeProperty("--hero-pointer-x");
      hero.style.removeProperty("--hero-pointer-y");
      portrait.style.removeProperty("--hero-tilt-x");
      portrait.style.removeProperty("--hero-tilt-y");
    });
  }
}

const navigation = document.querySelector(".portfolio-navigation");
const navigationLinks = document.querySelectorAll(
  ".portfolio-nav-link, .portfolio-nav-cta",
);

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (
      navigation instanceof HTMLElement &&
      navigation.classList.contains("show") &&
      window.bootstrap?.Collapse
    ) {
      window.bootstrap.Collapse.getOrCreateInstance(navigation).hide();
    }
  });
});

if ("IntersectionObserver" in window) {
  const observedSections = document.querySelectorAll(
    "#about, #skills, #projects, #animations, #contact",
  );
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navigationLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

document.querySelectorAll("[data-replay]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".animation-card");
    if (!(card instanceof HTMLElement)) {
      return;
    }

    const samples = card.querySelectorAll(
      ".sample-fade, .sample-pulse, .sample-orbit",
    );
    samples.forEach((sample) => {
      if (sample instanceof HTMLElement) {
        sample.style.animation = "none";
        void sample.offsetWidth;
        sample.style.removeProperty("animation");
      }
    });
  });
});
