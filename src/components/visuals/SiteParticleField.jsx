import { useEffect, useRef } from "react";

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

const clusterLayout = [
  { x: 0.08, y: 0.2, radius: 0.14, drift: 1 },
  { x: 0.9, y: 0.31, radius: 0.17, drift: -0.72 },
  { x: 0.16, y: 0.82, radius: 0.12, drift: -0.54 },
  { x: 0.83, y: 0.76, radius: 0.14, drift: 0.82 },
];

const createParticles = (width, height) => {
  const random = seededRandom(Math.round(width * 13 + height * 29));
  const mobile = width < 720;
  const perCluster = mobile ? 15 : 28;

  return clusterLayout.flatMap((cluster, clusterIndex) => (
    Array.from({ length: perCluster }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const distance = Math.sqrt(random());
      const radius = Math.min(width, height) * cluster.radius;
      return {
        cluster: clusterIndex,
        index,
        originX: width * cluster.x + Math.cos(angle) * radius * distance,
        originY: height * cluster.y + Math.sin(angle) * radius * distance,
        x: 0,
        y: 0,
        phase: random() * Math.PI * 2,
        amplitude: 2 + random() * 7,
        speed: 0.16 + random() * 0.24,
        size: random() > 0.78 ? 2 : 1.05,
        accent: random() > 0.79,
      };
    })
  ));
};

export default function SiteParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let scrollProgress = 0;
    let reducedMotion = motionMedia.matches;
    let pageVisible = !document.hidden;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(width, height);
    };

    const updateScroll = () => {
      const range = Math.max(1, document.documentElement.scrollHeight - height);
      scrollProgress = Math.min(1, window.scrollY / range);
    };

    const render = (timestamp = 0) => {
      const time = timestamp / 1000;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const cluster = clusterLayout[particle.cluster];
        const scrollShift = (scrollProgress - 0.5) * height * 0.22 * cluster.drift;
        const driftX = reducedMotion ? 0 : Math.sin(time * particle.speed + particle.phase) * particle.amplitude;
        const driftY = reducedMotion ? 0 : Math.cos(time * particle.speed * 0.8 + particle.phase) * particle.amplitude;
        const naturalX = particle.originX + driftX;
        const naturalY = particle.originY + driftY + scrollShift;
        const deltaX = naturalX - pointer.x;
        const deltaY = naturalY - pointer.y;
        const distance = Math.hypot(deltaX, deltaY);
        const influence = reducedMotion ? 0 : Math.max(0, 1 - distance / 170);
        particle.x = naturalX + deltaX * influence * 0.07;
        particle.y = naturalY + deltaY * influence * 0.07;
      }

      const connectionDistance = width < 720 ? 62 : 82;
      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        const first = particles[firstIndex];
        let connections = 0;
        for (let secondIndex = firstIndex + 1; secondIndex < particles.length && connections < 2; secondIndex += 1) {
          const second = particles[secondIndex];
          if (first.cluster !== second.cluster) continue;
          const distance = Math.hypot(first.x - second.x, first.y - second.y);
          if (distance > connectionDistance) continue;
          const opacity = (1 - distance / connectionDistance) * 0.22;
          context.strokeStyle = first.accent || second.accent
            ? `rgba(139, 91, 255, ${opacity})`
            : `rgba(232, 228, 239, ${opacity})`;
          context.lineWidth = 0.55;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
          connections += 1;
        }
      }

      const pulse = reducedMotion ? 0.5 : 0.45 + Math.sin(time * 1.15) * 0.09;
      for (const particle of particles) {
        context.strokeStyle = particle.accent
          ? `rgba(168, 131, 255, ${pulse})`
          : `rgba(245, 242, 250, ${pulse * 0.72})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.moveTo(particle.x - particle.size, particle.y);
        context.lineTo(particle.x + particle.size, particle.y);
        context.moveTo(particle.x, particle.y - particle.size);
        context.lineTo(particle.x, particle.y + particle.size);
        context.stroke();
      }

      if (!reducedMotion && pageVisible) frame = window.requestAnimationFrame(render);
    };

    const updatePointer = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const clearPointer = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const updateMotion = (event) => {
      reducedMotion = event.matches;
      window.cancelAnimationFrame(frame);
      render(performance.now());
    };

    const updateVisibility = () => {
      pageVisible = !document.hidden;
      window.cancelAnimationFrame(frame);
      if (pageVisible) render(performance.now());
    };

    resize();
    updateScroll();
    render(performance.now());
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", clearPointer);
    document.addEventListener("visibilitychange", updateVisibility);
    motionMedia.addEventListener("change", updateMotion);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", clearPointer);
      document.removeEventListener("visibilitychange", updateVisibility);
      motionMedia.removeEventListener("change", updateMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="cb-site-particle-field" aria-hidden="true" />;
}
