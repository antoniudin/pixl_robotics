const STRIPE_PAYMENT_LINKS = {
  starter: 'https://buy.stripe.com/3cI6oI9449M38fSa2J43S03',
  monthly: 'https://buy.stripe.com/9B628sbccf6n9jW8YF43S04'
};

const planNames = {
  starter: 'Starter Pack',
  monthly: 'Monthly Updates'
};

const selectedPlan = new URLSearchParams(window.location.search).get('plan');
const selectedPlanName = planNames[selectedPlan];
const paymentOptions = document.querySelector('.payment-options');
const selectedCopy = document.querySelector('.payment-selected-copy');

if (selectedPlanName) {
  document.querySelectorAll('[data-plan-card]').forEach(card => {
    card.hidden = card.dataset.planCard !== selectedPlan;
  });
  paymentOptions.classList.add('single');
  selectedCopy.textContent = `Continue with secure Stripe checkout for ${selectedPlanName}.`;
}

document.querySelectorAll('.stripe-checkout').forEach(link => {
  const plan = link.dataset.plan;
  const stripeLink = STRIPE_PAYMENT_LINKS[plan];

  if (stripeLink) {
    link.href = stripeLink;
    return;
  }

  link.addEventListener('click', event => {
    event.preventDefault();
    alert(`Stripe link for ${planNames[plan]} is not connected yet. Paste the Payment Link into payment.js.`);
  });
});
