import { cn } from '@/lib/utils'
import { useModalStateSlice } from '@/redux/services/modalStateSlice'
import { motion } from 'framer-motion'
import { Home, SearchIcon, SquarePlus, Heart, User2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const sidebarRoutes = [
  { route: '/', label: 'Home', icon: Home },
  {
    route: '/search',
    label: 'Search',
    icon: SearchIcon,

    modalName: 'searchSheet',
  },
  {
    route: '/create',
    label: 'Create',
    icon: SquarePlus,

    modal: true,
    modalName: 'openPostModal',
  },
  {
    route: '/notifications',
    label: 'Notifications',
    icon: Heart,

    modalName: 'notiSheet',
  },
  { route: '/profile', label: 'Profile', icon: User2 },
]

const TabBar = ({ hideAppBar, show }: any) => {
  const variants = {
    visible: {
      y: '0',
    },
    hidden: {
      y: '100%',
    },
  }

  const { setModalState, setPostion } = useModalStateSlice()

  return (
    <motion.div
      animate={hideAppBar ? 'hidden' : 'visible'}
      variants={variants}
      transition={{ duration: 0.2 }}
      className={cn(
        'absolute bottom-0 flex p-3 w-full tabbar items-center bg-secondary sm:hidden',
        { hidden: !show } 
      )}
    >
      <div className="w-full">
        <ul className="flex justify-evenly">
          {sidebarRoutes.map(({ route, label, icon: Icon, modal }) => (
            <li  key={label} className="cursor-pointer">
              <NavLink
                id={label}
                to={route}
                className={({ isActive }) =>
                  isActive ? 'text-foreground' : 'text-foreground/50'
                }
                onClick={(e) => {
                  if (modal) {
                    e.preventDefault()

                    const rect = e.currentTarget.getBoundingClientRect()

                    const top = rect.top - rect.height - 112.33
                    const left = rect.left - 75

                    setPostion({
                      top,
                      left,
                      bottom:'auto',
                      right: 'auto',
                    })

                    setModalState('openPostModal')
                  }
                }}
              >
                <Icon className='pointer-events-none' />
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default TabBar
