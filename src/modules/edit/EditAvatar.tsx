import { removeUserAvatar, updateUserAvatar } from '@/api'
import Avatar from '@/components/shared/Avatar'
import MenuItemModal from '@/components/shared/modal/MenuItemModal'
import Modal from '@/components/shared/modal/Modal'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { updateDataInLocalStorage } from '@/lib/localStorage'
import { readFileAsDataURL } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const EditAvatar = () => {
  const { user, updateUser } = useAuth()
  const [avatar, setAvatar] = useState<any>(user?.avatar?.url)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  function pickFiles(callBack: (file: File) => void) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.addEventListener('change', (event: any) => {
      const files = event.target.files!
      callBack(files[0])
    })

    input.click()
  }

  const updateAvatar = async () => {
    try {
      pickFiles(async (file: File) => {
        if (!file) return
        const formData = new FormData()
        formData.append('avatar', file!)
        const dataUrl = await readFileAsDataURL(file!)
        setAvatar(dataUrl)
        setShowProfileOptions(false)
        setUploadingAvatar(true)
        const result = await updateUserAvatar(formData)
        setAvatar(result.avatar.url)
        updateUser((prev) => prev && { ...prev, avatar: result.avatar })
        updateDataInLocalStorage({ avatar: result.avatar })
        setUploadingAvatar(false)
      })
    } catch (error) {
      toast.error('Error Updating Avatar', { position: 'bottom-right' })
    }
  }

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true)
    setShowProfileOptions(false)
    await removeUserAvatar()
    updateDataInLocalStorage({ avatar: null })
    updateUser((prev) => prev && { ...prev, avatar: undefined })
    setAvatar(null)
    setUploadingAvatar(false)
  }
  const handleAvatar = () => {
    if (avatar) {
      setShowProfileOptions(true)
    } else {
      updateAvatar()
    }
  }

  const menuOptions = [
    {
      label: 'Upload Photo',
      onClick: updateAvatar,
    },
    {
      label: 'Remove Current Photo',
      onClick: handleRemoveAvatar,
      destructive: true,
    },
  ]

  return (
    <div className="my-2 w-full">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary p-2 md:flex-row md:gap-0 md:p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar
              src={avatar}
              className="size-14 cursor-pointer bg-rose-950 object-cover"
              onClick={handleAvatar}
            />
            {uploadingAvatar && (
              <div className="absolute top-0 flex size-14 items-center justify-center rounded-full bg-black/40">
                <Loader className="animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-base font-semibold">{user?.username}</span>
            <span className="text-sm text-zinc-400">{user?.name}</span>
          </div>
        </div>
        <div className="hidden md:ml-auto md:block">
          <Button
            className="h-5 bg-blue-600 px-2 text-sm text-white hover:bg-blue-500 md:h-9 md:px-4 md:text-sm"
            onClick={handleAvatar}
          >
            Change Photo
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showProfileOptions && (
          <Modal
            onClose={() => setShowProfileOptions(false)}
            showCloseButton={false}
          >
            <MenuItemModal menuOptions={menuOptions} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EditAvatar
