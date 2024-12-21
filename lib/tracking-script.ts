export function generateTrackingScript(trackingId: string) {
  return `
(function() {
  const ENDPOINT = "${process.env.NEXT_PUBLIC_APP_URL}/api/track";
  const trackingId = "${trackingId}";

  function sendEvent(event, metadata = {}) {
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId, event, metadata })
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Track page views
  sendEvent('pageview', {
    path: window.location.pathname,
    referrer: document.referrer,
    title: document.title
  });

  // Track clicks
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (target && target instanceof HTMLElement) {
      sendEvent('click', {
        element: target.tagName,
        id: target.id,
        class: target.className,
        text: target.textContent?.trim()
      });
    }
  });

  // Expose global tracking function
  window.trackAnalytics = sendEvent;
})();
`;
}
