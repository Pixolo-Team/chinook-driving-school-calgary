import { trackEvent } from "@/utils/analytics";

declare global {
  interface Window {
    __chinookAnalyticsInitialized?: boolean;
    __chinookLastTrackedPageView?: string;
  }
}

function getLinkType(destination: string): "internal" | "external" {
  if (!destination) {
    return "internal";
  }

  try {
    const resolvedUrl = new URL(destination, window.location.origin);
    return resolvedUrl.origin === window.location.origin ? "internal" : "external";
  } catch {
    return destination.startsWith("/") ? "internal" : "external";
  }
}

function isExternalHttpLink(destination: string): boolean {
  try {
    const resolvedUrl = new URL(destination, window.location.origin);
    return /^https?:$/.test(resolvedUrl.protocol) && resolvedUrl.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function resolveContactType(destination: string): "whatsapp" | "phone" | "email" | null {
  const normalizedDestination = destination.toLowerCase();

  if (
    normalizedDestination.startsWith("https://wa.me/") ||
    normalizedDestination.startsWith("http://wa.me/") ||
    normalizedDestination.includes("whatsapp")
  ) {
    return "whatsapp";
  }

  if (normalizedDestination.startsWith("tel:")) {
    return "phone";
  }

  if (normalizedDestination.startsWith("mailto:")) {
    return "email";
  }

  return null;
}

function trackPageView(): void {
  const pageIdentifier = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (window.__chinookLastTrackedPageView === pageIdentifier) {
    return;
  }

  window.__chinookLastTrackedPageView = pageIdentifier;

  trackEvent("page_view", {
    page_title: document.title,
  });
}

function handleDelegatedClick(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const interactiveElement = target.closest<HTMLElement>("a, button");

  if (!interactiveElement) {
    return;
  }

  const destination =
    interactiveElement.getAttribute("href") ??
    interactiveElement.dataset.destination ??
    interactiveElement.getAttribute("data-link-url") ??
    "";
  const linkType = getLinkType(destination);
  const contactType =
    (interactiveElement.dataset.contactType as "whatsapp" | "phone" | "email" | undefined) ??
    resolveContactType(destination);

  if (interactiveElement.dataset.ctaLabel) {
    trackEvent("cta_click", {
      cta_label: interactiveElement.dataset.ctaLabel,
      cta_location: interactiveElement.dataset.ctaLocation ?? "unknown",
      destination,
      link_type: linkType,
    });
  }

  if (interactiveElement.dataset.navLabel) {
    trackEvent("navigation_click", {
      nav_label: interactiveElement.dataset.navLabel,
      nav_area: interactiveElement.dataset.navArea ?? "unknown",
      destination,
    });
  }

  if (contactType) {
    // SECONDARY CONVERSION: track direct WhatsApp and phone intent.
    trackEvent("contact_click", {
      contact_type: contactType,
      location:
        interactiveElement.dataset.contactLocation ??
        interactiveElement.dataset.ctaLocation ??
        interactiveElement.dataset.linkArea ??
        "unknown",
      destination,
    });

    if (contactType === "whatsapp" || contactType === "phone") {
      // PRIMARY CONVERSION: direct outreach actions are treated as lead intent.
      trackEvent("generate_lead", {
        lead_type: contactType,
        form_name: "contact_link",
        method: "manual",
      });
    }
  }

  if (interactiveElement.dataset.reviewProvider) {
    trackEvent("review_click", {
      provider: interactiveElement.dataset.reviewProvider,
      location: interactiveElement.dataset.reviewLocation ?? "unknown",
    });
  }

  if (destination && isExternalHttpLink(destination) && !contactType) {
    trackEvent("external_link_click", {
      link_label:
        interactiveElement.dataset.linkLabel ??
        interactiveElement.dataset.ctaLabel ??
        interactiveElement.dataset.navLabel ??
        interactiveElement.getAttribute("aria-label") ??
        interactiveElement.textContent?.trim() ??
        "external_link",
      link_url: destination,
      link_area:
        interactiveElement.dataset.linkArea ??
        interactiveElement.dataset.ctaLocation ??
        interactiveElement.dataset.navArea ??
        "unknown",
    });
  }
}

export function initializeAnalytics(): void {
  if (typeof window === "undefined" || window.__chinookAnalyticsInitialized) {
    return;
  }

  window.__chinookAnalyticsInitialized = true;

  document.addEventListener("click", handleDelegatedClick);
  document.addEventListener("astro:page-load", trackPageView);

  trackPageView();
}
