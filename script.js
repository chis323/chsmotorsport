const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const rpmElement = document.getElementById('rpmValue');
const rpmGaugeArc = document.getElementById('rpmGaugeArc');
const rpmGaugeTicks = document.getElementById('rpmGaugeTicks');
const rpmValues = [3840, 4120, 4560, 5020, 4680, 4210];
const rpmGaugeMax = 8000;
let rpmIndex = 0;

function buildRpmTicks() {
  if (!rpmGaugeTicks) return;

  const centerX = 120;
  const centerY = 132;
  const outerRadius = 105;
  const tickCount = 20;

  for (let index = 0; index <= tickCount; index += 1) {
    const angle = Math.PI - (Math.PI * index / tickCount);
    const isMajor = index % 5 === 0;
    const innerRadius = isMajor ? 88 : 94;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttribute('x1', String(centerX + Math.cos(angle) * innerRadius));
    line.setAttribute('y1', String(centerY - Math.sin(angle) * innerRadius));
    line.setAttribute('x2', String(centerX + Math.cos(angle) * outerRadius));
    line.setAttribute('y2', String(centerY - Math.sin(angle) * outerRadius));
    if (isMajor) line.classList.add('major');
    rpmGaugeTicks.appendChild(line);
  }
}

function updateRpmGauge(rpm) {
  if (rpmElement) rpmElement.textContent = rpm.toLocaleString('en-US');
  if (rpmGaugeArc) {
    const percentage = Math.max(0, Math.min(100, (rpm / rpmGaugeMax) * 100));
    rpmGaugeArc.style.strokeDasharray = `${percentage} ${100 - percentage}`;
  }
}

buildRpmTicks();
updateRpmGauge(rpmValues[0]);

setInterval(() => {
  rpmIndex = (rpmIndex + 1) % rpmValues.length;
  updateRpmGauge(rpmValues[rpmIndex]);
}, 850);

const yearElement = document.getElementById('yearNow');
if (yearElement) yearElement.textContent = new Date().getFullYear();

const bookingForm = document.getElementById('bookingForm');
const formToast = document.getElementById('formToast');
const toastCloseButton = formToast?.querySelector('.form-toast-close');
let toastTimer;

function showFormToast(type, title, message) {
  if (!formToast) return;

  formToast.classList.remove('success', 'error', 'show');
  formToast.classList.add(type);

  const titleElement = formToast.querySelector('strong');
  const messageElement = formToast.querySelector('p');
  const iconElement = formToast.querySelector('.form-toast-icon');

  if (titleElement) titleElement.textContent = title;
  if (messageElement) messageElement.textContent = message;
  if (iconElement) iconElement.textContent = type === 'success' ? '✓' : '!';

  requestAnimationFrame(() => formToast.classList.add('show'));

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    formToast.classList.remove('show');
  }, 5500);
}

toastCloseButton?.addEventListener('click', () => {
  clearTimeout(toastTimer);
  formToast?.classList.remove('show');
});

bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent || 'Trimite solicitarea';

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Se trimite...';
  }

  try {
    const response = await fetch(bookingForm.action, {
      method: 'POST',
      body: new FormData(bookingForm),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Formspree request failed');
    }

    bookingForm.reset();
    showFormToast(
      'success',
      'Solicitare trimisă',
      'Mulțumim! Te vom contacta pentru confirmarea programării.'
    );
  } catch (error) {
    showFormToast(
      'error',
      'Trimiterea a eșuat',
      'Solicitarea nu a putut fi trimisă. Verifică internetul și încearcă din nou.'
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
});

