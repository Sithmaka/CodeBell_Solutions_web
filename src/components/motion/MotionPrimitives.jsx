import { motion, useReducedMotion } from "framer-motion";

export function MotionSection({ children, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      data-motion-reveal="section"
      initial={reduceMotion ? false : { opacity: 0, y: 42 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function MotionStagger({ children, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.14 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({ as = "article", children, ...props }) {
  const reduceMotion = useReducedMotion();
  const Component = as === "div" ? motion.div : motion.article;
  return (
    <Component
      variants={reduceMotion ? undefined : {
        hidden: { opacity: 0, y: 24, scale: 0.985 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
