import { getSentRequest } from '@/api'
import Avatar from '@/components/shared/Avatar'
import UsernameLink from '@/components/shared/UsernameLink'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

const SentRequests: React.FC = () => {
  const [sentRequests, setSentRequests] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const fetchSentFollowRequests = useCallback(async () => {
    setLoading(true)
    const res = await getSentRequest()
    if (res.isSuccess) {
      setSentRequests(res.sentRequests)
    } else {
      setError('Failed to fetch sent requests.')
    }
    setLoading(false)
  }, [])

  const handleCancelRequest = async (requestId: string) => {
    const res = { isSuccess: true }
    if (res.isSuccess) {
      setSentRequests(
        sentRequests.filter((request) => request._id !== requestId)
      )
    } else {
      setError('Failed to cancel request.')
    }
  }

  useEffect(() => {
    fetchSentFollowRequests()
  }, [fetchSentFollowRequests])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-md bg-background"
    >
      <div className="flex items-center p-2">
        <h2 className="text-semibold text-base">Sent Follow Requests</h2>

        <button className="ml-auto" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {loading && <div className="p-2">Loading...</div>}
            {error && <div>Error: {error}</div>}
            {sentRequests.length === 0 && !loading ? (
              <p className="p-2">No sent requests found.</p>
            ) : (
              <ul className="">
                {sentRequests.map((request) => (
                  <motion.li
                    animate={{ opacity: 1, y: 0 }}
                    layout
                    initial={{opacity:0, y:-20}}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, y: -20 }}
                    key={request._id}
                    className="group flex items-center gap-3 p-2"
                  >
                    <UsernameLink
                      username={request.username}
                      className="flex items-center gap-2"
                    >
                      <div>
                        <Avatar src={request?.avatar?.url} className="size-6" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-xs font-medium">{request.name}</p>
                        <p className="text-xs text-white/70">
                          {request.username}
                        </p>
                      </div>
                    </UsernameLink>
                    <Button
                      variant={'secondary'}
                      size={'sm'}
                      className="ml-auto transition"
                      onClick={() => handleCancelRequest(request._id)}
                    >
                      Cancel
                    </Button>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SentRequests
