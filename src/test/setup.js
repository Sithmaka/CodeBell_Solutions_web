import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
});

window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
window.cancelAnimationFrame = (handle) => window.clearTimeout(handle);
