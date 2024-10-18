import { Clock9Icon, Check, CheckCheck } from 'lucide-react'
import { cn, getReadableTime } from '@/lib/utils'

const MetaData = ({
  createdAt,
  seen,
  currentUserMessage,
  isLoading,
  allSeen,
  className = '',
  showTimeStamp = false,
  currentTime,
  duration,
  reaction,
}: any) => {
  return (
    <div
      className={cn(
        'float-right flex w-fit flex-col items-center justify-end rounded-md px-1 pt-2 text-right text-xs text-xss text-gray-300',
        className
      )}
    >
      <span className="z-[1] flex items-center gap-3 text-xss text-white">
        {showTimeStamp && (
          <div className="text-xss">
            <span>{currentTime}</span> / <span>{duration}</span>
          </div>
        )}
        {reaction && (
          <button
            className={cn(
              'z-20 rounded-xl border border-border bg-black/20 px-1 py-0 text-sm hover:bg-black',
              {
                '-left-2': currentUserMessage,
                '-right-2': !currentUserMessage,
              }
            )}
          >
            {reaction}
          </button>
        )}
        {getReadableTime(createdAt)}

        {currentUserMessage && (
          <>
            {seen || allSeen ? (
              <CheckCheck className="text-blue-500" />
            ) : (
              <>
                {isLoading ? (
                  <Clock9Icon className="text-xss text-white" size={10} />
                ) : (
                  <Check />
                )}
              </>
            )}
          </>
        )}
      </span>
    </div>
  )
}

export default MetaData
