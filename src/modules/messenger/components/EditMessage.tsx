import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { IMessage } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useChatSlice } from '@/redux/services/chatSlice'
import { Send, Smile, X } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'

type EditMessageProps = {
  message: IMessage
  end?: boolean
  onClose?: () => void
}

const EditMessage = ({ message, end = false, onClose }: EditMessageProps) => {
  const [messageText, setMessageText] = useState(message.text)
  const [isValid, setIsValid] = useState(false)
  const { editMessageById } = useChatSlice()

  useEffect(() => {
    if (!messageText) {
      setIsValid(false)
      return
    }
    setIsValid(messageText !== message.text)
  }, [messageText])

  const handleMessgeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value)
  }

  const handleSendChangedMessage = async () => {
    try {
      editMessageById({ text: messageText, messageId: message._id })
      onClose?.()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex max-h-dvh min-h-96 w-screen flex-col justify-between bg-background sm:w-128">
      <div className="flex items-center justify-between p-3">
        <h1 className="text-xl font-semibold text-foreground">Edit Message</h1>
        <div>
          <span>
            <Button variant={'ghost'} size={'icon'} onClick={onClose}>
              <X />
            </Button>
          </span>
        </div>
      </div>
      <div className="flex w-full items-center justify-center p-3">
        <div
          className={cn('start flex w-full items-center justify-center', {
            end: end,
          })}
        >
          <span className="w block max-h-32 min-w-32 max-w-full overflow-y-scroll rounded-xl bg-secondary p-3 font-sans scrollbar-none">
            {messageText}
          </span>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 p-3">
        <Textarea
          value={messageText}
          className="max-h-52 min-h-24 resize-none"
          onChange={handleMessgeText}
        />
        <div className="flex flex-col justify-between gap-2">
          <Button
            variant={'ghost'}
            size={'icon'}
            disabled={!isValid}
            onClick={handleSendChangedMessage}
          >
            <Send />
          </Button>
          <Button variant={'ghost'} size={'icon'} disabled={!isValid}>
            <Smile />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditMessage
