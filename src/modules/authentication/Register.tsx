import { registerWithEmailAndPassword } from '@/api'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Connectify from './components/Connectify'
import ConnectifyLogoText from '@/components/icons/ConnectifyLogoText'
import { GoogleButton } from './components/GoogleButton'
import { SubmitButton } from './components/SubmitButton'
import Input from '@/components/shared/Input'
import { AtSign, Lock, Mail, User2 } from 'lucide-react'

const Register = () => {
  const { login } = useAuth()
  const { register, handleSubmit, setError, formState } = useForm({
    criteriaMode: 'all',
    mode: 'onSubmit',
  })
  const { errors, isValid, isSubmitting, isSubmitSuccessful } = formState

  const onSubmit = async (data: any) => {
    try {
      const res = (await registerWithEmailAndPassword(data)) as any
      if (res.isSuccess) {
        login(res)
      }
    } catch (error: any) {
      setError('root', {
        message: error?.message,
      })
    }
  }

  useEffect(() => {
    document.title = 'connectify-register'
  }, [])

  return (
    <div className="relative flex h-dvh w-full flex-1 flex-col items-center text-black bg-appcolor lg:flex-row">
      <div className="absolute top-0 hidden h-[400px] w-full bg-black lg:block" />
      <div className="absolute bottom-0 hidden h-[400px] w-full lg:block" />
      <Connectify />
      <div className="flex h-full items-center justify-center bg-appcolor p-3 backdrop-blur-sm lg:flex-1 lg:rounded-tl-[200px] lg:p-8">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-3"
        >
          <h1 className="text-bold flex items-center justify-center lg:hidden">
            <ConnectifyLogoText />
          </h1>
          <div className="flex flex-col gap-2 text-3xl font-bold ">
            Welcome!
          </div>
          <div className="flex flex-col gap-2 text-xl ">
            Register To Connectify
          </div>

          <Input
            autoFocus={true}
            type="text"
            placeholder="Username"
            prefix={<AtSign size={24} />}
            error={errors?.username}
            {...register('username', {
              required: 'Username is Required',
              pattern: {
                value: /^(?=[a-z_])[a-z0-9_]{5,20}$/,
                message: 'Invalid Username',
              },
              validate: (val) => {
                return val !== 'ujjwallade' || 'Value should be ujjwal lade'
              },
            })}
          />
          <Input
            autoFocus={false}
            type="text"
            placeholder="Name"
            prefix={<User2 size={24} />}
            error={errors?.name}
            {...register('name', { required: 'Name is Required' })}
          />

          <Input
            autoFocus={false}
            type="text"
            placeholder="Email"
            prefix={<Mail size={24} />}
            error={errors?.email}
            {...register('email', {
              required: 'Email is Required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Invalid Email',
              },
            })}
          />

          <Input
            autoFocus={false}
            {...register('password', {
              required: 'Password is Required',
              minLength: {
                value: 8,
                message: 'Password should be minimum 8 char long',
              },
            })}
            type={'password'}
            placeholder="Password"
            prefix={<Lock size={24} />}
            error={errors?.password}
          />

          <SubmitButton
            title={'Register'}
            isSubmitting={isSubmitting}
            disabled={!isValid || isSubmitting || isSubmitSuccessful}
          />

          <p className="">
            Already have an account
            <Link to={'/login'} className="cursor-pointer px-2 text-blue-700">
              Login
            </Link>
          </p>

          <GoogleButton />
        </form>
      </div>
    </div>
  )
}

export default Register
