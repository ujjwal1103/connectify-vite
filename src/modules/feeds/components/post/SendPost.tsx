import Avatar from '@/components/shared/Avatar'
import { makeRequest } from '@/config/api.config'
import { useDebounce } from '@/hooks/useDebounce'
import { IPost, IUser } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CircleCheck, Circle } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'

const variants = {
  initial: {
    // x: '100%',
    scale: 0.9,
  },
  animate: {
    // x: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'linear' },
  },
  exit: {
    // x: '100%',
    scale: 0.9,
    transition: { duration: 0.2, ease: 'linear' },
  },
}

interface SendPostProps {
  onClose: () => void
  post: IPost
}

const SendPost = ({ onClose, post }: SendPostProps) => {
  const [users, setUsers] = useState<IUser[]>([])
  const [search, setSearch] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<
    { username: string; id: string }[]
  >([])
  const debounceSearch = useDebounce(search, 400)

  const fetchUsers = useCallback(async () => {
    let url = '/users/send'
    if (debounceSearch) {
      url = url + `?search=${debounceSearch}`
    }
    try {
      const res = await makeRequest(url)
      setUsers(res.data)
    } catch (error) {
      console.log(error)
    }
  }, [debounceSearch])

  const handleSendPost = useCallback(async () => {
    if (selectedUser[0]?.id) {
      makeRequest.post('/message/u/send', {
        userId: selectedUser[0].id,
        post: post?._id,
        messageType: 'POST_MESSAGE',
      })
      onClose()
    }
  }, [onClose, post?._id, selectedUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Backspace' &&
      !e.currentTarget.value &&
      selectedUser.length
    ) {
      setSelectedUser((prev) => prev.slice(0, prev.length - 1))
    }
  }

  const toggleUserSelection = useCallback(
    (user: IUser) => {
      if (selectedUser.some((u) => u.username === user.username)) {
        setSelectedUser((prev) =>
          prev.filter((u) => u.username !== user.username)
        )
      } else {
        setSelectedUser((prev) => [
          ...prev,
          { username: user.username, id: user?._id },
        ])
      }
    },
    [selectedUser]
  )

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative h-screen w-screen overflow-hidden bg-background text-foreground md:h-auto md:w-500"
    >
      <div className="flex items-center justify-between p-3">
        <h1>Share</h1>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <hr className="border-secondary" />
      <motion.div className="flex items-center p-2 px-3">
        <span>To:</span>

        <motion.div className="ml-2 flex w-full flex-wrap gap-1 rounded bg-secondary p-2">
          <AnimatePresence>
            {selectedUser.map((user) => (
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 rounded-sm bg-background p-1 px-2"
                >
                  {user.username}
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedUser((prev) =>
                        prev.filter(
                          (selectedUser) =>
                            selectedUser.username !== user.username
                        )
                      )
                    }
                  >
                    <X size={12} />
                  </span>
                </motion.span>
              </AnimatePresence>
            ))}
          </AnimatePresence>

          <input
            type="text"
            className="bg-transparent pl-2 focus-visible:outline-none"
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="search"
          />
        </motion.div>
      </motion.div>

      <hr className="border-secondary" />
      <div className="h-[calc(100dvh_-_150px)] overflow-y-scroll py-2 scrollbar-none md:h-[350px]">
        <h1 className="px-3 pb-2">Suggested</h1>
        <ul className="">
          {users?.map((user) => {
            const isSelected = selectedUser.some(
              (u) => u.username === user.username
            )
            return (
              <motion.li
                key={user?._id}
                initial={{ opacity: 0, y: '-20%' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                exit={{
                  opacity: 0,
                  y: '-20%',
                  animationDirection: 'forward',
                  transition: { duration: 0.3, delay: 0 },
                }}
                className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-secondary"
                onClick={() => toggleUserSelection(user)}
              >
                <Avatar
                  src={user.avatar?.url}
                  className={'size-10 rounded-full'}
                />
                <span>{user.username}</span>
                <motion.span className="ml-auto flex">
                  {isSelected ? (
                    <CircleCheck className="rounded-full bg-green-600" />
                  ) : (
                    <Circle />
                  )}
                </motion.span>
              </motion.li>
            )
          })}
        </ul>
      </div>

      <div className="w-full bg-transparent px-2 pb-3">
        <button
          onClick={handleSendPost}
          disabled={!selectedUser.length}
          className="w-full rounded bg-blue-600 py-2 text-base disabled:opacity-55"
        >
          Send
        </button>
      </div>
    </motion.div>
  )
}

export default SendPost
