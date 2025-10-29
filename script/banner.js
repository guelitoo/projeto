/* ======== CARROSSEL ======== */
let slideIndex = 1;
mostrarSlides(slideIndex);

// Função para mudar slides manualmente
function mudarSlide(n) {
  mostrarSlides(slideIndex += n);
}

// Função para ir direto a um slide específico
function slideAtual(n) {
  mostrarSlides(slideIndex = n);
}

// Função principal que mostra os slides
function mostrarSlides(n) {
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");

  if (slides.length === 0) return; // evita erro se não houver carrossel

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Troca automática a cada 5 segundos
setInterval(() => {
  mudarSlide(1);
}, 5000);
