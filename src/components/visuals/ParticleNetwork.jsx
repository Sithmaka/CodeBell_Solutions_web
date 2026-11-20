import { useEffect, useRef } from "react";
import { motion as Motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const seededRandom = (seed) => {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const createParticles = (width, height) => {
  const random = seededRandom(Math.round(width * 17 + height * 31));
  const mobile = width < 700;
  const count = mobile ? 112 : Math.min(230, Math.round(width / 5.7));
  const particles = [];

  for (let index = 0; index < count; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random());
    const horizontalSpread = mobile ? width * 0.48 : width * 0.44;
    const verticalSpread = mobile ? height * 0.34 : height * 0.39;
    const cluster = index % 9 === 0 ? 0.38 : 1;
    const baseX = width * 0.5 + Math.cos(angle) * radius * horizontalSpread * cluster;
    const baseY = height * (mobile ? 0.58 : 0.57) + Math.sin(angle) * radius * verticalSpread * cluster;

    particles.push({
      baseX,
      baseY,
      x: baseX,
      y: baseY,
      phase: random() * Math.PI * 2,
      speed: 0.22 + random() * 0.34,
      amplitude: 3 + random() * 13,
      size: random() > 0.82 ? 2.6 : 1.35 + random() * 1.05,
      purple: random() > 0.76,
    });
  }

  return particles;
};

export default function ParticleNetwork() {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 });
  const canvasY = useTransform(smoothProgress, [0, 0.28], [0, 95]);
  const canvasScale = useTransform(smoothProgress, [0, 0.28], [1, 1.08]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let particles = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let reducedMotion = media.matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(width, height);
    };

    const drawCross = (particle, opacity) => {
      const size = particle.size;
      context.strokeStyle = particle.purple
        ? `rgba(167, 126, 255, ${opacity})`
        : `rgba(246, 243, 255, ${opacity})`;
      context.lineWidth = 0.75;
      context.beginPath();
      context.moveTo(particle.x - size, particle.y);
      context.lineTo(particle.x + size, particle.y);
      context.moveTo(particle.x, particle.y - size);
      context.lineTo(particle.x, particle.y + size);
      context.stroke();
    };

    const drawTerrain = (time) => {
      context.save();
      context.lineWidth = 0.65;

      for (let band = 0; band < 18; band += 1) {
        const bandOffset = band * 6;
        const opacity = 0.035 + band * 0.0025;
        context.strokeStyle = `rgba(224, 224, 229, ${opacity})`;
        context.beginPath();
        context.moveTo(-40, height * 0.18 + bandOffset);
        context.bezierCurveTo(
          width * 0.14,
          height * (0.2 + band * 0.003),
          width * 0.18,
          height * (0.61 + band * 0.003),
          width * 0.5,
          height * (0.67 + band * 0.003),
        );
        context.bezierCurveTo(
          width * 0.82,
          height * (0.61 + band * 0.003),
          width * 0.86,
          height * (0.2 + band * 0.003),
          width + 40,
          height * 0.18 + bandOffset,
        );
        context.stroke();
      }

      for (let row = 0; row < 19; row += 1) {
        const baseY = height * 0.66 + row * 9;
        context.strokeStyle = `rgba(${row % 5 === 0 ? "135, 105, 215" : "218, 218, 222"}, ${0.028 + row * 0.002})`;
        context.beginPath();
        for (let x = -20; x <= width + 20; x += 13) {
          const normalized = (x - width * 0.5) / Math.max(width, 1);
          const valley = Math.exp(-(normalized * normalized) / 0.035) * 46;
          const ripple = Math.sin(x * 0.012 + row * 0.62 + time * 0.22) * (4 + row * 0.16);
          const y = baseY + valley + ripple;
          if (x === -20) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
      context.restore();
    };

    const render = (timestamp = 0) => {
      const time = timestamp / 1000;
      context.clearRect(0, 0, width, height);
      drawTerrain(reducedMotion ? 0 : time);

      for (const particle of particles) {
        if (!reducedMotion) {
          const driftX = Math.sin(time * particle.speed + particle.phase) * particle.amplitude;
          const driftY = Math.cos(time * particle.speed * 0.78 + particle.phase) * particle.amplitude * 0.72;
          const deltaX = particle.baseX + driftX - pointer.x;
          const deltaY = particle.baseY + driftY - pointer.y;
          const pointerDistance = Math.hypot(deltaX, deltaY);
          const influence = Math.max(0, 1 - pointerDistance / 150);
          particle.x = particle.baseX + driftX + deltaX * influence * 0.06;
          particle.y = particle.baseY + driftY + deltaY * influence * 0.06;
        }
      }

      const connectionDistance = width < 700 ? 68 : 88;
      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        const first = particles[firstIndex];
        let connections = 0;
        for (let secondIndex = firstIndex + 1; secondIndex < particles.length && connections < 3; secondIndex += 1) {
          const second = particles[secondIndex];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);
          if (distance >= connectionDistance) continue;
          const opacity = (1 - distance / connectionDistance) * 0.3;
          context.strokeStyle = first.purple || second.purple
            ? `rgba(126, 78, 255, ${opacity * 1.35})`
            : `rgba(236, 231, 255, ${opacity})`;
          context.lineWidth = 0.55;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
          connections += 1;
        }
      }

      const pulse = reducedMotion ? 0.86 : 0.79 + Math.sin(time * 1.35) * 0.09;
      for (const particle of particles) drawCross(particle, particle.purple ? pulse : pulse * 0.9);

      const coreX = width * 0.5;
      const coreY = height * (width < 700 ? 0.58 : 0.57);
      const coreGradient = context.createRadialGradient(coreX, coreY, 0, coreX, coreY, 135);
      coreGradient.addColorStop(0, `rgba(121, 72, 255, ${reducedMotion ? 0.17 : 0.14 + Math.sin(time) * 0.035})`);
      coreGradient.addColorStop(1, "rgba(121, 72, 255, 0)");
      context.fillStyle = coreGradient;
      context.beginPath();
      context.arc(coreX, coreY, 135, 0, Math.PI * 2);
      context.fill();

      if (!reducedMotion && visible) frame = window.requestAnimationFrame(render);
    };

    const updatePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const clearPointer = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const updateMotion = (event) => {
      reducedMotion = event.matches;
      window.cancelAnimationFrame(frame);
      render();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      window.cancelAnimationFrame(frame);
      if (visible) render(performance.now());
    }, { threshold: 0.02 });

    const resizeObserver = new ResizeObserver(() => {
      resize();
      window.cancelAnimationFrame(frame);
      render(performance.now());
    });

    resize();
    render(performance.now());
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("blur", clearPointer);
    media.addEventListener("change", updateMotion);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", clearPointer);
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <Motion.canvas
      ref={canvasRef}
      className="cb-particle-network"
      aria-hidden="true"
      style={reduceMotion ? undefined : { y: canvasY, scale: canvasScale }}
    />
  );
}
