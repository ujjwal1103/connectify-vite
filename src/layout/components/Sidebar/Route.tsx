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
}: Props) => {
  return (
    <li key={route} className="relative last:mt-auto" id={label.toLowerCase()}>
      <NavLink
        to={route}
        className={({ isActive }) =>
          cn(
            'inline-block items-center rounded p-2 transition-all duration-200 ease-linear hover:bg-secondary/60 lg:flex lg:gap-2',
            {
              'bg-secondary shadow-lg': isActive,
              'shadow-inner ring ring-background': isDisabled,
            }
          )
        }
        onClick={(e) => handleModalClick(e, modalName!, modal)}
      >
        <div className="mx-2">
          <Icon />
        </div>
        <div className={cn('hidden lg:inline-block')}>
          <span className="text-lg">{label}</span>
        </div>
      </NavLink>
      {badge && count !== 0 && (
        <span className="absolute right-3 top-1/2 z-50 hidden -translate-y-1/2 sm:inline">
          {count}
        </span>
      )}
    </li>
  )
}

export default Route
