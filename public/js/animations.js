// ========================================
// ANIMAÇÕES E INTERAÇÕES DA HOME PAGE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================
  // INTERSECTION OBSERVER PARA ANIMAÇÕES
  // ========================================
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observar feature cards
  document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
  
  // ========================================
  // SCROLL SUAVE PARA ÂNCORAS
  // ========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // ========================================
  // NAVBAR COM SCROLL
  // ========================================
  
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
  });
  
  // ========================================
  // ANIMAÇÃO DO PHONE MOCKUP
  // ========================================
  
  const phoneMockup = document.querySelector('.phone-mockup');
  
  if (phoneMockup) {
    // Parallax effect no scroll
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      
      if (scrollPosition < heroHeight) {
        const parallaxSpeed = 0.3;
        phoneMockup.style.transform = `translateY(${scrollPosition * parallaxSpeed}px)`;
      }
    });
  }
  
  // ========================================
  // DEMO CONTENT ANIMAÇÃO
  // ========================================
  
  const demoItems = document.querySelectorAll('.demo-item');
  
  if (demoItems.length > 0) {
    let currentIndex = 0;
    
    setInterval(() => {
      demoItems.forEach(item => item.style.opacity = '0.3');
      demoItems[currentIndex].style.opacity = '1';
      demoItems[currentIndex].style.transform = 'scale(1.02)';
      
      setTimeout(() => {
        demoItems[currentIndex].style.transform = 'scale(1)';
      }, 300);
      
      currentIndex = (currentIndex + 1) % demoItems.length;
    }, 2000);
  }
  
  // ========================================
  // GRADIENT ANIMATION
  // ========================================
  
  const gradientElements = document.querySelectorAll('.gradient-text');
  
  gradientElements.forEach(element => {
    element.style.backgroundSize = '200% auto';
    
    let position = 0;
    setInterval(() => {
      position = (position + 1) % 100;
      element.style.backgroundPosition = `${position}% center`;
    }, 50);
  });
  
});

// ========================================
// LOADING STATE
// ========================================

window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});
