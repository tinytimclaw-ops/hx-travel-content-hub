// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeDates();
  initializeProductTabs();
  initializeSearchForm();
  initializeSmoothScroll();
});

// Date helper
function datePlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Initialize dates with defaults
function initializeDates() {
  const outDateInput = document.getElementById('outDate');
  const inDateInput = document.getElementById('inDate');

  // Set drop-off to tomorrow
  outDateInput.value = datePlus(1);

  // Set return to drop-off + 8 days
  inDateInput.value = datePlus(1 + 8);

  // Auto-recalculate return date when drop-off changes
  let manuallyChanged = false;

  inDateInput.addEventListener('change', () => {
    manuallyChanged = true;
  });

  outDateInput.addEventListener('change', () => {
    if (!manuallyChanged) {
      const out = new Date(outDateInput.value);
      out.setDate(out.getDate() + 8);
      inDateInput.value = out.toISOString().split('T')[0];
    }
  });
}

// Product tab switching
function initializeProductTabs() {
  const tabs = document.querySelectorAll('.product-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));

      // Add active to clicked tab
      tab.classList.add('active');
    });
  });
}

// Search form submission
function initializeSearchForm() {
  const form = document.getElementById('searchForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const airport = document.getElementById('airport').value;
    const outDate = document.getElementById('outDate').value;
    const outTime = document.getElementById('outTime').value;
    const inDate = document.getElementById('inDate').value;
    const inTime = document.getElementById('inTime').value;

    if (!airport || !outDate || !inDate) {
      alert('Please complete all fields');
      return;
    }

    // Determine product based on active tab
    const activeTab = document.querySelector('.product-tab.active');
    const product = activeTab.dataset.product;

    // Build search URL
    const searchUrl = buildSearchUrl(product, airport, outDate, outTime, inDate, inTime);

    // Redirect to search
    window.location.href = searchUrl;
  });
}

// Build search URL based on product
function buildSearchUrl(product, airport, outDate, outTime, inDate, inTime) {
  // Format times for URL
  const outTimeEncoded = outTime.replace(':', '%3A');
  const inTimeEncoded = inTime.replace(':', '%3A');

  // Get URL params
  const urlParams = new URLSearchParams(window.location.search);
  const agent = urlParams.get('agent') || 'WY992';
  const adcode = urlParams.get('adcode') || '';
  const promotionCode = urlParams.get('promotionCode') || '';

  // HX domain resolution
  const host = window.location.host;
  const isLocal = host.startsWith('127') || host.includes('github.io');
  const basedomain = isLocal ? 'www.holidayextras.com' : host;

  // Product-specific URLs
  if (product === 'parking') {
    return `https://${basedomain}/static/?selectProduct=cp&#/categories?agent=${agent}&ppts=&customer_ref=&lang=en&adults=2&depart=${airport}&terminal=&arrive=&flight=default&in=${inDate}&out=${outDate}&park_from=${outTimeEncoded}&park_to=${inTimeEncoded}&filter_meetandgreet=&filter_parkandride=&children=0&infants=0&redirectReferal=carpark&from_categories=true&adcode=${adcode}&promotionCode=${promotionCode}`;
  } else if (product === 'hotels') {
    return `https://${basedomain}/static/?selectProduct=hp&#/categories?agent=${agent}&ppts=&customer_ref=&lang=en&adults=2&depart=${airport}&terminal=&arrive=&flight=default&in=${inDate}&out=${outDate}&park_from=${outTimeEncoded}&park_to=${inTimeEncoded}&children=0&infants=0&redirectReferal=hotelparking&from_categories=true&adcode=${adcode}&promotionCode=${promotionCode}`;
  } else if (product === 'lounges') {
    return `https://${basedomain}/static/?selectProduct=al&#/categories?agent=${agent}&ppts=&customer_ref=&lang=en&adults=2&depart=${airport}&terminal=&arrive=&flight=default&in=${inDate}&out=${outDate}&park_from=${outTimeEncoded}&park_to=${inTimeEncoded}&children=0&infants=0&redirectReferal=lounge&from_categories=true&adcode=${adcode}&promotionCode=${promotionCode}`;
  } else {
    // Default to parking
    return `https://${basedomain}/static/?selectProduct=cp&#/categories?agent=${agent}&ppts=&customer_ref=&lang=en&adults=2&depart=${airport}&terminal=&arrive=&flight=default&in=${inDate}&out=${outDate}&park_from=${outTimeEncoded}&park_to=${inTimeEncoded}&filter_meetandgreet=&filter_parkandride=&children=0&infants=0&redirectReferal=carpark&from_categories=true&adcode=${adcode}&promotionCode=${promotionCode}`;
  }
}

// Smooth scroll for hero CTA
function initializeSmoothScroll() {
  const heroCta = document.querySelector('.hero-cta');

  if (heroCta) {
    heroCta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(heroCta.getAttribute('href'));

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}
