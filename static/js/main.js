import { init as initNavigation } from "./modules/nav.js";
import { init as initReveal } from "./modules/reveal.js";
import { init as initDemo } from "./modules/demo.js";
import { init as initWaitlist } from "./modules/waitlist.js";
import { siteConfig } from "./config.js";
document.documentElement.classList.add("js");
initNavigation();
initReveal();
initDemo();
initWaitlist();
const year = document.querySelector("[data-current-year]");
if (year) {
    year.textContent = String(new Date().getFullYear());
}
const emailTargets = document.querySelectorAll("[data-contact-email]");
emailTargets.forEach((target) => {
    target.href = `mailto:${siteConfig.contactEmail}`;
    target.textContent = siteConfig.contactEmail;
});
const canonical = document.querySelector('link[rel="canonical"]');
if (canonical) {
    canonical.href = siteConfig.websiteUrl;
}
const socialUrl = document.querySelector('meta[property="og:url"]');
if (socialUrl)
    socialUrl.content = siteConfig.websiteUrl;
const socialImage = new URL("static/img/og-image.png", siteConfig.websiteUrl).href;
document.querySelector('meta[property="og:image"]')?.setAttribute("content", socialImage);
document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", socialImage);
document.querySelectorAll("[data-privacy-link]").forEach((link) => {
    link.href = siteConfig.privacyPolicyUrl;
});
document.querySelectorAll("[data-configured-website]").forEach((link) => {
    link.href = siteConfig.websiteUrl;
});
//# sourceMappingURL=main.js.map