import { searchUser } from '@/api'
import Avatar from '@/components/shared/Avatar'
import UsernameLink from '@/components/shared/UsernameLink'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { SearchIcon, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import FollowButton from '@/components/shared/FollowButton'
import { IUser } from '@/lib/types'
import { motion } from 'framer-motion'
const Search = () => {
  const [focused, setFocused] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string | undefined>()
  const [users, setUsers] = useState<IUser[]>([])
  const [recents, setRecents] = useState<IUser[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [notFound, setNotFound] = useState<boolean>(false)
  const debouncedValue: string = useDebounce(searchTerm, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const searchUsers = useCallback(async () => {
    setLoading(true)
    if (debouncedValue && debouncedValue.length >= 3) {
      const res = await searchUser(debouncedValue ?? '')
      setUsers(res.users)
      setNotFound(res.notFound)
    } else {
      setUsers([])
      setNotFound(false)
    }
    setLoading(false)
  }, [debouncedValue])

  useEffect(() => {
    searchUsers()
    const recentsfromLs = JSON.parse(localStorage.getItem('recents')!) ?? []
    setRecents(recentsfromLs)
  }, [searchUsers])

  const addToRecent = (user: any) => {
    const recentsFromLs = JSON.parse(localStorage.getItem('recents') || '[]')

    const userExists = recentsFromLs.some((u: any) => u._id === user._id)

    if (!userExists) {
      const all = [user, ...recentsFromLs]
      localStorage.setItem('recents', JSON.stringify(all))
      setRecents(all)
    }
  }

  const handleRemoveRecent = (user: any) => {
    const recentsFromLs = JSON.parse(localStorage.getItem('recents') || '[]')
    const userExists = recentsFromLs.filter((u: any) => u._id !== user._id)
    localStorage.setItem('recents', JSON.stringify(userExists))
    setRecents(userExists)
  }

  const divRef = useRef<any>(null)
  const [hasContentToScroll, setHasContentToScroll] = useState(false)

  useEffect(() => {
    const divElement = divRef.current
    if (divElement) {
      setHasContentToScroll(divElement.scrollHeight)
    }
  }, [recents])

  return (
    <div
      ref={searchRef}
      className="flex h-full flex-1 flex-col items-center border-border bg-background text-primary scrollbar-none sm:w-96 sm:rounded-r-xl sm:border-l-[1px] sm:border-r-[1px] sm:pb-0"
    >
      <h1 className="hidden w-full px-4 py-2 text-2xl md:block">Search</h1>
      <div className="flex w-[95%] p-2 md:w-[90%] md:p-0">
        <div className="flex h-[40px] w-full items-center overflow-hidden rounded-[8px] bg-secondary">
          {!focused && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="flex h-full w-full items-center gap-2 px-2"
              onClick={() => setFocused(true)}
            >
              <div>
                <SearchIcon size={16} className="text-[#a8a8a8]" />
              </div>
              <span className="text-sm text-[#a8a8a8]">Search </span>
            </motion.div>
          )}

          {/* <AnimatePresence> */}
          {focused && (
            <>
              <motion.input
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                autoFocus={true}
                transition={{ duration: 0.2 }}
                style={{ paddingLeft: '12px', paddingRight: '12px' }}
                className="w-full bg-transparent text-sm placeholder:text-[#a8a8a8] focus:outline-none"
                placeholder="Search"
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                }}
                value={searchTerm}
              />
              <span
                className="mr-2 cursor-pointer rounded-full bg-primary-foreground"
                onClick={() => {
                  setFocused(false)
                  setSearchTerm('')
                }}
              >
                <X size={16} />
              </span>
            </>
          )}
          {/* </AnimatePresence> */}
        </div>
      </div>
      <div className="w-full border-b-[1px] border-border md:mt-4" />

      {notFound && !loading && focused && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-2">
          <h1>No result found</h1>
        </div>
      )}

      {users.length === 0 && !notFound && (
        <div
          ref={divRef}
          className={cn(
            'mb-10 flex h-full w-full flex-col overflow-y-scroll scrollbar-none md:mb-0 md:py-2',
            {
              'overflow-y-scroll': hasContentToScroll,
            }
          )}
        >
          <div className="flex items-center justify-between p-2 text-sm">
            <span>Recents</span>
            <button
              className="text-sm text-blue-500 disabled:select-none disabled:text-blue-500/50"
              onClick={() => {
                localStorage.removeItem('recents')
                setRecents([])
              }}
              disabled={recents.length === 0}
            >
              Clear All
            </button>
          </div>

          {recents.length === 0 && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-2">
              <h1>No recent</h1>
            </div>
          )}

          {recents &&
            recents.map((user: any) => (
              <ListItem
                username={user?.username}
                name={user?.name}
                avatar={user?.avatar?.url}
                actionBtn={
                  <button
                    onClick={() => {
                      handleRemoveRecent(user)
                    }}
                    className="flex items-center justify-center text-xs"
                  >
                    <X />
                  </button>
                }
              />
            ))}
        </div>
      )}

      {users.length > 0 && focused && (
        <div
          ref={containerRef}
          className={cn(
            'mb-10 flex h-dvh w-full flex-col overflow-y-scroll py-2 scrollbar-none md:mb-0'
          )}
        >
          {loading &&
            focused &&
            !users.length &&
            !notFound &&
            [1, 2, 3, 4].map(() => {
              return (
                <div className="ml-2 flex items-center gap-3">
                  <div className="size-10 animate-pulse rounded-full bg-zinc-800"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-52 animate-pulse rounded-xl bg-zinc-800"></div>
                    <div className="h-4 w-28 animate-pulse rounded-xl bg-zinc-800"></div>
                  </div>
                </div>
              )
            })}
          {users.length > 0 &&
            !notFound &&
            users.map((user: any) => {
              return (
                <ListItem
                  username={user?.username}
                  name={user?.name}
                  avatar={user?.avatar?.url}
                  action={() => {
                    addToRecent(user)
                  }}
                  actionBtn={
                    <FollowButton
                      isFollow={user?.isFollow}
                      userId={user?._id}
                      showRemoveFollowerBtn={false}
                      isRequested={user?.isRequested}
                      isPrivate={user?.isPrivate}
                    />
                  }
                />
              )
            })}
        </div>
      )}
    </div>
  )
}

export default Search

export const ListItem = ({
  username,
  avatar,
  name,
  action,
  actionBtn,
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 px-3 py-2 hover:bg-secondary hover:shadow-md"
    >
      <UsernameLink
        username={username}
        className="text-priamry flex flex-1 items-center gap-3 transition-colors duration-300 ease-in-out"
        onClick={action}
      >
        <Avatar src={avatar} name={name} />
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-sm leading-none">{username}</div>
          <div className="text-sm text-card-foreground/70">{name}</div>
        </div>
      </UsernameLink>

      <div>
        <div>{actionBtn}</div>
      </div>
    </motion.div>
  )
}
