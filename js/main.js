// Countdown Timer
function initCountdown() {
  const deadline = new Date('2025-12-31T23:59:59Z').getTime();
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = deadline - now;
    
    if (distance <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    if (!question || !answer) return;
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherAnswer) otherAnswer.style.display = 'none';
        if (otherIcon) otherIcon.textContent = '+';
      });
      
      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
        answer.style.display = 'block';
        if (icon) icon.textContent = '−';
      }
    });
  });
}

// Copy to clipboard
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    console.log(`${label} copied to clipboard`);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Registration count simulation
function initRegistrationCount() {
  const countElement = document.getElementById('registration-count');
  if (countElement) {
    // Simulated count for demo purposes
    countElement.textContent = '---';
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initFAQ();
  initRegistrationCount();
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
});
