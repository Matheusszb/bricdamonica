const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');
const floatingContact = document.querySelector('.floating-contact');
const floatingButton = document.querySelector('.floating-button');
const contactPopover = document.querySelector('.contact-popover');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}

function closeMenu() {
  header.classList.remove('menu-active');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.inert = true;
}

function closeContact() {
  floatingContact.classList.remove('active');
  floatingButton.setAttribute('aria-expanded', 'false');
  contactPopover.inert = true;
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  header.classList.toggle('menu-active', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.inert = !open;
  if (open) closeContact();
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 920) closeMenu(); });

floatingButton.addEventListener('click', () => {
  const open = floatingButton.getAttribute('aria-expanded') !== 'true';
  floatingContact.classList.toggle('active', open);
  floatingButton.setAttribute('aria-expanded', String(open));
  contactPopover.inert = !open;
  if (open) closeMenu();
});
document.addEventListener('click', event => {
  if (!floatingContact.contains(event.target)) closeContact();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeMenu(); closeContact(); }
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(element => observer.observe(element));
} else {
  reveals.forEach(element => element.classList.add('visible'));
}

function updateOpenStatus() {
  const status = document.getElementById('open-status');
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const getPart = type => parts.find(part => part.type === type)?.value;
  const day = getPart('weekday');
  const minutes = Number(getPart('hour')) * 60 + Number(getPart('minute'));
  const open = day === 'Sat' ? minutes >= 540 && minutes < 750 : day !== 'Sun' && minutes >= 540 && minutes < 1080;
  status.classList.toggle('open', open);
  status.classList.toggle('closed', !open);
  status.querySelector('span:last-child').textContent = open ? 'Estamos abertos agora' : 'Estamos fechados agora';
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);
