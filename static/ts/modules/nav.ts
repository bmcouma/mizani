interface BootstrapCollapse {
  hide(): void;
  show(): void;
}

interface BootstrapNamespace {
  Collapse: {
    getOrCreateInstance(element: Element): BootstrapCollapse;
  };
}

declare global {
  interface Window {
    bootstrap?: BootstrapNamespace;
  }
}

export function init(): void {
  const nav = document.querySelector<HTMLElement>("#site-nav");
  const collapse = document.querySelector<HTMLElement>("#primary-navigation");
  const toggle = document.querySelector<HTMLButtonElement>(".navbar-toggler");
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("#primary-navigation a[href^='#']"));
  if (!nav || !collapse || !toggle) return;

  const collapseMenu = (): void => {
    window.bootstrap?.Collapse.getOrCreateInstance(collapse).hide();
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 991.98px)").matches) {
        collapseMenu();
        toggle.focus();
      }
    });
  });

  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape" && collapse.classList.contains("show")) {
      collapseMenu();
      toggle.focus();
    }
  });

  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.hash))
    .filter((section): section is HTMLElement => section !== null);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        links.forEach((link) => {
          const active = link.hash === `#${visible.target.id}`;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  const updateNav = (): void => {
    nav.classList.toggle("nav-scrolled", window.scrollY > 24);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
}
