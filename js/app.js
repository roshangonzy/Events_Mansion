/* ==========================================================================
   EVENTORA (Eventora Experiences Private Limited) — Interactive Controller
   Handles: Header scroll state, Mobile Drawer, Scroll Reveals, FAQ Accordion,
   Portfolio Filtering, Case Study Dynamic Renderer, Capabilities Deck Modal,
   and 3-Step High-Converting Proposal (RFP) Intake Form.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroReady();
  initHeaderScroll();
  initMobileDrawer();
  initRevealObserver();
  initFaqAccordions();
  initCapabilitiesModal();
  initPortfolioFilter();
  initCaseStudyPage();
  initRfpForm();
});

/* 1. Trigger subtle hero scale settle */
function initHeroReady() {
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('is-ready'));
  }
}

/* 2. Sticky Header Scroll Transition */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 36) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* 3. Mobile Navigation Drawer */
function initMobileDrawer() {
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggle || !drawer) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      setOpen(false);
    }
  });
}

/* 4. Editorial Scroll Reveal Observer */
function initRevealObserver() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* 5. FAQ Accordion */
function initFaqAccordions() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector('.faq-trigger');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach((other) => {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.faq-trigger');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* 6. Capabilities Deck Modal (B2B Lead Capture) */
function initCapabilitiesModal() {
  const modal = document.getElementById('capabilities-modal');
  if (!modal) return;

  const openers = document.querySelectorAll('[data-open-deck]');
  const closeBtn = modal.querySelector('[data-close-modal]');
  const form = modal.querySelector('#deck-form');
  const formView = modal.querySelector('#deck-form-view');
  const successView = modal.querySelector('#deck-success-view');

  const openModal = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openers.forEach((btn) => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.trim()) return;
      if (formView) formView.style.display = 'none';
      if (successView) successView.style.display = 'flex';
    });
  }
}

/* 7. Work / Portfolio Page Dynamic Grid & Category Filter */
function initPortfolioFilter() {
  const grid = document.getElementById('portfolio-grid');
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (!grid || !window.EM_CASE_STUDIES) return;

  const renderCards = (category) => {
    const items =
      category === 'all'
        ? window.EM_CASE_STUDIES
        : window.EM_CASE_STUDIES.filter((cs) => cs.category === category);

    grid.innerHTML = items
      .map(
        (cs) => `
      <article class="case-card">
        <a href="case-study.html?id=${cs.id}" class="media-frame ratio-16-10" aria-label="View ${cs.title} case study">
          <img src="${cs.image}" alt="${cs.title}" loading="lazy">
        </a>
        <div class="case-card-body">
          <div class="case-card-meta">
            <span class="cat">${cs.categoryLabel}</span>
            <span>${cs.location}</span>
            <span>${cs.year}</span>
          </div>
          <h2 class="case-card-title">
            <a href="case-study.html?id=${cs.id}">${cs.title}</a>
          </h2>
          <p class="body-copy">${cs.excerpt}</p>
          <div class="case-kpi-line">
            <span><strong>${cs.headlineMetric}</strong></span>
            <a href="case-study.html?id=${cs.id}" class="text-link">
              View Study
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </a>
          </div>
        </div>
      </article>
    `
      )
      .join('');
  };

  renderCards('all');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderCards(btn.dataset.filter);
    });
  });
}

/* 8. Dynamic Case Study Detail Page */
function initCaseStudyPage() {
  const root = document.getElementById('case-study-root');
  if (!root || !window.EM_CASE_STUDIES) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const studies = window.EM_CASE_STUDIES;
  const idx = studies.findIndex((s) => s.id === id);
  const cs = idx >= 0 ? studies[idx] : studies[0];
  const nextCs = studies[(idx >= 0 ? idx + 1 : 1) % studies.length];

  document.title = `${cs.title} — EVENTORA`;

  root.innerHTML = `
    <section class="page-hero surface-alabaster">
      <div class="container">
        <div style="margin-bottom: 1.5rem;">
          <a href="work.html" class="text-link">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="transform: rotate(180deg);"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            All Case Studies
          </a>
        </div>
        <div class="page-hero-grid">
          <div class="section-header-stack">
            <span class="eyebrow">${cs.categoryLabel} · ${cs.year}</span>
            <h1 class="display-lg">${cs.title}</h1>
          </div>
          <p class="lead-copy">${cs.excerpt}</p>
        </div>

        <dl class="cs-meta-strip">
          <div class="cs-meta-item"><dt>Client</dt><dd>${cs.client}</dd></div>
          <div class="cs-meta-item"><dt>Sector</dt><dd>${cs.sector}</dd></div>
          <div class="cs-meta-item"><dt>Location</dt><dd>${cs.location}</dd></div>
          <div class="cs-meta-item"><dt>Attendance</dt><dd>${cs.guests}</dd></div>
          <div class="cs-meta-item"><dt>Timeline</dt><dd>${cs.timeline}</dd></div>
        </dl>

        <div class="media-frame ratio-16-9">
          <img src="${cs.image}" alt="${cs.title}">
        </div>
      </div>
    </section>

    <section class="section surface-paper">
      <div class="container">
        <div class="cs-editorial-grid">
          <div>
            <span class="eyebrow">01 / The Brief</span>
            <h2 class="display-md" style="margin-top: 1rem;">Objective &amp; Strategic Context</h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.4rem;">
            <p class="lead-copy" style="color: var(--ink-primary);">${cs.objective}</p>
            <p class="body-copy"><strong>Format:</strong> ${cs.format}</p>
          </div>
        </div>

        <div class="cs-editorial-grid hairline-top" style="margin-top: 4rem; padding-top: 4rem;">
          <div>
            <span class="eyebrow">02 / Architecture &amp; Production</span>
            <h2 class="display-md" style="margin-top: 1rem;">Spatial Concept &amp; Precision Delivery</h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <p class="body-copy">${cs.concept}</p>
            <p class="body-copy">${cs.execution}</p>
            <div class="media-frame ratio-16-10" style="margin-top: 1rem;">
              <img src="${cs.secondaryImage}" alt="${cs.client} event environment detail">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section surface-alabaster hairline-top">
      <div class="container">
        <div class="section-header-stack">
          <span class="eyebrow">03 / Measurable Outcomes</span>
          <h2 class="display-md">Commercial &amp; Experiential Impact</h2>
        </div>

        <div class="cs-outcome-grid">
          ${cs.outcomes
            .map(
              (o) => `
            <div class="cs-outcome-card">
              <div class="metric-value">${o.value}</div>
              <p class="metric-label" style="margin-top: 0.65rem;">${o.label}</p>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="testimonial-card" style="margin-top: 3rem;">
          <blockquote class="testimonial-quote">“${cs.quote.text}”</blockquote>
          <div class="testimonial-author">
            <div>
              <div class="author-name">${cs.quote.author}</div>
              <div class="author-role">${cs.quote.role}</div>
            </div>
            <a href="contact.html?service=${encodeURIComponent(cs.categoryLabel)}" class="btn btn-primary btn-sm">
              Plan a Similar Event
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-compact surface-paper hairline-top">
      <div class="container" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem;">
        <div>
          <span class="meta-label">Next Case Study</span>
          <h3 class="display-sm" style="margin-top: 0.35rem;">${nextCs.title}</h3>
        </div>
        <a href="case-study.html?id=${nextCs.id}" class="btn btn-outline">
          Read Next Study
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
        </a>
      </div>
    </section>
  `;
}

/* 9. High-Converting 3-Step RFP Proposal Form */
function initRfpForm() {
  const form = document.getElementById('rfp-form');
  if (!form) return;

  const panels = Array.from(form.querySelectorAll('.rfp-step-panel'));
  const indicators = Array.from(document.querySelectorAll('.rfp-step-indicator'));
  const errorBox = document.getElementById('rfp-error');
  const confirmation = document.getElementById('rfp-confirmation');
  const summaryBox = document.getElementById('rfp-summary');
  const refEl = document.getElementById('rfp-ref');

  let currentStep = 0;

  // Sync visual selection states for custom choice cards (radios & checkboxes)
  const syncChoices = () => {
    form.querySelectorAll('.choice-card').forEach((card) => {
      const input = card.querySelector('input');
      if (input) {
        card.classList.toggle('is-selected', input.checked);
      }
    });
  };

  form.addEventListener('change', syncChoices);

  // Pre-select event type from URL query parameter (?service=...)
  const params = new URLSearchParams(window.location.search);
  const preselectedService = params.get('service');
  if (preselectedService) {
    const normalized = preselectedService.toLowerCase();
    const serviceRadios = form.querySelectorAll('input[name="eventType"]');
    serviceRadios.forEach((radio) => {
      if (
        radio.value.toLowerCase().includes(normalized) ||
        normalized.includes(radio.value.toLowerCase().split(' ')[0])
      ) {
        radio.checked = true;
      }
    });
  }

  syncChoices();

  const showStep = (stepIndex) => {
    currentStep = stepIndex;
    panels.forEach((p, idx) => p.classList.toggle('is-active', idx === stepIndex));
    indicators.forEach((ind, idx) => {
      ind.classList.toggle('is-active', idx === stepIndex);
      ind.classList.toggle('is-done', idx < stepIndex);
    });
    if (errorBox) errorBox.classList.remove('is-visible');
  };

  const validateStep = (stepIndex) => {
    const panel = panels[stepIndex];
    let valid = true;
    let message = 'Please complete the required fields to continue.';

    if (stepIndex === 0) {
      const eventType = form.querySelector('input[name="eventType"]:checked');
      const city = form.querySelector('#rfp-city');
      if (!eventType) {
        valid = false;
        message = 'Please select an event category to proceed.';
      } else if (city && !city.value.trim()) {
        valid = false;
        message = 'Please enter your target city or region.';
        city.focus();
      }
    }

    if (stepIndex === 1) {
      const guests = form.querySelector('input[name="guestCount"]:checked');
      const budget = form.querySelector('input[name="budgetRange"]:checked');
      if (!guests || !budget) {
        valid = false;
        message = 'Please select both an estimated guest count and indicative budget tier.';
      }
    }

    if (stepIndex === 2) {
      const name = form.querySelector('#rfp-name');
      const email = form.querySelector('#rfp-email');
      const company = form.querySelector('#rfp-company');
      if (!name.value.trim() || !email.value.trim() || !company.value.trim()) {
        valid = false;
        message = 'Please provide your full name, work email, and organization.';
      } else if (!email.value.includes('@')) {
        valid = false;
        message = 'Please enter a valid corporate email address.';
      }
    }

    if (!valid && errorBox) {
      errorBox.textContent = message;
      errorBox.classList.add('is-visible');
    }
    return valid;
  };

  form.querySelectorAll('[data-rfp-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep) && currentStep < panels.length - 1) {
        showStep(currentStep + 1);
      }
    });
  });

  form.querySelectorAll('[data-rfp-prev]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    const data = new FormData(form);
    const refNumber = `EV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const scopes = data.getAll('scope');

    if (refEl) refEl.textContent = refNumber;
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div><dt>Event Category</dt><dd>${data.get('eventType') || 'Corporate Event'}</dd></div>
        <div><dt>Target Location</dt><dd>${data.get('city') || 'TBD'}</dd></div>
        <div><dt>Target Date</dt><dd>${data.get('targetDate') || 'Flexible / Upcoming Quarter'}</dd></div>
        <div><dt>Estimated Scale</dt><dd>${data.get('guestCount') || 'TBD'} · ${data.get('budgetRange') || 'TBD'}</dd></div>
        <div><dt>Primary Contact</dt><dd>${data.get('fullName')} (${data.get('company')})</dd></div>
        <div><dt>Production Scope</dt><dd>${scopes.length ? scopes.join(', ') : 'Full Turnkey Production'}</dd></div>
      `;
    }

    form.style.display = 'none';
    const progress = document.querySelector('.rfp-progress');
    if (progress) progress.style.display = 'none';
    if (confirmation) confirmation.classList.add('is-visible');
  });
}
