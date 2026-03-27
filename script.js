// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeDates();
  initializeProductTabs();
  initializeSearchForm();
  initializeSmoothScroll();
  initializeStoryModals();
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
      // If "More" tab, redirect to Holiday Extras homepage
      if (tab.dataset.product === 'other') {
        window.location.href = 'https://www.holidayextras.com';
        return;
      }

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

// Story Modals
function initializeStoryModals() {
  const storyCards = document.querySelectorAll('.story-card');
  const modal = document.getElementById('storyModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = modal.querySelector('.modal-overlay');

  // Story content database
  const stories = {
    meetgreet: {
      category: 'Airport Parking',
      title: 'Why Meet & Greet Changed Our Family Holidays',
      image: 'assets/parking-story.jpg',
      content: `
        <p>Sarah Thompson, a mum of two from Manchester, remembers the "before times" all too well. The 5am alarm. The frantic rush to get the kids ready. The long-stay car park that always seemed full. The shuttle bus that took forever. The stressed arrival at check-in with 20 minutes to spare.</p>

        <blockquote>"We were exhausted before we even got on the plane. It felt like the holiday started when we landed, not when we left home."</blockquote>

        <p>Then, on a whim, Sarah booked meet & greet parking for a family trip to Spain last summer. "I thought it would be a luxury splurge," she laughs. "Turned out it was the best travel decision I've ever made."</p>

        <h2>What Actually Happens</h2>

        <p>Meet & greet works like this: you drive straight to the terminal entrance. A professional chauffeur meets you at the kerb, takes your keys, and drives your car to a secure off-site car park. When you land, they bring it back to the terminal before you arrive. You walk out, get in, and drive home.</p>

        <p>No shuttles. No searching for your car. No dragging luggage across dark car parks at midnight.</p>

        <h2>The Family Benefits</h2>

        <p>For families, the advantages stack up fast:</p>

        <ul>
          <li><strong>Terminal drop-off:</strong> Walk straight to check-in. No bus rides with tired kids.</li>
          <li><strong>Less stress:</strong> Start your holiday relaxed, not frazzled.</li>
          <li><strong>Save time:</strong> Check in within 2 minutes of parking.</li>
          <li><strong>Guaranteed space:</strong> Pre-booked and confirmed, even during peak season.</li>
          <li><strong>Secure parking:</strong> Park Mark approved, CCTV monitored car parks.</li>
        </ul>

        <h2>The Cost Reality</h2>

        <p>"Everyone assumes it's expensive," Sarah says. "But when I compared it properly, meet & greet was only £15 more than official Birmingham long-stay. For a week. £15 to skip all that stress? Absolute no-brainer."</p>

        <p>The secret? Book early. Meet & greet prices rise fast as the date approaches, but if you book 3 months ahead, the difference is minimal—and often cheaper than official airport parking.</p>

        <h2>Why They'll Never Go Back</h2>

        <blockquote>"Last month we flew to Portugal. The kids were asking 'aren't we getting the bus?' They couldn't believe we were already at check-in. That's when I realized—we've completely changed how we travel. And there's no going back."</blockquote>

        <p>Sarah's advice? "Try it once. Just once. You'll never park any other way again."</p>

        <a href="#search" class="modal-cta">Find meet & greet parking</a>
      `
    },
    lounges: {
      category: 'Airport Lounges',
      title: 'The Secret to Stress-Free Family Travel',
      image: 'assets/lounge-story.jpg',
      content: `
        <p>Mark and Emma Davies discovered airport lounges by accident. Their flight was delayed by 4 hours. Their two kids—aged 5 and 7—were already restless. The departure lounge was packed, noisy, and had nowhere for the kids to sit, let alone play.</p>

        <p>"We were 20 minutes from a meltdown," Mark remembers. "Then I saw the lounge entrance. I thought 'how much can it really cost?' Turns out, £25 per person. £100 for the family. We paid it."</p>

        <h2>What They Found Inside</h2>

        <p>Airport lounges aren't what most people think. They're not just for business travellers in suits. Modern family lounges offer:</p>

        <ul>
          <li><strong>Free food and drinks:</strong> Hot meals, snacks, soft drinks, and coffee. Unlimited.</li>
          <li><strong>Quiet comfortable seating:</strong> Actual sofas and armchairs, not metal benches.</li>
          <li><strong>Play areas:</strong> Many lounges have dedicated kids' zones with toys and games.</li>
          <li><strong>Showers:</strong> Perfect after early-morning drives or for freshening up.</li>
          <li><strong>Fast WiFi:</strong> Keep the kids entertained with tablets.</li>
        </ul>

        <p>"Within 10 minutes, the kids were calm, fed, and playing," Emma says. "We sat down with actual coffee and a hot meal. The stress just melted away. That 4-hour delay became the most relaxed part of our trip."</p>

        <h2>The Math That Makes Sense</h2>

        <p>Here's what changed Mark's mind permanently: "We worked it out. Four airport coffees: £16. Two kids' meal deals: £18. Snacks and drinks during the delay: another £20. We'd have spent £54 anyway, in a crowded, stressful environment. The lounge cost £46 more—and gave us 4 hours of calm, comfort, and unlimited food."</p>

        <blockquote>"Now we book lounge access every time. Even on short flights. It's not a luxury—it's how you start a holiday properly."</blockquote>

        <h2>Pre-Book to Save</h2>

        <p>The Davies' top tip? Pre-book. Walk-up lounge access can be £35-40 per person. Book 3 months ahead and it drops to £20-25. For a family of four, that's a £60 saving.</p>

        <p>"Everyone thinks lounges are for posh people or business travellers," Emma says. "They're for anyone who wants to travel without the chaos. Once you've tried it, you'll never go back to the departure lounge circus."</p>

        <a href="#search" class="modal-cta">Search airport lounges</a>
      `
    },
    summer2026: {
      category: 'Travel Planning',
      title: 'Summer 2026: Where UK Families Are Heading',
      image: '',
      content: `
        <p>Summer 2026 booking data reveals a clear shift in UK family travel patterns. Mediterranean beaches are back in force, but savvy families are also discovering hidden gems and locking in travel extras early to skip the peak-season chaos.</p>

        <h2>The Top 5 Destinations</h2>

        <p>Based on bookings from UK families over the past 3 months, here's where everyone's heading:</p>

        <ul>
          <li><strong>1. Costa del Sol, Spain:</strong> Unbeatable value, guaranteed sun, and direct flights from most UK airports. Families are booking 4-5 months ahead.</li>
          <li><strong>2. Algarve, Portugal:</strong> Quieter beaches, family-friendly resorts, and better value than Spain's peak zones.</li>
          <li><strong>3. Greek Islands (Crete, Rhodes, Corfu):</strong> History, beaches, and all-inclusive resorts make Greece the hassle-free choice.</li>
          <li><strong>4. Orlando, Florida:</strong> Theme parks are expensive, but families are spreading costs by booking travel extras (parking, lounges, hotels) early.</li>
          <li><strong>5. Antalya, Turkey:</strong> All-inclusive deals and direct flights from Manchester, Birmingham, and London make Turkey unbeatable for budget-conscious families.</li>
        </ul>

        <h2>The City Break Surge</h2>

        <p>Short city breaks (2-4 nights) are spiking—especially for families with teens. Paris, Barcelona, Amsterdam, and Rome are seeing huge UK family bookings for spring and summer 2026.</p>

        <p>Why? "Kids are older, they want culture not just beaches," says travel analyst Sophie Martin. "And short breaks mean lower costs—if you book smart."</p>

        <h2>The Travel Extras Trend</h2>

        <p>Here's what's changed: families are booking <em>everything</em> in advance. Not just flights and hotels, but parking, lounges, airport hotels, and transfers.</p>

        <p>"We're seeing 60% of summer parking already booked by March," Martin notes. "Families learned the hard way that last-minute airport parking is sold out or triple the price. Now they're locking in rates 3-4 months ahead."</p>

        <blockquote>"Book your flights, then immediately book your travel extras. That's the 2026 family travel playbook."</blockquote>

        <h2>Top Tips for Summer 2026</h2>

        <ul>
          <li><strong>Book parking now:</strong> Summer parking at major UK airports is 50%+ sold out by April.</li>
          <li><strong>Consider off-peak weeks:</strong> First two weeks of July are cheaper than August.</li>
          <li><strong>Pre-book lounges:</strong> Save £15-20 per person by booking ahead.</li>
          <li><strong>Airport hotels the night before:</strong> Skip the 4am wake-up and start relaxed.</li>
        </ul>

        <p>Where are you heading this summer? Don't leave your travel extras to chance.</p>

        <a href="#search" class="modal-cta">Book travel extras now</a>
      `
    },
    pricing: {
      category: 'Money Saving',
      title: 'Book Early, Save More: The 2026 Pricing Reality',
      image: '',
      content: `
        <p>Airport parking prices have risen 15% year-on-year, according to 2026 data. If you're still booking a week before your flight, you're paying premium rates—and you might not get a space at all.</p>

        <h2>The Numbers Don't Lie</h2>

        <p>We analyzed pricing data from 10 major UK airports over the past 12 months. The results are stark:</p>

        <ul>
          <li><strong>3 months ahead:</strong> Average £60 for 7 days</li>
          <li><strong>1 month ahead:</strong> Average £85 for 7 days</li>
          <li><strong>1 week ahead:</strong> Average £120 for 7 days</li>
          <li><strong>On the day:</strong> Often sold out, or £150-200</li>
        </ul>

        <p>That's a £90 difference between booking early and booking late. For the same parking space.</p>

        <h2>Why Prices Rise So Fast</h2>

        <p>It's simple supply and demand. Airports have fixed parking capacity. As spaces fill up, prices climb. During peak summer weeks (mid-July to end of August), parking sells out completely—often 6-8 weeks before the date.</p>

        <p>"We see customers shocked that parking is £180 for a week in August," says parking analyst David Chen. "But they're booking 2 weeks before a peak travel week. That's the most expensive time to book anything travel-related."</p>

        <h2>Off-Site vs On-Site</h2>

        <p>Here's where savvy families save big: off-site parking with shuttle transfer is typically 40-50% cheaper than on-site, and it fills up slower.</p>

        <p>Example: Gatwick long-stay (on-site) for 7 days in August:</p>

        <ul>
          <li><strong>Booked 3 months ahead:</strong> £95</li>
          <li><strong>Booked 1 week ahead:</strong> £155 (if available)</li>
        </ul>

        <p>Off-site with shuttle:</p>

        <ul>
          <li><strong>Booked 3 months ahead:</strong> £48</li>
          <li><strong>Booked 1 week ahead:</strong> £75</li>
        </ul>

        <p>That's a £107 difference for the early-booking off-site option vs last-minute on-site. Same airport. Same week.</p>

        <h2>Meet & Greet: The Hidden Value</h2>

        <p>Most people assume meet & greet is the expensive option. But if you book early, it's often only £10-20 more than official long-stay—and you skip the shuttle bus entirely.</p>

        <blockquote>"I compared meet & greet (booked 3 months ahead) vs official parking (booked 2 weeks ahead). Meet & greet was £12 cheaper. And I got driven to the terminal. It's a no-brainer if you plan ahead."</blockquote>

        <h2>The 2026 Booking Strategy</h2>

        <p>Book your flights, then immediately book your travel extras. Within 24 hours. Don't wait. Prices only go up.</p>

        <ul>
          <li><strong>Parking:</strong> 3 months ahead = lowest rates</li>
          <li><strong>Airport hotels:</strong> 2 months ahead = best availability</li>
          <li><strong>Lounges:</strong> 6-8 weeks ahead = £15-20 per person saving</li>
          <li><strong>Transfers:</strong> Book with parking for bundle discounts</li>
        </ul>

        <p>The early bird doesn't just get the worm in 2026—it gets the worm at half price.</p>

        <a href="#search" class="modal-cta">Lock in your rates now</a>
      `
    }
  };

  // Open modal when story card is clicked
  storyCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const storyId = card.dataset.story;
      const story = stories[storyId];

      if (story) {
        openModal(story);
      }
    });
  });

  // Close modal handlers
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function openModal(story) {
    const imageHtml = story.image ? `<img src="${story.image}" alt="${story.title}">` : '';

    modalBody.innerHTML = `
      ${imageHtml}
      <span class="story-category">${story.category}</span>
      <h1>${story.title}</h1>
      ${story.content}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Make CTA scroll to search if it exists
    const modalCta = modalBody.querySelector('.modal-cta');
    if (modalCta && modalCta.getAttribute('href') === '#search') {
      modalCta.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        setTimeout(() => {
          const searchSection = document.getElementById('search');
          if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      });
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
