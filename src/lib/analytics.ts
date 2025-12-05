// GoatCounter analytics helper

declare global {
  interface Window {
    goatcounter?: {
      count: (vars: { path: string; title?: string; event?: boolean }) => void;
    };
  }
}

export function trackEvent(eventName: string, title?: string) {
  if (typeof window !== "undefined" && window.goatcounter) {
    window.goatcounter.count({
      path: eventName,
      title: title || eventName,
      event: true,
    });
  }
}

// Predefined events for consistency
export const EVENTS = {
  TEMPLATE_CLICK: (templateId: string) => `click/template/${templateId}`,
  DOWNLOAD_PDF: "click/download-pdf",
  RESUME_OPEN: (docId: string) => `click/resume/${docId}`,
} as const;

