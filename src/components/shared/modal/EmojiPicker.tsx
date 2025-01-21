import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SmileIcon } from 'lucide-react'

const EmojiPicker = ({ onEmojiClick }: { onEmojiClick: (e: any) => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger  className=" size-6 rounded-md hover:bg-background items-center  flex justify-center">
        <SmileIcon size={16}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[1000] rounded-md border-none bg-transparent"
        align="start"
      >
        <Picker
          data={data}
          onEmojiSelect={onEmojiClick}
          searchPosition="none"
          previewPosition="none"
          navPosition="bottom"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default EmojiPicker
