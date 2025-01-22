import Avatar from '@/components/shared/Avatar'
import { Button } from '@/components/ui/button'
import { makeRequest } from '@/config/api.config'
import { useDebounce } from '@/hooks/useDebounce'
import { IPost, IUser } from '@/lib/types'
import { motion } from 'framer-motion'
import { X, CircleCheck, Circle, ChevronLeft, Loader } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'

interface SendPostProps {
  onClose: () => void
  post: IPost
}

type Status = 'IDEAL' | 'SUCCESS' | 'LOADING' | 'ERROR'

const SendPost = ({ onClose, post }: SendPostProps) => {
  const [users, setUsers] = useState<IUser[]>([])
  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<Status>('IDEAL')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<
    { username: string; id: string }[]
  >([])
  const debounceSearch = useDebounce(search, 400)

  const fetchUsers = useCallback(async () => {
    let url = '/users/send'
    if (debounceSearch) {
      url = url + `?search=${debounceSearch}`
      setIsSearching(true)
    } else {
      setStatus('LOADING')
    }
    try {
      const res = await makeRequest(url)
      setUsers(res.data)
      setStatus('SUCCESS')
    } catch (error) {
      console.log(error)
      setStatus('ERROR')
    } finally {
      setIsSearching(false)
    }
  }, [debounceSearch])

  const handleSendPost = useCallback(async () => {
    if (selectedUser[0]?.id) {
      const res = await makeRequest.post('/message/users/send', {
        userIds: selectedUser.map((u) => u.id),
        post: post?._id,
      })
      console.log(res)
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
    (user: IUser, isSelected: boolean) => {
      if (isSelected) {
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
    <div className="relative h-dvh w-screen overflow-hidden bg-background text-foreground md:h-auto md:w-128">
      <div className="flex w-full items-center justify-between border-b-[0.5px] border-border p-2 text-xl text-foreground">
        <div className="flex items-center gap-3">
          <Button
            onClick={onClose}
            size={'icon'}
            className="p-0 hover:bg-background md:hidden"
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-xl font-semibold">Share</h1>
        </div>
        <Button
          variant={'ghost'}
          size="icon"
          onClick={onClose}
          className="hidden md:flex"
        >
          <X />
        </Button>
      </div>
      <hr className="h-0 border-secondary border-b-[0.5]" />
      <div>
        <motion.div className="flex items-center p-2 px-3">
          {/* <span>To:</span> */}

          <motion.div className="ml-2 flex max-h-20 w-full flex-wrap items-center gap-1 overflow-auto rounded bg-secondary p-2">
            {/* <AnimatePresence>
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
            </AnimatePresence> */}

            <input
              type="text"
              className="bg-transparent pl-2 focus-visible:outline-none"
              value={search}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Search"
            />

            {isSearching && (
              <Loader
                size={16}
                className="ml-auto mr-2 animate-spin fill-secondary"
              />
            )}
          </motion.div>
        </motion.div>

        <hr className="h-0 border-secondary border-b-[0.5]" />
        <div className="h-[calc(100dvh_-_155px)] overflow-y-scroll py-2 scrollbar-none md:h-[350px]">
          <h1 className="px-3 pb-2">Suggested</h1>

          {status === 'LOADING' && (
            <ul className="space-y-2 px-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_s) => (
                <li className="flex h-14 animate-pulse cursor-pointer items-center gap-3 rounded">
                  <span className="inline-block size-10 rounded-full bg-secondary p-2"></span>
                  <span className="h-4 w-20 rounded bg-secondary"></span>
                  <span className="ml-auto size-7 rounded-full bg-secondary"></span>
                </li>
              ))}
            </ul>
          )}
          {status === 'SUCCESS' && (
            <ul className="">
              {users?.map((user) => {
                const isSelected = selectedUser.some(
                  (u) => u.username === user.username
                )
                return (
                  <People
                    key={user._id}
                    user={user}
                    isSelected={isSelected}
                    toggleUserSelection={toggleUserSelection}
                  />
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="send-button-safe-area w-full bg-background px-2">
        <Button
          onClick={handleSendPost}
          disabled={!selectedUser.length}
          className="w-full"
          variant={'follow'}
          size={'lg'}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default SendPost

interface PeopleProps {
  user: IUser
  isSelected: boolean
  toggleUserSelection: (user: IUser, isSelected: boolean) => void
}

const People = ({ user, isSelected, toggleUserSelection }: PeopleProps) => {
  return (
    <motion.li
      key={user?._id}
      className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-secondary"
      onClick={() => toggleUserSelection(user, isSelected)}
    >
      <Avatar src={user.avatar?.url} className={'size-10 rounded-full'} />
      <span>{user.username}</span>
      <motion.span className="ml-auto flex">
        {isSelected ? (
          <CircleCheck size={20} className="rounded-full fill-green-600" />
        ) : (
          <Circle size={20} />
        )}
      </motion.span>
    </motion.li>
  )
}
