import Modal from '@/components/shared/modal/Modal'
import MoreMenu from '@/components/shared/MoreMenu'
import { cn } from '@/lib/utils'
import { useModalStateSlice } from '@/redux/services/modalStateSlice'
import { motion } from 'framer-motion'
import { Menu, SendIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const Appbar = ({ hideAppBar, show }: any) => {
  const variants = {
    visible: {
      y: '0',
    },
    hidden: {
      y: '-100%',
    },
  }
  const { setModalState, mobileDrawer } = useModalStateSlice()

  return (
    <motion.div
      animate={hideAppBar ? 'hidden' : 'visible'}
      variants={variants}
      transition={{ duration: 0.2 }}
      className={cn(
        'absolute z-10 flex w-full items-center justify-between bg-zinc-800 p-2 sm:hidden',
        { hidden: !show }
      )}
    >
      <div>
        <Link to={'/'}>
          <span>App Name</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/inbox">
          <SendIcon />
        </Link>
        <button
          className="md:hidden"
          onClick={() => {
            setModalState('mobileDrawer')
          }}
        >
          <Menu />
        </button>
      </div>

      {mobileDrawer && (
        <Modal
          onClose={() => {
            setModalState('mobileDrawer')
          }}
        >
          <MoreMenu />
        </Modal>
      )}
    </motion.div>
  )
}

export default Appbar
