export function generateTrackingScript(trackingId: string) {
  return `
(function() {
  const ENDPOINT = "${process.env.NEXT_PUBLIC_APP_URL}/api/track";
  const trackingId = "${trackingId}";

  function sendEvent(event, metadata = {}) {
    // Add visitor ID if not present
    if (!localStorage.getItem('visitorId')) {
      localStorage.setItem('visitorId', Math.random().toString(36).substring(2));
    }

    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId,
          event,
          metadata,
          visitorId: localStorage.getItem('visitorId'),
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenSize: \`\${window.screen.width}x\${window.screen.height}\`,
          timestamp: new Date().toISOString()
        })
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

  // Track clicks with improved targeting
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (target && target instanceof HTMLElement) {
      const interactionData = {
        element: target.tagName.toLowerCase(),
        id: target.id,
        className: target.className,
        text: target.textContent?.trim(),
        href: target instanceof HTMLAnchorElement ? target.href : null,
        path: e.composedPath().map(el =>
          el instanceof HTMLElement ? \`\${el.tagName.toLowerCase()}\${el.id ? '#'+el.id : ''}\` : ''
        ).filter(Boolean).join(' > ')
      };
      sendEvent('click', interactionData);
    }
  });

  // Track form submissions
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form instanceof HTMLFormElement) {
      const formData = {
        formId: form.id,
        formName: form.name,
        formAction: form.action,
        formFields: Array.from(form.elements).map(el => {
          if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
            return {
              type: el.type,
              name: el.name,
              id: el.id
            };
          }
          return null;
        }).filter(Boolean)
      };
      sendEvent('form_submit', formData);
    }
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', function() {
    sendEvent('visibility_change', {
      state: document.visibilityState
    });
  });

  // Expose global tracking function for custom events
  window.trackAnalytics = function(eventName, metadata = {}) {
    if (typeof eventName !== 'string') {
      console.error('Event name must be a string');
      return;
    }
    sendEvent('custom:' + eventName, metadata);
  };
})();
`;
}
