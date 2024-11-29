import { cn } from '@/lib/utils'
import {
  Bookmark,
  ChevronLeft,
  LogOut,
  Moon,
  Settings2,
  SquareActivity,
  Sun,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../ThemeProvider'
import { ChangeEvent, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Switch from './Inputs/Switch'

const MoreMenu = () => {
  const [themeMenu, setThemeMenu] = useState(false)
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()

  const containerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.2 } },
  }

  return (
    <div className="z-100 flex w-64 flex-col justify-end">
      <motion.div className="mb-3 rounded-md">
        <AnimatePresence initial={false} mode="popLayout">
          {themeMenu && (
            <motion.div
              key="theme-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              variants={containerVariants}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-md border border-border bg-background text-primary shadow-xl"
            >
              <div className="space-y-4 p-4">
                <div className="flex w-full items-center justify-between gap-2">
                  <button
                    className="cursor-pointer"
                    onClick={() => setThemeMenu(false)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="">
                    <span className="text-base font-semibold">
                      Switch theme
                    </span>
                  </div>
                  <div className="mx-2">
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                </div>

                <div
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-2 rounded'
                  )}
                  onClick={() => {
                    if (theme === 'dark') {
                      setTheme('light')
                    } else {
                      setTheme('dark')
                    }
                  }}
                >
                  <div className="">
                    <span className="text-base font-semibold">Dark Mode</span>
                  </div>
                  <div className="mx-2">
                    <Switch
                      checked={theme === 'dark'}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                          setTheme('light')
                        } else {
                          setTheme('dark')
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!themeMenu && (
            <motion.div
              key="main-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              variants={containerVariants}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-md border border-border bg-background text-primary shadow-xl"
            >
              <ul className="p-2">
                <li className="rounded hover:bg-secondary">
                  <Link
                    to="/edit?tab=settings"
                    className={cn('flex w-full items-center gap-2 p-2')}
                  >
                    <div className="mx-2">
                      <Settings2 />
                    </div>
                    <div className="">
                      <span className="text-base font-semibold">Settings</span>
                    </div>
                  </Link>
                </li>
                <li className="rounded hover:bg-secondary">
                  <Link
                    to={'/activity'}
                    className={cn('flex w-full items-center gap-2 rounded p-2')}
                  >
                    <div className="mx-2">
                      <SquareActivity size={20} />
                    </div>
                    <div className="">
                      <span className="text-base font-semibold">
                        Your Activity
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="rounded hover:bg-secondary">
                  <Link
                    to={'/profile?tab=saved'}
                    className={cn('flex w-full items-center gap-2 rounded p-2')}
                  >
                    <div className="mx-2">
                      <Bookmark size={20} />
                    </div>
                    <div className="">
                      <span className="text-base font-semibold">Saved</span>
                    </div>
                  </Link>
                </li>
                <li className="rounded hover:bg-secondary">
                  <button
                    className={cn('flex w-full items-center gap-2 rounded p-2')}
                    onClick={() => setThemeMenu(true)}
                  >
                    <div className="mx-2">
                      {theme === 'dark' ? (
                        <Moon size={20} />
                      ) : (
                        <Sun size={20} />
                      )}
                    </div>
                    <div className="">
                      <span className="text-base font-semibold">
                        Switch appearance
                      </span>
                    </div>
                  </button>
                </li>
                <li className="rounded hover:bg-secondary">
                  <button
                    className={cn('flex w-full items-center gap-2 rounded p-2')}
                    onClick={logout}
                  >
                    <span className="mx-2">
                      <LogOut size={20} />
                    </span>
                    <div className="">
                      <span className="text-base font-semibold">Logout</span>
                    </div>
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default MoreMenu
