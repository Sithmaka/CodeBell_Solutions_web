import { motion as Motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import SiteParticleField from "../visuals/SiteParticleField";

export default function SiteMotionLayer() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.3 });
  const firstY = useTransform(progress, [0, 1], [0, -240]);
  const secondY = useTransform(progress, [0, 1], [0, 320]);
  const thirdY = useTransform(progress, [0, 1], [0, -180]);
  const firstRotate = useTransform(progress, [0, 1], [0, 18]);
  const secondRotate = useTransform(progress, [0, 1], [0, -14]);

  return (
    <div className="cb-site-motion-layer" aria-hidden="true">
      <SiteParticleField />
      <Motion.div
        className="cb-site-motion-orbit cb-site-motion-orbit-one"
        style={reduceMotion ? undefined : { y: firstY, rotate: firstRotate }}
      />
      <Motion.div
        className="cb-site-motion-orbit cb-site-motion-orbit-two"
        style={reduceMotion ? undefined : { y: secondY, rotate: secondRotate }}
      />
      <Motion.div
        className="cb-site-motion-orbit cb-site-motion-orbit-three"
        style={reduceMotion ? undefined : { y: thirdY, rotate: firstRotate }}
      />
      <Motion.div
        className="cb-site-scroll-progress"
        style={{ scaleX: reduceMotion ? 0 : progress }}
      />
    </div>
  );
}
