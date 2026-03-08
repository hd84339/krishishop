import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const fadeInUp = (element, delay = 0, duration = 0.8) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration, delay, ease: 'power3.out' }
  );
};

export const fadeInLeft = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, x: -60 },
    { opacity: 1, x: 0, duration: 0.8, delay, ease: 'power3.out' }
  );
};

export const fadeInRight = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.8, delay, ease: 'power3.out' }
  );
};

export const staggerFadeIn = (elements, stagger = 0.1) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.6, stagger, ease: 'power3.out' }
  );
};

export const scrollReveal = (element, options = {}) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 60, ...options.from },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      ...options.to,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
        ...options.scrollTrigger,
      },
    }
  );
};

export const scrollRevealStagger = (parent, children, stagger = 0.12) => {
  gsap.fromTo(
    children,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
};

export const heroAnimation = (elements) => {
  const tl = gsap.timeline();
  elements.forEach((el, i) => {
    tl.fromTo(
      el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      i * 0.15
    );
  });
  return tl;
};

export const navbarAnimation = (element) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  );
};

export const scaleIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.6, delay, ease: 'back.out(1.4)' }
  );
};

export const hoverScale = (element) => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
  });
  element.addEventListener('mouseleave', () => {
    gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });
  });
};

export { gsap, ScrollTrigger };
