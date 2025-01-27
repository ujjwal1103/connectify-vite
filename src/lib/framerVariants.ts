// Slide In and Out Animation
const slideVariants = {
  hidden: {
    x: '-100vw',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 50 },
  },
  exit: {
    x: '100vw',
    opacity: 0,
    transition: { ease: 'easeInOut' },
  },
}

// Fade In and Out Animation
const fadeVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

// Scale Animation
const scaleVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

// Rotate Animation
const rotateVariants = {
  hidden: {
    rotate: -180,
    opacity: 0,
  },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 60 },
  },
  exit: {
    rotate: 180,
    opacity: 0,
    transition: { duration: 0.5 },
  },
}

// Bounce Animation
const bounceVariants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 5,
    },
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: { ease: 'easeInOut' },
  },
}

// Staggered Children Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const childVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

const heightVariants = {
    hidden: { 
      height: 0, 
      opacity: 0 
    },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: 'easeInOut' 
      } 
    },
    exit: { 
      height: 0, 
      opacity: 0, 
      transition: { 
        duration: 0.3, 
        ease: 'easeInOut' 
      } 
    }
  };
  

const animations = {
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
}

export {
  slideVariants,
  childVariants,
  containerVariants,
  bounceVariants,
  rotateVariants,
  scaleVariants,
  fadeVariants,
  heightVariants,
  animations,
}
