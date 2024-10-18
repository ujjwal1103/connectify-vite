import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

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
      className="relative w-full h-10 sm:!h-9 bg-black disabled:bg-black/90 disabled:opacity-90 text-lg text-zinc-50 hover:bg-black/80"
    >
      {isSubmitting ? (
        <span className="flex justify-center">
          <Loader2 className="animate-spin" />
        </span>
      ) : (
        title
      )}
    </Button>
  )
}
