import Input from '@/components/shared/Input'
import { Link } from 'react-router-dom'

import { useForm } from 'react-hook-form'
import Connectify from './components/Connectify'
import { loginWithEmailAndPassword } from '@/api'
import ConnectifyLogoText from '@/components/icons/ConnectifyLogoText'
import { useAuth } from '@/context/AuthContext'
import { GoogleButton } from './components/GoogleButton'
import { SubmitButton } from './components/SubmitButton'
import { AtSign, Lock } from 'lucide-react'

type FormFields = {
  username: string
  password: string
}

const Login = () => {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<FormFields>({
    criteriaMode: 'all',
    mode: 'onSubmit',
  })

  const onSubmit = async (data: FormFields) => {
    try {
      const res = await loginWithEmailAndPassword(data)
      if (res.isSuccess) {
        login(res)
      }
    } catch (error: any) {
      setError('root', {
        message: error?.message,
      })
    }
  }

  return (
    <main className="relative flex h-dvh w-full flex-col items-center bg-appcolor lg:flex-row">
      <div className="absolute top-0 hidden h-[400px] w-full bg-black lg:block" />
      <div className="absolute bottom-0 hidden h-[400px] w-full lg:block" />
      <Connectify />
      <div className="flex h-screen w-screen flex-1 items-center justify-center border-violet-950 bg-appcolor font-semibold text-black backdrop-blur-sm sm:p-8 lg:rounded-tl-[200px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="z-10 flex h-dvh w-screen flex-col items-center justify-center gap-5 overflow-hidden border bg-gray-50 p-5 shadow-md sm:mx-10 sm:h-auto sm:w-auto"
        >
          <div className="z-10 flex flex-col items-center justify-center gap-5">
            <div className="text-bold mb-3 flex items-center justify-center lg:hidden">
              <ConnectifyLogoText />
            </div>
            <div className="4 flex flex-col gap-5 text-2xl font-bold md:text-5xl">
              Welcome!
            </div>
            <div className="flex flex-col gap-5 text-xl">
              Sign In to Connectify
            </div>

            <Input
              autoFocus={true}
              type="text"
              placeholder="Enter you username"
              prefix={<AtSign size={24} />}
              className="p-4 px-10 sm:py-2"
              error={errors?.username}
              {...register('username', {
                required: 'Username is Required',
                pattern: {
                  value: /^(?=[a-z_])[a-z0-9_]{5,20}$/,
                  message: 'Invalid Username',
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
              className="p-4 px-10 sm:py-2"
              placeholder="Enter you password"
              prefix={<Lock size={24}  />}
              error={errors?.password}
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              disabled={!isValid || isSubmitting || isSubmitSuccessful}
            />
            {errors.root && (
              <div className="rounded bg-red-300 px-2 py-1 font-semibold text-red-700">
                {errors.root.message}
              </div>
            )}

            <p className="">
              Dont have an account?
              <Link to={'/new-account'} className="cursor-pointer px-2">
                Register
              </Link>
            </p>

            <GoogleButton />
          </div>
          <div className="absolute -left-32 top-96 z-0 hidden h-96 w-96 rounded-full bg-appcolor/70" />
          <div className="absolute -bottom-20 -left-10 z-0 hidden h-96 w-96 rounded-full bg-appcolor/70" />
        </form>
      </div>
    </main>
  )
}

export default Login
