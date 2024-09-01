import { DoubleCheckIcon, Check } from '@/components/icons'
import { cn, getReadableTime } from '@/lib/utils'
import { Loader } from 'lucide-react'

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
}: any) => {
  return (
    <div
      className={cn(
        'float-right flex w-fit flex-col items-center justify-end rounded-md p-1 text-right text-xs text-xss text-gray-300',
        className
      )}
    >
      <span className="z-[1] flex items-center gap-3 text-xss text-white">
        {showTimeStamp && (
          <div className="text-xss">
            <span>{currentTime}</span> / <span>{duration}</span>
          </div>
        )}
        {getReadableTime(createdAt)}
        {currentUserMessage && (
          <>
            {isLoading && (
              <div>
                <Loader className="animate-spin text-white" size={16} />
              </div>
            )}
            {seen || allSeen ? (
              <DoubleCheckIcon className="text-blue-500" />
            ) : (
              <Check />
            )}
          </>
        )}
      </span>
    </div>

    /* <div className="float-right flex w-full flex-col items-center justify-end text-right text-xss text-gray-300">
<span className="z-[1] flex items-center gap-3 self-end">
  {getReadableTime(createdAt)}

  {currentUserMessage && (
    <>
      {isLoading && (
        <div>
          <Loader className="animate-spin" size={16} />
        </div>
      )}
      {seen || allSeen ? (
        <DoubleCheckIcon className="text-blue-500" />
      ) : (
        <Check />
      )}
    </>
  )}
</span>
</div> */
  )
}

export default MetaData
