import { ModalStateNames } from '@/redux/services/modalStateSlice'
import {
  Compass,
  Heart,
  Home,
  Menu as MenuIcon,
  Search as SearchIcon,
  Send,
  SquarePlay,
  SquarePlus,
  User2,
} from 'lucide-react'
import { ComponentType } from 'react'

export interface SidebarRoute {
  route: string
  label: string
  Icon: ComponentType
  modal?: boolean
  modalName?: ModalStateNames
  badge?: boolean
}

export const sidebarRoutes: SidebarRoute[] = [
  { route: '/', label: 'Home', Icon: Home },
  {
    route: '/search',
    label: 'Search',
    Icon: SearchIcon,
    modal: true,
    modalName: 'searchSheet',
  },
  { route: '/explore', label: 'Explore', Icon: Compass },
  { route: '/reels', label: 'Reels', Icon: SquarePlay },
  { route: '/inbox', label: 'Messages', Icon: Send, badge: true },
  {
    route: '/notifications',
    label: 'Notifications',
    Icon: Heart,
    modal: true,
    modalName: 'notiSheet',
    badge: true,
  },
  {
    route: '/create',
    label: 'Create',
    Icon: SquarePlus,
    modal: true,
    modalName: 'openPostModal',
  },
  { route: '/profile', label: 'Profile', Icon: User2 },
  {
    route: '/more',
    label: 'More',
    Icon: MenuIcon,
    modal: true,
    modalName: 'moreOptions',
  },
]