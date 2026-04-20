type AnalyticsParams = Record<string, unknown>;

declare global {
  interface Window {
    ANALYTICS_DEBUG?: boolean;
    dataLayer?: unknown[];
    gtag?: (command: "config" | "event" | "js", target: string | Date, params?: AnalyticsParams) => void;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function sanitizeParams(params: AnalyticsParams): AnalyticsParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  );
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}): void {
  if (!isBrowser()) {
    return;
  }

  const eventPayload = sanitizeParams({
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    page_location: window.location.href,
    ...params,
  });
  const shouldDebug = import.meta.env.DEV || window.ANALYTICS_DEBUG === true;

  if (shouldDebug) {
    console.info("[analytics]", eventName, eventPayload);
  }

  window.gtag?.("event", eventName, eventPayload);
}
