import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PropsWithChildren } from 'react'

interface Props {
    text: string
}

const Tooltip = ({text, children}: PropsWithChildren<Props>) => {
  return (
    <TooltipProvider>
      <TooltipPrimitive>
        <TooltipTrigger>
            {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  )
}

export default Tooltip
