import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { LucideIcon } from 'lucide-react'
import DropDownMenuItem from './DropDownMenuItem'
import { cn } from '@/lib/utils'

const cssVars =
  '[--opacity-close:0%] [--opacity-open:100%] [--scale-from:1] [--scale-to:1] [--translatey-from:100] [--translatey-to:0] md:w-auto md:[--scale-from:30%] md:[--scale-to:100%] md:[--translatey-from:0]'

export type DropDownMenuItem = {
  title: string
  icon?: LucideIcon
  onPress?: (title: string) => void
}

const calculateDistance = (right: number) => {
  if (right) {
    const viewportWidth = window.innerWidth
    const distanceFromRight = viewportWidth - right
    return distanceFromRight
  }
}

const DropDownMenu = ({
  children,
  items,
  className,
}: PropsWithChildren<{ items: DropDownMenuItem[]; className?: string }>) => {
  const [moreOptions, setMoreOptions] = useState(false)
  const [menuPosition, setMenuPosition] = useState<any>({
    top: 0,
    left: 0,
    bottom: 'auto',
    right: 'auto',
    transformOrigin: 'top left',
  })
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setMoreOptions(false)
    }
  }

  const handleScroll = () => {
    setMoreOptions(false)
  }

  const handleMoreOptions = () => {
    setMoreOptions(true)
  }

  const setLayout = useCallback(() => {
    if (moreOptions && buttonRef.current) {
      const isLargeScreen = window.innerWidth >= 768
      if (!isLargeScreen) {
        setMenuPosition({
          top: 'auto',
          left: 0,
          bottom: 0,
          right: 0,
          transformOrigin: 'bottom',
        })
        return
      }

      const buttonRect = buttonRef.current.getBoundingClientRect()
      const distanceFromRight = calculateDistance(buttonRect.right) ?? 0
      const menuWidth = 150
      const menuItemHeight = 36
      const menuHeight = menuItemHeight * items.length + 12
      let top = buttonRect.bottom + window.scrollY
      let left = 'auto'
      let bottom = 'auto'
      let right = isLargeScreen
        ? distanceFromRight - menuWidth - buttonRect.width
        : distanceFromRight + buttonRect.width
      let transformOrigin = isLargeScreen ? 'top left' : 'top right'

      if (window.innerHeight - buttonRect.bottom < menuHeight) {
        top = buttonRect.top + window.scrollY - menuHeight
        transformOrigin = isLargeScreen ? 'bottom left' : 'bottom right'
      }
      setMenuPosition({ top, left, bottom, right, transformOrigin })
    }
  }, [moreOptions])

  useLayoutEffect(() => {
    setLayout()
  }, [setLayout])

  useEffect(() => {
    if (moreOptions) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleScroll)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleScroll)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [moreOptions])

  const variants = {
    closed: {
      opacity: 'var(--opacity-close)',
      scale: 'var(--scale-from)',
      translateY: 'var(--translatey-from)',
    },
    open: {
      opacity: 'var(--opacity-open)',
      scale: 'var(--scale-to)',
      translateY: 'var(--translatey-to)',
    },
  }

  return (
    <>
      <button
        ref={buttonRef}
        tabIndex={0}
        role="button"
        className={cn(className)}
        onClick={handleMoreOptions}
      >
        {children}
      </button>

      {createPortal(
        <AnimatePresence>
          {moreOptions && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-0 z-[988] h-screen w-screen bg-black/70 backdrop-blur md:hidden`}
              ></motion.div>
              <motion.div
                ref={menuRef}
                className={`absolute z-[999] w-full rounded bg-secondary shadow-xl ${cssVars}`}
                variants={variants}
                initial={'closed'}
                animate={'open'}
                exit={'closed'}
                transition={{ duration: 0.3 }}
                style={menuPosition}
              >
                <ul className="w-full p-1.5 text-foreground md:w-44">
                  {items.map(({ title, icon, onPress }, index) => {
                    return (
                      <DropDownMenuItem
                        key={title + index}
                        label={title}
                        onClick={() => onPress?.(title)}
                        icon={icon}
                      />
                    )
                  })}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
export default DropDownMenu
