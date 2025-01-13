import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DevTool } from '@hookform/devtools'
import { useAuth } from '@/context/AuthContext'
import { updateUserDetails } from '@/api'
import { IUser } from '@/lib/types'
import { updateDataInLocalStorage } from '@/lib/localStorage'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
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
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import EditAvatar from './EditAvatar'
// interface EditProfileProps {}

const EditProfileSchema = z.object({
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  name: z.string(),
})
const EditProfile = () => {
  const { user, updateUser } = useAuth()

  const navigate = useNavigate()
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

  const onSubmit = async (data: any) => {
    const res = (await updateUserDetails(data)) as Partial<{
      updatedData: IUser
    }>
    updateDataInLocalStorage(res.updatedData)
    updateUser((prev) => prev && { ...prev, ...res.updatedData })
    toast.success('Post Updated Successfully')
    navigate(-1)
  }

  const userBio = watch('bio')?.trim() ?? ''
  const rows =
    userBio?.split('\n')?.length > 4 ? 5 : userBio?.split('\n').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-2 md:p-20"
    >
      <header className="md:flex gap-2 hidden">
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
              className="resize-none border-[#363636] pr-14 focus-visible:border-gray-300"
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
              className="resize-none min-h-24 border-[#363636] pr-14 scrollbar-none focus-visible:border-gray-300"
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
  )
}

export default EditProfile
