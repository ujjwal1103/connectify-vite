import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'

type SubmitButtonProps = {
  disabled: boolean
  isSubmitting: boolean
  title?: string
}

export const SubmitButton = ({
  disabled,
  isSubmitting,
  title = 'Login',
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={disabled}
      size={'lg'}
      className="relative w-full group  flex items-center justify-center gap-2  transition-colors bg-purple-600 text-base text-zinc-50 hover:bg-purple-700 disabled:opacity-90"
    >
      {isSubmitting ? (
        <span className="flex justify-center">
          <Loader2 className="animate-spin size-5" />
        </span>
      ) : (
        title
      )}

      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Button>
  )
}
