// Pat Tattoo - Core Logic & Modern Clean Interactions

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initNavigation();
  initScrollAnimations();
  initLightbox();
  initFAQ();
  initCookieBanner();
  initSampleBookings();
  initBookingWizard();
  initAdminPanel();
  checkHashRoute();
});

window.addEventListener('hashchange', checkHashRoute);

/* ==========================================================================
   1. AMBIENT CANVAS (Szara subtelna mgła latająca i rozpraszająca się przy scrollu)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mist puff particles
  const particleCount = 26;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      baseRadius: Math.random() * 90 + 110,
      radius: Math.random() * 90 + 110,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.05 + 0.035, // very subtle soft mist
      phase: Math.random() * Math.PI * 2,
      dispersionX: 0,
      dispersionY: 0
    });
  }

  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScrollY;
    scrollVelocity = Math.min(Math.max(delta * 0.25, -20), 20);
    lastScrollY = currentScroll;

    // Disperse mist on scroll
    particles.forEach((p, idx) => {
      const dir = (idx % 2 === 0 ? 1 : -1);
      p.dispersionX += dir * Math.abs(scrollVelocity) * 1.8;
      p.dispersionY += scrollVelocity * 0.8;
    });
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Slowly relax dispersion back to zero
    particles.forEach(p => {
      p.dispersionX *= 0.94;
      p.dispersionY *= 0.94;

      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.008;

      // Soft breathing effect
      p.radius = p.baseRadius + Math.sin(p.phase) * 15;

      // Wrap edges
      if (p.x < -p.radius * 2) p.x = width + p.radius * 2;
      if (p.x > width + p.radius * 2) p.x = -p.radius * 2;
      if (p.y < -p.radius * 2) p.y = height + p.radius * 2;
      if (p.y > height + p.radius * 2) p.y = -p.radius * 2;

      const renderX = p.x + p.dispersionX;
      const renderY = p.y + p.dispersionY;

      const grad = ctx.createRadialGradient(renderX, renderY, 0, renderX, renderY, p.radius);
      // Soft monochromatic gray tone
      grad.addColorStop(0, `rgba(165, 170, 180, ${p.alpha * 1.1})`);
      grad.addColorStop(0.5, `rgba(185, 190, 198, ${p.alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(210, 215, 222, 0)');

      ctx.beginPath();
      ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. NAVIGATION & MOBILE DRAWER (MENU W ROGU NA TELEFONIE)
   ========================================================================== */
window.toggleMobileMenu = function() {
  const drawer = document.getElementById('mobile-drawer');
  const icon = document.getElementById('mobile-menu-icon');
  if (!drawer) return;

  const isHidden = drawer.classList.contains('hidden');
  if (isHidden) {
    drawer.classList.remove('hidden');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }
  } else {
    drawer.classList.add('hidden');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  }
};

window.closeMobileMenu = function() {
  const drawer = document.getElementById('mobile-drawer');
  const icon = document.getElementById('mobile-menu-icon');
  if (drawer) drawer.classList.add('hidden');
  if (icon) {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
};

function initNavigation() {
  const closeDrawer = document.getElementById('close-drawer-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (closeDrawer) {
    closeDrawer.addEventListener('click', window.closeMobileMenu);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', window.closeMobileMenu);
  });

  // Sticky nav background shadow on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('shadow-sm', 'bg-white/95');
      navbar.classList.remove('bg-white/80');
    } else {
      navbar.classList.remove('shadow-sm', 'bg-white/95');
      navbar.classList.add('bg-white/80');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. SCROLL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. LIGHTBOX MODAL FOR PORTFOLIO
   ========================================================================== */
const portfolioItems = [
  {
    src: 'portfolio-1.png',
    title: 'Delikatna Lilia Fineline & Pamiątkowe Daty',
    category: 'Fineline & Botanika',
    desc: 'Precyzyjny kwiat lilii z pamiątkowymi datami 1976 i 1973 wykonany cienką igłą 1RL.'
  },
  {
    src: 'portfolio-2.png',
    title: 'Wielkoformatowy Lettering Autorski',
    category: 'Lettering & Kaligrafia',
    desc: 'Dynamiczna, płynna kaligrafia na udzie ("Create Custom") idealnie skomponowana z anatomią ciała.'
  },
  {
    src: 'portfolio-3.png',
    title: 'Subtelny Tatuaż wzdłuż Kręgosłupa',
    category: 'Minimalizm & Spine Tattoo',
    desc: 'Sentencja "simplicity is strength" połączona ze słońcem, księżycem i gwiezdnymi mikrodetalami.'
  },
  {
    src: 'portfolio-4.png',
    title: 'Botaniczna Żarówka ze Słonecznikiem i Pszczołą',
    category: 'Dotwork & Mikrodokładność',
    desc: 'Harmonijna kompozycja natury i światła z miękkimi cieniowaniami oraz elementami geometrycznymi.'
  }
];

let currentLightboxIndex = 0;

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const category = document.getElementById('lightbox-category');
  const desc = document.getElementById('lightbox-desc');
  const counter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal) return;

  function updateLightbox() {
    const item = portfolioItems[currentLightboxIndex];
    img.src = item.src;
    img.alt = item.title;
    title.textContent = item.title;
    category.textContent = item.category;
    desc.textContent = item.desc;
    counter.textContent = `${currentLightboxIndex + 1} / ${portfolioItems.length}`;
  }

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + portfolioItems.length) % portfolioItems.length;
    updateLightbox();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % portfolioItems.length;
    updateLightbox();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentLightboxIndex = (currentLightboxIndex - 1 + portfolioItems.length) % portfolioItems.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      currentLightboxIndex = (currentLightboxIndex + 1) % portfolioItems.length;
      updateLightbox();
    }
  });
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   6. CUSTOM ALERTS & CONFIRMS (No basic alert/confirm!)
   ========================================================================== */
function showCustomAlert(message, title = 'Informacja') {
  const modal = document.getElementById('custom-alert-modal');
  const alertTitle = document.getElementById('custom-alert-title');
  const alertMsg = document.getElementById('custom-alert-msg');
  const alertBtn = document.getElementById('custom-alert-ok');

  if (!modal) {
    console.warn('Custom alert modal not found');
    return;
  }

  alertTitle.textContent = title;
  alertMsg.textContent = message;
  modal.classList.remove('hidden');

  const handleOk = () => {
    modal.classList.add('hidden');
    alertBtn.removeEventListener('click', handleOk);
  };
  alertBtn.addEventListener('click', handleOk);
}

function showCustomConfirm(message, title = 'Potwierdzenie', onConfirm) {
  const modal = document.getElementById('custom-confirm-modal');
  const confirmTitle = document.getElementById('custom-confirm-title');
  const confirmMsg = document.getElementById('custom-confirm-msg');
  const confirmYes = document.getElementById('custom-confirm-yes');
  const confirmNo = document.getElementById('custom-confirm-no');

  if (!modal) return;

  confirmTitle.textContent = title;
  confirmMsg.textContent = message;
  modal.classList.remove('hidden');

  const cleanup = () => {
    modal.classList.add('hidden');
    confirmYes.removeEventListener('click', handleYes);
    confirmNo.removeEventListener('click', handleNo);
  };

  const handleYes = () => {
    cleanup();
    if (typeof onConfirm === 'function') onConfirm();
  };

  const handleNo = () => {
    cleanup();
  };

  confirmYes.addEventListener('click', handleYes);
  confirmNo.addEventListener('click', handleNo);
}

/* ==========================================================================
   7. DEMO BAR CONTACT MODAL & PRIVACY POLICY MODAL
   ========================================================================== */
window.openDemoContactModal = function() {
  const modal = document.getElementById('demo-contact-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeDemoContactModal = function() {
  const modal = document.getElementById('demo-contact-modal');
  if (modal) modal.classList.add('hidden');
};

window.copyDemoEmail = function() {
  navigator.clipboard.writeText('kacperekwas1@gmail.com').then(() => {
    showCustomAlert('Adres e-mail kacperekwas1@gmail.com został skopiowany do schowka.', 'Skopiowano');
  });
};

window.openPrivacyModal = function() {
  const modal = document.getElementById('privacy-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closePrivacyModal = function() {
  const modal = document.getElementById('privacy-modal');
  if (modal) modal.classList.add('hidden');
};

/* ==========================================================================
   8. COOKIE BANNER
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  const accepted = localStorage.getItem('pattattoo_cookie_consent');
  if (!accepted) {
    banner.classList.remove('hidden');
  }

  const acceptBtn = document.getElementById('cookie-accept');
  const settingsBtn = document.getElementById('cookie-settings');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('pattattoo_cookie_consent', 'accepted');
      banner.classList.add('hidden');
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      localStorage.setItem('pattattoo_cookie_consent', 'necessary_only');
      banner.classList.add('hidden');
      showCustomAlert('Zapisano Twoje preferencje plików cookies: wyłącznie niezbędne.', 'Cookies');
    });
  }
}

/* ==========================================================================
   9. SAMPLE INITIAL BOOKINGS (Zajęte terminy w kalendarzu demonstracyjnym)
   ========================================================================== */
function initSampleBookings() {
  const existing = localStorage.getItem('pattattoo_bookings');
  if (!existing || JSON.parse(existing).length === 0) {
    const today = new Date();

    // Helper to get formatted next weekday (Mon-Fri)
    function getNextWorkday(addDays) {
      const d = new Date(today);
      d.setDate(d.getDate() + addDays);
      // If Sunday (0), move to Monday (+1)
      if (d.getDay() === 0) d.setDate(d.getDate() + 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }

    const sampleData = [
      {
        id: '#PT-71042',
        service: 'Fineline & Botanika',
        placement: 'Przedramię / Ręka',
        description: 'Delikatna kompozycja polnych kwiatów ze wstążką.',
        date: getNextWorkday(2),
        time: '12:00',
        fullName: 'Oliwia Pałac',
        email: 'oliwia.palac@example.com',
        phone: '+48 602 114 908',
        image: '',
        status: 'Potwierdzona',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: '#PT-83915',
        service: 'Lettering & Kaligrafia',
        placement: 'Udo',
        description: 'Autorska sentencja kaligraficzna o lekkim, płynnym kroju.',
        date: getNextWorkday(3),
        time: '14:00',
        fullName: 'Kasia Oleksy',
        email: 'kasia.oleksy@example.com',
        phone: '+48 518 903 221',
        image: '',
        status: 'Potwierdzona',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: '#PT-94218',
        service: 'Profesjonalny Piercing',
        placement: 'Ucho (Helix & Tragus)',
        description: 'Dwa przekłucia z tytanową biżuterią medyczną G23.',
        date: getNextWorkday(5),
        time: '10:00',
        fullName: 'Nadia Budzyn',
        email: 'nadia.budzyn@example.com',
        phone: '+48 730 456 120',
        image: '',
        status: 'Zrealizowano',
        createdAt: new Date(Date.now() - 3600000 * 120).toISOString()
      }
    ];

    localStorage.setItem('pattattoo_bookings', JSON.stringify(sampleData));
  }
}

/* ==========================================================================
   10. BOOKING WIZARD (4 KROKI + KALENDARZ + KOMPRESJA CANVAS API)
   ========================================================================== */
function initBookingWizard() {
  const wizardForm = {
    service: '',
    placement: '',
    description: '',
    compressedImage: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+48',
    phone: ''
  };

  let currentStep = 1;

  // Working Hours definition for Pat Tattoo
  // Mon-Fri: 10:00 - 18:00 (slots: 10:00, 12:00, 14:00, 16:00)
  // Saturday: 10:00 - 14:00 (slots: 10:00, 12:00)
  // Sunday: Closed
  const weekdaySlots = ['10:00', '12:00', '14:00', '16:00'];
  const saturdaySlots = ['10:00', '12:00'];

  // Calendar State
  let calDate = new Date();
  calDate.setDate(1); // Start of current month

  // DOM Elements
  const stepContainers = [
    document.getElementById('wizard-step-1'),
    document.getElementById('wizard-step-2'),
    document.getElementById('wizard-step-3'),
    document.getElementById('wizard-step-4')
  ];

  const stepIndicators = [
    document.getElementById('indicator-step-1'),
    document.getElementById('indicator-step-2'),
    document.getElementById('indicator-step-3'),
    document.getElementById('indicator-step-4')
  ];

  function showStep(step) {
    currentStep = step;
    stepContainers.forEach((container, idx) => {
      if (!container) return;
      if (idx + 1 === step) {
        container.classList.remove('hidden');
      } else {
        container.classList.add('hidden');
      }
    });

    stepIndicators.forEach((ind, idx) => {
      if (!ind) return;
      if (idx + 1 === step) {
        ind.classList.add('bg-black', 'text-white', 'border-black');
        ind.classList.remove('bg-neutral-100', 'text-neutral-500', 'border-neutral-300');
      } else if (idx + 1 < step) {
        ind.classList.add('bg-neutral-800', 'text-white', 'border-neutral-800');
        ind.classList.remove('bg-neutral-100', 'text-neutral-500', 'border-neutral-300', 'bg-black');
      } else {
        ind.classList.remove('bg-black', 'text-white', 'border-black', 'bg-neutral-800');
        ind.classList.add('bg-neutral-100', 'text-neutral-500', 'border-neutral-300');
      }
    });

    // Scroll to wizard on step change
    const wizardCard = document.getElementById('booking-card-main');
    if (wizardCard && window.scrollY > wizardCard.offsetTop + 100) {
      wizardCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Step 1: Style Selection
  const serviceCards = document.querySelectorAll('.service-choice-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => {
        c.classList.remove('border-black', 'bg-neutral-100', 'shadow-md');
        c.classList.add('border-neutral-200');
      });
      card.classList.add('border-black', 'bg-neutral-100', 'shadow-md');
      card.classList.remove('border-neutral-200');
      wizardForm.service = card.getAttribute('data-service') || '';
    });
  });

  // Step 1: Image Compression via Canvas API
  const imageInput = document.getElementById('wizard-image-input');
  const imagePreview = document.getElementById('wizard-image-preview');
  const previewImg = document.getElementById('wizard-preview-img');
  const removeImgBtn = document.getElementById('wizard-remove-img');

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showCustomAlert('Wybierz plik graficzny (JPG, PNG, WebP).', 'Nieobsługiwany format');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Compress via Canvas
          const maxDim = 850;
          let w = img.width;
          let h = img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          // Quality 0.80 JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
          wizardForm.compressedImage = compressedDataUrl;

          if (imagePreview && previewImg) {
            previewImg.src = compressedDataUrl;
            imagePreview.classList.remove('hidden');
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeImgBtn) {
    removeImgBtn.addEventListener('click', () => {
      wizardForm.compressedImage = '';
      if (imageInput) imageInput.value = '';
      if (imagePreview) imagePreview.classList.add('hidden');
    });
  }

  // Step 1 Next Button
  const step1Next = document.getElementById('step-1-next');
  if (step1Next) {
    step1Next.addEventListener('click', () => {
      const placement = document.getElementById('wizard-placement')?.value.trim();
      const desc = document.getElementById('wizard-desc')?.value.trim();

      if (!wizardForm.service) {
        showCustomAlert('Proszę wybrać styl tatuażu lub usługę.', 'Brak wyboru');
        return;
      }
      if (!desc) {
        showCustomAlert('Proszę krótko opisać swój pomysł na tatuaż lub piercing.', 'Brak opisu');
        return;
      }

      wizardForm.placement = placement || 'Do ustalenia podczas konsultacji';
      wizardForm.description = desc;

      renderCalendar();
      showStep(2);
    });
  }

  // Step 2: Calendar Rendering
  const monthLabel = document.getElementById('cal-month-label');
  const prevMonthBtn = document.getElementById('cal-prev-month');
  const nextMonthBtn = document.getElementById('cal-next-month');
  const calGrid = document.getElementById('cal-days-grid');
  const timeSlotsContainer = document.getElementById('time-slots-container');
  const selectedDateLabel = document.getElementById('selected-date-label');

  const polishMonths = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  function getBookings() {
    try {
      return JSON.parse(localStorage.getItem('pattattoo_bookings') || '[]');
    } catch {
      return [];
    }
  }

  function renderCalendar() {
    if (!calGrid || !monthLabel) return;

    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    monthLabel.textContent = `${polishMonths[month]} ${year}`;

    calGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Polish week starts on Monday (1). Sunday is 0 in JS.
    let startingDay = firstDay.getDay() - 1;
    if (startingDay === -1) startingDay = 6;

    const totalDays = lastDay.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty lead cells
    for (let i = 0; i < startingDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'h-10 sm:h-12';
      calGrid.appendChild(empty);
    }

    const bookings = getBookings();

    for (let day = 1; day <= totalDays; day++) {
      const current = new Date(year, month, day);
      current.setHours(0, 0, 0, 0);

      const dayOfWeek = current.getDay(); // 0 is Sun, 6 is Sat
      const isSunday = (dayOfWeek === 0);
      const isPast = (current < today);
      const isClosed = isSunday || isPast;

      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      // Check bookings on this day
      const dayBookings = bookings.filter(b => b.date === dateStr && b.status !== 'Anulowano');
      const hasBooking = dayBookings.length > 0;

      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.className = `cal-day relative h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center text-sm font-medium border border-neutral-200/80 ${isClosed ? 'disabled' : 'cursor-pointer hover:border-black'}`;

      dayBtn.textContent = day;

      if (hasBooking && !isClosed) {
        const dot = document.createElement('span');
        dot.className = 'w-1.5 h-1.5 bg-neutral-900 rounded-full mt-0.5';
        dayBtn.appendChild(dot);
      }

      if (wizardForm.date === dateStr) {
        dayBtn.classList.add('selected');
      }

      if (!isClosed) {
        dayBtn.addEventListener('click', () => {
          document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
          dayBtn.classList.add('selected');
          wizardForm.date = dateStr;
          wizardForm.time = '';
          renderTimeSlots(current, dayBookings);
        });
      }

      calGrid.appendChild(dayBtn);
    }
  }

  function renderTimeSlots(dateObj, existingBookings) {
    if (!timeSlotsContainer || !selectedDateLabel) return;

    const dayOfWeek = dateObj.getDay();
    const dayName = dateObj.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
    selectedDateLabel.textContent = `Wybrany dzień: ${dayName}`;

    timeSlotsContainer.innerHTML = '';

    const availableHours = (dayOfWeek === 6) ? saturdaySlots : weekdaySlots;
    const bookedTimes = existingBookings.map(b => b.time);

    availableHours.forEach(hour => {
      const isBooked = bookedTimes.includes(hour);
      const slotBtn = document.createElement('button');
      slotBtn.type = 'button';
      slotBtn.className = `p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
        isBooked
          ? 'border-neutral-200 bg-neutral-100/70 text-neutral-400 cursor-not-allowed'
          : 'border-neutral-300 hover:border-black hover:bg-neutral-50 cursor-pointer text-neutral-900'
      }`;

      slotBtn.innerHTML = `
        <span>${hour}</span>
        <span class="text-xs ${isBooked ? 'text-neutral-400 font-normal' : 'text-neutral-500 font-light'}">
          ${isBooked ? '[ Zajęty ]' : 'Dostępny'}
        </span>
      `;

      if (wizardForm.time === hour && !isBooked) {
        slotBtn.classList.add('border-black', 'bg-neutral-900', 'text-white');
        slotBtn.classList.remove('text-neutral-900', 'hover:bg-neutral-50');
      }

      if (!isBooked) {
        slotBtn.addEventListener('click', () => {
          timeSlotsContainer.querySelectorAll('button').forEach(b => {
            b.classList.remove('border-black', 'bg-neutral-900', 'text-white');
            b.classList.add('text-neutral-900');
          });
          slotBtn.classList.add('border-black', 'bg-neutral-900', 'text-white');
          slotBtn.classList.remove('text-neutral-900');
          wizardForm.time = hour;
        });
      }

      timeSlotsContainer.appendChild(slotBtn);
    });
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      const now = new Date();
      if (calDate.getFullYear() === now.getFullYear() && calDate.getMonth() <= now.getMonth()) {
        return; // Don't go to past months
      }
      calDate.setMonth(calDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      calDate.setMonth(calDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // Step 2 Navigation
  const step2Back = document.getElementById('step-2-back');
  const step2Next = document.getElementById('step-2-next');

  if (step2Back) {
    step2Back.addEventListener('click', () => showStep(1));
  }

  if (step2Next) {
    step2Next.addEventListener('click', () => {
      if (!wizardForm.date) {
        showCustomAlert('Proszę wybrać dzień z kalendarza.', 'Brak daty');
        return;
      }
      if (!wizardForm.time) {
        showCustomAlert('Proszę zaznaczyć wolną godzinę wizyty.', 'Brak godziny');
        return;
      }
      showStep(3);
    });
  }

  // Step 3 Navigation
  const step3Back = document.getElementById('step-3-back');
  const step3Next = document.getElementById('step-3-next');

  if (step3Back) {
    step3Back.addEventListener('click', () => showStep(2));
  }

  if (step3Next) {
    step3Next.addEventListener('click', () => {
      const fName = document.getElementById('client-first-name')?.value.trim();
      const lName = document.getElementById('client-last-name')?.value.trim();
      const email = document.getElementById('client-email')?.value.trim();
      const code = document.getElementById('client-country-code')?.value || '+48';
      const phone = document.getElementById('client-phone')?.value.trim();

      if (!fName || !lName) {
        showCustomAlert('Proszę podać imię i nazwisko.', 'Niekompletne dane');
        return;
      }
      if (!email || !email.includes('@') || !email.includes('.')) {
        showCustomAlert('Proszę podać poprawny adres e-mail.', 'Błędny e-mail');
        return;
      }
      if (!phone || phone.length < 7) {
        showCustomAlert('Proszę podać poprawny numer telefonu.', 'Błędny telefon');
        return;
      }

      wizardForm.firstName = fName;
      wizardForm.lastName = lName;
      wizardForm.email = email;
      wizardForm.countryCode = code;
      wizardForm.phone = phone;

      // Populate Step 4 Summary
      document.getElementById('summary-service').textContent = wizardForm.service;
      document.getElementById('summary-placement').textContent = wizardForm.placement;
      document.getElementById('summary-datetime').textContent = `${wizardForm.date} o godzinie ${wizardForm.time}`;
      document.getElementById('summary-name').textContent = `${wizardForm.firstName} ${wizardForm.lastName}`;
      document.getElementById('summary-contact').textContent = `${wizardForm.countryCode} ${wizardForm.phone} • ${wizardForm.email}`;
      document.getElementById('summary-desc').textContent = wizardForm.description;

      const summaryImgContainer = document.getElementById('summary-img-container');
      const summaryImg = document.getElementById('summary-img');
      if (wizardForm.compressedImage && summaryImg && summaryImgContainer) {
        summaryImg.src = wizardForm.compressedImage;
        summaryImgContainer.classList.remove('hidden');
      } else if (summaryImgContainer) {
        summaryImgContainer.classList.add('hidden');
      }

      showStep(4);
    });
  }

  // Step 4 Navigation & Confirm
  const step4Back = document.getElementById('step-4-back');
  const step4Confirm = document.getElementById('step-4-confirm');

  if (step4Back) {
    step4Back.addEventListener('click', () => showStep(3));
  }

  if (step4Confirm) {
    step4Confirm.addEventListener('click', () => {
      const consent = document.getElementById('summary-consent')?.checked;
      if (!consent) {
        showCustomAlert('Proszę zaakceptować regulamin oraz zgodę na kontakt w sprawie rezerwacji.', 'Wymagana zgoda');
        return;
      }

      // Generate unique code #PT-XXXXX
      const randomCode = '#PT-' + Math.floor(10000 + Math.random() * 90000);
      const newBooking = {
        id: randomCode,
        service: wizardForm.service,
        placement: wizardForm.placement,
        description: wizardForm.description,
        date: wizardForm.date,
        time: wizardForm.time,
        fullName: `${wizardForm.firstName} ${wizardForm.lastName}`,
        email: wizardForm.email,
        phone: `${wizardForm.countryCode} ${wizardForm.phone}`,
        image: wizardForm.compressedImage,
        status: 'Nowa',
        createdAt: new Date().toISOString()
      };

      const bookings = getBookings();
      bookings.unshift(newBooking);
      localStorage.setItem('pattattoo_bookings', JSON.stringify(bookings));

      // Show Success Modal
      showSuccessModal(newBooking);
    });
  }
}

function showSuccessModal(booking) {
  const modal = document.getElementById('success-booking-modal');
  if (!modal) return;

  document.getElementById('success-booking-code').textContent = booking.id;
  document.getElementById('success-booking-date').textContent = `${booking.date} o godz. ${booking.time}`;
  document.getElementById('success-booking-service').textContent = booking.service;

  modal.classList.remove('hidden');

  const closeBtn = document.getElementById('success-modal-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.add('hidden');
      window.location.reload();
    };
  }

  const adminDemoBtn = document.getElementById('success-modal-admin-btn');
  if (adminDemoBtn) {
    adminDemoBtn.onclick = () => {
      modal.classList.add('hidden');
      window.location.hash = '#admin';
    };
  }
}

/* ==========================================================================
   11. ADMIN PANEL (#admin HASH ROUTE & MANAGEMENT)
   ========================================================================== */
function initAdminPanel() {
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email')?.value.trim();
      const pass = document.getElementById('admin-password')?.value.trim();

      if (email === 'admin@pattattoo.pl' && pass === 'admin123') {
        sessionStorage.setItem('pattattoo_admin_auth', 'true');
        showCustomAlert('Pomyślnie zalogowano do Panelu Studia Pat Tattoo.', 'Zalogowano');
        renderAdminDashboard();
      } else {
        showCustomAlert('Nieprawidłowy login lub hasło. Użyj danych demo: admin@pattattoo.pl / admin123', 'Błąd logowania');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('pattattoo_admin_auth');
      renderAdminDashboard();
      showCustomAlert('Wylogowano z Panelu Studia.', 'Do widzenia');
    });
  }

  // Pre-fill demo credentials on button click
  const fillDemoBtn = document.getElementById('fill-demo-creds');
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', () => {
      const emailInput = document.getElementById('admin-email');
      const passInput = document.getElementById('admin-password');
      if (emailInput) emailInput.value = 'admin@pattattoo.pl';
      if (passInput) passInput.value = 'admin123';
    });
  }
}

function checkHashRoute() {
  const hash = window.location.hash;
  const mainView = document.getElementById('main-view-container');
  const adminView = document.getElementById('admin-view-container');

  if (hash === '#admin') {
    if (mainView) mainView.classList.add('hidden');
    if (adminView) adminView.classList.remove('hidden');
    renderAdminDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (mainView) mainView.classList.remove('hidden');
    if (adminView) adminView.classList.add('hidden');
  }
}

function renderAdminDashboard() {
  const isAuth = sessionStorage.getItem('pattattoo_admin_auth') === 'true';
  const loginBox = document.getElementById('admin-login-box');
  const dashboardContent = document.getElementById('admin-dashboard-content');

  if (!loginBox || !dashboardContent) return;

  if (!isAuth) {
    loginBox.classList.remove('hidden');
    dashboardContent.classList.add('hidden');
    return;
  }

  loginBox.classList.add('hidden');
  dashboardContent.classList.remove('hidden');

  let bookings = [];
  try {
    bookings = JSON.parse(localStorage.getItem('pattattoo_bookings') || '[]');
  } catch {
    bookings = [];
  }

  // Stats
  const totalCount = bookings.length;
  const activeCount = bookings.filter(b => b.status === 'Nowa' || b.status === 'Potwierdzona').length;
  const doneCount = bookings.filter(b => b.status === 'Zrealizowano').length;
  const cancelledCount = bookings.filter(b => b.status === 'Anulowano').length;

  document.getElementById('stat-total').textContent = totalCount;
  document.getElementById('stat-active').textContent = activeCount;
  document.getElementById('stat-completed').textContent = doneCount;
  document.getElementById('stat-cancelled').textContent = cancelledCount;

  // Tables
  const activeTbody = document.getElementById('admin-active-tbody');
  const historyTbody = document.getElementById('admin-history-tbody');

  if (activeTbody) activeTbody.innerHTML = '';
  if (historyTbody) historyTbody.innerHTML = '';

  const activeBookings = bookings.filter(b => b.status === 'Nowa' || b.status === 'Potwierdzona');
  const historyBookings = bookings.filter(b => b.status === 'Zrealizowano' || b.status === 'Anulowano');

  if (activeTbody) {
    if (activeBookings.length === 0) {
      activeTbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-neutral-400">Brak aktywnych rezerwacji.</td></tr>`;
    } else {
      activeBookings.forEach(b => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-neutral-100 hover:bg-neutral-50/80 transition-colors';
        tr.innerHTML = `
          <td class="py-3 px-3 font-semibold text-neutral-900">${b.id}</td>
          <td class="py-3 px-3">
            <div class="font-medium text-neutral-900">${b.fullName}</div>
            <div class="text-xs text-neutral-500">${b.phone} • ${b.email}</div>
          </td>
          <td class="py-3 px-3">
            <div class="text-neutral-800">${b.service}</div>
            <div class="text-xs text-neutral-400">${b.placement}</div>
          </td>
          <td class="py-3 px-3 font-medium text-neutral-800">${b.date} <span class="text-xs text-neutral-500">${b.time}</span></td>
          <td class="py-3 px-3">
            ${b.image ? `<button type="button" class="view-insp-btn text-xs underline font-medium text-neutral-900 hover:text-black" data-id="${b.id}">Podgląd zdjęcia</button>` : '<span class="text-xs text-neutral-300">Brak</span>'}
          </td>
          <td class="py-3 px-3 text-right">
            <div class="flex items-center justify-end gap-1.5">
              ${b.status === 'Nowa' ? `<button type="button" class="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-900 text-white hover:bg-black admin-status-btn" data-id="${b.id}" data-status="Potwierdzona">Potwierdź</button>` : ''}
              <button type="button" class="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-100 text-neutral-800 hover:bg-neutral-200 admin-status-btn" data-id="${b.id}" data-status="Zrealizowano">Wykonano</button>
              <button type="button" class="px-2 py-1 text-xs font-medium rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 admin-status-btn" data-id="${b.id}" data-status="Anulowano">Anuluj</button>
            </div>
          </td>
        `;
        activeTbody.appendChild(tr);
      });
    }
  }

  if (historyTbody) {
    if (historyBookings.length === 0) {
      historyTbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-neutral-400">Brak zrealizowanych lub anulowanych wizyt.</td></tr>`;
    } else {
      historyBookings.forEach(b => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-neutral-100 hover:bg-neutral-50/80 transition-colors';
        const isDone = b.status === 'Zrealizowano';
        tr.innerHTML = `
          <td class="py-3 px-3 font-medium text-neutral-700">${b.id}</td>
          <td class="py-3 px-3">
            <div class="text-neutral-800 font-medium">${b.fullName}</div>
            <div class="text-xs text-neutral-400">${b.phone}</div>
          </td>
          <td class="py-3 px-3 text-neutral-600">${b.service}</td>
          <td class="py-3 px-3 text-neutral-600">${b.date} ${b.time}</td>
          <td class="py-3 px-3">
            <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium ${isDone ? 'bg-neutral-200 text-neutral-800' : 'bg-neutral-100 text-neutral-500'}">
              ${b.status}
            </span>
          </td>
          <td class="py-3 px-3 text-right">
            <button type="button" class="text-xs text-neutral-400 hover:text-red-600 admin-delete-btn" data-id="${b.id}">Usuń</button>
          </td>
        `;
        historyTbody.appendChild(tr);
      });
    }
  }

  // Bind Actions
  document.querySelectorAll('.admin-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const newStatus = btn.getAttribute('data-status');
      updateBookingStatus(id, newStatus);
    });
  });

  document.querySelectorAll('.admin-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      showCustomConfirm(`Czy na pewno chcesz usunąć wpis ${id}?`, 'Usuwanie rezerwacji', () => {
        deleteBooking(id);
      });
    });
  });

  document.querySelectorAll('.view-insp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = bookings.find(b => b.id === id);
      if (item && item.image) {
        openInspirationModal(item);
      }
    });
  });
}

function updateBookingStatus(id, newStatus) {
  let bookings = JSON.parse(localStorage.getItem('pattattoo_bookings') || '[]');
  bookings = bookings.map(b => {
    if (b.id === id) {
      return { ...b, status: newStatus };
    }
    return b;
  });
  localStorage.setItem('pattattoo_bookings', JSON.stringify(bookings));
  renderAdminDashboard();
  showCustomAlert(`Zmieniono status wizyty ${id} na: ${newStatus}`, 'Zaktualizowano');
}

function deleteBooking(id) {
  let bookings = JSON.parse(localStorage.getItem('pattattoo_bookings') || '[]');
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem('pattattoo_bookings', JSON.stringify(bookings));
  renderAdminDashboard();
  showCustomAlert(`Usunięto rezerwację ${id}.`, 'Usunięto');
}

function openInspirationModal(booking) {
  const modal = document.getElementById('admin-insp-modal');
  const img = document.getElementById('admin-insp-img');
  const info = document.getElementById('admin-insp-info');
  const closeBtn = document.getElementById('admin-insp-close');

  if (!modal || !img || !info) return;

  img.src = booking.image;
  info.innerHTML = `<strong>${booking.id}</strong> • ${booking.fullName}<br><span class="text-neutral-500">${booking.service} • ${booking.placement}</span><br><p class="mt-2 text-neutral-700">${booking.description}</p>`;
  modal.classList.remove('hidden');

  closeBtn.onclick = () => modal.classList.add('hidden');
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  };
}
