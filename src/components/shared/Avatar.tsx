import {
  Avatar as ShadAvatat,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import noAvatar from '../../assets/Icons/no_avatar.png'
import { tranformUrl } from '@/lib/utils'
import { memo } from 'react'

const Avatar = ({
  src,
  name,
  className = 'size-8',
  onClick,
  resize = 100,
}: {
  src?: string
  name?: string
  className?: string
  onClick?: () => void
  resize?: number
}) => {
  return (
    <ShadAvatat className={className} onClick={onClick}>
      <AvatarImage
        src={tranformUrl(src, resize) || noAvatar}
        className="object-cover"
      />
      <AvatarFallback className="text-sm">
        {name?.substring(0, 2)}
      </AvatarFallback>
    </ShadAvatat>
  )
}

export default memo(Avatar)
