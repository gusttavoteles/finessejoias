/* =========================================================================
   FINESSE — Joias em Prata 925
   Script principal
   -------------------------------------------------------------------------
   Índice:
   1. Configuração do WhatsApp (EDITE AQUI)
   2. Montagem dos links de WhatsApp (geral e por produto)
   3. Cabeçalho: efeito ao rolar + menu mobile
   4. Animações de entrada ao rolar a página (reveal on scroll)
   5. Ano atual no rodapé
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------------
     1. CONFIGURAÇÃO DO WHATSAPP
     -------------------------------------------------------------------------
     IMPORTANTE — troque pelo número real da loja, no formato internacional,
     apenas números (código do país + DDD + número). Exemplo para um número
     de Goiânia (62) 91234-5678:  "5562912345678"
     ----------------------------------------------------------------------- */
  const WHATSAPP_NUMBER = '5562982593182'; // <-- SUBSTITUA pelo número da Finesse

  // Mensagem padrão usada quando o cliente clica em "Fale conosco" / botão flutuante
  const DEFAULT_MESSAGE =
    'Olá, Finesse! Vim pelo site e gostaria de saber mais sobre as joias de vocês. ✨';

  // Função que monta a mensagem para um produto/coleção específico
  function buildProductMessage(productName) {
    return `Olá, Finesse! Tenho interesse na peça "${productName}" que vi no site. Ainda está disponível?`;
  }

  // Monta a URL final do WhatsApp a partir de um texto
  function buildWhatsappUrl(text) {
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  }

  /* -----------------------------------------------------------------------
     2. LIGANDO OS BOTÕES DA PÁGINA AO WHATSAPP
     -------------------------------------------------------------------------
     Qualquer link com a classe ".whatsapp-link" é interceptado aqui:
     - se tiver o atributo [data-wa-product="Nome da peça"], a mensagem já
       chega pronta com o nome do produto/coleção;
     - caso contrário (ex: [data-wa-general]), usa a mensagem padrão.
     ----------------------------------------------------------------------- */
  const waLinks = document.querySelectorAll('.whatsapp-link');

  waLinks.forEach((link) => {
    const product = link.getAttribute('data-wa-product');
    const message = product ? buildProductMessage(product) : DEFAULT_MESSAGE;
    const url = buildWhatsappUrl(message);

    // Define o href real (assim funciona mesmo com JS desabilitado / clique do meio / abrir em nova aba)
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  /* -----------------------------------------------------------------------
     3. CABEÇALHO: fundo ao rolar + menu mobile
     ----------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function updateHeaderOnScroll() {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeaderOnScroll();
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu mobile ao clicar em qualquer link de navegação
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------------------------------------------------------
     4. ANIMAÇÕES DE ENTRADA (reveal on scroll)
     -------------------------------------------------------------------------
     Elementos com a classe ".reveal" começam invisíveis (ver CSS) e ganham
     a classe ".is-visible" assim que entram na viewport, disparando a
     transição definida em style.css.
     ----------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal:not(.is-visible)');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Sem suporte a IntersectionObserver: mostra tudo direto
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------------------------
     5. ANO ATUAL NO RODAPÉ
     ----------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
