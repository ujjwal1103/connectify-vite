import { AnimatePresence } from 'framer-motion'

const Wrapper = ({ shouldRender, children }: any) => {
  return <AnimatePresence>{shouldRender && children}</AnimatePresence>
}
export default Wrapper
