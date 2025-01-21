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

const initialPosition = {
  top: 0,
  left: 0,
  bottom: 'auto',
  right: 'auto',
  transformOrigin: 'top left',
}

const DropDownMenu = ({
  children,
  items,
  className,
  onPressItem,
}: PropsWithChildren<{ items: DropDownMenuItem[]; className?: string,onPressItem?: (title: string)=>void }>) => {
  const [selectedItem, setSelectedItem] = useState(-1);
  const [moreOptions, setMoreOptions] = useState(false)
  const [menuPosition, setMenuPosition] = useState<any>(initialPosition)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    setMoreOptions(false);
    setSelectedItem(-1);
    setMenuPosition(initialPosition);
    window.removeEventListener('keydown', handleKeyDown)
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) close()
  }

 
  const handleMoreOptions = () => {
    setMoreOptions(true)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close();
    }
    if (event.key === 'ArrowUp') {
      setSelectedItem((prev) => (prev === 0 ? items.length -1 : prev - 1));
    }
    if (event.key === 'ArrowDown') {
      setSelectedItem((prev) =>
        prev === items.length - 1 ? 0 : prev + 1
      );
    }
    if (event.key === 'Enter' && selectedItem >= 0) {
     try {
      console.log('enter key press', selectedItem >= 0)
      onPressItem?.(items[selectedItem].title);
      close();
      console.log('close key')
     } catch (error) {
      console.log('error',error)
     }
    }
  };

  useEffect(() => {
    if (moreOptions) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moreOptions, selectedItem]);

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
      const availableSpaceRight = window.innerWidth - buttonRect.right;
      const menuWidth = 150
      const hasSpaceOnRight = availableSpaceRight >= menuWidth;
      const menuItemHeight = 36
      const menuHeight = menuItemHeight * items.length + 12
      let top = buttonRect.bottom + window.scrollY
      let left = 'auto'
      let bottom = 'auto'
      let right = !hasSpaceOnRight ? distanceFromRight :  (isLargeScreen
          ? distanceFromRight - menuWidth - buttonRect.width
      : distanceFromRight + buttonRect.width)

      let transformOrigin = (isLargeScreen && hasSpaceOnRight) ? 'top left' : 'top right'

      if (window.innerHeight - buttonRect.bottom < menuHeight) {
        top = buttonRect.top + window.scrollY - menuHeight
        transformOrigin = (isLargeScreen && hasSpaceOnRight) ? 'bottom left' : 'bottom right'
      }
      setMenuPosition({ top, left, bottom, right, transformOrigin })
    }
  }, [moreOptions])

  useLayoutEffect(() => {
    setLayout()
  }, [setLayout])

  useEffect(() => {
    if (moreOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', close);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', close);
    };
  }, [moreOptions]);

  useEffect(() => {
    if (moreOptions && menuRef.current) {
      menuRef.current.focus();
    }
  }, [moreOptions]);

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
        tabIndex={1}
        role="button"
        className={cn(className)}
        onClick={handleMoreOptions}
      >
        {children}
      </button>

      {createPortal(
        <AnimatePresence mode='wait'>
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
                tabIndex={0}
                className={`absolute z-[999] w-full rounded bg-secondary shadow-xl focus-visible:outline-none ${cssVars}`}
                variants={variants}
                initial={'closed'}
                animate={'open'}
                exit={'closed'}
                transition={{ duration: 0.3 }}
                style={menuPosition}
              >
                <ul className="w-full p-1.5 text-foreground md:w-44">
                  {items.map(({ title, icon }, index) => {
                    return (
                      <DropDownMenuItem
                        key={title + index}
                        label={title}
                        onClick={() => {
                          onPressItem?.(title)
                          close()
                        }}
                        icon={icon}
                        selected={selectedItem === index} 
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
