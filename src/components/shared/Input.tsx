import { ChangeEvent, ForwardedRef, forwardRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

const ShowPassword = ({ showPassword, setShowPassword }: any) => {
  if (showPassword) {
    return <EyeOffIcon size={16} onClick={() => setShowPassword(false)} className="cursor-pointer text-gray-400"/>
  }

  return <EyeIcon size={16} onClick={() => setShowPassword(true)} className="cursor-pointer text-gray-400"/>
}

type InputProps = {
  type?: string
  placeholder: string
  prefix?: any
  sufix?: any
  value?: string
  error?: any
  autoFocus: boolean
  sufixClassname?: string
  disabled?: boolean
  className?: string
  onChange: (e: ChangeEvent) => void
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}

const Input = (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const {
    type,
    placeholder,
    prefix = '',
    sufix = '',
    error,
    sufixClassname,
    className = '',
    disabled,
  } = props

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex w-full flex-col justify-center">
      <div className="relative flex items-center bg-transparent">
        <input
          ref={ref}
          {...props}
          type={showPassword ? 'text' : type}
          className={cn(
            'peer w-full rounded border border-gray-300 bg-transparent p-2 px-10 placeholder:text-gray-400 hover:outline-none',
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
        />
        <span className={cn('absolute px-2 text-black')}>{prefix}</span>
        <span
          className={cn(
            'absolute right-0 flex items-center justify-center px-3',
            sufixClassname
          )}
        >
          {type === 'password' ? (
            <ShowPassword
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          ) : (
            sufix
          )}
        </span>
      </div>
      {error && <p className={cn('text-sm text-red-500')}>{error.message}</p>}
    </div>
  )
}

export default forwardRef(Input)
