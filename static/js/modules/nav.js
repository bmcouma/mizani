export function init() {
    const nav = document.querySelector("#site-nav");
    const collapse = document.querySelector("#primary-navigation");
    const toggle = document.querySelector(".navbar-toggler");
    const links = Array.from(document.querySelectorAll("#primary-navigation a[href^='#']"));
    if (!nav || !collapse || !toggle)
        return;
    const collapseMenu = () => {
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
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && collapse.classList.contains("show")) {
            collapseMenu();
            toggle.focus();
        }
    });
    const sections = links
        .map((link) => document.querySelector(link.hash))
        .filter((section) => section !== null);
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible)
                return;
            links.forEach((link) => {
                const active = link.hash === `#${visible.target.id}`;
                if (active)
                    link.setAttribute("aria-current", "location");
                else
                    link.removeAttribute("aria-current");
            });
        }, { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.25, 0.5] });
        sections.forEach((section) => observer.observe(section));
    }
    const updateNav = () => {
        nav.classList.toggle("nav-scrolled", window.scrollY > 24);
    };
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
}
//# sourceMappingURL=nav.js.map