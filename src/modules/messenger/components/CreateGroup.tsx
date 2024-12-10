import { createGroup } from '@/api'
import Avatar from '@/components/shared/Avatar'
import { readFileAsDataURL } from '@/lib/utils'
import { useChatSlice } from '@/redux/services/chatSlice'
import { X } from 'lucide-react'
import { useState, ChangeEvent } from 'react'
import { IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const CreateGroup = ({ selectedUsers, onClose, onGroupCreated }: any) => {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [groupName, setGroupName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { setChat } = useChatSlice()
  const navigate = useNavigate()

  const handleCreateNewGroup = async () => {
    const users = selectedUsers.map((u: any) => u.userId)
    const formData = new FormData()
    formData.set('users', JSON.stringify(users))
    formData.set('groupName', groupName)
    if (avatar) {
      formData.set('avatar', file!)
    }
    const res = (await createGroup(formData)) as any
    if (res.isExisting) {
      setError(
        `Group name ${res.chat.groupName} with this members already exits. Please add different Members.`
      )
    } else if (res.isSuccess) {
      setChat(res.chat)
      navigate(`/inbox/${res.chat._id}`)
      onGroupCreated()
    }
  }

  const handleImagePic = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files![0]
    const url = (await readFileAsDataURL(f)) as string
    setAvatar(url)
    setFile(f)
  }

  return (
    <div className="h-96 w-96 bg-background py-3 shadow-lg">
      <div>
        <div>
          <div className="mb-2 flex items-center justify-between rounded-sm p-2 text-gray-50 shadow-lg">
            <h1>New Group</h1>
            <button type="button" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2 px-3 pb-2">
            {selectedUsers.map((user: { username: string }) => {
              return (
                <span className="flex items-center gap-2 rounded-md bg-black px-2">
                  <span>{user?.username}</span>
                  <span className="cursor-pointer" onClick={() => {}}>
                    <X size={12} />
                  </span>
                </span>
              )
            })}
          </div>
          <div className="flex items-center justify-center py-3">
            <label
              htmlFor="avatar"
              className="flex items-center justify-center"
            >
              <Avatar className="size-24" src={avatar!} />
              <input
                type="file"
                name="avatar"
                id="avatar"
                hidden
                onChange={handleImagePic}
              />
            </label>
          </div>
          <div className="mx-2 my-2 flex h-10 items-center border-b-2 border-black bg-neutral-900">
            <input
              autoFocus={false}
              className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-[#a8a8a8] focus:outline-none"
              placeholder="Group Name"
              onChange={(e) => {
                setGroupName(e.target.value)
              }}
              value={groupName}
            />
            {groupName && (
              <span
                className="mr-2 cursor-pointer rounded-full bg-gray-300 text-[#262626]"
                onClick={() => {
                  setGroupName('')
                }}
              >
                <X size={16} />
              </span>
            )}
          </div>
          {error && (
            <div className='px-2'>
              <p className='p-2 border rounded border-red-800 text-red-800 bg-red-200' >{error}</p>
            </div>
          )} 
          <div className="px-2 py-4">
            <button
              className="w-full rounded-md bg-blue-500 p-2 text-white"
              onClick={handleCreateNewGroup}
            >
              Create New Group
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateGroup
