import { useEffect, useRef } from "react";

export function ParticleBackground({ theme }) {
    const canvasRef = useRef(null);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
  
      let animationFrameId;
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);
  
      const mouse = { x: null, y: null, radius: 170 };
  
      const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
      const handleMouseLeave = () => { mouse.x = null; mouse.y = null; };
      const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('resize', handleResize);
  
      const isDark = theme === 'dark';
  
      const colorPalette = isDark
        ? [
            { r: 56, g: 189, b: 248 },   // Vibrant Cyan
            { r: 129, g: 140, b: 248 },  // Soft Indigo
            { r: 192, g: 132, b: 252 },  // Neon Purple
            { r: 52, g: 211, b: 153 },   // Emerald Teal
            ]
        : [
            { r: 100, g: 116, b: 189 },  // Muted Indigo
            { r: 56, g: 152, b: 199 },   // Dusty Sky Blue
            { r: 139, g: 111, b: 196 },  // Soft Lavender Violet
            { r: 45, g: 156, b: 148 },   // Muted Teal
        ];
  
      const particleCount = Math.floor((width * height) / 60000);
      const linkDistance = Math.min(width, height) * 0.16;
      const shapes = ['circle', 'square', 'triangle', 'diamond'];
  
      const particles = Array.from({ length: particleCount }, () => {
        const depth = Math.random();
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          baseVx: (Math.random() - 0.5) * (0.2 + depth * 0.6),
          baseVy: (Math.random() - 0.5) * (0.2 + depth * 0.6),
          vx: (Math.random() - 0.5) * (0.2 + depth * 0.6),
          vy: (Math.random() - 0.5) * (0.2 + depth * 0.6),
          baseSize: depth * 3.2 + 1.0,
          size: depth * 3.2 + 1.0,
          alpha: Math.random() * 0.45 + 0.35,
          baseAlpha: Math.random() * 0.45 + 0.35,
          color,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          angle: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.03,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulseVal: Math.random() * Math.PI,
          depth,
        };
      });
  
      // Extra far-background twinkling stars — purely decorative depth layer
      const starCount = Math.floor((width * height) / 9000);
      const stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 0.3,
        twinkleSpeed: 0.01 + Math.random() * 0.02,
        twinkleVal: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.4 + 0.15,
      }));
  
      const render = () => {
        ctx.clearRect(0, 0, width, height);
  
        // Soft glow that gently follows the cursor
        if (mouse.x !== null && mouse.y !== null) {
          const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 1.6);
          glow.addColorStop(0, isDark ? 'rgba(129,140,248,0.10)' : 'rgba(79,70,229,0.07)');
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, width, height);
        }
  
        // Twinkling background stars
        stars.forEach((s) => {
          s.twinkleVal += s.twinkleSpeed;
          const a = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.twinkleVal));
          ctx.beginPath();
          ctx.fillStyle = isDark ? `rgba(226,232,240,${a})` : `rgba(71,85,105,${a * 0.7})`;
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });
  
        // 1. Inter-particle & mouse constellation links
        for (let i = 0; i < particles.length; i++) {
          if (mouse.x !== null && mouse.y !== null) {
            const mdx = particles[i].x - mouse.x;
            const mdy = particles[i].y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
  
            if (mdist < mouse.radius) {
              const mAlpha = (1 - mdist / mouse.radius) * (isDark ? 0.5 : 0.4);
              const c = particles[i].color;
  
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${mAlpha})`;
              ctx.lineWidth = 1.3;
              ctx.stroke();
  
              const force = (mouse.radius - mdist) / mouse.radius;
              const angle = Math.atan2(mdy, mdx);
              particles[i].x += Math.cos(angle) * force * 0.8;
              particles[i].y += Math.sin(angle) * force * 0.8;
            }
          }
  
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
  
            if (dist < linkDistance) {
              const opacity = (1 - dist / linkDistance) * (isDark ? 0.32 : 0.24);
              const c1 = particles[i].color;
              const c2 = particles[j].color;
  
              const midX = (particles[i].x + particles[j].x) / 2;
              const midY = (particles[i].y + particles[j].y) / 2;
              const bow = Math.sin((particles[i].x + particles[j].y) * 0.01) * (dist * 0.04);
  
              const lineGrad = ctx.createLinearGradient(
                particles[i].x, particles[i].y,
                particles[j].x, particles[j].y
              );
              lineGrad.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${opacity})`);
              lineGrad.addColorStop(1, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${opacity})`);
  
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.quadraticCurveTo(midX + bow, midY - bow, particles[j].x, particles[j].y);
              ctx.strokeStyle = lineGrad;
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }
          }
        }
  
        // 2. Render animated particle nodes with a soft glow halo + twinkle
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.angle += p.vRot;
  
          p.pulseVal += p.pulseSpeed;
          p.size = p.baseSize + Math.sin(p.pulseVal) * 0.7;
          p.alpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(p.pulseVal * 0.7));
  
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
  
          const { r, g, b } = p.color;
  
          // Soft radial halo behind every particle — what makes it feel "alive" vs. flat dots
          const haloR = p.size * (3 + p.depth * 2);
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
          halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.35})`);
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
          ctx.fill();
  
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
  
          if (p.baseSize > 2.2) {
            ctx.shadowBlur = isDark ? 16 : 9;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
          }
  
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
          ctx.beginPath();
  
          if (p.shape === 'circle') {
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          } else if (p.shape === 'square') {
            ctx.rect(-p.size, -p.size, p.size * 2, p.size * 2);
          } else if (p.shape === 'diamond') {
            ctx.moveTo(0, -p.size * 1.4);
            ctx.lineTo(p.size, 0);
            ctx.lineTo(0, p.size * 1.4);
            ctx.lineTo(-p.size, 0);
            ctx.closePath();
          } else if (p.shape === 'triangle') {
            ctx.moveTo(0, -p.size * 1.3);
            ctx.lineTo(p.size * 1.1, p.size);
            ctx.lineTo(-p.size * 1.1, p.size);
            ctx.closePath();
          }
  
          ctx.fill();
          ctx.restore();
        });
  
        animationFrameId = requestAnimationFrame(render);
      };
  
      render();
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
      };
    }, [theme]);
  
    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.9,
        }}
      />
    );
  }