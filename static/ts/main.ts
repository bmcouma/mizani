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

const year = document.querySelector<HTMLElement>("[data-current-year]");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const emailTargets = document.querySelectorAll<HTMLAnchorElement>("[data-contact-email]");
emailTargets.forEach((target) => {
  target.href = `mailto:${siteConfig.contactEmail}`;
  target.textContent = siteConfig.contactEmail;
});

const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
if (canonical) {
  canonical.href = siteConfig.websiteUrl;
}

const socialUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
if (socialUrl) socialUrl.content = siteConfig.websiteUrl;
const socialImage = new URL("static/img/og-image.png", siteConfig.websiteUrl).href;
document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.setAttribute("content", socialImage);
document.querySelector<HTMLMetaElement>('meta[name="twitter:image"]')?.setAttribute("content", socialImage);

document.querySelectorAll<HTMLAnchorElement>("[data-privacy-link]").forEach((link) => {
  link.href = siteConfig.privacyPolicyUrl;
});

document.querySelectorAll<HTMLAnchorElement>("[data-configured-website]").forEach((link) => {
  link.href = siteConfig.websiteUrl;
});
