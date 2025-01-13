import { cn } from '@/lib/utils'
import { NavLink } from 'react-router-dom'
import { SidebarRoute } from './sidebarRoutes'
import { MouseEvent } from 'react'
import { ModalStateNames } from '@/redux/services/modalStateSlice'

interface Props extends SidebarRoute {
  isDisabled: boolean
  handleModalClick: (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    modalName: ModalStateNames,
    modal?: boolean
  ) => void
  count?: number | null
  isHidden: boolean
}

const Route = ({
  label,
  route,
  isDisabled,
  Icon,
  modal,
  modalName,
  handleModalClick,
  badge = false,
  count,
  isHidden
}: Props) => {
  return (
    <li key={route} className="relative last:mt-auto" >
      <NavLink
        id={label.toLowerCase()}
        to={route}
        className={({ isActive }) =>
          cn(
            'inline-block items-center rounded p-2 transition-all duration-200 ease-linear hover:bg-secondary/60 lg:flex lg:gap-2',
            {
              'bg-secondary': isActive,
              'shadow-inner ring ring-background': isDisabled,
              'lg:inline-block lg:gap-0 transition-all duration-300': isHidden
            }
          )
        }
        onClick={(e) => handleModalClick(e, modalName!, modal)}
      >
        <div className="mx-2 pointer-events-none">
          <Icon />
        </div>
        <div className={cn('hidden lg:inline-block pointer-events-none', isHidden && 'lg:hidden transition-all duration-300')}>
          <span className="text-lg">{label}</span>
        </div>
      </NavLink>
      {badge && count !== 0 && (
        <span className="absolute pointer-events-none right-3 top-1/2 z-50 hidden -translate-y-1/2 sm:inline">
          {count}
        </span>
      )}
    </li>
  )
}

export default Route
