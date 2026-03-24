const AEC_MEASUREMENT_ID = "G-3CMKMB7J42";
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
window.gtag = window.gtag || gtag;
gtag("js", new Date());
gtag("config", AEC_MEASUREMENT_ID, { anonymize_ip: true, send_page_view: false });
function getDeviceCategory() {
  const w = window.innerWidth || document.documentElement.clientWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}
function trackEvent(name, params = {}) {
  gtag("event", name, Object.assign({
    device_category: getDeviceCategory(),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    page_path: location.pathname + location.hash,
    page_title: document.title
  }, params));
}
window.AECTracking = { trackEvent, getDeviceCategory };
document.addEventListener("click", (event) => {
  const element = event.target.closest("a[data-track], button[data-track], [data-track]");
  if (!element) return;
  const href = element.getAttribute("href") || "";
  const label = element.dataset.track || element.textContent.trim().slice(0, 80) || "interaction";
  const section = element.closest("section.view")?.id?.replace("view-", "") || "global";
  const kind = element.dataset.linkKind || (href.startsWith("#/") ? "internal" : href.startsWith("http") ? "outbound" : "other");
  trackEvent("aec_click", {
    event_category: section,
    event_label: label,
    link_kind: kind,
    destination: href || "none",
    product_name: element.dataset.product || "none",
    interaction_text: element.textContent.trim().slice(0, 100)
  });
});
let scrollMilestonesSent = new Set();
window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const total = Math.max(doc.scrollHeight - window.innerHeight, 1);
  const progress = Math.round((window.scrollY / total) * 100);
  [25, 50, 75, 90].forEach((milestone) => {
    if (progress >= milestone && !scrollMilestonesSent.has(milestone)) {
      scrollMilestonesSent.add(milestone);
      trackEvent("scroll_depth", { percent_scrolled: milestone });
    }
  });
}, { passive: true });
window.addEventListener("load", () => {
  trackEvent("device_profile", {
    os: navigator.platform || "unknown",
    language: navigator.language || "unknown",
    user_agent_family: navigator.userAgent.includes("Firefox") ? "Firefox" : navigator.userAgent.includes("Chrome") ? "Chrome" : navigator.userAgent.includes("Safari") ? "Safari" : "Other"
  });
});
