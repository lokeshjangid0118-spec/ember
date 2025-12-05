

// IMMEDIATE PRELOADER CONTROL
    (function() {
      // Remove loading class immediately
      document.documentElement.classList.remove('loading');
      document.body.classList.remove('loading');
      
      const preloader = document.getElementById('preloader');
      const content = document.getElementById('content');
      
      // 3 second perfect display
      setTimeout(() => {
        preloader.classList.add('fade-out');
        
        setTimeout(() => {
          preloader.remove();
          if (content) {
            content.style.display = 'block';
          }
          // Enable scroll
          document.documentElement.style.overflow = 'auto';
          document.body.style.overflow = 'auto';
        }, 850);
      }, 2000);
    })();


//    Toggle Button Function 
function myFunction(x) {
  x.classList.toggle("change");
}

/////// Home banner section start ///////


let swiper = new Swiper('.mySwiper', {
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
});

/////// Home banner section end ///////


////////  Photography Category start ////////
const customSwiper = new Swiper('.customSwiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  coverflowEffect: {
    rotate: 40,
    stretch: 0,
    depth: 200,
    modifier: 1,
    slideShadows: false,
  },
  navigation: {
    nextEl: '.customSwiper .swiper-button-next',
    prevEl: '.customSwiper .swiper-button-prev',
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 40,
    }
  }
});

////////  Photography Category end ////////

// ===================== FULLSCREEN IMAGE VIEWER (PHOTOGRAPHY SWIPER) =====================
document.addEventListener('DOMContentLoaded', function () {

  // Overlay elements
  const overlay = document.getElementById('imageOverlay');        // Fullscreen overlay
  const overlayImg = document.getElementById('imageOverlayImg');  // Image inside overlay
  const overlayClose = document.getElementById('imageOverlayClose'); // Close button

  // If any required element missing → stop execution
  if (!overlay || !overlayImg || !overlayClose) return;

  // Photography slider images only
  const photoImages = document.querySelectorAll('.customSwiper .swiper-slide img');

  // Set zoom cursor + open fullscreen on image click
  photoImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      overlayImg.src = this.src;       // Show clicked image in overlay
      overlay.style.display = 'flex';  // Show fullscreen
      document.body.style.overflow = 'hidden'; // Disable page scroll
    });
  });

  // Close on 'X' button
  overlayClose.addEventListener('click', closeOverlay);

  // Close on clicking outside image
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closeOverlay();
    }
  });

  // Close function (reusable)
  function closeOverlay() {
    overlay.style.display = 'none';
    overlayImg.src = '';
    document.body.style.overflow = ''; // enable scroll again
  }
});



// ===================== SPARKLES CURSOR EFFECT (OPTIMIZED VERSION) =====================

// Sparkles class handles all particle logic
class Sparkles {
  constructor(canvas) {
    this.colors = ["#ffd166", "#ffffff", "#ffe8a3", "#fffae0"];  // Gold/white theme
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    // Tuned performance values
    this.intensity = 18;
    this.perMove = 4;
    this.maxSparkles = 180;
    this.sparkles = [];
    this.lastMoveTime = 0;

    // Resize canvas on window change
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));

    // Track mouse movement
    window.addEventListener("mousemove", this.onMouseMove.bind(this));

    // Start animation loop
    this.animate();
  }

  // Animation loop: draw + update sparkles
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let i = this.sparkles.length;
    while (i--) {
      const s = this.sparkles[i];

      // Remove invisible particles
      if (s.opacity <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }

      // Particle movement & fading
      s.yPos += 0.7;
      s.xPos += s.dispersingDirection * 0.7;
      s.opacity -= s.dispersingSpeed * 0.02;

      // Draw sparkle
      this.ctx.globalAlpha = s.opacity;
      this.ctx.beginPath();
      this.ctx.arc(s.xPos, s.yPos, s.radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = s.color;
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  // Auto adjust canvas to screen size
  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Add sparkles on mouse move (throttled)
  onMouseMove(event) {
    const now = performance.now();

    // Only allow sparkles every 30ms
    if (now - this.lastMoveTime < 30) return;
    this.lastMoveTime = now;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Add small number of sparkles each move
    for (let i = 0; i < this.perMove; i++) {
      this.addSparkle(
        mouseX + ((Math.random() * this.intensity) - (this.intensity * 0.5)),
        mouseY + ((Math.random() * this.intensity) - (this.intensity * 0.5)),
      );
    }
  }

  // Create and store a new sparkle
  addSparkle(xPos, yPos) {
    const radius = Math.random() * 2 + 0.5;
    const opacity = 1;
    const dispersingSpeed = 0.5 + Math.random() * 0.5;
    const dispersingDirection = Math.random() < 0.5 ? -Math.random() : Math.random();
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];

    this.sparkles.push({ xPos, yPos, radius, opacity, dispersingSpeed, dispersingDirection, color });

    // Keep sparkle count within max limit
    if (this.sparkles.length > this.maxSparkles) {
      const extra = this.sparkles.length - this.maxSparkles;
      this.sparkles.splice(0, extra);
    }
  }
}

// Init Sparkles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById("sparkles");
  if (canvas) {
    new Sparkles(canvas);
  }
});


document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;
    const icon = question.querySelector(".faq-icon");

    // Close all other FAQs
    document.querySelectorAll(".faq-answer").forEach((ans) => {
      if (ans !== answer) {
        ans.classList.remove("open");
      }
    });

    document.querySelectorAll(".faq-icon").forEach((ic) => {
      if (ic !== icon) ic.textContent = "+";
    });

    // Toggle current
    answer.classList.toggle("open");
    icon.textContent = answer.classList.contains("open") ? "×" : "+";
  });
});

// FAQ Section End


// Testimonials Section Start

const track = document.querySelector(".track");
let cards = document.querySelectorAll(".card");

// Duplicate Cards for Infinite Loop
track.innerHTML += track.innerHTML;

// Re-select cards after duplication
cards = document.querySelectorAll(".card");

let index = 0;

// Detect visible cards based on screen size
function getVisibleCards() {
  if (window.innerWidth <= 576) return 1;  // Mobile
  if (window.innerWidth <= 992) return 2;  // Tablet
  return 3;                                // Desktop
}

function autoSlide() {
  const visible = getVisibleCards();
  const movePercent = 100 / visible;

  index++;

  track.style.transition = "transform 0.6s ease";
  track.style.transform = `translateX(-${index * movePercent}%)`;

  // Infinite Loop Reset
  if (index >= cards.length - visible) {
    setTimeout(() => {
      track.style.transition = "none";
      index = 0;
      track.style.transform = "translateX(0)";
    }, 600);
  }
}

setInterval(autoSlide, 3000);

// Reset on resize
window.addEventListener("resize", () => {
  index = 0;
  track.style.transition = "none";
  track.style.transform = "translateX(0)";
});

// Testimonials Section End
