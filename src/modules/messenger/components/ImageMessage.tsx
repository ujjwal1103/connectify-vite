import { DoubleCheckIcon } from '@/components/icons'
import { cn, getReadableTime } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import { Smile, Loader, Check } from 'lucide-react'
import { useRef } from 'react'
import CheckBox from './CheckBox'
import MessageMenu from './MessageMenu'
import Notch from './Notch'
import MessageImage from './MessageImage'

const ImageMessage = ({
  message,
  isSelectMessages,
  isMessageSelected,
  handleSelectMessage,
  currentUserMessage,
  allSeen,
  className,
  showNotch,
  options,
  setOptions,
  isLoading = false,
}: any) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className={cn('group relative overflow-hidden', className)}>
      {isSelectMessages && (
        <CheckBox
          isMessageSelected={isMessageSelected}
          handleSelectMessage={handleSelectMessage}
        />
      )}
      <div
        className={cn('z-10 mx-4 flex text-gray-50 duration-700', {
          'ml-auto self-end': currentUserMessage,
        })}
      >
        <div
          className={cn('flex flex-row', {
            'flex-row-reverse': !currentUserMessage,
          })}
        >
          <div className="relative flex items-center p-2 transition-all duration-300">
            <div className="dropdown dropdown-end ml-auto">
              <button
                ref={buttonRef}
                tabIndex={0}
                role="button"
                disabled={options}
                className={cn(
                  '-translate-x-12 opacity-0 transition-transform duration-700 group-hover:translate-x-0 group-hover:opacity-100',
                  { 'translate-x-12': currentUserMessage }
                )}
                onClick={() => setOptions(!options)}
              >
                <Smile />
              </button>
              <AnimatePresence>
                {options && (
                  <MessageMenu
                    buttonRef={buttonRef}
                    options={options}
                    setOptions={setOptions}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
          <div
            className={cn(
              'relative flex w-fit max-w-md flex-col rounded-xl bg-black p-2 text-gray-50 shadow-2xl transition-all duration-700',
              {
                'bg-zinc-800': currentUserMessage,
              }
            )}
          >
            <MessageImage src={message.attachments[0]} />

            <div className="absolute bottom-3 right-3 float-right flex w-fit flex-col items-center justify-end rounded-md bg-black p-1 text-right text-xss text-gray-300">
              <span className="z-[1] flex items-center gap-3 text-white mix-blend-exclusion">
                {getReadableTime(message.createdAt)}
                {currentUserMessage && (
                  <>
                    {isLoading && (
                      <div>
                        <Loader className="animate-spin text-white" size={16} />
                      </div>
                    )}
                    {message.seen || allSeen ? (
                      <DoubleCheckIcon className="text-blue-500" />
                    ) : (
                      <Check />
                    )}
                  </>
                )}
              </span>
            </div>

            {showNotch && <Notch currentUserMessage={currentUserMessage} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageMessage
