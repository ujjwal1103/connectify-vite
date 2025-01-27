import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { memo, MouseEvent } from "react"

interface MenuListItemProps {
    label: string
    onClick?: (e: MouseEvent<HTMLLIElement>, label?: string) => void
    icon?: LucideIcon
    selected?: boolean
    className?: string
  }
  
const DropDownMenuItem = ({
    label,
    onClick,
    icon: Icon,
    selected = false,
    className
  }: MenuListItemProps) => {
    return (
      <li
        tabIndex={0}
        className={cn("flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-2 text-sm hover:bg-background/40 focus-within:bg-background/40",
          selected && 'bg-background/40', className
        )}
        onClick={(e) => onClick?.(e, label)}
      >
        {Icon && <Icon className="size-5" />}
        <span>{label}</span>
      </li>
    )
}


export default memo(DropDownMenuItem);
  