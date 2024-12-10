import { LucideIcon } from "lucide-react"
import { MouseEvent } from "react"

interface MenuListItemProps {
    label: string
    onClick?: (e: MouseEvent<HTMLLIElement>, label?: string) => void
    icon?: LucideIcon
  }
  
const DropDownMenuItem = ({
    label,
    onClick,
    icon: Icon,
  }: MenuListItemProps) => {
    return (
      <li
        className="flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-2 text-sm hover:bg-background/40"
        tabIndex={0}
        onClick={(e) => onClick?.(e, label)}
      >
        {Icon && <Icon className="size-5" />}
        <span>{label}</span>
      </li>
    )
}


export default DropDownMenuItem;
  