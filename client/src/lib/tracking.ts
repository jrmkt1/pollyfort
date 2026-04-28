// Analytics and tracking utilities
export function initializeTracking() {
  // Google Analytics tracking initialization would go here
  // For now, we'll implement basic tracking functionality
  
  if (typeof window !== 'undefined') {
    // Track page views
    trackPageView(window.location.pathname);
    
    // Set up automatic page view tracking for SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      trackPageView(window.location.pathname);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      trackPageView(window.location.pathname);
    };
    
    // Track popstate events (back/forward navigation)
    window.addEventListener('popstate', () => {
      trackPageView(window.location.pathname);
    });
  }
}

export function trackPageView(path: string) {
  // Basic page view tracking
  if (typeof window !== 'undefined') {
    console.log(`Page view: ${path}`);
    
    // Google Analytics 4 tracking would be implemented here
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_path: path,
    // });
  }
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    console.log(`Event: ${eventName}`, parameters);
    
    // Google Analytics 4 event tracking would be implemented here
    // gtag('event', eventName, parameters);
  }
}

export function trackQuotationRequest(productIds: number[], customerInfo: any) {
  trackEvent('quotation_request', {
    product_count: productIds.length,
    product_ids: productIds,
    customer_type: customerInfo.companyName ? 'business' : 'individual'
  });
}

export function trackProductView(productId: number, productName: string) {
  trackEvent('product_view', {
    product_id: productId,
    product_name: productName
  });
}

export function trackSearch(query: string, resultsCount: number) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount
  });
}