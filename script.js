const menu = document.querySelector('.menu');
const nav = document.querySelector('#main-nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
}
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filters .active').classList.remove('active');
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.lesson').forEach(card => card.hidden = filter !== 'all' && card.dataset.category !== filter);
}));
document.querySelectorAll('.lesson-open').forEach(button => button.addEventListener('click', () => {
  const card = button.closest('.lesson');
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  button.querySelector('span').textContent = expanded ? '+' : '−';
  card.classList.toggle('expanded', !expanded);
}));

document.querySelectorAll('[data-mobile-slider]').forEach(slider => {
  const slides = Array.from(slider.children).filter(slide => slide.matches('article'));
  if (slides.length < 2) {
    return;
  }
  let activeIndex = 0;

  const dots = document.createElement('div');
  dots.className = 'mobile-slider-dots';
  dots.setAttribute('aria-label', 'Slider navigation');
  const buttons = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to item ${index + 1}`);
    if (index === 0) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => {
      activeIndex = index;
      slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    dots.append(dot);
    return dot;
  });

  slider.after(dots);

  const updateActiveDot = () => {
    const sliderBox = slider.getBoundingClientRect();
    const sliderCenter = sliderBox.left + sliderBox.width / 2;
    activeIndex = slides.reduce((closestIndex, slide, index) => {
      const slideBox = slide.getBoundingClientRect();
      const closestBox = slides[closestIndex].getBoundingClientRect();
      const currentDistance = Math.abs(slideBox.left + slideBox.width / 2 - sliderCenter);
      const closestDistance = Math.abs(closestBox.left + closestBox.width / 2 - sliderCenter);
      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    buttons.forEach((button, index) => button.classList.toggle('active', index === activeIndex));
  };

  slider.addEventListener('scroll', updateActiveDot, { passive: true });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      window.location.href = contactForm.dataset.redirect || 'thanks.html';
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText;
      alert('Something went wrong. Please try again in a moment.');
    }
  });
}
