import { createNewChat } from '@/api'
import Modal from '@/components/shared/modal/Modal'
import UsernameLink from '@/components/shared/UsernameLink'
import { makeRequest } from '@/config/api.config'
import { IUser } from '@/lib/types'
import { useChatSlice } from '@/redux/services/chatSlice'

import { AnimatePresence } from 'framer-motion'
import { X, Loader } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { BiLoader } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import CreateGroup from './CreateGroup'
import Avatar from '@/components/shared/Avatar'

const AddNewUser = ({ onClose }: any) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [createGroup, setCreateGroup] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<
    { username: string; userId: string }[]
  >([])
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setChat } = useChatSlice()
  const navigate = useNavigate()

  const getAllUsers = useCallback(async (showLoader = true) => {
    showLoader && setIsLoading(true)
    try {
      const res = await makeRequest.get(`/newchat/users`)
      setUsers(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getAllUsers()
  }, [getAllUsers])

  const handleUserSelect = async () => {
    try {
      setLoading(true)
      const response = (await createNewChat(selectedUsers[0].userId)) as any
      if (response.isSuccess) {
        setChat(response.chat)
        navigate(`/inbox/${response.chat._id}`)
        onClose()
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChat = (userId: string, username: string) => {
    setSelectedUsers((prev) => {
      // Check if the user is already in the array
      const userExists = prev.some((user) => user.userId === userId)

      // If the user exists, remove them from the array
      if (userExists) {
        return prev.filter((user) => user.userId !== userId)
      }

      // If the user doesn't exist, add them to the array
      return [...prev, { userId, username }]
    })
  }
  const handleCreateNewGroup = async () => {
    setCreateGroup(true)
  }

  return (
    <div className="relative z-10 h-144 bg-background text-foreground scrollbar-none">
      <div className="h-full overflow-y-scroll pb-12 scrollbar-none">
        <div className="h-full w-screen overflow-y-scroll shadow-lg scrollbar-none md:w-96">
          <div className="mb-2 flex items-center justify-between rounded-sm p-2 font-medium text-foreground shadow-lg">
            <h1>{selectedUsers.length <= 1 ? 'New Chat' : 'New Group'}</h1>
            <button type="button" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>
          <div>
            <div className="mx-2 my-2 flex h-10 items-center rounded-md bg-card">
              <input
                autoFocus={false}
                className="text-forground w-full bg-transparent px-3 py-2 text-sm placeholder:text-foreground focus:outline-none"
                placeholder="Search followers..."
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                }}
                value={searchTerm}
              />
              {searchTerm && (
                <span
                  className="mr-2 cursor-pointer rounded-full bg-foreground text-secondary"
                  onClick={() => {
                    //   setFocused(false);
                    setSearchTerm('')
                  }}
                >
                  <X size={16} />
                </span>
              )}
            </div>
          </div>
          {!isLoading && users.length === 0 && (
            <div className="m-2 flex items-center gap-3 rounded-xl bg-zinc-800 p-4">
              no user found
            </div>
          )}

          {isLoading && (
            <div className="flex-center">
              <BiLoader className="animate-spin text-white" size={24} />
            </div>
          )}
          <div className="flex flex-wrap gap-2 px-3 pb-2">
            {selectedUsers.map((user) => {
              return (
                <span className="flex items-center gap-2 rounded-md bg-secondary px-2">
                  <span>{user?.username}</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedUsers((prev) => {
                        // Check if the user is already in the array
                        const userExists = prev.some(
                          (u) => u.userId === user?.userId
                        )

                        // If the user exists, remove them from the array
                        if (userExists) {
                          return prev.filter((u) => u.userId !== user?.userId)
                        }

                        // If the user doesn't exist, add them to the array
                        return prev
                      })
                    }}
                  >
                    <X size={12} />
                  </span>
                </span>
              )
            })}
          </div>
          <div className="relative">
            {users?.map((user) => {
              return (
                <div
                  className="group flex items-center gap-3 p-2 px-4 transition-all hover:bg-secondary"
                  key={user._id}
                >
                  <div>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleSelectChat(user._id, user?.username)
                      }
                      checked={selectedUsers.some(
                        (u) => u.userId === user?._id
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user?.avatar?.url}
                      className="inline-block h-8 w-8 rounded-full object-cover duration-500 hover:scale-90"
                    />
                    <UsernameLink
                      username={user?.username}
                      className="text-sm text-foreground"
                    >
                      <span>{user?.username}</span>
                    </UsernameLink>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex w-full items-center justify-center p-2">
        {selectedUsers.length <= 1 && (
          <button
            className="flex w-full items-center justify-center gap-3 rounded-md bg-blue-500 p-2 disabled:opacity-50"
            onClick={handleUserSelect}
            disabled={loading || !selectedUsers.length}
          >
            <span> SEND MESSAGE </span>
            <span>
              {loading && <Loader size={16} className="animate-spin" />}
            </span>
          </button>
        )}
        {selectedUsers.length > 1 && (
          <button
            className="w-full rounded-md bg-blue-500 p-2"
            onClick={handleCreateNewGroup}
          >
            Create New Group
          </button>
        )}
      </div>
      <AnimatePresence>
        {createGroup && (
          <Modal
            onClose={() => {
              setCreateGroup(false)
            }}
            overlayClasses={'bg-opacity-90'}
            showCloseButton={false}
          >
            <CreateGroup
              selectedUsers={selectedUsers}
              onGroupCreated={() => {
                setCreateGroup(false)
                onClose()
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddNewUser
