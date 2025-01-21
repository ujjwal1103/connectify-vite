import UsernameLink from '@/components/shared/UsernameLink'
import { formatInstagramDate } from '@/lib/utils'

type NotificationTextProps = {
  text: string
  username: string
  date: string
}

export const NotificationText = ({
  text,
  username,
  date,
}: NotificationTextProps) => {
  return (
    <div className="flex-1">
      <p className="text-sm leading-tight">
        <UsernameLink username={username}>{username}</UsernameLink>
        <span> {text}.</span>{' '}
        <span className="text-zinc-400">{formatInstagramDate(date)}</span>
      </p>
    </div>
  )
}
