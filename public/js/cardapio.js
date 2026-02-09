// ========================================
// NAVEGAÇÃO SUAVE ENTRE CATEGORIAS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Adicionar scroll suave ao clicar nos links de categoria
  const categoriaLinks = document.querySelectorAll('.categoria-link');
  
  categoriaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Remover classe active de todos os links
        categoriaLinks.forEach(l => l.classList.remove('active'));
        
        // Adicionar classe active ao link clicado
        link.classList.add('active');
        
        // Scroll suave até a seção
        const navHeight = document.querySelector('.categorias-nav').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ========================================
  // HIGHLIGHT DA CATEGORIA VISÍVEL NO SCROLL
  // ========================================
  
  const sections = document.querySelectorAll('.categoria-section');
  const navLinks = document.querySelectorAll('.categoria-link');
  
  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY;
    const navHeight = document.querySelector('.categorias-nav').offsetHeight;
    
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLinks[index]) {
          navLinks[index].classList.add('active');
        }
      }
    });
  };
  
  // Throttle para otimizar performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
      highlightNavOnScroll();
    });
  });
  
  // ========================================
  // ANIMAÇÕES DE ENTRADA
  // ========================================
  
  const observerOptions = {
    threshold: 0.1,
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
  
  // Observar produtos para animação de entrada
  document.querySelectorAll('.produto-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
  });
  
  // ========================================
  // SCROLL SUAVE INICIAL
  // ========================================
  
  // Se houver hash na URL, rolar até a seção
  if (window.location.hash) {
    setTimeout(() => {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        const navHeight = document.querySelector('.categorias-nav').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
});

// ========================================
// FUNCIONALIDADE PWA (OPCIONAL)
// ========================================

// Detectar se está rodando como PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('Rodando como PWA');
}

// ========================================
// FORMATAÇÃO DE PREÇO
// ========================================

// Função auxiliar para formatar preços (caso necessário no futuro)
function formatarPreco(valor) {
  return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
}
