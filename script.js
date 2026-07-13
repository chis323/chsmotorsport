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
const rpmValues = ['3,840', '4,120', '4,560', '5,020', '4,680', '4,210'];
let rpmIndex = 0;
setInterval(() => {
  rpmIndex = (rpmIndex + 1) % rpmValues.length;
  if (rpmElement) rpmElement.textContent = rpmValues[rpmIndex];
}, 850);

const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  bookingForm.querySelector('.form-success')?.classList.add('show');
  bookingForm.reset();
});

const yearElement = document.getElementById('yearNow');
if (yearElement) yearElement.textContent = new Date().getFullYear();
