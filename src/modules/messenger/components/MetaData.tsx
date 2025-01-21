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
        'float-right flex w-fit flex-col items-center justify-end rounded-md  pt-2 text-right text-xs text-xss',
        className,
        {
          'text-white': currentUserMessage
        }
      )}
    >
      <span className="z-[1] flex items-center gap-3 text-xss text-foreground">
        {showTimeStamp && (
          <div className="text-xss">
            <span>{currentTime}</span> / <span>{duration}</span>
          </div>
        )}
        {reaction && (
          <button
            className={cn(
              'z-20 rounded-xl border border-border bg-black/20 px-1 py-0 text-sm',
              {
                '-left-2': currentUserMessage,
                '-right-2': !currentUserMessage,
              }
            )}
          >
            {reaction}
          </button>
        )}
        <span className={cn('text-black',{
         
          'text-white':currentUserMessage
        })}>{getReadableTime(createdAt)}
        </span>

       {currentUserMessage && (
          <>
            {seen || allSeen ? (
              <CheckCheck className="text-blue-500" size={12} />
            ) : (
              <>
                {isLoading ? (
                  <Clock9Icon className="" size={12} />
                ) : (
                  <Check size={12} className={cn({
                    'text-white':currentUserMessage
                  })}/>
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
