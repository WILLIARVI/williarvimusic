// ============================================================
// LUCES DE CONCIERTO - Willi ArVi Music
// Fondo animado con haces de luz tipo escenario + polvo flotante
// Colores: blanco, azul y fucsia
// ============================================================

(function () {

    // ============================================================
    // 1. CONFIGURACIÓN INICIAL DEL CANVAS
    // ============================================================
    const container = document.getElementById('particles-js');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    let isMobile = false;
    let dpr = 1;

    function resize() {
        const rect = container.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        isMobile = W < 768;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);


    // ============================================================
    // 2. PALETA DE COLORES DE LOS REFLECTORES
    // Se van rotando entre los haces automáticamente
    // ============================================================
    const COLORS = [
        [255, 255, 255],   // Blanco (reflector principal)
        [70, 150, 255],    // Azul (reflector frío)
        [255, 40, 170]     // Fucsia (reflector cálido)
    ];


    // ============================================================
    // 3. HACES DE LUZ (REFLECTORES DEL ESCENARIO)
    // ============================================================
    const BEAM_COUNT = isMobile ? 3 : 5;
    const beams = [];

    for (let i = 0; i < BEAM_COUNT; i++) {
        const baseX = W * ((i + 0.5) / BEAM_COUNT);
        beams.push({
            baseX: baseX,
            baseXRatio: (i + 0.5) / BEAM_COUNT,
            angle: Math.PI / 2,
            angleOffset: (Math.random() - 0.5) * 0.6,
            angleSpeed: 0.00015 + Math.random() * 0.0002,
            angleRange: 0.25 + Math.random() * 0.35,
            width: 140 + Math.random() * 120,
            length: Math.max(H * 1.2, 900),
            opacity: 0.28 + Math.random() * 0.15,
            pulseOffset: Math.random() * Math.PI * 2,
            pulseSpeed: 0.6 + Math.random() * 0.6,
            hue: COLORS[i % COLORS.length]   // Rotación: blanco → azul → fucsia → blanco → azul
        });
    }


    // ============================================================
    // 4. POLVO FLOTANTE (HUMO DE ESCENARIO ILUMINADO)
    // ============================================================
    const DUST_COUNT = isMobile ? 40 : 90;
    const dust = [];

    function resetDust(d) {
        d.x = Math.random() * W;
        d.y = H + Math.random() * 40;
        d.r = 0.6 + Math.random() * 1.8;
        d.vy = -(0.1 + Math.random() * 0.35);
        d.vx = (Math.random() - 0.5) * 0.15;
        d.alpha = 0.15 + Math.random() * 0.5;
        // Polvo blanco/azul tenue (no compite con los reflectores)
        d.hue = Math.random() < 0.7 ? [200, 220, 255] : [255, 200, 240];
        d.wobblePhase = Math.random() * Math.PI * 2;
        d.wobbleSpeed = 0.0008 + Math.random() * 0.0015;
    }

    for (let i = 0; i < DUST_COUNT; i++) {
        const d = {};
        resetDust(d);
        d.y = Math.random() * H;
        dust.push(d);
    }


    // ============================================================
    // 5. BUCLE PRINCIPAL DE DIBUJO
    // ============================================================
    let time = 0;
    let lastT = performance.now();

    function draw(now) {
        const dt = Math.min(60, now - lastT);
        lastT = now;
        time += dt;


        // --------------------------------------------------------
        // 5.1 LIMPIAR EL FONDO
        // --------------------------------------------------------
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, W, H);

        ctx.globalCompositeOperation = 'lighter';


        // --------------------------------------------------------
        // 5.2 DIBUJAR LOS HACES DE LUZ
        // --------------------------------------------------------
        beams.forEach((beam) => {
            beam.baseX = W * beam.baseXRatio;

            const swing = Math.sin(time * beam.angleSpeed + beam.pulseOffset) * beam.angleRange;
            const angle = Math.PI / 2 + swing;

            const pulse = 0.75 + 0.25 * Math.sin(time * 0.001 * beam.pulseSpeed + beam.pulseOffset);

            const x1 = beam.baseX;
            const y1 = -20;

            const endX = x1 + Math.cos(angle) * beam.length;
            const endY = y1 + Math.sin(angle) * beam.length;

            const [r, g, b] = beam.hue;
            const op = beam.opacity * pulse;

            // Gradiente del haz
            const grad = ctx.createLinearGradient(x1, y1, endX, endY);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${op})`);
            grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${op * 0.45})`);
            grad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${op * 0.12})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            const dx = endX - x1;
            const dy = endY - y1;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / len;
            const ny = dx / len;
            const hwTop = 12;
            const hwBottom = beam.width;

            ctx.beginPath();
            ctx.moveTo(x1 + nx * hwTop, y1 + ny * hwTop);
            ctx.lineTo(endX + nx * hwBottom, endY + ny * hwBottom);
            ctx.lineTo(endX - nx * hwBottom, endY - ny * hwBottom);
            ctx.lineTo(x1 - nx * hwTop, y1 - ny * hwTop);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Foco brillante en la base
            const bulbR = 12;
            const bulbGrad = ctx.createRadialGradient(x1, y1, 0, x1, y1, bulbR * 3);
            bulbGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${op * 1.6})`);
            bulbGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${op * 0.5})`);
            bulbGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.beginPath();
            ctx.arc(x1, y1, bulbR * 3, 0, Math.PI * 2);
            ctx.fillStyle = bulbGrad;
            ctx.fill();
        });


        // --------------------------------------------------------
        // 5.3 DIBUJAR EL POLVO FLOTANTE
        // --------------------------------------------------------
        dust.forEach((d) => {
            d.y += d.vy * (dt / 16);
            d.x += d.vx * (dt / 16) + Math.sin(time * d.wobbleSpeed + d.wobblePhase) * 0.2;
            d.wobblePhase += d.wobbleSpeed * dt;

            if (d.y < -20) resetDust(d);
            if (d.x < -20) d.x = W + 20;
            if (d.x > W + 20) d.x = -20;

            const [r, g, b] = d.hue;
            const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 9);
            glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${d.alpha})`);
            glow.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${d.alpha * 0.35})`);
            glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r * 9, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
        });


        // --------------------------------------------------------
        // 5.4 RESPLANDOR EN EL "PISO DEL ESCENARIO" (ahora azulado)
        // --------------------------------------------------------
        const floorGrad = ctx.createLinearGradient(0, H - 180, 0, H);
        floorGrad.addColorStop(0, 'rgba(70, 150, 255, 0)');
        floorGrad.addColorStop(1, 'rgba(70, 150, 255, 0.08)');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, H - 180, W, 180);


        // --------------------------------------------------------
        // 5.5 RESTAURAR MODO Y REPETIR
        // --------------------------------------------------------
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(draw);
    }


    // ============================================================
    // 6. ARRANCAR
    // ============================================================
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(draw);

})();