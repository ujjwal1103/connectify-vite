import { updateUserDetails } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { z } from 'zod'
import { DevTool } from '@hookform/devtools'
import { ChevronLeft, Loader } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import EditAvatar from './EditAvatar'
import { updateDataInLocalStorage } from '@/lib/localStorage'
import { useAuth } from '@/context/AuthContext'
import { Controller, useForm } from 'react-hook-form'
import { TabControl } from '@/components/shared/TabControl'
import Setting from '../settings/Settings'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { IUser } from '@/lib/types'

const EditProfileSchema = z.object({
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  name: z.string(),
})

const Edit = () => {
  const { user, loading, updateUser } = useAuth()
  const [params, setParams] = useSearchParams()

  const tab = (params.get('tab') as string) ?? 'editProfile'

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      bio: user?.bio,
      gender: user?.gender,
      name: user?.name,
    },
  })

  const navigate = useNavigate()

  const onSubmit = async (data: any) => {
    const res = (await updateUserDetails(data)) as Partial<{
      updatedData: IUser
    }>
    updateDataInLocalStorage(res.updatedData)
    updateUser((prev) => prev && { ...prev, ...res.updatedData })
    toast.success('Post Updated Successfully')
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  if (!user && !loading) {
    return <div>User not found</div>
  }

  console.log(!isDirty || !isValid, { isDirty, isValid }, user)

  const userBio = watch('bio')?.trim() ?? ''
  const rows =
    userBio?.split('\n')?.length > 4 ? 5 : userBio?.split('\n').length

  return (
    <div className="relative min-h-dvh flex-1 overflow-y-scroll text-sm scrollbar-none md:text-sm">
      <div className="sticky top-0 w-full">
        <div className="mx-auto w-3/4 rounded-sm pt-3 md:w-1/2">
          <div className="overflow-clip rounded-md">
            <TabControl
              selectedTab={tab}
              setSelectedTab={(t) => setParams({ tab: t })}
              tabs={[
                {
                  name: 'Edit Profle',
                  id: 'editProfile',
                },
                {
                  name: 'Settings',
                  id: 'settings',
                },
              ]}
              tabId={'settingsTabs'}
              indicatorClasses="h-full top-0 p-2"
            />
          </div>
        </div>
      </div>
      {tab === 'editProfile' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-2 md:p-20"
        >
          <header className="flex gap-2">
            <button className="block md:hidden" onClick={() => navigate(-1)}>
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Edit profile</h1>
          </header>

          <EditAvatar />
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mt-5 space-y-3">
              <label htmlFor="bio">Name</label>
              <div className="relative">
                <Input
                  placeholder="Full Name"
                  className="resize-none border-[#363636] pr-14 placeholder:text-[#363636] focus-visible:border-gray-300"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <span className="text-red-600">{errors.name.message}</span>
                )}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <label htmlFor="bio">Bio</label>
              <div className="relative">
                <Textarea
                  id="bio"
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none border-[#363636] pr-14 scrollbar-none placeholder:text-[#363636] focus-visible:border-gray-300"
                  {...register('bio', {
                    maxLength: {
                      value: 200,
                      message: 'Bio cannot exceed 200 characters',
                    },
                  })}
                  maxLength={200}
                  rows={rows}
                />
                <span className="absolute bottom-2 right-3 text-sm text-[#838282]">
                  {userBio?.length}/200
                </span>
                {errors.bio && (
                  <span className="text-red-600">{errors.bio.message}</span>
                )}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <label htmlFor="bio">Gender</label>
              <div className="relative">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        disabled={!!user?.gender}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="border-[#363636]">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent className="border-[#363636] bg-secondary">
                          <SelectItem value="Male" className="cursor-pointer">
                            Male
                          </SelectItem>
                          <SelectItem value="Female" className="cursor-pointer">
                            Female
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
                {errors.gender && (
                  <span className="text-red-600">{errors.gender.message}</span>
                )}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                disabled={!isDirty || !isValid}
                type="submit"
                variant={'follow'}
                size={'lg'}
              >
                Submit
              </Button>
            </div>
          </motion.form>
          {import.meta.env.DEV && <DevTool control={control} />}
        </motion.div>
      )}
      {tab === 'settings' && <Setting />}
    </div>
  )
}
export default Edit
