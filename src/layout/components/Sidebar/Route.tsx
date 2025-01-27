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
  isHidden,
}: Props) => {
  return (
    <li key={route} className="relative last:mt-auto">
      <NavLink
        id={label.toLowerCase()}
        to={route}
        className={({ isActive }) =>
          cn(
            'inline-block items-center rounded p-2 transition-all duration-200 ease-linear hover:bg-secondary/60 lg:flex lg:gap-2',
            {
              'bg-secondary': isActive,
              'shadow-inner ring ring-background': isDisabled,
              'transition-all duration-300 lg:inline-block lg:gap-0': isHidden,
            }
          )
        }
        onClick={(e) => handleModalClick(e, modalName!, modal)}
      >
        <div className="pointer-events-none relative mx-2 ">
          {badge && count !== 0 && (
            <span className="pointer-events-none absolute -top-2 -left-3 z-50 flex h-5 min-w-5 text-xs overflow-clip px-1 items-center justify-center rounded-full bg-blue-700">
              {count}
            </span>
          )}
          <Icon />
        </div>
        <div
          className={cn(
            'pointer-events-none hidden lg:inline-block',
            isHidden && 'transition-all duration-300 lg:hidden'
          )}
        >
          <span className="text-lg">{label}</span>
        </div>
      </NavLink>
    </li>
  )
}

export default Route
