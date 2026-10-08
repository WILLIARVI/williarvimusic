// ==========================================================
// CONFIGURACIÓN DE PARTÍCULAS - Willi ArVi Music
// ==========================================================

document.addEventListener('DOMContentLoaded', function () {
  if (typeof particlesJS === 'undefined') {
    console.warn('particles.js no cargó. Verifica la CDN en el HTML.');
    return;
  }

  particlesJS('particles-js', {
    particles: {
      number: {
        value: 60,
        density: { enable: true, value_area: 900 }
      },
      color: { value: ["#FFD700", "#FFEC8B", "#B8860B"] },
      shape: {
        type: "circle",
        stroke: { width: 0, color: "#000000" }
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: { enable: true, speed: 0.8, opacity_min: 0.1, sync: false }
      },
      size: {
        value: 2.5,
        random: true,
        anim: { enable: true, speed: 2, size_min: 0.3, sync: false }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#FFD700",
        opacity: 0.15,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: {
          distance: 160,
          line_linked: { opacity: 0.5 }
        },
        push: { particles_nb: 3 }
      }
    },
    retina_detect: true
  });
});